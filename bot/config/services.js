'use strict';

const ports = {
  api: process.env.API_PORT || '1338'
}

const services = {
  api: {
    url: `http://localhost:${ports.api}/`
  }
}

module.exports = services;
