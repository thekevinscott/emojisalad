jest.unmock('../utils');

import {
  getOnlyDigits,
  getSplitDigits,
  parsePhoneNumber,
  isValidPhoneNumber,
} from '../utils';

describe('InvitePlayersSearch utils', () => {
  it('should only return digits', () => {
    expect(getOnlyDigits()).toEqual('');
    expect(getOnlyDigits('123')).toEqual('123');
    expect(getOnlyDigits('foobar123')).toEqual('123');
    expect(getOnlyDigits(' 123')).toEqual('123');
    expect(getOnlyDigits('123foobar123123123')).toEqual('123123123123');
  });

  it('should only return 10 characters', () => {
    expect(getSplitDigits()).toEqual([]);
    expect(getSplitDigits('')).toEqual([]);
    expect(getSplitDigits('foobar1234')).toEqual([
      'foo',
      'bar',
      '1234',
    ]);
  });

  it('should parse a phone number', () => {
    expect(parsePhoneNumber('foobar')).toEqual('');
    expect(parsePhoneNumber('foobar 123')).toEqual('123');
    expect(parsePhoneNumber(' 123 456')).toEqual('123-456');
    expect(parsePhoneNumber('+123456')).toEqual('123-456');
    expect(parsePhoneNumber('+1234567890')).toEqual('123-456-7890');
    expect(parsePhoneNumber('+1234567890123')).toEqual('123-456-7890');
    expect(parsePhoneNumber('  not 123 these 456 7890  ')).toEqual('123-456-7890');
    expect(parsePhoneNumber('(555) 555-5555')).toEqual('555-555-5555');
  });

  it('should return a valid phone number', () => {
    expect(isValidPhoneNumber()).toEqual(false);
    expect(isValidPhoneNumber('foobar')).toEqual(false);
    expect(isValidPhoneNumber('foobar 123')).toEqual(false);
    expect(isValidPhoneNumber(' 123 456')).toEqual(false);
    expect(isValidPhoneNumber('+123456')).toEqual(false);
    expect(isValidPhoneNumber('+1234567890')).toEqual(true);
    expect(isValidPhoneNumber('+1234567890123')).toEqual(false);
    expect(isValidPhoneNumber('(555) 555-5555')).toEqual(true);
  });
});
