var event = require('../model/event.js');
var eventController = require('../controllers/eventController.js');

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
var wx = function(zip, callback){
    var request = '/api/70ba34089d4744a1/forecast10day/q/' + zip + '.json';
    return $http({
      method: 'GET',
      url: 'https://api.wunderground.com' + request
    })
    .then(function successCallback(res) {
      callback(res.data);
      }, function errorCallback(res) {
        // called asynchronously if an error occurs
        console.log('Your weather call had an error', res);
      });
  };
// Function that updates each record in table to current weather information
// Will update event owner of any changes
var wxCheck = function(){
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
    eventArr = data;
  });
  for(var i = 0; i < eventArr.length; i++){
    var id = eventArr[i].eventID;
    var date = eventArr[i].date;
    var targetNum = date.getDOY();
    var zip = eventArr[i].zipcode;
    var daysOut = targetNum - todayNum;
    if(daysOut < 9){
      wx(zip, function(data){
        // grab current forcasted weather for target day
        var currForc = data.forecast.simpleforecast.forecastday[daysOut+1];
        var estWx = currForc.conditions+' '+'With a High Temperature of '+currForc.high.fahrenheit+' F';
        event.updateEvent(id, 'estimatedWeather', estWx);
        if(wxTerm[currForc.conditions] !== eventArr[i].weatherStatus){
          event.updateEvent(id, 'weatherStatus', wxTerm[currForc.conditions]);
          // Email change in weather status to user
        }
      });
    }
  }
};

// Pull each event in event table
// 
//http://api.wunderground.com/api/70ba34089d4744a1/forecast10day/q/94602.json

// module.exports = {
// 	var weather = function (zipcode) {
// 	  app.get('http://api.wunderground.com/api/70ba34089d4744a1/hourly10day/q/' + zipcode + '.json',
// 	  	function(parsed_json) {
// 		  var weatherObj = {};
// 		  	weather.location = parsed_json['location']['city'];
// 		    weather.temp_f = parsed_json['current_observation']['temp_f'];
//   		}
// 	  }
// }
