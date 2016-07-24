export function selectRegisterSlice({ ui }) {
  const {
    text,
    claiming,
    error,
  } = ui.Register;

  return {
    text,
    claiming,
    error,
  };
}
