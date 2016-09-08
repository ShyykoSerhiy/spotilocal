export interface Status {
    "version": number;
    "client_version": string;
    "playing": boolean;
    "shuffle": boolean;
    "repeat": boolean;
    "play_enabled": boolean;
    "prev_enabled": boolean;
    "next_enabled": boolean;
    "track": {
        "track_resource": {
            "name": string;
            "uri": string;
            "location": {
                "og": string;
            };
        };
        "artist_resource": {
            "name": string;
            "uri": string;
            "location": {
                "og": string;
            };
        };
        "album_resource": {
            "name": string;
            "uri": string;
            "location": {
                "og": string;
            };
        };
        /**
         * Duration of the track
         */
        "length": number;
        "track_type": string;
    };
    "context": {};
    "playing_position": number;
    "server_time": number;
    "volume": number;
    "online": boolean;
    "open_graph_state": {
        "private_session": boolean;
        "posting_disabled": boolean;
    };
    "running": boolean;
}
