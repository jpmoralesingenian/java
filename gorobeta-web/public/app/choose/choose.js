angular.module( 'goro.choose', [
    'ui.state',
])

.config(function config( $stateProvider )
{
    $stateProvider.state( 'choose', {
        url: '/choose',
        views: {
            "main": {
                controller: 'ChooseCtrl',
                templateUrl: 'app/choose/choose.html'
            }
        },
        data:{ pageTitle: 'Conoce y elige - Goro' }
    });
})

/**
 * Controlador de la página que le permite al usuario elegir buscar opciones por varios criterios y elegir las que
 * más le llame la atención (opciones)
 */
.controller( 'ChooseCtrl', ['$scope', 'searchSvc', 'sessionSvc', function ( $scope, searchSvc, sessionSvc )
{
    /**
     * Inicializa los componentes del controlador
     */
    init = function() {
        for(o=0; o < sessionSvc.options.length; o++)
            searchSvc.completeOptionDescription(sessionSvc.options[o]);
    }

    /**
     * Ordena alfabeticamente las opciones por el lugar asociado
     */
    $scope.orderOptionsByPlace = function() {
        sessionSvc.options.sort(function(a, b) {return a.restaurant.localeCompare(b.restaurant)});
    }

    /**
     * Ordena descendentemente las opciones por la cantidad de amigos a los que les gusta la opción
     */
    $scope.orderOptionsByFriends = function() {
        sessionSvc.options.sort(function(a, b) {return b.friends.length - a.friends.length});
    }

    /**
     * Ordena alfabeticamente las opciones por el precio asociado
     */
    $scope.orderOptionsByPrice = function() {
        sessionSvc.options.sort(function(a, b) {return getPriceNumber(a.price) - getPriceNumber(b.price)});
    }

    /**
     * Acción que se ejecuta cuando se selecciona una opción
     * @param option La opción seleccionada
     */
    $scope.selectOption = function (option) {
        option.selected = !option.selected;
        if (option.selected)
            sessionSvc.selectedOptions.push(option);
        else {
            //encuentra la opción previamente seleccionada
            var index = 0;
            for(; sessionSvc.selectedOptions[index].id != option.id; index++);
            sessionSvc.selectedOptions.slice(index, 1);
        }
    }

    /**
     * Retorna la clase que identifica si una opción está seleccionada o no
     */
    $scope.getSelectedClass = function(option) {
       return (option.selected)? "bg-success": "";
    }

    /**
     * Informa si el precio de un plato es mayor a cero
     * @param price Precio en el formato retornado por SOLR
     */
    $scope.greaterThanZero = function (price) {
        var price = Number(price.slice(0, price.indexOf(",")));
        return price > 0;
    }

    /**
     * Retorna la cantidad presente en el campo precio de un resultado de SOLR
     * @param price El precio en formato SOLR
     */
    getPriceNumber = function(price) {
        return Number(price.slice(0, price.indexOf(",")));
    }

    /**
     * Retorna las opciones que se seleccionaron en la búsqueda
     */
    $scope.getOptions = function() {
        return sessionSvc.options;
    }

    /**
     * Retorna las opciones seleccionadas en la sesión de comparar
     */
    $scope.getSelectedOptions = function () {
        return sessionSvc.selectedOptions;
    }

    init();

}])
;
