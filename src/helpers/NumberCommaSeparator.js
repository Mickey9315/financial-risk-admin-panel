// eslint-disable-next-line import/prefer-default-export
export const NumberCommaSeparator = number => {
  return number?.toString().trim().length > 0 ? number?.toString()?.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,') : console.log('else part');;
};
