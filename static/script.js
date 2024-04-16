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

const api_key = "95b06a32875746309437e49918c0c61a";

fetch('https://api.rawg.io/api/games?key=95b06a32875746309437e49918c0c61a')
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
          <div class="game-actions">
            <button onclick="rateGame('${game.id}')" class="btn-rate">Rate</button>
            <button onclick="addToLibrary('${game.id}')" class="btn-add">Add to Library</button>
            <button onclick="writeReview('${game.id}')" class="btn-review">Add Review</button>

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
  
    fetch(`https://api.rawg.io/api/games?key=95b06a32875746309437e49918c0c61a&page=${page}&page_size=20`) 
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
                  <button onclick="writeReview('${game.id}')" class="btn-review">Add Review</button>

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
  fetch('https://api.rawg.io/api/genres?key=95b06a32875746309437e49918c0c61a')
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
            <input type="hidden" class="genre-id" value="${genre.id}">
            <button onclick="followGenre('${genre.id}','${genre.name}')" class="btn-follow">Follow</button>
          </div>
        `;
        genreContainer.appendChild(genreCard);
      });
    })
    .catch(error => {
      console.error('Error fetching genres:', error);
    });
}

function followGenre(genreId, genreName) {
  fetch('/user/follow/genre', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ genre_id: genreId, genre_name: genreName })
  })
  .then(response => response.json())
  .then(data => {
    console.log(data.message); // Afficher un message de confirmation ou d'erreur
    displayFollowedGenres(); // Mettre à jour l'affichage de la bibliothèque
    alert(`You are now following the ${genreName} genre!`);
  })
  .catch(error => {
    console.error('Erreur lors de l\'ajout du jeu à la bibliothèque de l\'utilisateur:', error);
    alert(`Error following the ${genreName} genre.`);
  });
}



document.addEventListener('DOMContentLoaded', function() {
  // Sélectionnez le bouton LIBRARY
  const FollowGenreButton = document.getElementById('FollowingAccessBtn');

  // Ajoutez un écouteur d'événement de clic au bouton
  FollowGenreButton.addEventListener('click', function() {
      // Appelez la fonction displayLibrary lorsque le bouton est cliqué
      displayFollowedGenres();
  });
});

function displayFollowedGenres() {
  // Faites une requête pour obtenir les jeux de la bibliothèque de l'utilisateur depuis le serveur
  fetch('/user/following/genre')
    .then(response => response.json())
    .then(data => {
      const followedGenresContainer = document.getElementById('followed-genres-container');
      followedGenresContainer.innerHTML = ''; // Efface le contenu précédent de la bibliothèque

      // Parcourir les genres de la bibliothèque et les afficher dans la bibliothèque
      data.genres.forEach(genre => {
        // Faites une requête à l'API Rawg.io pour obtenir les détails du genre par son ID
        fetch(`https://api.rawg.io/api/genres/${genre.genre_id}?key=95b06a32875746309437e49918c0c61a`)
          .then(response => response.json())
          .then(genreDetails => {
            // Créer les éléments HTML pour afficher les détails du genre
            const genreCard = document.createElement('div');
            genreCard.className = 'genre-card';

            genreCard.innerHTML = `
              <img src="${genreDetails.image_background}" alt="${genreDetails.name}" class="genre-image">
              <div class="genre-content">
                <h3 class="genre-title">${genreDetails.name}</h3>
                <input type="hidden" class="genre-id" value="${genre.id}"> 
                <p>Date Added: ${genre.date_added}</p>
                <button onclick="UnfollowGenre('${genre.id}')" class="btn-follow">UnFollow</button>
              </div>
            `;

            followedGenresContainer.appendChild(genreCard); // Ajoute le genre  

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

function UnfollowGenre(genreId) {
  // Faites une requête pour supprimer le jeu de la bibliothèque de l'utilisateur
  fetch('/user/remove/genre', {
      method: 'DELETE',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({ genre_id: genreId })
  
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
        fetch(`https://api.rawg.io/api/games/${game.game_id}?key=95b06a32875746309437e49918c0c61a`)
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


 /*platforme*/
 document.addEventListener('DOMContentLoaded', function() {
  fetch('https://api.rawg.io/api/platforms?key=95b06a32875746309437e49918c0c61a')
  .then(response => response.json())
  .then(data => {
      const platformsContainer = document.getElementById('platforms-container');

      data.results.forEach(platform => {
          const platformCard = document.createElement('div');
          platformCard.className = 'platform-card';

          platformCard.innerHTML = `
            <div class = "platform-card-content">
              <img src="${platform.image_background}" alt="${platform.name}">
              <h3>${platform.name}</h3>
              <input type="hidden" class="platform-id" value="${platform.id}"> 
              <button onclick="Following('${platform.id}')"class="btn-follow">Following</button>
            </div>
          `;

          platformsContainer.appendChild(platformCard);
      });
  })
  .catch(error => {
      console.error('Error fetching platforms:', error);
  });
});

function Following(platformId) {
  fetch('/user/follow/platform', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ platform_id: platformId})
  })
  .then(response => response.json())
  .then(data => {
    console.log(data.message); // Afficher un message de confirmation ou d'erreur
    displayFollowedPlatform(); // Mettre à jour l'affichage de la bibliothèque
    alert(`You are now following the ${platformId} genre!`);
  })
  .catch(error => {
    console.error('Erreur lors de l\'ajout du jeu à la bibliothèque de l\'utilisateur:', error);
    alert(`Error following the ${platformId} genre.`);
  });
}



document.addEventListener('DOMContentLoaded', function() {
  // Sélectionnez le bouton LIBRARY
  const FollowPlatformButton = document.getElementById('FollowingPlatformAccessBtn');

  // Ajoutez un écouteur d'événement de clic au bouton
  FollowPlatformButton.addEventListener('click', function() {
      // Appelez la fonction displayLibrary lorsque le bouton est cliqué
      displayFollowedPlatform();
  });
});

function displayFollowedPlatform() {
  // Faites une requête pour obtenir les plateformes de la bibliothèque de l'utilisateur depuis le serveur
  fetch('/user/following/platform')
    .then(response => response.json())
    .then(data => {
      const followedPlatformContainer = document.getElementById('followed-platforms-container');
      followedPlatformContainer.innerHTML = ''; // Efface le contenu précédent de la bibliothèque

      // Parcourir les plateformes de la bibliothèque et les afficher dans la bibliothèque
      data.platforms.forEach(platform => {
        // Faites une requête à l'API Rawg.io pour obtenir les détails de la plateforme par son ID
        fetch(`https://api.rawg.io/api/platforms/${platform.platform_id}?key=95b06a32875746309437e49918c0c61a`)
          .then(response => response.json())
          .then(platformDetails => {
            // Créer les éléments HTML pour afficher les détails de la plateforme
            const platformCard = document.createElement('div');
            platformCard.className = 'platform-card';

            platformCard.innerHTML = `
              <div class="platform-card-content">
                <img src="${platformDetails.image_background}" alt="${platformDetails.name}">
                <h3>${platformDetails.name}</h3>
                <input type="hidden" class="platform-id" value="${platform.id}"> 
                <p>Date Added: ${platform.date_added}</p>
                <button onclick="UnfollowPlatform('${platform.id}')" class="btn-follow">UnFollow</button>
              </div>
            `;

            followedPlatformContainer.appendChild(platformCard); // Ajoute la platrforme 

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

function UnfollowPlatform(platformId) {
  // Faites une requête pour supprimer le jeu de la bibliothèque de l'utilisateur
  fetch('/user/remove/platform', {
      method: 'DELETE',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({ platform_id: platformId })
  
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



/*reveiws*/
// Ajouter un commentaire et une note pour un jeu
function writeReview(gameId) {
  // Demander à l'utilisateur de saisir le nom du jeu
  const nameGame = prompt('Nom du jeu :', '');
  // Demander à l'utilisateur de saisir une note
  const userRating = prompt('Notez le jeu (1-5) :', '');
  // Demander à l'utilisateur de saisir un commentaire
  const userComment = prompt('Commentaire sur le jeu :', '');
  

  // Vérifier si la note est valide et si le commentaire est non vide
  if (userRating >= 1 && userRating <= 5 && userComment && nameGame) {
    // Récupérer les commentaires existants depuis le localStorage ou créer un nouvel objet si aucun commentaire n'existe
    const reviews = JSON.parse(localStorage.getItem('userReviews')) || {};
    // Ajouter la note, le commentaire et le nom du jeu au jeu correspondant
    reviews[gameId] = {
      game_id : gameId,
      name: nameGame,
      rating: userRating,
      comment: userComment
    };
    fetch('/save_review', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(reviews[gameId])
    })
    .then(response => response.json())
    .then(data => {
      console.log(data.message); // Afficher un message de confirmation ou d'erreur
      // Effectuer d'autres actions en fonction de la réponse, par exemple actualiser l'affichage des critiques
    })
    .catch(error => {
      console.error('Erreur lors de l\'enregistrement de la critique:', error);
    });
    // Enregistrer les commentaires mis à jour dans le localStorage
    localStorage.setItem('userReviews', JSON.stringify(reviews));
    // Afficher les informations mises à jour
    displayReview(gameId, nameGame, userRating, userComment);
  } else {
    alert('Note invalide, commentaire manquant ou nom du jeu non spécifié. Veuillez vérifier vos saisies.');
  }
}


// Afficher la note et le commentaire de l'utilisateur pour un jeu sur la page "reviews.html"
function displayReview(gameId, nameGame, userRating, userComment) {
  // Supposons que nous avons un conteneur pour les avis sur la page "reviews.html"
  const reviewsContainer = document.getElementById('reviews-container');
  const reviewElement = document.createElement('div');
  reviewElement.className = 'user-review';
  reviewElement.innerHTML = `
    <h3 class="game-title">${nameGame}</h3>
    <h4>Avis pour le jeu ID ${gameId}</h4>
    <p>Note: ${userRating}</p>
    <p>Commentaire: ${userComment}</p>
    <button onclick="deleteReview('${gameId}')" class="btn-follow">Delete Review</button>

  `;
  reviewsContainer.appendChild(reviewElement);
}

function deleteReview(gameId) {
  fetch('/delete_review', {
      method: 'DELETE',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({ game_id: gameId })
  })
  .then(response => response.json())
  .then(data => {
      console.log(data.message); // Afficher un message de confirmation ou d'erreur
      const reviewElement = document.getElementById(`review-${gameId}`);
      if (reviewElement) {
          reviewElement.remove(); // Supprimer l'élément de la critique de la page HTML
      }
  })
  .catch(error => {
      console.error('Erreur lors de la suppression de la critique:', error);
  });
}



// Cette fonction doit être appelée pour afficher tous les avis au chargement de la page "reviews.html"
function displayAllReviews() {
  const reviews = JSON.parse(localStorage.getItem('userReviews')) || {};
  Object.keys(reviews).forEach(gameId => {
    const review = reviews[gameId];
    displayReview(gameId, review.name, review.rating, review.comment);
  });
}

document.addEventListener('DOMContentLoaded', displayAllReviews);
