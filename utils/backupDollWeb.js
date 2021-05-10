// mongo "mongodb+srv://dollwebsite.4stoq.mongodb.net/DollWebsite" --username thao --password Asd8538873 < backupDollWeb.js

use DollWebsite
show collections
db.people.aggregate([{ $match: {}}, { $out: "backupPeople" } ])
db.posts.aggregate([{ $match: {}}, { $out: "backupPosts" } ])
db.projects.aggregate([{ $match: {}}, { $out: "backupProjects"} ])
db.solutions.aggregate([{ $match: {}}, { $out: "backupSolutions"} ])
db.updates.aggregate([{ $match: {}}, { $out: "backupUpdates"} ])
db.users.aggregate([{ $match: {} }, { $out: "backupUsers"} ])