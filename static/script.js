// Fonction pour effectuer une requête AJAX vers l'API
function fetchGenre() {
    fetch('urlAPI_pour_laPage')
        .then(response => response.json())
        .then(data => {
            // Appeler la fonction pour afficher les Genres sur la page
            displayGenres(data);
        })
        .catch(error => console.error('Erreur lors de la récupération des Genres:', error));
}

// Fonction pour afficher les genres sur la page HTML
function displayGenres(genres) {
    const genresList = document.getElementById('genre');
    genres.forEach(genre => {
        const genreElement = document.createElement('div');
        genreElement.innerHTML = `
            <h2>${genre.name}</h2>
            <p>${genre.slug}</p>
            <p>${genre.games_count}</p>
            <img src="${genre.image_background}" alt="Background Image">
            <p>${genre.description}</p>
        `;
        genresList.appendChild(genreElement);
    });
}

// Appeler la fonction pour récupérer les genres lors du chargement de la page
window.onload = fetchGenre;

//Faire la même pour les autres pages... Home , Developers , Platforms 
