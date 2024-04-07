document.addEventListener('DOMContentLoaded', function() {
  const filterButtons = document.getElementById('filter-buttons');
  const container = document.getElementById('container');
  const filterButtonsContainer = document.getElementById('filter-buttons');
  const template = document.getElementById('template');
  const filterButtonTemplate = document.getElementById('filter-button');
  const typeColors = {
    normal: '#A8A878',
    fighting: '#C03028',
    flying: '#A890F0',
    poison: '#A040A0',
    ground: '#E0C068',
    rock: '#B8A038',
    bug: '#A8B820',
    ghost: '#705898',
    steel: '#B8B8D0',
    fire: '#F08030',
    water: '#6890F0',
    grass: '#78C850',
    electric: '#F8D030',
    psychic: '#F85888',
    ice: '#98D8D8',
    dragon: '#7038F8',
    dark: '#705848',
    fairy: '#EE99AC',
    unknown: '#68A090',
    shadow: '#705898'
  };

  for (const [key, value] of Object.entries(typeColors)) {
    const button = filterButtonTemplate.content.cloneNode(true);
    const filterButton = button.querySelector('.filter-button')
    filterButton.style.backgroundColor = value;
    filterButton.style.textTransform = 'capitalize';
    filterButton.textContent = key
    filterButton.dataset.type = key

    filterButtonsContainer.appendChild(filterButton);
  }

  fetch('https://pokeapi.co/api/v2/pokemon?limit=50')
    .then(response => response.json())
    .then(data => {
      container.innerHTML = ''
      data.results.forEach(pokemon => {
        const cardClone = template.content.cloneNode(true);
        const card = cardClone.querySelector('.pokemon-card');

        fetchPokemonDetails(pokemon.url)
          .then(details => {
            fillPokemonCard(card, details);
            container.appendChild(card);
          });
      });
    })
    .catch(error => console.error('Feil ved henting av Pokémon:', error));

  async function fetchPokemonDetails(url) {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  }

  function fillPokemonCard(card, pokemon) {
    const image = card.querySelector('.pokemon-image');
    const name = card.querySelector('.pokemon-name');
    const type = card.querySelector('.pokemon-type');

    image.src = pokemon.sprites.front_default;
    name.textContent = pokemon.name;
    type.textContent = pokemon.types[0].type.name;
    const typeColor = typeColors[pokemon.types[0].type.name.toLowerCase()];
    card.style.backgroundColor = typeColor;
  }

  filterButtons.addEventListener('click', function(event) {
    if (event.target.classList.contains('filter-button')) {
      const type = event.target.dataset.type;
      filterPokemonByType(type);
    }
  });

  function filterPokemonByType(type) {
    const pokemonCards = container.querySelectorAll('.pokemon-card');

    pokemonCards.forEach(card => {
      card.style.display = 'none';
    });

    pokemonCards.forEach(card => {
      const pokemonType = card.querySelector('.pokemon-type').textContent;
      if (pokemonType.toLowerCase() === type.toLowerCase()) {
        card.style.display = 'block';
      }
    });
  }

  function resetFilters() {
    const pokemonCards = container.querySelectorAll('.pokemon-card');
    pokemonCards.forEach(card => {
      card.style.display = 'block';
    });
  }

  const resetButton = document.createElement('button');
  resetButton.textContent = 'Reset Filters';
  resetButton.style.marginTop = '15px';
  resetButton.addEventListener('click', function() {
    resetFilters();
  });

  filterButtons.appendChild(resetButton);
});
