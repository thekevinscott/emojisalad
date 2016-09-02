import apn from 'apn';

export default function attachFeedback(options) {
  const feedback = new apn.Feedback(options);
  feedback.on('feedback', (devices) => {
    devices.forEach((item) => {
      console.log('item', item);
      // Do something with item.device and item.time;
    });
  });
}
