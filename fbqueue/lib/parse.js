/*
 * An incoming message from Facebook contains the following:
 *
 params {
    "object": "page",
    "entry": [
        {
            "id": 822686354503815,
            "time": 1460509241153,
            "messaging": [
                {
                    "sender": {
                        "id": 914814918617840
                    },
                    "recipient": {
                        "id": 822686354503815
                    },
                    "timestamp": 1460509132821,
                    "message": {
                        "mid": "mid.1460509132815:e9fd144130035c4057",
                        "seq": 27,
                        "text": "hi now"
                    }
                }
            ]
        }
    ]
}
 */

module.exports = function parse(params) {
  console.log('params', JSON.stringify(params, null, 4));
  if (!params.object || !params.entry) {
    console.error('Potentially malicious error, invalid params', params);
    throw new Error('Incorrect parameters provided');
  } else {
    const object = params.object;
    const messaging_events = params.entry[0].messaging;
    console.log('messaging', messaging_events.length, messaging_events);
    for (let i=0;i<messaging_events.length;i++) {
      const event = messaging_events[i];
      //console.log('event', event);
      if (event.message && event.message.text) {
        const payload = {
          body: event.message.text,
          from: event.sender.id,
          to: event.recipient.id,
          data: JSON.stringify(messaging_events)
        };
        console.log('pyaload', payload);
        return payload;
      } else {
        console.log('invalid event', event);
      }
    }
  }
};
