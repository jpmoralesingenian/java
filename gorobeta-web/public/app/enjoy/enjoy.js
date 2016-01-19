angular.module( 'goro.enjoy', [
    'ui.state',
])

.config(function config( $stateProvider )
{
    $stateProvider.state( 'enjoy', {
        url: '/enjoy',
        views: {
            "main": {
                controller: 'EnjoyCtrl',
                templateUrl: 'app/enjoy/enjoy.html'
            }
        },
        data:{ pageTitle: 'Disfruta' }
    });
})

/**
 * Controlador de la página que le permite al usuario conocer cómo disfrutar las opciones seleccionadas
 */
.controller( 'EnjoyCtrl', ['$scope', 'sessionSvc', function ( $scope, sessionSvc )
{
    //listado de opciones seleccionadas ordenadas por restaurante
    $scope.optionsResume;

    /**
     * Inicializa los componentes del controlador
     */
    init = function() {
        /**
         * Resumen de las opciones seleccionadas
         */
        //ordena las opciones seleccionadas por restaurante
        var selectedOptions = sessionSvc.selectedOptions;
        selectedOptions.sort(function(a, b) {return a.restaurant.localeCompare(b.restaurant)});
        $scope.optionsResume = [];
        //agrupa las opciones por restaurante
        for(o=0; o < selectedOptions.length; o++)
            addOption(selectedOptions[o]);

        //consulta qué servicios de delivery hay disponible para la opción seleccionada
        for(o=0; o < $scope.optionsResume.length; o++){
            var resumeItem = $scope.optionsResume[o];
            addDeliveryService(resumeItem, 1, "Domicilios.com", "domicilios.png", resumeItem.options[0].url);
            addDeliveryService(resumeItem, 2, "Rappi", "rappi.jpg", "http://www.rappi.com");
            addDeliveryService(resumeItem, 3, "Kiwi", "kiwi.png", "http://dileakiwi.com");
        }
    }

    /**
     * Agrega un servicio de domicilios al resumen
     * @param id
     * @param name
     * @param logo_url
     * @param url
     */
    addDeliveryService = function(itemResume, id, name, logo_url, url) {
        itemResume.deliveryServices.push({id: id, name: name, logo_url: logo_url, url: url});
    }

    /**
     * Agrega una opción al resumen de opciones seleccionadas
     */
    addOption = function (option) {
        //encuentra el resutaurante en el resumen
        var index = $scope.optionsResume.length - 1;
        for(; index >= 0 && $scope.optionsResume[index].restaurant != option.restaurant; index--);
        //crea la llave para el restaurante
        if (index == -1)
            $scope.optionsResume.push({restaurant: option.restaurant, options: [option], deliveryServices: []});
        else
            $scope.optionsResume[index].options.push(option);
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

    /**
     * Informa si el precio de un plato es mayor a cero
     * @param price Precio en el formato retornado por SOLR
     */
    $scope.greaterThanZero = function (price) {
        var price = Number(price.slice(0, price.indexOf(",")));
        return price > 0;
    }

    init();

}])
;