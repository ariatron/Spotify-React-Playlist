let accessToken;
const clientID = 'e4682aa1ed784942aa2ff475d1f8d15b';
const redirectUrl = 'http://arireactplaylist.surge.sh';
//const redirect_uri = 'https://localhost:3000';

const Spotify = {
	getAccessToken() {
		if (accessToken) {
			return accessToken;
		} 

		const newAccessToken = window.location.href.match(/access-token=([^&]*)/);
		const newExpiresIn = window.location.href.match(/expires_in=([^&]*)/);

		if (newAccessToken && newExpiresIn) {
			accessToken = newAccessToken[1];
			const expiresIn = Number(newExpiresIn[1]);

			// Clear parameters, allow fetching a new token after expiration
			window.setTimeout(() => (accessToken = ''), expiresIn * 1000);
			window.history.pushState('Access Token', null, '/');
			return accessToken;
		} else {
            const accessUrl = `https://accounts.spotify.com/authorize?client_id=${clientID}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectUrl}`;
            window.location = accessUrl;
		} 

	},

    search(searchTerm) {
        const accessToken = Spotify.getAccessToken();
        return fetch(`https://api.spotify.com/v1/search?type=track&q=${searchTerm}`,
            {
                headers: {Authorization: `Bearer ${accessToken}`}
            }).then(response => {
                return response.json();
            }).then(jsonResponse => {
                if(!jsonResponse.tracks) {
                    return [];
                }

                return jsonResponse.tracks.items.map(track => (
                    {
                        id: track.id,
                        name: track.name,
                        artists: track.artists[0].name,
                        album: track.album.name,
                        uri: track.uri

                    })
                );
            })
    },

	savePlaylist(playlistName, trackURIs) {
		if (playlistName && trackURIs.length) {
			const accessToken = Spotify.getAccessToken();
			const headers = { Authorization: `Bearer: ${accessToken}`};
			let userID;

			let playlistID;

			// Get userId
			return fetch('https://api.spotify.com/v1/me', {headers: headers})
				.then( (response) => {
						if (response.ok) {
							return response.json();
						}
						throw new Error('Requested failed!');
					},
					(networkError) => {
						console.log(networkError.message);
					}
				)
				.then((jsonResponse) => {
					userID = jsonResponse.id;
					return fetch(`https://api.spotify.com/v1/users/${userID}/playlists`, 
					{
						method: 'POST',
						headers: headers,
						body: JSON.strigify({ name: playlistName })
					})
					.then(
						(response) => {
							if (response.ok) {
								return response.json();
							}
							throw new Error('Request failed!');
						},
						(networkError) => {
							console.log(networkError.message);
						}
					)
					.then((jsonResponse) => {
						playlistID = jsonResponse.id;
						return fetch(`https://api.spotify.com/v1/users/${userID}/playlists/${playlistID}/tracks`, {
							method: 'POST',
							headers: headers,
							body: JSON.stringify({ uris: trackURIs })
						})
							.then(
								(response) => {
									if (response.ok) {
										return response.json();
									}
									throw new Error('Request failed!');
								},
								(networkError) => {
									console.log(networkError.message);
								}
							)
							.then((jsonResponse) => jsonResponse);
					});
				});

		} else {
			return;
		}
	}
};

export default Spotify;