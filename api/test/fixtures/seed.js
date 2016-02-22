module.exports = [
  {
    table: 'game_numbers',
    rows: [
      { number: '+15551111111' },
      { number: '+15552222222' },
      { number: '+15553333333' },
      { number: '+15554444444' },
      { number: '+15559999999' },
    ]
  },
  {
    table: 'phrases',
    rows: [
      { id: 1, phrase: 'JURASSIC PARK' },
      { id: 2, phrase: 'SILENCE OF THE LAMBS' },
      { id: 3, phrase: 'BUFFALO WILD WINGS' },
      { id: 4, phrase: 'TIME AFTER TIME' },
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
      { phrase_id: 4, clue: 'MOVIE' },
    ]
  },
];
