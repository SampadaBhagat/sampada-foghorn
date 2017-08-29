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
    var META_REL = "rel";
    var META_LAST = "last";
    var META_NEXT = "next";
    var META_FIRST = "first";
    var META_PREV = "prev";
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
            var url = "";
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
            console.log(url + "  --- " + newPage);
            $scope.currentPage = newPage;
            $scope.pageSize = pageSize;
            $http.get(url)
              .then(function (data) {
                parseLinks(data.headers('Link'));
                $scope.gridOptions2.data = data.data;
              });
          });
        gridApi.selection.on.rowSelectionChanged($scope, function (row) {
          $location.path('/details/'+row.entity.login );
        });
      }
    };

    // $scope.gridOptions2.onRegisterApi = function (gridApi) {
    //   $scope.gridApi2 = gridApi;
    // }
    $scope.searchUsers = function (searchString, pageNumber, pageSize) {
      if (!pageNumber) {
        pageNumber = 1;
        $scope.currentPage = 1;
      }

      $http.get("https://api.github.com/search/users", { params: { q: searchString, page: pageNumber, per_page: pageSize } })
        .then(function (data) {
          parseLinks(data.headers('Link'));
          $scope.gridOptions2.data = data.data.items;
          $scope.gridOptions2.totalItems = data.data.total_count;
        });
    };
    function loadUsers() {
      $http.get("https://api.github.com/users", { params: { page: $scope.currentPage, per_page: $scope.pageSize } })
        .then(function (data) {
          parseLinks(data.headers('Link'));
          $scope.gridOptions2.data = data.data;
          $scope.gridOptions2.totalItems = data.data.total_count;
        });
    }
    loadUsers();
    function parseLinks(response) {
      var linksArray = response.split(DELIM_LINKS);
      for (var link of linksArray) {
        let segments = link.split(DELIM_LINK_PARAM);
        if (segments.length < 2)
          continue;

        let linkPart = segments[0].trim();
        if (!linkPart.startsWith("<") || !linkPart.endsWith(">"))
          continue;
        linkPart = linkPart.substring(1, linkPart.length - 1);

        for (let i = 1; i < segments.length; i++) {
          let rel = segments[i].trim().split("=");
          if (rel.length < 2 || !(META_REL === rel[0]))
            continue;

          var relValue = rel[1];
          if (relValue.startsWith("\"") && relValue.endsWith("\""))
            relValue = relValue.substring(1, relValue.length - 1);

          if (META_FIRST === relValue)
            paginationLinks.first = linkPart;
          else if (META_LAST === relValue)
            paginationLinks.last = linkPart;
          else if (META_NEXT === relValue)
            paginationLinks.next = linkPart;
          else if (META_PREV === relValue)
            paginationLinks.prev = linkPart;
        }
      }
    }
  }]);
