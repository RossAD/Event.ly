var db = require('../db/db.js').database();

/*Helper Functions*/
var insertValues = function(eventOwner, title, date, time, streetAddress, city, state, zipCode, latitude, longitude, indoorOutdoor, estimatedWeather, weatherStatus, publicPrivate, callback){

  var statement = db.prepare('INSERT INTO `eventTable`(`eventOwner`,`title`,`date`,`time`,`streetAddress`,`city`,`state`,`zipCode`,`latitude`,`longitude`,`indoorOutdoor`,`estimatedWeather`,`weatherStatus`,`publicPrivate`) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)');
  statement.run(eventOwner, title, date, time, streetAddress, city, state, zipCode, latitude, longitude, indoorOutdoor, estimatedWeather, weatherStatus, publicPrivate, callback);
};

var createTable = function(callback){
  db.run('CREATE TABLE IF NOT EXISTS `eventTable`(' +
    '`eventID` INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,' +
    '`eventOwner` TEXT,' +
    '`title` TEXT,' +
    '`date` TEXT,' +
    '`time` TEXT,' +
    '`streetAddress` TEXT,' +
    '`city` TEXT,' +
    '`state` TEXT,' +
    '`zipCode` INTEGER,' +
    '`latitude` REAL,' +
    '`longitude` REAL,' +
    '`indoorOutdoor` INTEGER,' +
    '`estimatedWeather` TEXT,' +
    '`weatherStatus` INTEGER,' +
    '`publicPrivate` INTEGER)', callback);
};

/*Exported Functions*/
module.exports.addOne = function(eventObj, callback){
  if(!eventObj.hasOwnProperty('eventOwner') || !eventObj.hasOwnProperty('date') || !eventObj.hasOwnProperty('time') || !eventObj.hasOwnProperty('zipCode') || !eventObj.hasOwnProperty('title')) {
    return callback('Must complete required fields.');
  }

  insertValues(
    eventObj.eventOwner, // required
    eventObj.title, // required
    eventObj.date, // required
    eventObj.time, // required
    eventObj.streetAddress,
    eventObj.city,
    eventObj.state,
    eventObj.zipCode, // required
    eventObj.latitude,
    eventObj.longitude,
    eventObj.indoorOutdoor || 1,
    eventObj.estimatedWeather,
    eventObj.weatherStatus || 0,
    eventObj.publicPrivate || 1,
    callback);
};
module.exports.getAll = function(callback){
  db.all('SELECT * from eventTable', callback);
};

module.exports.getByOwner = function(eventOwner, callback){
  var lookUp = db.prepare('SELECT * from eventTable where eventOwner = ?');
  lookUp.all(eventOwner, callback);
};

module.exports.deleteEvent = function(eventID, callback){
  var lookUp = db.prepare('DELETE from eventTable where eventID = ?');
  lookUp.run(eventID, callback);

};

// Update records
module.exports.updateEvent = function(eventID, col, data){
  db.run('UPDATE eventTable SET '+col+'='+data+' where eventID = '+eventID);
};

//-------------------------------------------------------------------------------------------//

/*Test for inserting in eventTable*/
createTable(function (err){
  if(err){
    console.log("ERR!! ", err);
  }
});
