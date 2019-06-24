const clientID = '6d563c63286a49f29e65622a2e4bfd26';
const redirectURI = 'http://localhost:3000/';

let accessToken;
let expiresIn;

const Spotify = {
    getAccessToken() {
        if (accessToken) {
            return accessToken;
        }

        else if (window.location.href.match(/access_token=([^&]*)/) && window.location.href.match(/expires_in=([^&]*)/)) {
            accessToken = window.location.href.match(/access_token=([^&]*)/)[1];
            expiresIn = window.location.href.match(/expires_in=([^&]*)/)[1];
      
            window.setTimeout(() => accessToken = '', expiresIn * 1000);
            window.history.pushState('Access Token', null, '/');
            return accessToken;
          }

        else {
            let spotifyUrl = `https://accounts.spotify.com/authorize?client_id=${clientID}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURI}`;
            window.location = spotifyUrl;
            return null;
        }
    },

    search(term) {
        const accessToken = this.getAccessToken();
        return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            }
        }).then(response => {
            return response.json()
          }).then(jsonResponse => {
              if (jsonResponse.tracks) {
                    return jsonResponse.tracks.items.map(track => ({
                            id: track.id,
                            name: track.name,
                            artist: track.artists[0].name,
                            album: track.album.name,
                            uri: track.uri,
                            })
            )
                        }
                        else {
                            return [];
                        }
          })
    },

savePlaylist(playlistName, trackURIs) {
    if (!playlistName || !trackURIs) {
        return;
    }

    const accessToken = this.getAccessToken();
    const headers = {Authorization: `Bearer ${accessToken}`};
    let userID;

    return fetch('https://api.spotify.com/v1/me', { headers: headers }).then(response => {return response.json()}).then(
      jsonResponse => {
        userID = jsonResponse.id;
        return fetch(`https://api.spotify.com/v1/users/${userID}/playlists`, {
          method: 'POST',
          headers: headers,
          body: JSON.stringify({ name: playlistName })
        }).then(response => response.json()).then(jsonResponse => {
          let playlistID = jsonResponse.id;
          fetch(`https://api.spotify.com/v1/playlists/${playlistID}/tracks`, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({ uris: trackURIs })
          });
        });
      }
    );
    }
};

export default Spotify;