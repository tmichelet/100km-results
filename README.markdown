100km results
=======

See in real time where are all your friends attenting the 100km Steenwerck walking race 
-----------


Each year, there's a 100km walk race in steenwerck (http://100kmsteenwerck.fr).

This project provides a website to check in real time where your friends are in the race.

It relies on 100kmsteenwerck.fr API to retrieve the data.

To install on prod:

  * `git clone git@github.com:tmichelet/100km-results.git && cd 100km-results`
  * `npm install --production`
  * `./grunt.sh create-database`
  * `./grunt.sh watch`

To install as a dev:

  * `git clone git@github.com:tmichelet/100km-results.git && cd 100km-results`
  * `npm install`
  * `./grunt.sh`


build with node version v0.10.25 and npm version 1.3.2