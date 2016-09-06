import * as request from 'superagent';
import * as https from 'https';

function failIfNotInitialized(target: any, propertyKey: string, descriptor: PropertyDescriptor):PropertyDescriptor{
    const fn = descriptor.value as Function;

    if (typeof fn !== 'function'){
        throw new Error(`@failIfNotInitialized can only be applied to method and not to ${typeof fn}`)
    }

    return Object.assign({}, descriptor, {value: function(){
        if (!this.initialized) {
            return Promise.reject<string>(SPOTILOCAL_IS_NOT_INITIALIZED);
        }         
        return fn.apply(this, arguments);
    }})

} 

export const SPOTILOCAL_IS_NOT_INITIALIZED = 'Spotilocal is not initialized';

export class Spotilocal {
    private spotilocalUrl: string;
    private oauth: string;
    private csrf: string;
    private initialized: boolean;

    constructor() {
    }

    public init(): Promise<Spotilocal> {
        return Spotilocal.getSpotilocalUrl().then((spotilocalUrl: string) => {
            this.spotilocalUrl = spotilocalUrl;
            return Promise.all([Spotilocal.getOauthToken(), Spotilocal.getCsrfToken(this.spotilocalUrl)]);
        }).then((value) => {
            this.oauth = value[0];
            this.csrf = value[1];
            this.initialized = true;
            return this;
        })
    }
    
    @failIfNotInitialized
    public getStatus(): Promise<string> {        
        return new Promise((resolve, reject) => {
            Spotilocal.requestToAbsolutelyUglyNotSecuredRequest(request.get(`${this.spotilocalUrl}remote/status.json?csrf=${this.csrf}&oauth=${this.oauth}`))
                .end((err, res) => {
                    if (err || !res.ok) {
                        reject(err || res.status);
                    } else {
                        resolve(res.body as string);
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
     * Gets spotilocal appi url with port in range 4370-4380.
     */
    public static getSpotilocalUrl(): Promise<string> {
        const subdomain = 'tommarvoloriddle'.split('').map((v, i, arr) => {
            return arr[Math.floor(Math.random() * arr.length)];
        }).join('');

        return new Promise((resolve, reject) => {
            const tryGetSpotilocalVersion = (port: number) => {
                if (port > 4380) {
                    reject('It looks like spotify isn\'t open. We failed to find spotiflocal url with ports in range 4370-4380.');
                }
                const possibleUrl = `https://${subdomain}.spotilocal.com:${port}/`;
                Spotilocal.getSpotilocalVersion(possibleUrl).then(() => { resolve(possibleUrl) }).catch(() => {
                    tryGetSpotilocalVersion(port + 1);
                });
            }
            tryGetSpotilocalVersion(4370);
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
    public static requestToAbsolutelyUglyNotSecuredRequest(request: request.SuperAgentRequest): request.SuperAgentRequest {
        return request.agent(new https.Agent({ rejectUnauthorized: false }))
            .set('Origin', 'https://open.spotify.com')
            .timeout(1000);
    }
}