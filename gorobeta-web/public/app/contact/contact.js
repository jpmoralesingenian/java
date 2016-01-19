angular.module( 'goro.contact', [
    'ui.state',
])

.config(function config( $stateProvider )
{
    $stateProvider.state( 'contact', {
        url: '/contact',
        views: {
            "main": {
                controller: 'ContactCtrl',
                templateUrl: 'app/contact/contact.html'
            }
        },
        data:{ pageTitle: 'Contáctanos' }
    });
})

/**
 * Controlador de la página de contacto
 */
.controller( 'ContactCtrl', function ( $scope, searchSvc, sessionSvc )
{

});