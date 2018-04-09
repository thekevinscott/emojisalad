#!/bin/bash
echo Hello World

cd /var/www/web
npm i --production
pm2 start app.json

# cd /var/www/appqueue
# npm i --production
# pm2 start app.json

# cd /var/www/mailqueue
# npm i --production
# pm2 start app.json

cd /var/www/nexmoqueue
npm i --production
pm2 start app.json

cd /var/www/smsqueue
npm i --production
pm2 start app.json

# cd /var/www/fbqueue
#npm i --production
# pm2 start app.json

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
