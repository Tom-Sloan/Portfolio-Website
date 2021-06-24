const clientID = 'bbb8cfd60e114a708a2b57727581a434';
const redirectURI = 'http://localhost:3000/about'
let token;

const Spotify = {
    getAccessToken () {
        if(token) {
            return token;
        }

        const accessToken = window.location.href.match(/access_token=([^&]*)/);
        const expiresIn = window.location.href.match(/expires_in=([^&]*)/);

        if (accessToken && expiresIn) {
            token = accessToken[1];
            const expires_in = Number(expiresIn[1]);

            window.setTimeout(() => token = '', expires_in * 1000);
            window.history.pushState('Access Token', null, '/');
            return token;
        } else {
            const accessURL = `https://accounts.spotify.com/authorize?client_id=${clientID}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURI}`;
            window.location = accessURL;
        }
    },

    getPlaylists(userID) {
        const accessToken = Spotify.getAccessToken();
        const headers = { Authorization: `Bearer ${accessToken}` };
        // let userID;

        // console.log(`https://api.spotify.com/v1/users/${userID}/playlists`)

        return fetch(`https://api.spotify.com/v1/users/${userID}/playlists`, {
            headers: headers
        }).then(response => {
            return response.json();
        }).then(jsonResponse => {
            console.log(jsonResponse);
            return jsonResponse.items;
        });

        // return fetch('https://api.spotify.com/v1/me', {
        //     headers: headers
        // }).then(response => {
        //     return response.json();
        // }).then(jsonResponse => {
        //     userID = jsonResponse.id;
        //     console.log(`https://api.spotify.com/v1/users/${userID}/playlists`)
        //     return fetch(`https://api.spotify.com/v1/users/${userID}/playlists`, {
        //         headers: headers,
        //         // method: 'POST',
        //         // body: JSON.stringify({ name: playlistName })
        //     }).then(response => {
        //         return response.json();
        //     }).then(jsonResponse => {
        //         console.log(jsonResponse);
        //         return jsonResponse.items;
        //     });
        // });
    },

    search(term) {
        const accessToken = Spotify.getAccessToken();
        return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, { 
                headers: { 
                    Authorization: `Bearer ${accessToken}` 
                }
            }
        ).then(response => {
            return response.json();
        }).then(jsonResponse => {
            if (!jsonResponse.tracks) {
                return [];
            }
            return jsonResponse.tracks.items.map(track => ({
                id: track.id,
                name: track.name,
                artist: track.artists[0].name,
                album: track.album.name,
                uri: track.uri
            }));
        });
    },

    savePlaylist(playlistName, trackURIs) {
        // console.log('Checking');
        // console.log(playlistName);
        // console.log(trackURIs.length);
        if (!playlistName || !trackURIs.length) {
            return;
        }
        // console.log('Preparing');
        const accessToken = Spotify.getAccessToken();
        const headers = { Authorization: `Bearer ${accessToken}` };
        let userID;

        return fetch('https://api.spotify.com/v1/me', {
            headers: headers
        }).then(response => {
            return response.json();
        }).then(jsonResponse => {
            userID = jsonResponse.id;
            return fetch(`https://api.spotify.com/v1/users/${userID}/playlists`, {
                headers: headers,
                method: 'POST',
                body: JSON.stringify({ name: playlistName })
            }).then(response => {
                return response.json();
            }).then(jsonResponse => {
                const playlistID = jsonResponse.id;
                return fetch(`https://api.spotify.com/v1/users/${userID}/playlists/${playlistID}/tracks`, {
                    headers: headers,
                    method: 'POST',
                    body: JSON.stringify({ uris: trackURIs })
                });
            });
        });
    }
}

export default Spotify;