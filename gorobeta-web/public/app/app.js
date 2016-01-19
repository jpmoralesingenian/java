angular.module( 'goro-app', [
  'goro.home',
  'goro.search',
  'goro.choose',
  'goro.enjoy',
  'goro.help',
  'goro.contact',
  'goro-filters',
  'ui.state',
  'ui.route'
])

.config( function myAppConfig ( $stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise( '/home' );
})

.run(function () {
})

.controller( 'AppCtrl', function AppCtrl ( $scope, $location ) {
  $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
    if ( angular.isDefined( toState.data.pageTitle ) ) {
      $scope.pageTitle = toState.data.pageTitle + ' | Goro' ;
    }
  });
})

;

