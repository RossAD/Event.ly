var event = require('../model/event.js');
var wxUp = require('../wundergroundapi/wundergroundapi.js');

/*Helper Functions*/
var getAllEvents =  function (req,res) {
  event.getAll(function (err, data) {
    if(err) {
      return res.status(500).json(err);
    }
    res.json(data);
  });
};

var getEventByOwner =function(req, res){
  var owner = req.query.eventOwner;
  event.getByOwner(owner, function(err, data){
    if(err) {
      return res.status(500).json(err);
    }
    res.status(200).json(data);
  });

};

module.exports.addOneEvent =function(req, res){
  var newEvent = req.body;
  event.addOne(newEvent, function (err, data) {
    if(err) {
      return res.status(500).json(err);
    }
    res.status(201).json(data);
  });
};

/*Exported Functions*/
module.exports.getter = function(req, res){
  console.log('inside getter');
  wxUp.wxCheck();
  if (!req.query.eventOwner){
    getAllEvents(req, res);
  } else {
    getEventByOwner(req, res);
  }
};

module.exports.deleteThisEvent =function(req, res){
  var eventID = req.params.id;
  event.deleteEvent(eventID, function(err, data){
    if(err) {
      return res.status(500).json(err);
    }
    res.json(data);
  });

};
