'use strict';

angular.module('housingApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'app/user/user.html',
        controller: 'UserCtrl'
      });
  });