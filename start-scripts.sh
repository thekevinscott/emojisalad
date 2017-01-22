 #!/bin/bash          
 echo Hello World   

 cd /var/www/appqueue
 pm2 start app.json

 cd /var/www/mailqueue
 pm2 start app.json

 cd /var/www/nexmoqueue
 pm2 start app.json

 cd /var/www/smsqueue
 pm2 start app.json

# cd /var/www/fbqueue
# pm2 start app.json

 cd /var/www/webqueue
 pm2 start app.json

 cd /var/www/web
 pm2 start app.json

 cd /var/www/api
 pm2 start app.json

 cd /var/www/bot
 pm2 start app.json

 cd /var/www/admin
 pm2 start app.json

 cd /var/www/jungle
 pm2 start app.json
