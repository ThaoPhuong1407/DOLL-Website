# DOLL-website-v1

### To Back Up current data in case of unwanted future CRUD operations

1. cd to utils dir
2. mongo "mongodb+srv://dollwebsite.4stoq.mongodb.net/DollWebsite" --username thao --password Asd8538873 < backupDollWeb.js

If mongodb is gone, we will need to change the database structure completely.
If AWS is gone, we can simply switch to a different cloud storage provider using Mongo AtLas Platform https://cloud.mongodb.com/

### To Back Up website:

All source code is available in github: https://github.com/ThaoPhuong1407/DOLL-Website

// Before pushing to Heroku
// 1. Do a build for the server
// 2. Do a build for a client: build:js
// "git push heroku main" To force an update
