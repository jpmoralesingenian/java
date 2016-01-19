angular.module( 'goro.help', [
    'ui.state',
])

.config(function config( $stateProvider )
{
    $stateProvider.state( 'help', {
        url: '/help',
        views: {
            "main": {
                controller: 'HelpCtrl',
                templateUrl: 'app/help/help.html'
            }
        },
        data:{ pageTitle: 'Ayuda' }
    });
})

/**
 * Controlador de la página de ayuda
 */
.controller( 'HelpCtrl', function ( $scope, searchSvc, sessionSvc )
{

});