This is vaguely built on the other queues but because it uses websockets, it's a bit different.

## Structure

###`config`

Holds the database and app configuration.

###`test`

Tests for the app

###`app`

Holds all the app code

###`app/utils`

Holds API querying functions, or database querying functions. Organized by concern (`users`, `games`, etc).

###`app/rest`

Routes related to REST endpoints. This would include `send` and `senders`, both called by the Bot.

###`app/websocket`

Routes related to Websocket endpoints. This is the protocol through which the app communicates.



