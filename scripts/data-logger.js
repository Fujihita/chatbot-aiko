var app = angular.module('DataLogger', []);

app.controller('DataLoggerCtrl', function ($scope, $http) {
    $scope.data = [];
    $http.get("/log").success(function (response) {
        console.log(response);
        $scope.data = response;
    });
});

