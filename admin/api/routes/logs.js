'use strict';
const log_path = process.env.LOG_FILES || 'logs';
const fs = require('fs');
const Tail = require('tail').Tail;

module.exports = function(app, io) {
  app.get('/api/logs', (req, res) => {
    getFiles(files => {
      res.json({
        files: files.map(file => {
          const info = fs.statSync(`${log_path}/${file}`);
          return {
            path: file,
            mtime: info.mtime,
            ctime: info.ctime
          };
        }).sort((a, b) => {
          const aDate = new Date(a.mtime);
          const bDate = new Date(b.mtime);
          return aDate < bDate;
        })
      });
    });
  });

  app.get('/api/logs/:log', (req, res) => {
    getFiles(files => {
      const log = req.params.log;
      if (files.indexOf(log) === -1) {
        res.json({ error: 'Unknown error' });
      } else {
        const path = `${log_path}/${log}`;
        fs.readFile(path, 'utf8', function (err,data) {
          if (err) {
            res.json({ error: err });
          } else {
            res.json({ contents: data });
          }
        });
      }
    });
  });

  io.on('connection', function(client) {
    console.log('Connection to client established');

    // Success!  Now listen to messages to be received
    client.on('message',function(event) {
      if (event.type === 'subscribe') {
        const log = event.path;
        getFiles(files => {
          if (files.indexOf(log) !== -1) {
            const path = `${log_path}/${log}`;
            const tail = new Tail(path);
            tail.on('line', (data) => {
              client.send({ data });
            });
          }
        });
      }
    });
  });
};

function getFiles(cb) {
  fs.readdir(log_path, (err, files) => {
    if (err) {
      throw new Error(err);
    } else {
      cb(files);
    }
  });
}
