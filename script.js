// === CONFIG ===
// Replace with your actual Ticketmaster API key
const API_KEY = "YOUR_TICKETMASTER_API_KEY";
const SEARCH_KEYWORD = "Islanders";
const COUNTRY_CODE = "US";

const gamesContainer = document.getElementById("games-container");

function fetchGames() {
  const url = `https://app.ticketmaster.com/discovery/v2/events.json?apikey=${API_KEY}&keyword=${encodeURIComponent(SEARCH_KEYWORD)}&countryCode=${COUNTRY_CODE}`;
  fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok: " + response.status);
      }
      return response.json();
    })
    .then((data) => {
      if (!data._embedded || !data._embedded.events) {
        gamesContainer.innerHTML = "<p>No upcoming games found.</p>";
        return;
      }
      const events = data._embedded.events;
      renderGames(events);
    })
    .catch((error) => {
      console.error("Error fetching games:", error);
      gamesContainer.innerHTML = "<p>Error loading games. Try again later.</p>";
    });
}

function renderGames(events) {
  gamesContainer.innerHTML = "";

  events.forEach((ev) => {
    const name = ev.name;
    const date = ev.dates?.start?.localDate;
    const time = ev.dates?.start?.localTime;
    const venue = ev._embedded?.venues && ev._embedded.venues[0]?.name;
    const url = ev.url;

    const div = document.createElement("div");
    div.className = "game";

    const html = `
      <h3>${name}</h3>
      <p>Date: ${date} ${time || ""}</p>
      <p>Venue: ${venue || "TBA"}</p>
      <a href="${url}" class="buy-btn" target="_blank">Buy on Ticketmaster</a>
    `;
    div.innerHTML = html;
    gamesContainer.appendChild(div);
  });
}

fetchGames();
