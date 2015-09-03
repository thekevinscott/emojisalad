# API #

## Ports
The API runs on port 5000. The testing server runs on port 5005.

## Getting everything running

1. Run the server with:
`export ENVIRONMENT=kevin-dev supervisor index.js`

You will need to make sure the database credentials in the db repo (in this case, kevin-dev) match the local database you're trying to test against.

2. Start up ngrok

`./node_modules/ngrok/bin/ngrok 5000`

This will expose port 5000 to ngrok. This lets Twilio contact your local machine when making callbacks. You'll probably need to update the callback URL in the Twilio interface to match the URL ngrok sets up for you.

That's it.

## Syncing

`
gulp sync --kevin-dev
`


This will blow away the specified database (e.g., `--kevin-dev`) and replace it with production.
