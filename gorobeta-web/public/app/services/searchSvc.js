angular.module('goro-app').

service('searchSvc', ['$http', function( $http ) {

    /**
     * Ejecuta en al backend un query dado unos criterios de búsqueda
     * @param query Objeto que encapsula los criterios de búsqueda
     * @returns {Array} Arreglo de resultados de la búsqueda
     */
    this.runQuery = function(query) {
        return createDummyResponse(query);
    }

    /**
     * Crea un resultado de query de prueba con valores aleatorios
     * @param query Definición de la búsqueda solicitada por el usuario
     * @returns {Array} Arreglo de resultados de la búsqueda
     */
        //TODO: eliminar cuando esté listo el llamado al servicio
    createDummyResponse = function(query) {
        //inicializa la estructura donde se almacena la respuesta del query
        var queryResponse = {
            //cantidad total de registros existentes por el motor de búsqueda
            'total' : Math.floor(Math.random()*120),
            //registros que arroja el query dados los parámetros del mismo
            'results' : []
        };

        //valores aleatorios
        var names = ["Botanas Viva México",
            "Pizza del huerto",
            "Stir fry a la pimienta verde",
            "Lomo siam",
            "Stir fry agridulce"
        ];
        var descriptions = ["Cortes de grouper marinado en limon y chile de arbol acompañado de nuestra salsa bandera con crujientes de tortilla de harina y rodajas de limon botanas",
            "Napolitana, tres quesos con alcachofas, rúgula, champiñones, jamón y salsa de anchóas",
            "Lomo de res, pimentones rojos, cebolla roja, chile, salsa de ostras, salsa soya y albahaca siam. Servido con arroz jazmín o integral",
            "Pollo, piña, cebolla roja, pimentón verde, pepino europeo, salsa de ostras, salsa agria, salsa soya y aceite de ajonjolí. Servido con arroz jazmín o integral. Con lomo de cerdo",
            "Pimienta verde del Putumayo salteada al wok con cebolla roja, tomate, pepino europeo, salsa soya, salsa de ostras y cebollín. Servido con arroz jazmín o integral. Con lomo de res"
        ];
        var maxPrice = (query.price)? query.price : 50000;
        var tags = ["Pizza", "Italiana", "Internacional", "Thai", "Wok"];
        var places = ["Mi calle", "Wok", "Crepes & Waffles", "Chicanos", "Fridays"];

        //crea aleatoriamente la cantidad de resultados que se indique
        for(i=1; i <= query.pageSize; i++){
            var random = Math.floor(Math.random()*names.length);
            var result = {
                'name': names[random],
                'description': descriptions[random],
                'price': Math.floor(Math.random()*maxPrice),
                'place': (query.places.length > 0)? query.places[0] : places[random],
                'tags': [],
                'id': i,
                'selected': false
            }
            //crea los tags
            result.tags = query.tags.slice(0);
            for(t=1; t<=random; t++) {
                var tag = tags[Math.floor(Math.random()*tags.length)];
                if (result.tags.indexOf(tag) == -1) {
                    result.tags.push(tag);
                }
            }
            queryResponse.results.push(result);
        }
        return queryResponse;
    }

    /**
     * Consulta la información adicional para una de las opciones seleccionadas por el usuario
     * @param option Una de las opciones seleccionadas
     */
    this.completeOptionDescription = function(option) {
        //TODO remplazar con llamado a servicio
        var friends = [
            {'name': "Javier Rodriguez", 'url': "https://www.facebook.com/javier.supelano"},
            {'name': "Andrés Lozano", 'url': "https://www.facebook.com/javier.supelano"},
            {'name': "Carlos Rodriguez", 'url': "https://www.facebook.com/javier.supelano"},
            {'name': "Gabriel Rocha", 'url': "https://www.facebook.com/javier.supelano"},
            {'name': "Juan Perez", 'url': "https://www.facebook.com/juan.p.morales"}
        ];
        var delivery_services = [
            {'name' : "Rappi", "url" : "http://www.rappi.com"},
            {'name' : "Kiwi", "url" : "http://dileakiwi.com/"},
            {'name' : "Domicilios.com", "url" : "http://domicilios.com/bogota"}
        ];

        //amigos del usuario que han pedido o dado like a la opción
        var numFriends = Math.floor(Math.random()*friends.length);
        option.friends = [];
        for(f=0; f < numFriends; f++)
            option.friends.push(friends[f]);
        //proveedores de domicilios disponibles para la opción
        var numServices = Math.floor(Math.random()*delivery_services.length);
        option.delivery_services = [];
        for(s=0; s < numServices; s++)
            option.delivery_services.push(delivery_services[s]);
        //condiciones y restricciones de la opción
        if (numFriends%2 == 0)
            option.conditions = "Solo disponible los fines de semana";
        //complemento de la descripción de la opción
        if (numServices%2 == 1)
            option.desc_comments = "Se puede pedir con lomo, pollo, cerdo o tofú, y el precio varia de acuerdo con la proteina elegida.";
    }


}]);