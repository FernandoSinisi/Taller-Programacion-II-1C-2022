# demo-base

Base para otros servicios.

[![Coverage Status](https://coveralls.io/repos/github/edjeordjian/demo-users/badge.svg?branch=develop&t=8RwVJZ)](https://coveralls.io/github/edjeordjian/demo-users?branch=develop) 

## Para reutilizar este scaffolding
- Descargarse este repositorio y descomprimirlo
- Crear un nuevo repo con un readme y clonárselo
- Copiar el contenido descomprimido de este repositorio dentro del nuevo repo clonado (cuidado con los archivos ocultos). Ejemplo:
  * cp -R demo-base-master/* demo-gateway/
  * cp -R demo-base-master/.[a-z]* demo-gateway/
- git checkou -b develop
- Editar el readme para sacar estas instrucciones
- Cambiar en los env el puerto en el que se va a estar trabajando
- Cambiar la ruta de la badge de coveralls
- Instalar las dependencias con npm i (la primera vez, se puede dejar copiado el node modules junto con el resto de los archivos de este repositorio para no tener que instalarlos la próxima). 
- Pushear
- Agregar el secret para coveralls

### Instalación y configuración

- #### Local
    * `npm ci`
    * Como pre-requisito se debe tener levantada una base de PostgreSLQ que escuche en `localhost:5432`
    * `npm run startdev`

- #### Local con Docker Compose
```
docker-compose up --build
```

### Arquitectura

### [Bitácora y Postmortem](https://edjeordjian.github.io/bitacora/)
