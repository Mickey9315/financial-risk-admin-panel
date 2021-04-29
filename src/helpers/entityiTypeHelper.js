export const getLabelFromValues = (value, mapObject) => {
  const found = mapObject.find(e => e.value === value);
  return (found && found.label) ?? '';
};
