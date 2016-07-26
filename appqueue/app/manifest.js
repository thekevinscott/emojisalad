import {
  NAME,
  PORT,
} from 'config/app';

const endpoint = `http://localhost:${PORT}/`;

const manifest = {
  send: {
    endpoint: `${endpoint}send`,
    method: 'POST',
    description: 'An endpoint for sending messages through a particular queue',
  },
  sent: {
    endpoint: `${endpoint}sent`,
    method: 'GET',
    description: 'An endpoint for getting messages from a particular queue',
  },
  received: {
    endpoint: `${endpoint}received`,
    method: 'GET',
    description: 'An endpoint for getting all received messages from a particular timestamp',
  },
  senders: {
    getID: {
      endpoint: `${endpoint}senders/:sender`,
      method: 'GET',
    },
    get: {
      endpoint: `${endpoint}senders`,
      method: 'GET',
    },
  },
};

export default manifest;
