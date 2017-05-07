/*
 * This functions translates messages
 * stored in the received table
 * into consumable packets for the
 * bot script.
 */
import translateOutgoingData from './translateOutgoingData';

// This function is called when the app queue
// is queried for the latest messages. This is a function
// that transforms the messages from the database
// into a format consumable by the bot service.
//
// The bot service in particular expects both a To
// and a From and will choke if these aren't present.
//
// Since the App queue does not assign sender numbers,
// we use the game key as a proxy for this.
export default function translateOutgoingMessage(message) {
  // Given some message, we get back a phone number and
  // sender id we can attach to the message array
  return translateOutgoingData(message).then(({
    phoneNumber,
    senderId,
  }) => ({
    id: message.id,
    body: message.body,
    game_key: message.game_key,
    timestamp: (new Date(message.timestamp)).getTime() / 1000,
    // the user's phone number
    from: phoneNumber,

    // the ID of the original SMS game_number assigned to the player
    to: senderId,
  }));
}

