angular.module( 'goro.search', [
    'ui.state',
])

.config(function config( $stateProvider )
{
    $stateProvider.state( 'search', {
        url: '/search?text&priceRange',
        views: {
            "main": {
                controller: 'SearchCtrl',
                templateUrl: 'app/search/search.html'
            }
        },
        data:{ pageTitle: 'Descubre' }
    });
})

/**
 * Controlador de la página que le permite al usuario elegir buscar opciones por varios criterios y elegir las que
 * más le llame la atención (opciones)
 */
.controller( 'SearchCtrl', ['$scope', '$http', 'searchSvc', 'sessionSvc', '$anchorScroll', '$stateParams', function ( $scope, $http, searchSvc, sessionSvc, $anchorScroll, $stateParams )
{
    //número máximo de resultados por página
    var PAGE_SIZE = 10;
    //número de páginas que se muestra en el control de paginación
    const NUM_PAGES = 5;
    //datos del paginador
    $scope.paginator = [];

    /**
     * Inicializa los valores del controlador
     */
    init = function () {
        //query
        $scope.query = sessionSvc.query;
        $scope.query.pageSize = PAGE_SIZE;
        $scope.query.priceRange = 0;
        $scope.query.places = [];
        $scope.query.tags = [];
        $scope.query.start = 0;
        //rangos de precios
        $scope.priceRanges = sessionSvc.priceRanges;
        //parámetros pasados por query string
        $scope.query.text = ($stateParams.text != null) ? $stateParams.text : $scope.query.text;
        if ($stateParams.priceRange)
            $scope.query.priceRange = Number($stateParams.priceRange);
        if ($scope.query.text != null)
        if ($scope.query.text != null)
            $scope.search();

        //response
        $scope.response = sessionSvc.queryResponse;
    }

    /**
     * Ejecuta el query dados los criterios de búsqueda ingresados por el usuario
     * @pre: las validaciones de los campos del formulario pasaron
     */
    $scope.search = function () {
        $scope.query.start = 0;
        runQuery();
    }

    /**
     * Define el número de páginas que se muestran en el control de paginación
     * @param firstPage Número de la primera página que se muestra
     */
    updatePaginator = function(firstPage) {
        //calcula el número total de páginas de resultados
        var lastPage = Math.floor($scope.response.numFound / PAGE_SIZE);
        lastPage += ($scope.response.numFound % PAGE_SIZE > 0) ? 1 : 0;

        //garantiza que siempre se muestra NUM_PAGES en el control
        if ((lastPage - firstPage + 1) < NUM_PAGES)
            firstPage = lastPage - NUM_PAGES + 1;
        if (firstPage < 1)
            firstPage = 1;

        //adiciona las páginas desde la primera hasta la última teniendo en cuenta NUM_PAGES
        $scope.paginator = [];
        for(p=0; p < NUM_PAGES && (firstPage+p) <= lastPage; p++) {
            $scope.paginator.push(firstPage+p);
        }
    }

    /**
     * Ejecuta una consulta en el motor de búsqueda (SOLR) de acuerdo con los criterios ingresados por el usuario
     * @param query Criterios de búsqueda ingresados por el usuario
     */
    runQuery = function() {
        //inicializa los parámetros de la consulta
        var params = {
            "json.wrf": "JSON_CALLBACK",
            "q": $scope.query.text,
            "q.op": "OR",
            "defType":"edismax",
            "indent":"true",
            "qf":"description^2.5 tag name^3",
            "pf":"description",
            "wt":"json",
            "lowercaseOperators":"true",
            "stopwords":"true",
            "start":$scope.query.start};

        //agrega los campos de filtro a la búsqueda
        var filters = [];
        getRestaurantFilter(filters);
        getTagsFilter(filters);
        getPriceFilter(filters);

        var url = "http://52.23.223.59:8983/solr/gorobeta/select";
        //agrega los filtros
        if (filters.length > 0)
            url = url.concat("?").concat(filters.join("&"));

        //ejecuta la consulta en solr
        $http({method: "JSONP", url: url, params: params}).then(
            function successCallback(response) {
                $scope.response = response.data.response;
                sessionSvc.queryResponse = $scope.response;
                updatePaginator(Math.floor($scope.query.start / PAGE_SIZE) +1);
            },
            function errorCallback(response) {
                console.log("errorCallback -> "+response.status)
            }
        );
        loadResultsSection();
    }

    /**
     * Retorna la definición para filtrar en SOLR por el restaurante seleccionado
     */
    getRestaurantFilter = function(filters) {
        if ($scope.query.places.length > 0)
            filters.push("fq=restaurant:".concat(getSolrFilterString($scope.query.places[0])));
    }

    /**
     * Retorna la definición para filtrar en SOLR por los tags seleccionados por el usuario
     */
    getTagsFilter = function(filters) {
        if ($scope.query.tags.length > 0) {
            var tags = []
            for(t=0; t < $scope.query.tags.length; t++)
                tags.push(getSolrFilterString($scope.query.tags[t]));
            filters.push("fq=tag:".concat(tags.toString()));
        }
    }

    /**
     * Retorna la definición para filtrar en SOLR por el rango de precio seleccionado por el usuario
     */
    getPriceFilter = function(filters) {
        if ($scope.query.priceRange > 0) {
            var priceRange = $scope.priceRanges[$scope.query.priceRange];
            var strFilter = "fq=price:[";

            if (priceRange.sign == "<")
                strFilter = strFilter.concat("* TO ").concat(priceRange.amount);
            else if (priceRange.sign == ">")
                strFilter = strFilter.concat(priceRange.amount).concat(" TO *");

            strFilter = strFilter.concat("]");
            filters.push(strFilter);
        }
    }

    /**
     * Retorna un string para que sea aceptado como filtro en SOLR
     * @param input Texto por el que se quiere filtrar un campo
     */
    getSolrFilterString = function(input) {
        return "\"".concat(input.trim()).concat("\"");
    }

    /**
     * Adiciona un tag seleccionado por el usuario a los criterios de búsqueda
     * @param result Resultado al que está relacionado el tag seleccionado
     * @param tag Tag seleccionado
     */
    $scope.selectTag = function (result, tag) {
        //valida que no se incluya más de una vez el mismo criterio de búsqueda
        if ($scope.query.tags.indexOf(tag) < 0) {
            $scope.query.tags.push(tag);
            $scope.query.start = 0;
            runQuery();
        }
    }

    /**
     * Adiciona un sitio seleccionado por el usuario a los criterios de búsqueda para que la búsqueda retorne solo resultados asociados a el sitio seleccionado
     * @param result Resultado al que está relacionado el sitio seleccionado
     * @param place Sitio seleccionado
     */
    $scope.selectPlace = function (place) {
        //valida que no se incluya más de una vez el mismo criterio de búsqueda
        if ($scope.query.places.indexOf(place) < 0) {
            $scope.query.places.push(place);
            $scope.query.start = 0;
            runQuery();
        }
    }

    /**
     * Quita un sitio de los criterios de búsqueda
     * @param place Sitio seleccionado para quitar de los filtros
     */
    $scope.removePlaceFilter = function (place) {
        //dado que solo soporta uno inicializa el arreglo de sitios
        $scope.query.places = [];
        runQuery();
    }

    /**
     * Quita un tag de los criterios de búsqueda
     * @param tag Tag que se quiere quitar de los criterios de búsqueda
     * @param index Número del tag dentro del listado de los seleccionados en los criterios de búsqueda
     */
    $scope.removeTagFilter = function (tag, index) {
        $scope.query.tags.splice(index, 1);
        runQuery();
    }

    /**
     * Remueve todos los tags seleccionados para filtrar la búsqueda
     */
    $scope.removeTagsFilter = function () {
        $scope.query.tags = [];
        runQuery();
    }

    /**
     * Muestra la página de resultados seleccionada
     * @param numPage Número de la página
     */
    $scope.showPage = function(numPage) {
        $scope.query.start = ((numPage-1)*PAGE_SIZE);
        runQuery();
    }

    /**
     * Ubica la pantalla en el inicio de la tabla de resultados
     */
    loadResultsSection = function() {
        $anchorScroll("initSearch");
    }

    /**
     * Muestra la página anterior de resultados
     */
    $scope.showPreviousPage = function () {
        //solo se mueve si no está en el inicio
        if ($scope.paginator[0] > 1)
            updatePaginator($scope.paginator[0]-1);
    }

    /**
     * Muestra la siguiente página de resultados
     */
    $scope.showNextPage = function() {
        //solo se mueve si no está en el inicio
        updatePaginator($scope.paginator[0]+1);
    }

    /**
     * Agrega un resultado al listado que el usuario quiere conocer mejor
     * @param index Número del resultado dentro del listad que está mostrando
     * @param result Resultado seleccionado
     */
    $scope.selectResult = function(index, result) {
        sessionSvc.options.push(result);
        $scope.response.docs.splice(index, 1);
    }

    /**
     * Retorna las opciones seleccionadas en la sesión de búsqueda
     */
    $scope.getOptions = function () {
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
        return getPriceNumber(price) > 0;
    }

    /**
     * Retorna la cantidad presente en el campo precio de un resultado de SOLR
     * @param price El precio en formato SOLR
     */
    getPriceNumber = function(price) {
        return Number(price.slice(0, price.indexOf(",")));
    }

    /**
     * Muestra más información acerca de un resultado seleccionado por el usuario
     * @param result Resultado seleccionado
     */
    $scope.showMoreResult = function (result) {
        $scope.selectedResult = result;
    }

    /**
     * Busca todas las opciones de un restaurante seleccionado por el usuairo
     * @param restaurant El restaurante seleccionado
     */
    $scope.searchByPlace = function(place) {
        $scope.query.text = "*";
        $scope.query.places = [];
        $scope.query.places.push(place);
        $scope.query.start = 0;
        runQuery();
    }

    init();

}])
;
