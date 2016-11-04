module.exports = [
  {
    table: 'game_numbers',
    rows: [
      { id: 1, number: '+15551111111' },
      { id: 2, number: '+15552222222' },
      { id: 3, number: '+15553333333' },
      { id: 4, number: '+15554444444' },
      { id: 5, number: '+15559999999' }
    ]
  },
  {
    table: 'phrases',
    rows: [
      { id: 1, phrase: 'JURASSIC PARK' },
      { id: 2, phrase: 'SILENCE OF THE LAMBS' },
      { id: 3, phrase: 'BUFFALO WILD WINGS' },
      { id: 4, phrase: 'DOCTOR WHO' }
    ]
  },
  {
    table: 'challenges',
    rows: [
      {
        id: 1,
        phrase_id: 1,
        sender_id: 4,
        protocol: 'testqueue',
        prompt: '💩',
      },
      {
        id: 2,
        phrase_id: 2,
        sender_id: 5,
        protocol: 'testqueue',
        prompt: '🐟',
      },
      {
        id: 3,
        phrase_id: 3,
        sender_id: 3,
        protocol: 'testqueue',
        prompt: '👾',
      }
    ]
  },
  {
    table: 'clues',
    rows: [
      { phrase_id: 1, clue: 'MOVIE' },
      //{ id: 2, phrase_id: 1, clue: 'CLEVER GIRL' },
      //{ id: 3, phrase_id: 1, clue: 'DINOSAURS' },
      { phrase_id: 2, clue: 'MOVIE' },
      //{ id: 5, phrase_id: 2, clue: 'CLARICE' },
      { phrase_id: 3, clue: 'MOVIE' },
      { phrase_id: 4, clue: 'MOVIE' }
    ]
  },
  {
    table: 'emojis',
    rows: [
      { emoji: '🐳' },
      { emoji: '🌟' },
      { emoji: '🍔' },
      { emoji: '🐦' },
      { emoji: '🐃' }
    ]
  }
];
