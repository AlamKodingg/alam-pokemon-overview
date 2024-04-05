document.addEventListener('DOMContentLoaded', function() {
  const container = document.getElementById('container');
  const template = document.getElementById('template');

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
    type.textContent = pokemon.types[0].type.name;   }
});
