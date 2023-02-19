let accessToken = new URLSearchParams(window.location.hash.substring(1)).get(
  "access_token"
);

const topTracks = document.querySelector("#top-tracks");
const topArtists = document.querySelector("#top-artists");
const btnTop50 = document.querySelector("#btn-top-50");
const btnMixUp = document.querySelector("#btn-mix-up");

var SpotifyWebApi = require("spotify-web-api-js");

var spotifyApi = new SpotifyWebApi();
spotifyApi.setAccessToken(accessToken);

let userId;
spotifyApi.getMe().then(
  function (data) {
    userId = data.id;

    btnTop50.addEventListener("click", function () {
      createNewTop50TrackPlaylist();
    });
    btnMixUp.addEventListener("click", function () {
      createMixUpPlaylist();
    });
  },
  function (err) {
    console.error(err);
  }
);

const options = { limit: 10 };
spotifyApi.getMyTopTracks(options).then(
  function (data) {
    let tracks = ("User information", data.items);
    tracks.forEach((track) => {
      let previewUrl = track.preview_url;
      const audio = document.createElement("audio");
      audio.controls = true;
      audio.src = previewUrl;
      const trackName = document.createElement("h3");
      if (track.artists.length === 1)
        trackName.textContent = `${track.name} by ${track.artists[0].name}`;
      else {
        trackName.textContent = `${track.name} by ${track.artists
          .map((ele) => ele.name)
          .join(", ")}`;
      }
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

function createMixUpPlaylist() {
  const playlistName = `Mix Up Tracks - ${Intl.DateTimeFormat(
    navigator.locale
  ).format(Date.now())} `;
  const playlistDescription =
    "Mixed Up songs from all your playlists - Created By SpotOn";
  spotifyApi
    .createPlaylist(userId, {
      name: playlistName,
      description: playlistDescription,
      public: false,
    })
    .then((response) => {
      const playlistId = response.id;
      addMixUpTracks(playlistId);
    })
    .catch((error) => {
      console.error(`Error creating new playlist: ${error}`);
    });
}

async function addMixUpTracks(plId) {
  const mixTracks = [];

  try {
    const data = await spotifyApi.getUserPlaylists(userId, { limit: 50 });
    for (const item of data.items) {
      const i = item.id;
      const trackData = await spotifyApi.getPlaylistTracks(i, { limit: 50 });
      const randomTrack =
        trackData.items[Math.floor(Math.random() * trackData.items.length)]
          ?.track.uri;
      if (randomTrack) {
        mixTracks.push(randomTrack);
      }
    }
    await spotifyApi.addTracksToPlaylist(plId, mixTracks);
  } catch (error) {
    console.error(`Error adding new tracks: ${error}`);
  }
}

function createNewTop50TrackPlaylist() {
  const playlistName = `Top 50 tracks - ${Intl.DateTimeFormat(
    navigator.locale
  ).format(Date.now())} `;
  const playlistDescription =
    "Your current top 50 tracks, all in one playlist - Created By SpotOn";
  spotifyApi
    .createPlaylist(userId, {
      name: playlistName,
      description: playlistDescription,
      public: false,
    })
    .then((response) => {
      const playlistId = response.id;
      addTop50Tracks(playlistId);
    })
    .catch((error) => {
      console.error(`Error creating new playlist: ${error}`);
    });
}

function addTop50Tracks(plId) {
  spotifyApi.getMyTopTracks({ limit: 50 }).then(
    function (data) {
      let tracks = ("User information", data.items);
      const top50Tracks = tracks.map((element) => {
        return element.uri;
      });
      spotifyApi.addTracksToPlaylist(plId, top50Tracks);
    },
    function (err) {
      console.error(err);
    }
  );
}
