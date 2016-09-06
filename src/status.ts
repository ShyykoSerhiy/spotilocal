export interface Status {
    "version": number, // 9 
    "client_version": string, //"1.0.36.124.g1cba1920", 
    "playing": boolean,
    "shuffle": boolean,
    "repeat": boolean,
    "play_enabled": boolean,
    "prev_enabled": boolean,
    "next_enabled": boolean,
    "track": {
        "track_resource": {
            "name": string,//"Ready", 
            "uri": string,//"spotify:track:5FPctWaZw32JIRJrOtW8fp", 
            "location": {
                "og": string//"https://open.spotify.com/track/5FPctWaZw32JIRJrOtW8fp"
            }
        },
        "artist_resource": {
            "name": string,//"Sondar", 
            "uri": string,//"spotify:artist:18QL43RyFNcvKqvL1uYtpz", 
            "location": {
                "og": string//"https://open.spotify.com/artist/18QL43RyFNcvKqvL1uYtpz"
            }
        },
        "album_resource": {
            "name": string,//"Ready", 
            "uri": string,//"spotify:album:4wX476IXAup6Oo7PBN6AvE", 
            "location": {
                "og": string//"https://open.spotify.com/album/4wX476IXAup6Oo7PBN6AvE"
            }
        },
        /**
         * Duration of the track
         */
        "length": number,//207,   
        "track_type": string//"normal"
    },
    "context": {},
    "playing_position": number,//63.02, 
    "server_time": number,//1473180693, 
    "volume": number,//0.88999772, 
    "online": boolean,//true, 
    "open_graph_state": {
        "private_session": boolean,//false, 
        "posting_disabled": boolean,//false
    },
    "running": boolean//true
}