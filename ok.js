const accessToken = new URLSearchParams(window.location.hash.substring(1)).get(
  "access_token"
);

const topTracks = document.querySelector("#top-tracks");
const topArtists = document.querySelector("#top-artists");
const btnTop50 = document.querySelector("#btn-top-50");

var SpotifyWebApi = require("spotify-web-api-js");

var spotifyApi = new SpotifyWebApi();
spotifyApi.setAccessToken(accessToken);

let userId;
spotifyApi.getMe().then(
  function (data) {
    userId = data.id;
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
    btnTop50.addEventListener("click", function () {
      createNewPlaylist();
    });
  },
  function (err) {
    console.error(err);
  }
);

function createNewPlaylist() {
  const playlistName = `Top 50 tracks - ${Intl.DateTimeFormat(
    navigator.locale
  ).format(Date.now())} `;
  const playlistDescription = "Your current top 50 tracks, all in one playlist";
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

// const options = { limit: 10 };
// spotifyApi.getMyTopTracks(options).then(
//   function (data) {
//     let tracks = ("User information", data.items);
//     tracks.forEach((element) => {
//       let previewUrl = element.preview_url;
//       const audio = document.createElement("audio");
//       audio.controls = true;
//       audio.src = previewUrl;
//       const trackName = document.createElement("h3");
//       trackName.textContent = element.name;
//       topTracks.insertAdjacentElement("beforeend", trackName);
//       topTracks.insertAdjacentElement("beforeend", audio);
//     });
//   },
//   function (err) {
//     console.error(err);
//   }
// );

// spotifyApi.getMyTopArtists(options).then(
//   function (data) {
//     const artists = data.items;
//     artists.forEach((artist) => {
//       const artistPfpSource = artist.images[2].url;
//       const artistPfp = document.createElement("img");
//       artistPfp.src = artistPfpSource;
//       const artistName = document.createElement("h3");
//       artistName.textContent = artist.name;
//       topArtists.insertAdjacentElement("beforeend", artistName);
//       topArtists.insertAdjacentElement("beforeend", artistPfp);
//     });
//   },
//   function (err) {
//     console.error(err);
//   }
// );
