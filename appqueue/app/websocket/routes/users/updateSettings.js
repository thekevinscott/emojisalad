import updateSettings from '../../users/updateSettings';

export default function _updateSettings(ws, payload) {
  return updateSettings(payload);
}
