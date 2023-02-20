let accessToken = new URLSearchParams(window.location.hash.substring(1)).get(
  "access_token"
);

let logOutTimer = setInterval(function () {
  window.location.href = "http://127.0.0.1:5500/index.html";
}, 1000 * 3500);

const topTracks = document.querySelector("#tracks");
const topArtists = document.querySelector("#top-artists");
const btnTop50 = document.querySelector("#btn-top-50");
const btnMixUp = document.querySelector("#btn-mix-up");
const welcomeMessage = document.querySelector("#welcome-message");

var SpotifyWebApi = require("spotify-web-api-js");

var spotifyApi = new SpotifyWebApi();
spotifyApi.setAccessToken(accessToken);

let userId;
spotifyApi.getMe().then(
  function (data) {
    let userDisplayName = data.display_name;
    let userProfilePic = data?.images[0]?.url;

    let username = document.createElement("h1");
    username.textContent = `Hello ${userDisplayName}`;
    welcomeMessage.insertAdjacentElement("afterbegin", username);

    if (userProfilePic) {
      let pfp = document.createElement("img");
      pfp.src = userProfilePic;
      pfp.id = "pfp";
      console.log(pfp);
      welcomeMessage.insertAdjacentElement("beforeend", pfp);
    }

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

function stringToHTML(str) {
  let parser = new DOMParser();
  let doc = parser.parseFromString(str, "text/html");
  return doc.body;
}

const options = { limit: 10 };
spotifyApi.getMyTopTracks(options).then(
  function (data) {
    let tracks = ("User information", data.items);
    tracks.forEach((track, i) => {
      let trackArtists = "";
      if (track.artists.length === 1)
        trackArtists = `${track.name} by ${track.artists[0].name}`;
      else {
        trackArtists = `${track.name} by ${track.artists
          .map((ele) => ele.name)
          .join(", ")}`;
      }
      let aTrack = `<div class="aTrack">
    <h3 id="trackName">${i + 1}. ${trackArtists}</h3>
    <img src="${track.album.images[0].url}" id="trackImg">
    <audio src="${track.preview_url}" controls="true"></audio>
</div>`;

      topTracks.insertAdjacentElement("beforeend", stringToHTML(aTrack));
    });
  },
  function (err) {
    console.error(err);
  }
);

spotifyApi.getMyTopArtists(options).then(
  function (data) {
    const artists = data.items;
    artists.forEach((artist, i) => {
      console.log(artist);
      let anArtist = `<div class="anArtist">
  <img src="${artist.images[2].url}" />
  <h3>${i + 1}. ${artist.name}</h3>
  <h3>${artist.genres[0]}</h3>
</div>
`;
      topArtists.insertAdjacentElement("beforeend", stringToHTML(anArtist));
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
  btnMixUp.disabled = true;

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
    btnMixUp.disabled = false;
  } catch (error) {
    console.error(`Error adding new tracks: ${error}`);
    btnMixUp.disabled = false;
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
        console.log(element.id);
        return element.uri;
      });
      spotifyApi.addTracksToPlaylist(plId, top50Tracks);
    },
    function (err) {
      console.error(err);
    }
  );
}
