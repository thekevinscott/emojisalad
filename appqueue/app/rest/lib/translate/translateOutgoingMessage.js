/*
 * This functions translates messages
 * stored in the received table
 * into consumable packets for the
 * bot script.
 */
import translateOutgoingData from './translateOutgoingData';

export default function translateOutgoingMessage(message) {
  return translateOutgoingData(message).then(({ phoneNumber, senderId }) => ({
    id: message.id,
    body: message.body,
    timestamp: (new Date(message.timestamp)).getTime() / 1000,
    from: phoneNumber, // the user's phone number
    to: senderId, // the ID of the original SMS game_number assigned to the player
  }));
}

