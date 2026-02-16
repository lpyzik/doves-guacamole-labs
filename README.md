# DoVEs
 ## Spis treści
- [Opis](#opis)
- [Instalacja](#instalacja)
  - *[Wymagania](#wymagania)*
  - *[Kroki instalacji](#kroki-instalacji)*
- [Użycie](#użycie)
- [FAQ](#faq)
## Opis
- ### **Co to jest DoVES?**

  DoVEs - Docker Virtual Environments jest oprogramowaniem do tworzenia środowiska wirtualnego i połączenia go ze dostawcą zdalnego dostępu do tego środowiska za pomocą np. Apache Guacamole

- ### **What is DoVEs?**

    DoVEs - Docker Virtual Environments is a software for creating virtual environments, and seamlessly linking them to remote access providers, such as Apache Guacamole.

## Instalacja
- ### *Wymagania*
    Na serwerze musi być zainstalowana i uruchomiona usługa *docker* oraz zainstalowane oprogramowanie *docker-compose*. By uruchomić poszczególne kontenery projektu użytkownik musi należeć do grupy *docker*. 
  - #### Struktura katalogów
    W katalogu labs utwórz katalog lab-data. Upewnij się że skrypty w katalogu labs up.sh down.sh i restet.sh mają uprawnienia dla wszystkich użytkowników

- ### *Kroki instalacji*ściągamy 
  1. Tworzenie katalogu projektu

     - Najlepiej w katalogu domowym użytkownika tworzymy katalog projektu o nazwie np. DoVEs Przechodzimy do tego katalogu i poleceniem git-a ściągamy do tego katalogu projekt.  
## Environment variables in DoVEs frontend

- `REACT_APP_TITLE` - title of the app, as displayed in browser tab.
- `REACT_APP_DESCRIPTION` - description of the app, in `<meta name="description" />`.
- `REACT_APP_DOVES_API_URL` - URL to DoVEs backend. exemple http://192.168.1.103:8080/api port is port from DoVEs backend container



## Environment variables in DoVEs backend

- `MONGO_URI` - MongoDB database connection URI.
- `DOCKER_VIA` - method of Docker daemon access. Either `local` for Docker daemon on host, or `ssh` for remote access via SSH.
- `DOCKER_SOCKET_PATH` - path to Docker socket. Required if `DOCKER_VIA` is `local`.
- `DOCKER_SSH_HOST` - remote Docker host address. Required if `DOCKER_VIA` is `ssh`.
- `DOCKER_SSH_PORT` - remote Docker host SSH port, if `DOCKER_VIA` is `ssh`. Defaults to `22`.
- `DOCKER_SSH_USERNAME` - username for remote Docker host. Required if `DOCKER_VIA` is `ssh`.
- `DOCKER_SSH_KEY` - path to private key used to connect to remote Docker host. Required if `DOCKER_VIA` is `ssh`. 
- `LAB_PATH` - absolute path to directory containing lab data on Docker host. Required.
- `DOCKER_COMPOSE_CREATE_SCRIPT` - script used to set up a lab. It will operate in newly created directory in `LAB_PATH`, with `docker-compose.yml` present. Usually `docker-compose up -d` will be enough.
- `DOCKER_COMPOSE_TEAR_DOWN_SCRIPT` - script used to tear down a lab. It will operate in lab directory in `LAB_PATH`, with `docker-compose.yml` present. Usually `docker-compose down` will be enough.
- `DOCKER_COMPOSE_REBUILD_MACHINE_SCRIPT` - script used to rebuild a single machine. It will operate in lab directory in `LAB_PATH`, provided with one argument, namely the name of the machine to be rebuilt. Usually `docker-compose up -d --build $1` will be enough.
- `LP_DEFAULT_PASSWORD` - default password for newly created login provider users. Defaults to `password`.

## Known issues

- If the Docker host is down or otherwise inaccessible, and a request involving `node-docker-api` is made, the app will crash. There is nothing I can do about that.