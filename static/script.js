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
    gamesContainer.innerHTML = ''; // Clear existing games

    data.results.forEach(game => {
      const gameCard = document.createElement('div');
      gameCard.className = 'game-card';

      gameCard.innerHTML = `
        <img src="${game.background_image}" alt="${game.name}" class="game-image">
        <div class="game-info">
          <h3 class="game-title">${game.name}</h3>
          <div class="game-icons">
            <!-- Icônes et autres éléments ici, comme les boutons de vote -->
            <span>👍 ${game.rating}</span>
            <!-- Ajoutez plus d'éléments ici si nécessaire -->
          </div>
        </div>
      `;

      gamesContainer.appendChild(gameCard);
    });
  })
  .catch(error => {
    console.error('Erreur lors de la récupération des données de l\'API:', error);
  });
  let currentPage = 2; // Commence à la première page

  function loadGames(page) {
    fetch(`https://api.rawg.io/api/games?key=86a34209259b4dd496f0989055c1711b&page=${page}`)
      .then(response => response.json())
      .then(data => {
        const gamesContainer = document.getElementById('games-container');
  
        data.results.forEach(game => {
          const gameCard = document.createElement('div');
          gameCard.className = 'game-card';
  
          gameCard.innerHTML = `
            <img src="${game.background_image}" alt="${game.name}" class="game-image">
            <div class="game-info">
              <h3 class="game-title">${game.name}</h3>
              <div class="game-icons">
                <!-- Icônes et autres éléments ici, comme les boutons de vote -->
                <span>👍 ${game.rating}</span>
                <!-- Ajoutez plus d'éléments ici si nécessaire -->
              </div>
            </div>
          `;
  
          gamesContainer.appendChild(gameCard);
        });
  
        // Incrémenter currentPage pour la prochaine charge
        currentPage++;
      })
      .catch(error => {
        console.error('Erreur lors de la récupération des données de l\'API:', error);
      });
  }
  
  // Gestionnaire d'événement pour le bouton 'Charger plus'
  document.getElementById('load-more').addEventListener('click', () => loadGames(currentPage));
  
  // Charge initialement la première page de jeux
  loadGames(currentPage);




