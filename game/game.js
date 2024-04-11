async function fetchPokemonData(pokemonId) {
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
  const data = await response.json();
  return {
    id: data.id,
    name: data.name,
    hp: data.stats[0].base_stat,
    attack: data.stats[1].base_stat,
    image: data.sprites.front_default
  };
}

async function displayPokemonData(pokemonId, containerId) {
  const pokemon = await fetchPokemonData(pokemonId);
  const container = document.getElementById(containerId);

  container.innerHTML = `
    <img src="${pokemon.image}" alt="${pokemon.name}">
    <div>
      <p>Name: ${pokemon.name}</p>
      <p>HP: <span id="${containerId}-hp">${pokemon.hp}</span></p>
      <p>Attack: ${pokemon.attack}</p>
    </div>
  `;
  return pokemon;
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function startBattle() {
  const playerPokemonId = getRandomNumber(1, 151);
  const opponentPokemonIds = [getRandomNumber(1, 151), getRandomNumber(1, 151)];

  const playerPokemon = await displayPokemonData(playerPokemonId, 'player-pokemon');
  const opponentPokemons = await Promise.all(opponentPokemonIds.map((id, index) => displayPokemonData(id, `opponent-pokemon-${index}`)));

  const battleResult = document.getElementById('battle-result');
  battleResult.textContent = '';

  for (let i = 0; i < 6; i++) {
    await sleep(1000);

    const playerAttack = getRandomNumber(10, playerPokemon.attack);
    const opponentAttack = getRandomNumber(10, opponentPokemons[i%2].attack);

    const playerHpElement = document.getElementById('player-pokemon-hp');
    const opponentHpElement = document.getElementById(`opponent-pokemon-${i % 2}-hp`);

    const playerHp = parseInt(playerHpElement.textContent);
    const opponentHp = parseInt(opponentHpElement.textContent);

    const newPlayerHp = Math.max(playerHp - opponentAttack, 0);
    const newOpponentHp = Math.max(opponentHp - playerAttack, 0);

    playerHpElement.textContent = newPlayerHp;
    opponentHpElement.textContent = newOpponentHp;

    if (newPlayerHp == 0 && newOpponentHp == 0) {
      battleResult.textContent = 'It\'s a tie!';
      break;
    } else if (newPlayerHp == 0) {
      battleResult.textContent = 'You lost the battle!';
      break;
    } else if (newOpponentHp === 0) {
      battleResult.textContent = 'You won the battle!';
      break;
    }
  }
}
