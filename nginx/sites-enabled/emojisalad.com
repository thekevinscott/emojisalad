server {
  listen 80;

  server_name emojinaryfriend.com www.emojinaryfriend.com emojisalad.com www.emojisalad.com;

  location / {
    proxy_pass http://127.0.0.1:5080;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
  }
  location ~ /.well-known {
    allow all;
  }
}

server {
  listen 80;

  server_name jungle.emojisalad.com;

  location / {
    proxy_pass http://127.0.0.1:5020;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
  }
  location ~ /.well-known {
    allow all;
  }
}

server {
  listen 80;

  server_name admin.emojinaryfriend.com;

  location / {
    proxy_pass http://127.0.0.1:5001;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
  }
  location ~ /.well-known {
    allow all;
  }
}

server {
  listen 80;

  server_name nexmo.emojisalad.com;

  location / {
    proxy_pass http://127.0.0.1:5019;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
  }
  location ~ /.well-known {
    allow all;
  }
}

server {
  listen 80;

  server_name admin.emojisalad.com;

  location / {
    proxy_pass http://127.0.0.1:5001;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
  }

  location ~ /.well-known {
    allow all;
  }
}

server {
  listen 80;

  server_name app.emojisalad.com;

  location / {
    proxy_pass http://127.0.0.1:5012;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
  }

  location ~ /.well-known {
    allow all;
  }
}

server {
  listen 80;

  server_name fb.emojinaryfriend.com;

  location / {
    proxy_pass http://127.0.0.1:5011;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
  }
  location ~ /.well-known {
    allow all;
  }
}
server {
  listen 80;

  server_name mail.emojinaryfriend.com;

  location / {
    proxy_pass http://127.0.0.1:5010;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
  }
  location ~ /.well-known {
    allow all;
  }
}
server {
  listen 80;

  server_name sms.emojinaryfriend.com;

  location / {
    proxy_pass http://127.0.0.1:5009;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
  }
  location ~ /.well-known {
    allow all;
  }
}

server {
  listen 80;

  server_name blog.emojinaryfriend.com;

  location / {
    proxy_pass http://0.0.0.0:2368;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header HOST $http_host;
    proxy_set_header X-NginX-Proxy true;

    proxy_redirect off;
  }
  location ~ /.well-known {
    allow all;
  }
}
