var event = require('../model/event.js');
var eventController = require('../controllers/eventController.js');
var https = require('https');
var request = require('request');

var wxTerm = {
'Chance of Flurries':-1,
'Chance of Rain':-1,
'Chance Rain':-1,
'Chance of Freezing Rain':-1,
'Chance of Sleet':-1,
'Chance of Snow':-1,
'Chance of Thunderstorms':-1,
'Chance of a Thunderstorm':-1,
'Clear':1,
'Cloudy':1,
'Flurries':-1,
'Fog':-1,
'Haze':1,
'Mostly Cloudy':1,
'Mostly Sunny':1,
'Partly Cloudy':1,
'Partly Sunny':1,
'Freezing Rain':-1,
'Rain':-1,
'Sleet':-1,
'Snow':-1,
'Sunny':1,
'Thunderstorms':-1,
'Thunderstorm':-1,
'Unknown':0,
'Overcast':1,
'Scattered Clouds':1
};

// API request for 10 day forcast

var wx = function(zip, index, callback){
  var reqPath = '/api/70ba34089d4744a1/forecast10day/q/94118.json';
  request('https://api.wunderground.com'+reqPath, function(err, res, body){
    if (!err && res.statusCode == 200) {
      // console.log(body);
      callback(JSON.parse(body)); 
    }
  });
};

// Function that updates each record in table to current weather information
// Will update event owner of any changes
module.exports.wxCheck = function(){
  var eventArr;
  Date.prototype.getDOY = function() {
    var onejan = new Date(this.getFullYear(),0,1);
    return Math.ceil((this - onejan) / 86400000);
  };
  var wxSts = 0;
  var today = new Date();
  // var targetDay = $scope.addDate;
  var todayNum = today.getDOY();
  // var targetNum = targetDay.getDOY();
  event.getAll(function (err, data) {
    if(err) {
      return res.status(500).json(err);
    }
    console.log('getAll response: ', data);
    eventArr = data;
    for(var i = 0; i < eventArr.length; i++){
      var id = eventArr[i].eventID;
      console.log('event Obj: ', eventArr[i]);
      var date = new Date(eventArr[i].date);
      var targetNum = date.getDOY();
      console.log('target date num: ', targetNum);
      var zip = eventArr[i].zipcode;
      var daysOut = targetNum - todayNum;
      console.log('Days Out:', daysOut);
      if(daysOut < 9){
        console.log('Current Event 1!!!: ', eventArr[i]);
        console.log('Current Index: ', i);
        wx(zip, i, function(data){
          // grab current forcasted weather for target day
          console.log('Index passed:' ,i);
          var currEvent = eventArr[i];
          console.log('Current Event Inside Wx Method: ', eventArr);
          var timeStamp = today.toString();
          // $filter('date')(today, 'medium');
          var currForc = data.forecast.simpleforecast.forecastday[daysOut+1];
          console.log('Current Weather Info: ', currForc);
          var estWx = currForc.conditions+' '+'With a High Temperature of '+currForc.high.fahrenheit+' F';
          console.log('Est weather string:', estWx);
          event.updateEvent(id, 'estimatedWeather', estWx);
          event.updateEvent(id, 'lastUpdate', timeStamp);
          if(wxTerm[currForc.conditions] !== eventArr[i].weatherStatus){
            event.updateEvent(id, 'weatherStatus', wxTerm[currForc.conditions]);
            // Email change in weather status to user
          }
        });
      }
    }
  });
};

