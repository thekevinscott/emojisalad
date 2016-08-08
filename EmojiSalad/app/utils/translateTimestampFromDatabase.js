export default function translateTimestampFromDatabase(timestamp) {
  if (timestamp || timestamp === 0) {
    return Number(timestamp) * 1000;
  }
  return null;
}

