'use strict';

/**
 * @ngdoc function
 * @name angularFoghornApp.controller:UsersCtrl
 * @description
 * # UsersCtrl
 * Controller of the angularFoghornApp
 */
angular.module('angularFoghornApp')
  .controller('UsersCtrl', ['$scope', '$http', '$location', function ($scope, $http, $location) {
    var DELIM_LINKS = ',';
    var DELIM_LINK_PARAM = ';';
    var META_REL = 'rel';
    var META_LAST = 'last';
    var META_NEXT = 'next';
    var META_FIRST = 'first';
    var META_PREV = 'prev';
    var paginationLinks = {};
    $scope.searchString = '';
    $scope.pageSize = 10;
    $scope.currentPage = 1;
    $scope.gridOptions2 = {
      paginationPageSize: 10,
      enableRowSelection: true,
      totalItems: 100,
      useExternalPagination: true,
      enableFullRowSelection: true,
      enableRowHeaderSelection: false,
      multiSelect: false,
      columnDefs: [
        { name: 'login', enableColumnMenu: false }
      ],
      onRegisterApi: function (gridApi) {
        $scope.gridApi = gridApi;
        gridApi.pagination.on.paginationChanged(
          $scope,
          function (newPage, pageSize) {
            console.log(newPage);
            var diff = $scope.currentPage - newPage;
            var url = '';
            if (newPage === 1) {
              url = paginationLinks.first;
            } else {
              if (diff === 1) {
                url = paginationLinks.prev;
              } else if (diff === -1) {
                url = paginationLinks.next;
              } else {
                url = paginationLinks.last;
              }
            }
            $scope.currentPage = newPage;
            $scope.pageSize = pageSize;
            $http.get(url)
              .then(function (data) {
                if (data.headers('Link')) {
                  parseLinks(data.headers('Link'));
                }
                if ($scope.searchString) {
                  $scope.gridOptions2.data = data.data.items;
                } else {
                  $scope.gridOptions2.data = data.data;
                }
              });
          });
        gridApi.selection.on.rowSelectionChanged($scope, function (row) {
          $location.path('/details/' + row.entity.login);
        });
      }
    };
    /**
     * @ngdoc function
     * @name UsersCtrl:searchUsers
     * @param {string} searchString - String to search users in GitHub API
     * @param {number} pageNumber - Current page number for pagination
     * @param {number} pageSize - Page size for pagination
     * @returns {void}
     * @description
     * # searchUsers
     * Function to make a call to git api based on the searched text
     */
    $scope.searchUsers = function (searchString, pageNumber, pageSize) {
      if (!pageNumber) {
        pageNumber = 1;
        $scope.currentPage = 1;
      }

      $http.get('https://api.github.com/search/users', { params: { q: searchString, page: pageNumber, per_page: pageSize } })
        .then(function (data) {
          if (data.headers('Link')) {
            parseLinks(data.headers('Link'));
          }
          $scope.gridOptions2.data = data.data.items;
          $scope.gridOptions2.totalItems = data.data.total_count;
        });
    };
    /**
     * @ngdoc function
     * @name UsersCtrl:loadUsers
     * @returns {void}
     * @description
     * # loadUsers
     * Function to get git users without search string on page load
     */
    function loadUsers() {
      $scope.currentPage = 1;
      $http.get('https://api.github.com/users', { params: { page: $scope.currentPage, per_page: $scope.pageSize } })
        .then(function (data) {
          if (data.headers('Link')) {
            parseLinks(data.headers('Link'));
          }
          $scope.gridOptions2.data = data.data;
          if (data.data.total_count) {
            $scope.gridOptions2.totalItems = data.data.total_count;
          }
        });
    }
    /**
     * @ngdoc function
     * @name UsersCtrl:parseLinks
     * @returns {void}
     * @description
     * # parseLinks
     * Function to get extract the pagination links from the git api response header - link
     */
    function parseLinks(response) {
      var linksArray = response.split(DELIM_LINKS);
      for (var i = 0; i < linksArray.length; i++) {
        var link = linksArray[i];
        var segments = link.split(DELIM_LINK_PARAM);
        if (segments.length < 2) {
          continue;
        }
        var linkPart = segments[0].trim();
        if (!linkPart.startsWith('<') || !linkPart.endsWith('>')) {
          continue;
        }

        linkPart = linkPart.substring(1, linkPart.length - 1).replace(/{/g, '').replace(/}/g, '');

        for (var j = 1; j < segments.length; j++) {
          var rel = segments[j].trim().split('=');
          if (rel.length < 2 || META_REL !== rel[0]) {
            continue;
          }
          var relValue = rel[1];
          if (relValue.startsWith('\"') && relValue.endsWith('\"')) {
            relValue = relValue.substring(1, relValue.length - 1);
          }

          if (META_FIRST === relValue) {
            paginationLinks.first = linkPart;
          } else if (META_LAST === relValue) {
            paginationLinks.last = linkPart;
          } else if (META_NEXT === relValue) {
            paginationLinks.next = linkPart;
          } else if (META_PREV === relValue) {
            paginationLinks.prev = linkPart;
          }
          console.log(JSON.stringify(paginationLinks));
        }
      }
    }
    $scope.$watch('searchString', function () {
      if ($scope.searchString.trim().length > 0) {
        $scope.searchUsers($scope.searchString, $scope.currentPage, $scope.pageSize);
      } else {
        loadUsers();
      }
    });
  }]);
