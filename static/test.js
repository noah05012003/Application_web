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

//<button onclick="addToLibrary('${game.id}')" class="btn-add">Add to Library</button>
//<li><a href="/home">HOME</button></a></li>


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
  