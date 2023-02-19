const accessToken = new URLSearchParams(window.location.hash.substring(1)).get(
  "access_token"
);
var SpotifyWebApi = require("spotify-web-api-js");

var spotifyApi = new SpotifyWebApi();
spotifyApi.setAccessToken(accessToken);

spotifyApi.getMe().then(
  function (data) {
    console.log("User information", data);
  },
  function (err) {
    console.error(err);
  }
);
