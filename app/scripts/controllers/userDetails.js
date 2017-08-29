'use strict';

/**
 * @ngdoc function
 * @name angularFoghornApp.controller:UserDetailsCtrl
 * @description
 * # UserDetailsCtrl
 * Controller of the angularFoghornApp
 */
angular.module('angularFoghornApp')
  .controller('UserDetailsCtrl', ['$scope', '$routeParams', '$http', '$location', '$window', function ($scope, $routeParams, $http, $location, $window) {
    $scope.login = $routeParams.login;
    if (sessionStorage[$scope.login]) {
      var gistId = sessionStorage[$scope.login];
      $http.get('https://api.github.com/gists/' + gistId).then(
        function (response) {
          sessionStorage[$scope.login] = response.data.id;
          $scope.description = response.data.description;
          $scope.content = response.data.files["file1.txt"].content;
        }
      )
    }
    $scope.submitData = function () {
      var data = {
        "description": $scope.description,
        "public": true,
        "files": {
          "file1.txt": {
            "content": $scope.content
          }
        }
      }
      $http.post('https://api.github.com/gists', data).then(
        function (response) {
          sessionStorage[$scope.login] = response.data.id;
          console.log('response' + JSON.stringify(response));
          alert("Data Stored Successfully!!!")
          $location.path('/users');
        }
      );
    }
    $scope.cancel = function () {
      if ($window.confirm('Any changes made in this page will not be saved. Do you want to cancel?')) {
        $location.path('/users');
      }
      
    }
    $scope.reset = function () {
      if ($window.confirm('Do you want to reset?')) {
        $scope.description = "";
        $scope.content = "";
      }

    }
  }]);
