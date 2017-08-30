'use strict';

describe('Controller: UsersCtrl', function () {

  // load the controller's module
  beforeEach(module('angularFoghornApp'));

  var UsersCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    UsersCtrl = $controller('UsersCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));
  it('should attach a searchString to the scope', function () {
    expect(scope.searchString.length).toBe(0);
  });
  it('should attach a pageSize to the scope', function () {
    expect(scope.pageSize).toBe(10);
  });
  it('should attach currentPage to the scope', function () {
    expect(scope.currentPage).toBe(1);
  });
  
});
