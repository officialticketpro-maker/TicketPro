const API_KEY = "YOUR_TICKETMASTER_API_KEY"; // Replace this placeholder with your real key
const SEARCH_KEYWORD = "Islanders";
const COUNTRY_CODE = "US";
const gamesContainer = document.getElementById("games-container");

function formatDate(dateStr, timeStr) {
  const options = { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' };
  const date = new Date(dateStr + "T" + (timeStr || "12:00:00"));
  return date.toLocaleDateString(undefined, options) + (timeStr ? " — " + timeStr.slice(0, 5) : "");
}

function fetchGames() {
  const url = `https://app.ticketmaster.com/discovery/v2/events.json?apikey=${API_KEY}&keyword=${encodeURIComponent(SEARCH_KEYWORD)}&countryCode=${COUNTRY_CODE}`;
  fetch(url)
    .then((response) => {
      if (!response.ok) throw new Error("API Error: " + response.status);
      return response.json();
    })
    .then((data) => {
      if (!data._embedded?.events?.length) {
        gamesContainer.innerHTML = "<p>No upcoming games found.</p>";
        return;
      }
      renderGames(data._embedded.events);
    })
    .catch((error) => {
      console.error(error);
      gamesContainer.innerHTML = "<p>Failed to load games. Try again later.</p>";
    });
}

function renderGames(events) {
  gamesContainer.innerHTML = "";
  events.forEach(event => {
    const name = event.name;
    const date = event.dates?.start?.localDate;
    const time = event.dates?.start?.localTime;
    const venue = event._embedded?.venues?.[0]?.name;
    const url = event.url;

    const div = document.createElement("div");
    div.className = "game";
    div.innerHTML = `
      <h3>${name}</h3>
      <p>${formatDate(date, time)}</p>
      <p>Venue: ${venue || "TBA"}</p>
      <a href="${url}" class="buy-btn" target="_blank">Buy on Ticketmaster</a>
    `;
    gamesContainer.appendChild(div);
  });
}

fetchGames();
