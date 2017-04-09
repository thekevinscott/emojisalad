const getOnlyDigits = text => text.match(/\d+/g).join('');

const getSplitDigits = digits => [
  digits.slice(0,3),
  digits.slice(3,6),
  digits.slice(6,10),
].filter(el => el);

export const parsePhoneNumber = text => getSplitDigits(getOnlyDigits(text)).join('-');

export const isValidPhoneNumber = phone => phone.match(/\d+/g).join('').length === 10;
