angular.module('goro-app').
factory('userSvc', function() {
    var sdo = {
        isLogged: false,
        username: ''
    };
    return sdo;
});