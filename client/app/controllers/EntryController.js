angular.module('Evently.Add',[])
  .controller('EntryController', ['$scope','Events','$filter', function($scope, Events, $filter){
    // var wxObj = Events.wx($scope.addZip);
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

    $scope.showValue = true;
    $scope.addEvent = function () {
      $scope.showValue = false;
      // Function to get current Day of Year
      // For comparison against Weather API days
      Date.prototype.getDOY = function() {
        var onejan = new Date(this.getFullYear(),0,1);
        return Math.ceil((this - onejan) / 86400000);
      };
      var wxSts = 0;
      var today = new Date();
      var targetDay = $scope.addDate;
      var todayNum = today.getDOY();
      var targetNum = targetDay.getDOY();
      var daysOut = targetNum - todayNum;
      $scope.data = {};
      var newEvent = {
        eventOwner:$scope.addOwner,
        title:$scope.addLabel,
        time:$filter('date')($scope.addTime, 'shortTime'),
        date:$filter('date')($scope.addDate, 'shortDate'),
        streetAddress:$scope.addStreet,
        city:$scope.addCity,
        state:$scope.addState,
        zipCode:$scope.addZip,
        indoorOutdoor:$scope.outside,
        weatherStatus:wxSts
      };
      if(daysOut < 9){
        Events.wx($scope.addZip, function(res){
          // console.log('Returned Wx Object 10Day Hourly: ', res);
          var wxCond = res.forecast.simpleforecast.forecastday[daysOut+1];
          console.log('Returned Wx object: ', wxCond);
          var cond = wxCond.conditions;
          console.log('Weather Cond : ', cond);
          newEvent.estimatedWeather = wxCond.conditions+' '+'With a High Temperature of '+wxCond.high.fahrenheit+' F';
          newEvent.weatherStatus = wxTerm[cond];
          newEvent.lastUpdate = $filter('date')(today, 'medium');
          Events.addEntry(newEvent);
          // $scope.estimatedWeather = newEvent.estimatedWeather;
          // $scope.eventEntry.$setPristine();
          $scope.eventEntry.$setUntouched();
        });
      } else {
        newEvent.estimatedWeather = 'Conditions are Unknown at this time, Check back when you are with in 10 days of your event.';
        Events.addEntry(newEvent);
        // $scope.estimatedWeather = newEvent.estimatedWeather;
      }
      // console.log('Date entry Data format: ', targetDay);
      // console.log('targetDay day of year: ', targetNum);
      // console.log('Day difference: ', daysOut);
    };
  }]);
