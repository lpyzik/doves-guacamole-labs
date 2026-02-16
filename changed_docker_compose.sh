#!/bin/bash

# Funkcja do wczytywania zmiennych z pliku
read_from_file() {
    echo "Podaj ścieżkę do pliku z danymi:"
    read file_path
    if [[ -f "$file_path" ]]; then
        source "$file_path"
    else
        echo "Plik nie istnieje. Spróbuj ponownie."
        exit 1
    fi
}

# Funkcja do wprowadzania zmiennych ręcznie
read_from_keyboard() {
    echo "Wprowadź nową wartość dla DOCKER_SSH_HOST (np. 192.168.1.104):"
    read DOCKER_SSH_HOST
    echo "Wprowadź nową wartość dla DOCKER_SSH_USER (np. nowy_user):"
    read DOCKER_SSH_USER
    echo "Wprowadź ścieżkę woluminu (np. /path/to/data):"
    read DOCKER_CUSTOM_VOLUME
    echo "Wprowadż ścieżkę bezwzględną do LAB_PATH"
    read LAB_PATH
    echo "Wprowadź nową wartość dla DOCKER_COMPOSE_CREATE_SCRIPT:"
    read DOCKER_COMPOSE_CREATE_SCRIPT
    echo "Wprowadź nową wartość dla DOCKER_COMPOSE_TEAR_DOWN_SCRIPT:"
    read DOCKER_COMPOSE_TEAR_DOWN_SCRIPT
    echo "Wprowadź nową wartość dla DOCKER_COMPOSE_REBUILD_MACHINE_SCRIPT:"
    read DOCKER_COMPOSE_REBUILD_MACHINE_SCRIPT
    echo "Wprowadź nową wartość dla LP_DEFAULT_PASSWORD:"
    read LP_DEFAULT_PASSWORD
    echo "Wprowadź nową wartość dla REACT_APP_DOVES_API_URL:"
    read REACT_APP_DOVES_API_URL
    echo "Wprowadź nazwę administratora panelu zmienna USERNAME:"
    read USERNAME
    echo "Wprowadź hasło administratora panelu:"
    read PASSWORD
}

# Funkcja do aktualizacji pliku docker-compose.yml
update_docker_compose() {
    local file="docker-compose.yml"
    local target="/data/id_rsa:ro"
    if [[ ! -f "$file" ]]; then
        echo "Plik docker-compose.yml nie istnieje!"
        exit 1
    fi
   
   if grep -q "$target" "$file"; then
        sed -i "s|[^ ]*:$target|${DOCKER_CUSTOM_VOLUME}:$target|" "$file"
        echo "Wpis woluminu został zaktualizowany."
    else
        echo "Wpis woluminu nie istnieje, nie można wykonać zamiany."
    fi
    sed -i \
        -e "s|DOCKER_SSH_HOST=.*|DOCKER_SSH_HOST=${DOCKER_SSH_HOST}|" \
        -e "s|DOCKER_SSH_USER=.*|DOCKER_SSH_USER=${DOCKER_SSH_USER}|" \
        -e "s|LAB_PATH=.*|LAB_PATH=${LAB_PATH}|" \
        -e "s|DOCKER_COMPOSE_CREATE_SCRIPT=.*|DOCKER_COMPOSE_CREATE_SCRIPT=${DOCKER_COMPOSE_CREATE_SCRIPT}|" \
        -e "s|DOCKER_COMPOSE_TEAR_DOWN_SCRIPT=.*|DOCKER_COMPOSE_TEAR_DOWN_SCRIPT=${DOCKER_COMPOSE_TEAR_DOWN_SCRIPT}|" \
        -e "s|DOCKER_COMPOSE_REBUILD_MACHINE_SCRIPT=.*|DOCKER_COMPOSE_REBUILD_MACHINE_SCRIPT=${DOCKER_COMPOSE_REBUILD_MACHINE_SCRIPT}|" \
        -e "s|LP_DEFAULT_PASSWORD=.*|LP_DEFAULT_PASSWORD=${LP_DEFAULT_PASSWORD}|" \
        -e "s|REACT_APP_DOVES_API_URL.*|REACT_APP_DOVES_API_URL=${REACT_APP_DOVES_API_URL}|" \
        -e "s|USERNAME=.*|USERNAME=${USERNAME}|" \
        -e "s|PASSWORD=.*|PASSWORD=${PASSWORD}|" \
        "$file"
    

 
    echo "Plik docker-compose.yml został zaktualizowany."
}

# Główna logika
echo "Wybierz sposób wprowadzenia danych:"
echo "1) Wczytaj dane z pliku"
echo "2) Wprowadź dane ręcznie"

read choice

case $choice in
    1)
        read_from_file
        ;;
    2)
        read_from_keyboard
        ;;
    *)
        echo "Nieprawidłowy wybór."
        exit 1
        ;;
esac

update_docker_compose
