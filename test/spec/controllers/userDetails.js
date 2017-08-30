'use strict';

describe('Controller: UserDetailsCtrl', function () {

  // load the controller's module
  beforeEach(module('angularFoghornApp'));

  var UserDetailsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    UserDetailsCtrl = $controller('UserDetailsCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

});
