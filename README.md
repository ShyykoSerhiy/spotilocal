# spotilocal
Unofficial api for Spotify's local web server.

## How it works
It uses the same method as https://developer.spotify.com/technologies/widgets/spotify-play-button/ does. 
Basically Spotify desktop runs a web server on 127.0.0.1 that can accept specific commands and even open 
Spotify client itself.  

Spotify domain spotilocal.com that simply points to 127.0.0.1. Apparently in order to bypass browser's 
limitation of amount of concurrent connection to the same domain they use randomly generated subdomains 
of spotilocal.com. 

## Api

### Spotilocal#init(defaultPort?:number)

Initializes the Spotilocal client. Returns a Promise for Spotilocal client.

defaultPort - Port to try first.

### Spotilocal#getStatus(returnOn?:Array<`play`|`pause`|`login`|`logout`|`error`|`ap`>, returnAfter?:number)

Returns a Promise for Status.

returnOn - Activates long-polling to return when one or more specific event(s) occur.

returnAfter - Defines a timeout. Pass 0 to disable. Default is 0.

### Spotilocal#pause(pause:boolean)

Pauses or unpauses current playback. Returns a Promise for Status.  

### Spotilocal#play(uri:string, context?:string)

Plays song with uri in provided context.

uri - track uri.

context - of song(where it exists). Examples: playlist uri, album uri and so on. 

Returns a Promise for Status. 

## Example usage 


```ts
import {Spotilocal} from 'spotilocal';

const spotilocal = new Spotilocal();
const trackUri = 'spotify:track:3cANM3NuUjRDTi8fdU8P6q';
spotilocal.init().then((spotilocal) => {
    return spotilocal.play(trackUri, 'spotify:user:shyyko.serhiy:playlist:4SdN0Re3tJg9uG08z2Gkr1')
}).then((status) => {
    console.log(`Playing:   ${status.playing}`);
    console.log(`Song Name: ${status.track.track_resource.name}`);
    return spotilocal.pause(true);
}).catch(console.error);
```


