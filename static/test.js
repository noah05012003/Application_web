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