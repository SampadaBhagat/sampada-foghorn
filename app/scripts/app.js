'use strict';

/**
 * @ngdoc overview
 * @name angularFoghornApp
 * @description
 * # angularFoghornApp
 *
 * Main module of the application.
 */
angular
  .module('angularFoghornApp', [
    'ngRoute', 'ui.grid', 'ui.grid.pagination', 'ui.grid.selection'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/users.html',
        controller: 'UsersCtrl',
        controllerAs: 'users'
      })
      .when('/details/:login', {
        templateUrl: 'views/userDetails.html',
        controller: 'UserDetailsCtrl',
        controllerAs: 'details'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
