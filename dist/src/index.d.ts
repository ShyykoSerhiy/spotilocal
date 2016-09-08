import * as request from 'superagent';
import { Status } from './status';
export declare const SPOTILOCAL_IS_NOT_INITIALIZED: string;
export declare class Spotilocal {
    private spotilocalUrl;
    private oauth;
    private csrf;
    private initialized;
    constructor();
    init(): Promise<Spotilocal>;
    getStatus(): Promise<Status>;
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
    private genericCommand(command, additionalProps?);
    /**
     * Gets oauth token that will be used in all later calls to spotilocal
     */
    static getOauthToken(): Promise<string>;
    /**
     * Gets csrf token that will be used in all later calls to spotilocal
     */
    static getCsrfToken(spotilocalUrl: string): Promise<string>;
    /**
     * Gets spotilocal appi url with port in range 4370-4380.
     */
    static getSpotilocalUrl(): Promise<string>;
    /**
     * Gets spotilocal version (presumably version of spotify local server)
     */
    static getSpotilocalVersion(apiUrl: string): Promise<string>;
    /**
     * Sets rejectUnauthorized to false, Origin to https://open.spotify.com and timeout to 1000
     */
    static requestToAbsolutelyUglyNotSecuredRequest(request: request.SuperAgentRequest): request.SuperAgentRequest;
}
