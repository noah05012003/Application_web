document.addEventListener('DOMContentLoaded', function() {
    // Sélectionner le bouton de suppression par son ID
    var deleteUserBtn = document.getElementById('deleteUserBtn');

    // Ajouter un écouteur d'événement de clic au bouton de suppression
    deleteUserBtn.addEventListener('click', function() {
        // Envoyer une requête HTTP POST au serveur Flask
        fetch('/user/delete/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            // Aucun corps de la requête n'est nécessaire car l'ID de l'utilisateur est déjà stocké dans la session côté serveur
        })
        .then(response => {
            if (response.ok) {
                // Rediriger l'utilisateur vers la page d'accueil après la suppression réussie
                window.location.href = '/';
            } else {
                // Afficher un message d'erreur en cas d'échec de la suppression
                console.error('Erreur lors de la suppression de l\'utilisateur');
            }
        })
        .catch(error => {
            console.error('Erreur lors de la requête fetch :', error);
        });
    });
});

fetch('https://api.rawg.io/api/games?key=86a34209259b4dd496f0989055c1711b')
  .then(response => response.json())
  .then(data => {
    const gamesContainer = document.getElementById('games-container');
    gamesContainer.innerHTML = '';

    data.results.forEach(game => {
      const userRatingHtml = displayUserRating(game.id); // Obtenez le HTML pour la note de l'utilisateur
      const gameCard = document.createElement('div');
      gameCard.className = 'game-card';

      gameCard.innerHTML = `
        <img src="${game.background_image}" alt="${game.name}" class="game-image">
        <div class="game-info">
          <h3 class="game-title">${game.name}</h3>
          <div class="game-ratings">
            <span class="global-rating">Global Rating: ${game.rating}</span>
            ${userRatingHtml} <!-- Insérer la note de l'utilisateur ici -->
          </div>
          <div class="game-actions">
            <button onclick="rateGame('${game.id}')" class="btn-rate">Rate</button>
            <button onclick="addToLibrary('${game.id}')" class="btn-add">Add to Library</button>
          </div>
        </div>
      `;
      gamesContainer.appendChild(gameCard);
    });
  })
  .catch(error => {
    console.error('Erreur lors de la récupération des données de l\'API:', error);
  });


  let currentPage = 1; // Commence à la première page
  const maxGames = 100; // Limite maximale de jeux à afficher
  let gamesLoaded = 0;

  function loadGames(page) {
    // Vérifiez si nous avons déjà chargé 100 jeux
    if (gamesLoaded >= maxGames) {
      return; // Si c'est le cas, ne chargez plus de jeux
    }
  
    fetch(`https://api.rawg.io/api/games?key=86a34209259b4dd496f0989055c1711b&page=${page}&page_size=20`) // Assurez-vous que la taille de page est définie sur 20 jeux par requête (ou selon ce que l'API permet)
      .then(response => response.json())
      .then(data => {
        const gamesContainer = document.getElementById('games-container');
  
        data.results.forEach(game => {
          if (gamesLoaded < maxGames) { // Vérifiez si le nombre maximal de jeux n'a pas été chargé
            const userRatingHtml = displayUserRating(game.id);
            const gameCard = document.createElement('div');
            gameCard.className = 'game-card';
            gameCard.innerHTML = `
              <img src="${game.background_image}" alt="${game.name}" class="game-image">
              <div class="game-info">
                <h3 class="game-title">${game.name}</h3>
                <div class="game-ratings">
                <span class="global-rating">Global Rating: ${game.rating}</span>
                ${userRatingHtml} <!-- Insérer la note de l'utilisateur ici -->
                </div>
                <div class="game-actions">
                <button onclick="rateGame('${game.id}')" class="btn-rate">Rate</button>
                <button onclick="addToLibrary('${game.id}')" class="btn-add">Add to Library</button>
              </div>
              </div>
            `;
        
            gamesContainer.appendChild(gameCard);
            gamesLoaded++; // Incrémenter le compteur de jeux chargés
          }
        });
  
        // Incrémenter la page actuelle si moins de 100 jeux ont été chargés
        if (gamesLoaded < maxGames) {
          currentPage++;
          loadGames(currentPage); // Chargez la page suivante
        }
      })
      .catch(error => {
        console.error('Erreur lors de la récupération des données de l\'API:', error);
      });
  }
  
  // Commencez à charger les jeux dès le chargement du script
  loadGames(currentPage);
  

 const api_key = "86a34209259b4dd496f0989055c1711b"

 function rateGame(gameId) {
  const userRating = prompt('Rate the game (1-5):', '');
  if (userRating >= 1 && userRating <= 5) {
    const ratings = JSON.parse(localStorage.getItem('userRatings')) || {};
    ratings[gameId] = userRating;
    localStorage.setItem('userRatings', JSON.stringify(ratings));
    updateGameCardRating(gameId, userRating); // Mettez à jour l'affichage de la note
  } else {
    alert('Invalid rating. Please enter a number from 1 to 5.');
  }
}
function updateGameCardRating(gameId, userRating) {
  const ratingDisplay = document.getElementById(`rating-${gameId}`);
  if (ratingDisplay) {
    ratingDisplay.textContent = `Your Rating: ${userRating}`;
  }
}
function displayUserRating(gameId) {
  const ratings = JSON.parse(localStorage.getItem('userRatings')) || {};
  // La note de l'utilisateur sera affichée dans un élément span avec une classe spécifique pour le style
  return ratings[gameId] ? `<span class="user-rating">Your Rating: ${ratings[gameId]}</span>` : '<span class="no-rating">Rate this game</span>';
}


function addToLibrary(gameId) {
  const library = JSON.parse(localStorage.getItem('library')) || [];
  if (!library.includes(gameId)) {
    library.push(gameId);
    localStorage.setItem('library', JSON.stringify(library));
    console.log(`Game with ID: ${gameId} added to library`);
  } else {
    console.log('Game is already in the library.');
  }
}

function displayLibrary() {
  const library = JSON.parse(localStorage.getItem('library')) || [];
  console.log('Library:', library);
  
  // creer un conteneur avec l'id 'library-container' dans ma page Library
  const libraryContainer = document.getElementById('library-container');
  libraryContainer.innerHTML = ''; 

  // Affichez le jeu dans la bibliothèque
  library.forEach(gameId => {
    // Ici faire requête à l'API pour obtenir les détails du jeu par son ID
    // créer les éléments HTML pour l'affichage, ou utiliser des informations stockées localement
  });
}


