var express = require('express');
var app = express();
var sqlite = require('sqlite3');
// var jquery = require(jquery); Commented to test server/db intergration
var wxCond = {
  'Drizzle' : -1,
  'Rain' : -1,
  'Snow' : -1,
  'Snow Grains' : -1,
  'Ice Crystals':-1,
  'Ice Pellets':-1,
  'Hail':-1,
  'Mist':-1,
  'Fog':-1,
  'Fog Patches':-1,
  'Smoke':-1,
  'Volcanic Ash':-1,
  'Widespread Dust':-1,
  'Sand':-1,
  'Haze':-1,
  'Spray':-1,
  'Dust Whirls':-1,
  'Sandstorm':-1,
  'Low Drifting Snow':-1,
  'Low Drifting Widespread Dust':-1,
  'Low Drifting Sand':-1,
  'Blowing Snow':-1,
  'Blowing Widespread Dust':-1,
  'Blowing Sand':-1,
  'Rain Mist':-1,
  'Rain Showers':-1,
  'Snow Showers':-1,
  'Snow Blowing Snow Mist':-1,
  'Ice Pellet Showers':-1,
  'Hail Showers':-1,
  'Small Hail Showers':-1,
  'Thunderstorm':-1,
  'Thunderstorms and Rain':-1,
  'Thunderstorms and Snow':-1,
  'Thunderstorms and Ice Pellets':-1,
  'Thunderstorms with Hail':-1,
  'Thunderstorms with Small Hail':-1,
  'Freezing Drizzle':-1,
  'Freezing Rain':-1,
  'Freezing Fog':-1,
  'Patches of Fog':-1,
  'Shallow Fog':-1,
  'Partial Fog':-1,
  'Small Hail':-1,
  'Squalls':-1,
  'Funnel Cloud':-1,
  'Unknown Precipitation':0,
  'Unknown':0,
  'Overcast':1,
  'Clear':1,
  'Partly Cloudy':1,
  'Mostly Cloudy':1,
  'Scattered Clouds':1
};


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
