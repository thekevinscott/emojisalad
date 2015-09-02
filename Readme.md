# Emojinary Friend

This is the overall Readme to Emojinary Friend! Woohoo!

There's four folders in here:

* Admin - Admin / CMS interface for our app
* API - The backend for our app
* Messenger - An admin helper for debugging messages
* Web - Our user-facing website

# Deployment

We're using a Digital Ocean droplet hosted under Ari's account. The droplet is Ubuntu.

The user on this account is `deploy`. `root` should not be able to SSH in.

We're using `pm2` to manage the node processes on the server, and this is tied into [KeyMetrics](https://app.keymetrics.io/#/bucket/55e745bf37c9f49723c3d8a3/dashboard).

Deploys are done by [DeployBot](https://siblings.deploybot.com/34736-emojinaryfriend/). There are dedicated scripts for API, Web, and Admin that will pull the latest `master` repo, run `npm install --production`, and then restart the node process with `pm2 restart <app>`.
