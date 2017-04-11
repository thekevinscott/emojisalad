const getDigits = (text = '') => text.match(/\d+/g);

export const getOnlyDigits = (text = '') => {
  const digits = getDigits(text);
  return digits && digits.length ? digits.join('') : '';
}

export const getSplitDigits = (digits = '') => [
  digits.slice(0,3),
  digits.slice(3,6),
  digits.slice(6,10),
].filter(el => el);

export const parsePhoneNumber = text => getSplitDigits(getOnlyDigits(text)).join('-');

export const isValidPhoneNumber = (text = '') => {
  const digits = getDigits(text);
  return digits && digits.join('').length === 10 ? true : false;
};
