const login = document.querySelector("#login");
const client_id = "17c429b2b366470d9bb920afd43ee271";
const redirect_uri = "http://127.0.0.1:5500/new.html";
const scope =
  "user-read-private user-read-email playlist-read-private playlist-read-collaborative";

var url = "https://accounts.spotify.com/authorize";
url += "?response_type=token";
url += "&client_id=" + encodeURIComponent(client_id);
url += "&scope=" + encodeURIComponent(scope);
url += "&redirect_uri=" + encodeURIComponent(redirect_uri);

login.addEventListener("click", function () {
  window.location.href = url;
});
