Based on the blog post 
Running Solr with Maven - http://www.petrikainulainen.net/programming/maven/running-solr-with-maven/
By Petri Kainulainen (http://www.petrikainulainen.net/)

CONFIGURATION:

- Open profiles/dev/config.properties
- Set the value of solr.home.directory property
- Update the Solr schema if necessary (this one haa a custom schema)

RUN:

- Run either mvn jetty:run or mvn:jetty:run-war
- Open browser and go to url: http://localhost:8983/solr/

El índice de SOLR debe tener por cada plato: 
1. Nombre
2. Descripción 
3. Precio
4. Restaurante
5. Categoría
6. URL 

MPV: 

Tener una página de búsqueda en la que yo pueda escribir una palabra y con esa palabra me encuentre los platos mas relevantes. 
Si me gusta el plato que encuentro hago click en él y me lleva a una página externa para terminar la compra. domicilios.com
