import {
  SUBMIT_CLAIM,
} from '../../../modules/Register/types';

// TODO: How to keep this up to date with the server?
const TYPES = {
  [SUBMIT_CLAIM]: 'CLAIM',
  [`${SUBMIT_CLAIM}_REJECTED`]: 'CLAIM_REJECTED',
};

export default TYPES;
