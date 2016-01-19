/**
 * Servicio utilizado para conservar los valores de sesión de un usuario para compartirlo a través de los
 * diferentes controladores de la aplicación
 */
angular.module('goro-app').factory('sessionSvc', function()
{

    var session = {
        //tamaño de las páginas de resultados
        PAGE_SIZE : 10,
        //criterios de búsqueda que ha ingresado en la opción "BUSCAR"
        query : {
            //texto de búsqueda
            text: "",
            //etiquetas con las que se clasifica el resultado
            tags: [],
            //sitios que ofrecen la opción
            places: [],
            //número del resultado inicial que se quiere ver (paginación)
            start: 0,
            pageSize: 10
        },
        //resultados de la búsqueda dado los criterios de búsqueda (query)
        queryResponse : {
            //cantidad total de registros existentes
            total : 0,
            //resultados del query
            results : []
        },
        //resultados que al usuario le han gustado y ha pre-seleccionado
        options : [],
        //resultados que al usuario le han gustado y ha seleccionado
        selectedOptions : [],
        //ciudades habilitadas para la búsqueda
        cities : ["Bogotá", "Medellín", "Cali"],
        priceRanges: [
            {sign:"", amount:"Cualquiera"},
            {sign:"<", amount:"15000"},
            {sign:"<", amount:"30000"},
            {sign:">", amount:"30000"}
            ]
    };
    return session;
});