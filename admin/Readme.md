# EmojinaryFriend Admin


So far, this is just a minimal user authentication setup. It's using [Passport](passportjs.org) and [Express](http://expressjs.com/).

## Description
Well, basically... We have a dope app. But the contents of the app needs to be updated.

For example, we might want to add/remove/edit phrases from gameplay, or check in on games. The admin interface allows us to do this. 

The deployed version should be [here](http://admin.emojinaryfriend.com).

We deploy this just like we deploy most other things, using [Deploybot](https://siblings.deploybot.com/34736-emojinaryfriend).

## Build Process

Let's use [Gulp](http://gulpjs.com/), because we actually know what we're doing.

## Setup
1. FUCKING CLONE THAT SHIT.
2. Run `npm install` in `db` (sister directory to this one)
3. Run `npm install` in `admin` (this directory)
4. Create a file called `db-local.js` in `config` (sister directory to this one)
5. `db-local.js` should contain: `module.exports={}` in it. That's it.
6. Cool. You're done, hopefully.


## Run
Pretty easy. Just run `gulp` in the `admin` directory (this one).