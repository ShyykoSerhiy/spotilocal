import * as request from 'superagent';
import {Status} from './status';

function failIfNotInitialized(_target: any, _propertyKey: string, descriptor: PropertyDescriptor):PropertyDescriptor{
    const fn = descriptor.value as Function;

    if (typeof fn !== 'function'){
        throw new Error(`@failIfNotInitialized can only be applied to method and not to ${typeof fn}`)
    }

    return Object.assign({}, descriptor, {value: function(this: Spotilocal){
        if (!this.initialized) {
            return Promise.reject<string>(SPOTILOCAL_IS_NOT_INITIALIZED);
        }         
        return fn.apply(this, arguments);
    }})

} 

export const SPOTILOCAL_IS_NOT_INITIALIZED = 'Spotilocal is not initialized';
export const SPOTILOCAL_IS_NOT_RUNNING = 'It looks like Spotify isn\'t open. We failed to find spotilocal url with ports in range 4370-4380.';
export const RETURN_ON_PLAY = 'play' as 'play';
export const RETURN_ON_PAUSE = 'pause' as 'pause';
export const RETURN_ON_LOGIN = 'login' as 'login';
export const RETURN_ON_LOGOUT = 'logout' as 'logout';
export const RETURN_ON_ERROR = 'error' as 'error';
export const RETURN_ON_AP = 'ap' as 'ap';

export type ReturnOnParam = typeof RETURN_ON_PLAY | typeof RETURN_ON_PAUSE | typeof RETURN_ON_LOGIN | typeof RETURN_ON_LOGOUT | typeof RETURN_ON_ERROR | typeof RETURN_ON_AP;

export class Spotilocal {
    public initialized: boolean;
    private spotilocalUrl: string;
    private _port: number;
    public get port(): number {
        return this._port;
    }
    private oauth: string;
    private csrf: string;    

    constructor() {
    }

    public init(defaultPort?: number): Promise<Spotilocal> {
        return Spotilocal.getSpotilocalUrl(defaultPort).then(port => {
            this.spotilocalUrl = Spotilocal.getSpotilocalUrlByPort(port);
            this._port = port;
            return Promise.all([Spotilocal.getOauthToken(), Spotilocal.getCsrfToken(this.spotilocalUrl)]);
        }).then((value) => {
            this.oauth = value[0];
            this.csrf = value[1];
            this.initialized = true;
            return this;
        })
    }

    @failIfNotInitialized
    public getStatus(returnOn?: ReturnOnParam[], returnAfter: number = 0): Promise<Status> {
        let timeout = 1000;

        const params = new Map<string, any>();
        if (returnOn && returnOn.length) {
            params.set('returnon', returnOn.join(','));
            params.set('returnafter', returnAfter); // 0 disables the timeout, passing -1 can cause spontaneous high CPU usage

            if (returnAfter === 0) timeout = 0;
            else timeout = (returnAfter * 1000) + 1000;
        }

        return this.genericCommand('status', params, timeout);
    }

    /**
     * Pauses(or unpauses) playback of spotify.
     * @param pause if true, then pauses playback. If else resumes playback.
     */
    @failIfNotInitialized
    public pause(pause:boolean = true): Promise<Status> {        
        const params = new Map<string, any>();
        params.set('pause', pause);     
        return this.genericCommand('pause', params);           
    }

    /**
     * Plays song with uri in provided context.
     * @param uri track uri
     * @param context context of song(where it exists). Examples: playlist uri, album uri and so on. 
     */
    @failIfNotInitialized    
    public play(uri:string, context?:string): Promise<Status> {        
        const params = new Map<string, any>();
        params.set('uri', uri);
        context && params.set('context', context);     
        return this.genericCommand('play', params);           
    }  

    private genericCommand(command: string, additionalProps?: Map<string, any>, timeout?: number): Promise<Status> {
        const additionalQuery = (additionalProps && additionalProps.size) ? `&${Array.from(additionalProps.entries()).reduce((prev, curr) => {
            return `${prev}&${curr[0]}=${encodeURIComponent(curr[1])}`
        }, '')}` : '';
        return new Promise((resolve, reject) => {
            Spotilocal.requestToAbsolutelyUglyNotSecuredRequest(
                request.get(`${this.spotilocalUrl}remote/${command}.json?csrf=${this.csrf}&oauth=${this.oauth}${additionalQuery}`), timeout)
                .end((err, res) => {
                    if (err || !res.ok) {
                        reject(err || res.status);
                    } else {
                        resolve(res.body as Status);
                    }
                })
        });
    }

    /**
     * Gets oauth token that will be used in all later calls to spotilocal
     */
    public static getOauthToken(): Promise<string> {
        return new Promise((resolve, reject) => {
            request.get('https://open.spotify.com/token').end((err, res) => {
                if (err || !res.ok) {
                    reject(err || res.status);
                } else {
                    var t = (res.body as { t: string }).t;
                    resolve(t);
                }
            })
        });
    }

    /**
     * Gets csrf token that will be used in all later calls to spotilocal
     */
    public static getCsrfToken(spotilocalUrl: string): Promise<string> {
        return new Promise((resolve, reject) => {
            Spotilocal.requestToAbsolutelyUglyNotSecuredRequest(request.get(`${spotilocalUrl}simplecsrf/token.json`))
                .end((err, res) => {
                    if (err || !res.ok) {
                        reject(err || res.status);
                    } else {
                        var token = (res.body as { token: string }).token;
                        resolve(token);
                    }
                })
        });
    }

    /**
     * Gets spotilocal api url with port in range 4370-4389.
     */
    public static getSpotilocalUrl(defaultPort?: number): Promise<number> {
        return new Promise((resolve, reject) => {
            const tryGetSpotilocalVersion = (port: number) => {
                if (port > 4389) {
                    reject(SPOTILOCAL_IS_NOT_RUNNING);
                    return;
                }
                Spotilocal.getSpotilocalVersion(Spotilocal.getSpotilocalUrlByPort(port)).then(() => { resolve(port) }).catch(() => {
                    tryGetSpotilocalVersion(port + 1);
                });
            }

            if (defaultPort) {
                Spotilocal.getSpotilocalVersion(Spotilocal.getSpotilocalUrlByPort(defaultPort)).then(() => { resolve(defaultPort) }).catch(() => {
                    tryGetSpotilocalVersion(4370);
                });
            } else {
                tryGetSpotilocalVersion(4370);
            }
        });
    }

    /**
     * Gets spotilocal version (presumably version of spotify local server)
     */
    public static getSpotilocalVersion(apiUrl: string): Promise<string> {
        return new Promise((resolve, reject) => {
            Spotilocal.requestToAbsolutelyUglyNotSecuredRequest(request.get(`${apiUrl}service/version.json?service=remote`))
                .end((err, res) => {
                    if (err || !res.ok) {
                        reject(err || res.status);
                    } else {
                        resolve(JSON.parse(res.text));
                    }
                });
        });
    }

    /**
     * Sets rejectUnauthorized to false, Origin to https://open.spotify.com and timeout to 1000
     */
    public static requestToAbsolutelyUglyNotSecuredRequest(request: request.SuperAgentRequest, timeout: number = 1000): request.SuperAgentRequest {
        const req = request.set('Origin', 'https://open.spotify.com');
        if (timeout !== 0) { // Disable timeout if set to 0
            req.timeout(timeout);
        }

        return req;
    }

    private static getSpotilocalUrlByPort(port: number) {
        return `http://127.0.0.1:${port}/`;
    }
}
