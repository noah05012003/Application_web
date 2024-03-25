const apiBaseUrl = "https://api.rawg.io/api/games";
const apiKey = "86a34209259b4dd496f0989055c1711b";

async function fetchGamesNowPlaying() {
    const response = await fetch(`${apiBaseUrl}/https://api.rawg.io/api/games?key=${apiKey}`);
    const jsonResponse = await response.json();
    const movies = jsonResponse.results;
    console.log(movies);
}

fetchGamesNowPlaying();