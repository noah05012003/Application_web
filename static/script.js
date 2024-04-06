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
            <button onclick="addToLibrary('${game.id}')" class="btn-add">Add to Library</button>
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
function displayUserRating(gameId) {
  const ratings = JSON.parse(localStorage.getItem('userRatings')) || {};
  // La note de l'utilisateur sera affichée dans un élément span avec une classe spécifique pour le style
  return ratings[gameId] ? `<span class="user-rating">Your Rating: ${ratings[gameId]}</span>` : '<span class="no-rating">Rate this game</span>';
}


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
    console.log(data.message); // Afficher un message de confirmation ou d'erreur
    displayLibrary(); // Mettre à jour l'affichage de la bibliothèque
  })
  .catch(error => {
    console.error('Erreur lors de l\'ajout du jeu à la bibliothèque de l\'utilisateur:', error);
    // Gérer l'erreur de manière appropriée
  });
}





document.addEventListener('DOMContentLoaded', function() {
  // Sélectionnez le bouton LIBRARY
  const libraryButton = document.getElementById('libraryAccessBtn');

  // Ajoutez un écouteur d'événement de clic au bouton
  libraryButton.addEventListener('click', function() {
      // Appelez la fonction displayLibrary lorsque le bouton est cliqué
      displayLibrary();
  });
});


function displayLibrary() {
  // Faites une requête pour obtenir les jeux de la bibliothèque de l'utilisateur depuis le serveur
  fetch('/user/library/')
    .then(response => response.json())
    .then(data => {
      const libraryContainer = document.getElementById('library-container');
      libraryContainer.innerHTML = ''; // Efface le contenu précédent de la bibliothèque

      // Parcourir les jeux de la bibliothèque et les afficher dans la bibliothèque
      data.games.forEach(game => {
        // Faites une requête à l'API Rawg.io pour obtenir les détails du jeu par son ID
        fetch(`https://api.rawg.io/api/games/${game.game_id}?key=86a34209259b4dd496f0989055c1711b`)
          .then(response => response.json())
          .then(gameDetails => {
            // Créer les éléments HTML pour afficher les détails du jeu
            const gameCard = document.createElement('div');
            gameCard.className = 'game-card';

            gameCard.innerHTML = `
              <img src="${gameDetails.background_image}" alt="${gameDetails.name}" class="game-image">
              <div class="game-info">
                <h3 class="game-title">${gameDetails.name}</h3>
                <input type="hidden" class="game-id" value="${game.id}"> 
                <p>Date Added: ${game.date_added}</p>
                <p>Rating: ${gameDetails.rating}</p>
                <button onclick="DeleteToLibrary('${game.id}')" class="btn-add">Remove from Library</button>

              </div>
            `;

            libraryContainer.appendChild(gameCard); // Ajoute le jeu à la bibliothèque
          })
          .catch(error => {
            console.error('Erreur lors de la récupération des détails du jeu:', error);
          });
      });
    })
    .catch(error => {
      console.error('Erreur lors de la récupération des jeux de la bibliothèque:', error);
    });
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
  })
  .catch(error => {
      console.error('Erreur lors de la suppression du jeu de la bibliothèque:', error);
  });
}

