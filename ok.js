const accessToken = new URLSearchParams(window.location.hash.substring(1)).get(
  "access_token"
);
var SpotifyWebApi = require("spotify-web-api-js");

var spotifyApi = new SpotifyWebApi();
spotifyApi.setAccessToken(accessToken);

spotifyApi.getUserPlaylists().then(
  function (data) {
    console.log(("User playlists", data.items[0]));
  },
  function (err) {
    console.error(err);
  }
);
