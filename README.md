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

### How to Update POST

1. npm run dev
2. Go to localhost:3000/login and login
3. Might want to do: cross-env NODE_ENV=development parcel watch ./public/js/index.js --out-dir ./public/js --public-url /js --out-file bundle.js

- To add image: https://lh3.googleusercontent.com/d/IMAGE-ID (get from sharing)
