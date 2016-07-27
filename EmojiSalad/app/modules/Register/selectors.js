export function selectRegisterSlice({ ui }) {
  const {
    text,
    claiming,
    error,
    migration,
  } = ui.Register;

  return {
    text,
    claiming,
    error,
    migration,
  };
}
