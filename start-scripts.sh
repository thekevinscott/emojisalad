#!/bin/bash
echo Hello Emojinary Friend

cd /var/www/db
npm i --production

cd /var/www/shared
npm i --production

cd /var/www/web
npm i --production
pm2 start app.json

cd /var/www/smsqueue
npm i --production
pm2 start app.json

cd /var/www/webqueue
npm i --production
pm2 start app.json

cd /var/www/api
npm i --production
pm2 start app.json

cd /var/www/bot
npm i --production
pm2 start app.json

cd /var/www/admin
npm i --production
pm2 start app.json

cd /var/www/jungle
npm i --production
pm2 start app.json
