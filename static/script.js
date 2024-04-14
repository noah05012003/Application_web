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
                // Rediriger l'utilisateur vers la page login après la suppression réussie
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
          <input type="hidden" class="game-id" value="${game.id}"> 
          <div class="game-ratings">
            <span class="global-rating">Global Rating: ${game.rating}</span>
            ${userRatingHtml} <!-- Insérer la note de l'utilisateur ici -->
          </div>
          <div class="game-actions">
            <button onclick="rateGame('${game.id}')" class="btn-rate">Rate</button>
            <button onclick="addToLibrary(gameId)">Add to Library</button>
            </div>
        </div>`;

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
                <input type="hidden" class="game-id" value="${game.id}"> 
                <div class="game-ratings">
                <span class="global-rating">Global Rating: ${game.rating}</span>
                ${userRatingHtml} <!-- Insérer la note de l'utilisateur ici -->
                </div>
                <div class="game-actions">
                <button onclick="rateGame('${game.id}')" class="btn-rate">Rate</button>
                <button onclick="addToLibrary('${game.id}')" class="btn-add">Add to Library</button>
                </div>
              </div>`;
        
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


//Fonction pour supprimer le jeu de la library
function DeleteToLibrary(gameId) {
  // Faites une requête pour supprimer le jeu de la bibliothèque de l'utilisateur
  fetch('/user/remove/game', {
      method: 'DELETE',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({ game_id: gameId })
  
  })
  .then(response => response.json())
  .then(data => {
      // Affichez un message à l'utilisateur pour indiquer si le jeu a été supprimé avec succès ou non
      console.log(data.message);
      // Actualisez la bibliothèque de l'utilisateur ou effectuez d'autres actions en fonction de la réponse
      // Par exemple, vous pouvez actualiser la page ou mettre à jour l'interface utilisateur
      window.location.reload();
  })
  .catch(error => {
      console.error('Erreur lors de la suppression du jeu de la bibliothèque:', error);
  });
}
function displayUserRating(gameId) {
  const ratings = JSON.parse(localStorage.getItem('userRatings')) || {};
  // La note de l'utilisateur sera affichée
  return ratings[gameId] ? `<span class="user-rating">Your Rating: ${ratings[gameId]}</span>` : '<span class="no-rating">Rate this game</span>';
}

/*genre*/
document.addEventListener('DOMContentLoaded', fetchGenres);

function fetchGenres() {
  fetch('https://api.rawg.io/api/genres?key=86a34209259b4dd496f0989055c1711b')
    .then(response => response.json())
    .then(data => {
      const genreContainer = document.getElementById('genre-container');
      genreContainer.innerHTML = '';

      data.results.forEach(genre => {
        const genreCard = document.createElement('div');
        genreCard.className = 'genre-card';

        genreCard.innerHTML = `
          <img src="${genre.image_background}" alt="${genre.name}" class="genre-image">
          <div class="genre-content">
            <h3 class="genre-title">${genre.name}</h3>
            <button onclick="followGenre('${genre.name}')" class="btn-follow">Follow</button>
          </div>
        `;
        genreContainer.appendChild(genreCard);
      });
    })
    .catch(error => {
      console.error('Error fetching genres:', error);
    });
}

function followGenre(genreName) {
  const followedGenres = JSON.parse(localStorage.getItem('followedGenres')) || [];
  if (!followedGenres.includes(genreName)) {
    followedGenres.push(genreName);
    localStorage.setItem('followedGenres', JSON.stringify(followedGenres));
    alert(`You are now following the ${genreName} genre!`);
  } else {
    alert(`You are already following the ${genreName} genre.`);
  }
}

function displayFollowedGenres() {
  const followedGenresContainer = document.getElementById('followed-genres-container');
  const followedGenres = JSON.parse(localStorage.getItem('followedGenres')) || [];

  followedGenresContainer.innerHTML = ''; 
  if (followedGenres.length === 0) {
    followedGenresContainer.innerHTML = '<p>You are not following any genres.</p>';
  } else {
    followedGenres.forEach(genreName => {
      const genreCard = document.createElement('div');
      genreCard.className = 'followed-genre-card';
      genreCard.textContent = genreName;
      followedGenresContainer.appendChild(genreCard);
    });
  }
}

document.addEventListener('DOMContentLoaded', displayFollowedGenres);

/*library*/
document.addEventListener('DOMContentLoaded', function() {
  const games = [
    {
      id: 'grand-theft-auto-v',
      name: "Grand Theft Auto V",
      image: "path/to/gta-v-image.jpg",  // Replace with the actual image path
      globalRating: 4.47,
      userRating: 5
    },
    {
      id: 'the-witcher-3-wild-hunt',
      name: "The Witcher 3: Wild Hunt",
      image: "path/to/witcher-3-image.jpg",  // Replace with the actual image path
      globalRating: 4.65,
      userRating: 1
    },
    {
      id: 'portal-2',
      name: "Portal 2",
      image: "path/to/portal-2-image.jpg",  // Replace with the actual image path
      globalRating: 4.61,
      userRating: 2
    },
    {
      id: 'counter-strike-global-offensive',
      name: "Counter-Strike: Global Offensive",
      image: "path/to/csgo-image.jpg",  // Replace with the actual image path
      globalRating: 3.57,
      userRating: undefined  // undefined if the user has not rated the game
    }
  ];
    
  const libraryContainer = document.getElementById('library-container');

  games.forEach(game => {
    const gameCard = document.createElement('div');
    gameCard.className = 'game-card';
    gameCard.innerHTML = `
      <img src="${game.image}" alt="${game.name}" class="game-image">
      <div class="game-info">
        <h3 class="game-title">${game.name}</h3>
        <p>Rating: ${game.rating}</p>
      </div>
    `;
    libraryContainer.appendChild(gameCard);
  });
});

function addToLibrary(gameId) {
  fetch('/user/add/game/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ game_id: gameId })
  })
  .then(response => response.json())
  .then(data => {
    alert(data.message);  // Show success or error message
  })
  .catch(error => {
    console.error('Error adding game to the library:', error);
  });
}

 /*platforme*/
 document.addEventListener('DOMContentLoaded', function() {
  fetch('https://api.rawg.io/api/platforms?key=86a34209259b4dd496f0989055c1711b')
  .then(response => response.json())
  .then(data => {
      const platformsContainer = document.getElementById('platforms-container');

      data.results.forEach(platform => {
          const platformCard = document.createElement('div');
          platformCard.className = 'platform-card';

          platformCard.innerHTML = `
              <img src="${platform.image_background}" alt="${platform.name}">
              <h3>${platform.name}</h3>
          `;

          platformsContainer.appendChild(platformCard);
      });
  })
  .catch(error => {
      console.error('Error fetching platforms:', error);
  });
});

