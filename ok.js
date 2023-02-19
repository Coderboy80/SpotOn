const accessToken = new URLSearchParams(window.location.hash.substring(1)).get(
  "access_token"
);

const topTracks = document.querySelector("#top-tracks");
const topArtists = document.querySelector("#top-artists");

var SpotifyWebApi = require("spotify-web-api-js");

var spotifyApi = new SpotifyWebApi();
spotifyApi.setAccessToken(accessToken);

let userId;
spotifyApi.getMe().then(
  function (data) {
    userId = data.id;
    console.log(userId);
  },
  function (err) {
    console.error(err);
  }
);

const options = { limit: 10 };
spotifyApi.getMyTopTracks(options).then(
  function (data) {
    let tracks = ("User information", data.items);
    tracks.forEach((element) => {
      let previewUrl = element.preview_url;
      const audio = document.createElement("audio");
      audio.controls = true;
      audio.src = previewUrl;
      const trackName = document.createElement("h3");
      trackName.textContent = element.name;
      topTracks.insertAdjacentElement("beforeend", trackName);
      topTracks.insertAdjacentElement("beforeend", audio);
    });
  },
  function (err) {
    console.error(err);
  }
);

spotifyApi.getMyTopArtists(options).then(
  function (data) {
    const artists = data.items;
    artists.forEach((artist) => {
      const artistPfpSource = artist.images[2].url;
      const artistPfp = document.createElement("img");
      artistPfp.src = artistPfpSource;
      const artistName = document.createElement("h3");
      artistName.textContent = artist.name;
      topArtists.insertAdjacentElement("beforeend", artistName);
      topArtists.insertAdjacentElement("beforeend", artistPfp);
    });
  },
  function (err) {
    console.error(err);
  }
);

// spotifyApi.createPlaylist(userId);
