const hardcodedGames = [
  {
    id: 2,
    name: 'Dungeons & Dragons (DnD) (5th edition)',
    gameTypeID: 3,
    description_preview:
      'Dungeons & Dragons (abbreviated as D&D or DnD) is a fantasy tabletop role-playing game (RPG) originally designed by Gary Gygax and Dave Arneson, and first published in 1974 by Tactical Studies Rules, Inc.. The game has been published by Wizards of the Coast (now a subsidiary of Hasbro) since 1997. It was derived from miniature wargames with a variation of the Chainmail game serving as the initial rule system. D&D‍‍s publication is widely regarded as the beginning of modern role-playing games and the role-playing game industry.',
    image_url:
      'https://static0.srcdn.com/wordpress/wp-content/uploads/2019/09/Dungeons-and-Dragons-Alignments.jpg',
    min_players: 3,
    max_players: 5,
    url: 'https://dnd.wizards.com/',
    primary_publisher: 'TSR, Inc., Wizards of the Coast',
    min_age: 8,
    year_published: 2014,
    min_playtime: 120,
    max_playtime: 600,
    average_user_rating: 4.5,
  },
  {
    id: 3,
    name: 'Warhammer 40,000 (40k)',
    gameTypeID: 3,
    description_preview:
      'Warhammer 40,000 is a miniature wargame produced by Games Workshop. It is the most popular miniature wargame in the world. It is most popular in Britain. The first edition of the rulebook was published in September 1987, and the latest edition was published in June 2017. As in other miniature wargames, players enact a battle using miniature models of warriors and fighting vehicles. The playing area is a tabletop model of a battlefield, comprising models of buildings, hills, trees, and other terrain features. Players take turns to move their model warriors around the battlefield and pretend that they are fighting the other players warriors. These imaginary fights are resolved using dice and simple arithmetic. Warhammer 40,000 is set in the distant future, where a stagnant human civilization is beset by hostile aliens and malevolent supernatural creatures. The models in the game are a mixture of humans, aliens, and supernatural monsters, wielding futuristic weaponry and magical powers.',
    image_url:
      'https://upload.wikimedia.org/wikipedia/en/9/92/Warhammer40%2C000logo.png',
    min_players: 2,
    max_players: 20,
    url: 'https://warhammer40000.com/',
    primary_publisher: 'Games Workshop',
    min_age: 8,
    year_published: 1987,
    min_playtime: 120,
    max_playtime: 600,
    average_user_rating: 3.22,
  },
  {
    id: 4,
    name: 'Magic: The Gathering (MTG)',
    gameTypeID: 2,
    description_preview:
      'Magic: The Gathering (colloquially known as Magic cards, Magic or just MTG) is a collectible and digital collectible card game created by Richard Garfield. Released in 1993 by Wizards of the Coast (now a subsidiary of Hasbro), Magic was the first trading card game and has approximately twenty million players as of 2015, and over twenty billion Magic cards produced in the period from 2008 to 2016, during which time it grew in popularity. Each game of Magic represents a battle between wizards known as planeswalkers who cast spells, use artifacts, and summon creatures as depicted on individual cards in order to defeat their opponents, typically, but not always, by draining them of their 20 starting life points in the standard format. Although the original concept of the game drew heavily from the motifs of traditional fantasy role-playing games such as Dungeons & Dragons, the gameplay bears little similarity to pencil-and-paper adventure games, while simultaneously having substantially more cards and more complex rules than many other card games.',
    image_url:
      'https://upload.wikimedia.org/wikipedia/en/a/aa/Magic_the_gathering-card_back.jpg',
    min_players: 2,
    max_players: 20,
    url: 'https://magic.wizards.com/en',
    primary_publisher: 'Wizards of the Coast',
    min_age: 13,
    year_published: 1993,
    min_playtime: 5,
    max_playtime: 600,
    average_user_rating: 4.2,
  },
  {
    id: 5,
    name: 'Pokémon Trading Card Game',
    gameTypeID: 2,
    description_preview:
      'The Pokémon Trading Card Game (ポケモンカードゲーム, Pokemon Kādo Gēmu, "Pokémon Card Game"), abbreviated to PTCG or Pokémon TCG, is a collectible card game, based on Nintendos Pokémon franchise of video games and anime, first published in October 1996 by Media Factory in Japan. In the US, it was initially published by Wizards of the Coast; The Pokémon Company eventually took over publishing the card game in June 2003. In 2016, it was the years top-selling toy in the strategic card game subclass.[2] In 2017, it had an 82% share of Europes strategic card game market. As of September 2019, the game has sold over 28.8 billion cards worldwide.',
    image_url:
      'https://upload.wikimedia.org/wikipedia/en/3/3b/Pokemon_Trading_Card_Game_cardback.jpg',
    min_players: 2,
    max_players: 20,
    url: 'https://www.pokemon.com/us/pokemon-tcg/',
    primary_publisher:
      'Creatures, Inc., Wizards of the Coast, The Pokemon Company',
    min_age: 13,
    year_published: 1996,
    min_playtime: 20,
    max_playtime: 120,
    average_user_rating: 3.87,
  },
];

module.exports = hardcodedGames;
