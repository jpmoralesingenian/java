angular.module( 'goro.home', [
  'ui.state'
])

/**
 * Each section or module of the site can also have its own routes. AngularJS
 * will handle ensuring they are all available at run-time, but splitting it
 * this way makes each module more "self-contained".
 */
.config(function config( $stateProvider ) {
  $stateProvider.state( 'home', {
    url: '/home',
    views: {
      "main": {
        controller: 'HomeCtrl',
        templateUrl: 'app/home/home.html'
      }
    },
    data:{ pageTitle: 'Antojado - Decide fácil qué comer' }
  });
})

/**
 * And of course we define a controller for our route.
 */
.controller( 'HomeCtrl', ['$scope', '$stateParams', 'sessionSvc', '$state', function( $scope, $stateParams, sessionSvc, $state )
{
  //campos de la consulta
  $scope.query = {text:"", priceRange:""};
  //rangos de precios
  $scope.priceRanges = sessionSvc.priceRanges;

}])
;
