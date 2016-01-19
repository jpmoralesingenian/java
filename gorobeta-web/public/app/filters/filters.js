angular.module('goro-filters', [])
    .filter("solrPrice", function() {
        return function (input) {
            return input.slice(0, input.indexOf(","));
        }
    })
    .filter("capitalizedName", function() {
        return function (input) {
            return input.substring(0, 1).toUpperCase().concat(input.substring(1, input.length).toLowerCase());
        }
    })
;