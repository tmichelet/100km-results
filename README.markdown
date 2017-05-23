100km results
=======

See in real time where are all your friends attending the 100km Steenwerck walking race 
-----------


Each year, there's a 100km walk race in steenwerck (https://100kmsteenwerck.fr).

This project provides a website to check in real time where your friends are in the race.

It relies on 100kmsteenwerck.fr API to retrieve the data.

To install on prod:

```bash
git clone git@github.com:tmichelet/100km-results.git && cd 100km-results
npm install --production
./grunt.sh create-database
./grunt.sh watch
```
go to http://localhost:8080
  
To install as a dev:
```
git clone git@github.com:tmichelet/100km-results.git && cd 100km-results
npm install
./grunt.sh
```
To simulate 100km CouchDB server, one can use ```./grunt.sh fake-100km```


build with node version v0.10.25 and npm version 1.3.2
On Ubuntu 12.04, the node version is too old. Use the following commands to install a more recent version:
```
apt-add-repository ppa:chris-lea/node.js
apt-get update
apt-get install nodejs
```
