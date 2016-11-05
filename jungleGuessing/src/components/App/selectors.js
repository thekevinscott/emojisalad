export function mapStateToProps({
  phrases,
  user: {
    currentPhrase,
  },
}) {
  const {
    phrase,
    prompt,
  } = phrases[currentPhrase];

  return {
    phrase,
    prompt,
    guesses: [],
  };
}

export function mapDispatchToProps() {
  return {
  };
}
