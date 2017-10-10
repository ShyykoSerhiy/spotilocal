import * as request from 'superagent';
import { Status } from './status';
export declare const SPOTILOCAL_IS_NOT_INITIALIZED = "Spotilocal is not initialized";
export declare const SPOTILOCAL_IS_NOT_RUNNING = "It looks like Spotify isn't open. We failed to find spotilocal url with ports in range 4370-4380.";
export declare const RETURN_ON_PLAY: "play";
export declare const RETURN_ON_PAUSE: "pause";
export declare const RETURN_ON_LOGIN: "login";
export declare const RETURN_ON_LOGOUT: "logout";
export declare const RETURN_ON_ERROR: "error";
export declare const RETURN_ON_AP: "ap";
export declare type ReturnOnParam = typeof RETURN_ON_PLAY | typeof RETURN_ON_PAUSE | typeof RETURN_ON_LOGIN | typeof RETURN_ON_LOGOUT | typeof RETURN_ON_ERROR | typeof RETURN_ON_AP;
export declare class Spotilocal {
    initialized: boolean;
    private spotilocalUrl;
    private _port;
    readonly port: number;
    private oauth;
    private csrf;
    constructor();
    init(defaultPort?: number): Promise<Spotilocal>;
    getStatus(returnOn?: ReturnOnParam[], returnAfter?: number): Promise<Status>;
    /**
     * Pauses(or unpauses) playback of spotify.
     * @param pause if true, then pauses playback. If else resumes playback.
     */
    pause(pause?: boolean): Promise<Status>;
    /**
     * Plays song with uri in provided context.
     * @param uri track uri
     * @param context context of song(where it exists). Examples: playlist uri, album uri and so on.
     */
    play(uri: string, context?: string): Promise<Status>;
    private genericCommand(command, additionalProps?, timeout?);
    /**
     * Gets oauth token that will be used in all later calls to spotilocal
     */
    static getOauthToken(): Promise<string>;
    /**
     * Gets csrf token that will be used in all later calls to spotilocal
     */
    static getCsrfToken(spotilocalUrl: string): Promise<string>;
    /**
     * Gets spotilocal api url with port in range 4370-4389.
     */
    static getSpotilocalUrl(defaultPort?: number): Promise<number>;
    /**
     * Gets spotilocal version (presumably version of spotify local server)
     */
    static getSpotilocalVersion(apiUrl: string): Promise<string>;
    /**
     * Sets rejectUnauthorized to false, Origin to https://open.spotify.com and timeout to 1000
     */
    static requestToAbsolutelyUglyNotSecuredRequest(request: request.SuperAgentRequest, timeout?: number): request.SuperAgentRequest;
    private static getSpotilocalUrlByPort(port);
}
