// eslint-disable-next-line import/prefer-default-export
export const NumberCommaSeparator = number => {
  return number?.toString()?.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
};
