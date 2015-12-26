const config = require('config/db-local.js');
const Sequelize = require('sequelize');

const options = {
  host: config.host,
  dialect: 'mysql',
  timezone : config.timezone,

  dialectOptions: {
    charset: config.charset,
  },

  pool: {
    max: 5,
    min: 0,
    idle: 10000
  },
};

const sequelize = new Sequelize(
  config.database, 
  config.user, 
  config.password, 
  options
);

const MessageSent = sequelize.define('sent', {
  body: Sequelize.TEXT,
  to: Sequelize.STRING,
  from: Sequelize.STRING,
  createdAt: {
    type: Sequelize.STRING,
    defaultValue: Sequelize.fn('NOW', 6)
  }
}, {
  freezeTableName: true,
  timestamps: false,
  //updatedAt: false,
});

const MessageReceived = sequelize.define('received', {
  body: Sequelize.TEXT,
  to: Sequelize.STRING,
  from: Sequelize.STRING,
  data: Sequelize.TEXT,
  createdAt: {
    type: Sequelize.STRING,
    defaultValue: Sequelize.fn('NOW', 6)
  }
}, {
  freezeTableName: true,
  timestamps: false,
  //updatedAt: false,
});

module.exports.MessageReceived = MessageReceived;
module.exports.MessageSent = MessageSent;
