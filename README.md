# DoVEs + Apache Guacamole  
### Środowisko laboratoryjne oparte o Docker

Projekt udostępnia kompletne środowisko laboratoryjne umożliwiające
tworzenie i zarządzanie laboratoriami z wieloma maszynami,
z dostępem SSH realizowanym **bezpośrednio z przeglądarki** za pomocą
**Apache Guacamole**.

Całość działa w kontenerach Docker i jest udostępniona przez
jeden punkt wejścia (nginx reverse proxy).

---

## ✨ Funkcjonalności

- tworzenie laboratoriów z wieloma maszynami
- dostęp SSH przez przeglądarkę (Guacamole)
- centralne zarządzanie labami (DoVEs)
- brak konieczności instalowania klientów SSH
- jedno wejście HTTP (`nginx`)
- obsługa WebSocket (wymagana przez Guacamole)
- konfiguracja przez plik `.env`
- brak twardo wpisanych adresów IP w kodzie

---

## 🧱 Architektura
[ Przeglądarka ]
|
v
[ nginx :8080 ]
|
| --> /guacamole --> Apache Guacamole
|
+--> /api --> DoVEs backend
|
+--> / --> DoVEs frontend

- wszystkie komponenty działają w Dockerze
- komunikacja wewnętrzna odbywa się po nazwach serwisów
- Guacamole dostępne wyłącznie przez nginx

---

## 📦 Wymagania

- Linux (testowane na openSUSE)
- Docker
- Docker Compose v2
- Git

---

## ▶️ Uruchomienie projektu

```bash
git clone https://github.com/TWOJ_LOGIN/doves-guacamole-labs.git
cd doves-guacamole-labs
docker compose up -d
Dostęp do aplikacji

Panel DoVEs

http://localhost:8080


Apache Guacamole

http://localhost:8080/guacamole

🔐 Domyślne dane logowania
nginx (Basic Auth – DoVEs)

użytkownik: admin

hasło: qazwsx

Apache Guacamole

użytkownik: guacadmin

hasło: zgodne z konfiguracją kontenera

🔌 Konfiguracja Login Provider (Guacamole)

W panelu DoVEs:

Type: Guacamole

API URL:

http://proxy/guacamole/api


Uwaga:
Endpoint /guacamole/api jest wymagany.
Wskazanie /guacamole spowoduje błąd (HTML zamiast JSON).

🔧 Konfiguracja przez plik .env

Projekt wykorzystuje plik .env do centralnego zarządzania
konfiguracją środowiska.

Docker Compose:

automatycznie wczytuje .env

podstawia zmienne tylko tam, gdzie użyto ${ZMIENNA}

nie nadpisuje wartości wpisanych na stałe w docker-compose.yml

Hierarchia ważności:

docker-compose.yml (wartości stałe)
    > .env
        > zmienne systemowe

📄 Zmienne w pliku .env
🔑 SSH / dostęp do hosta
DOCKER_SSH_HOST=192.168.68.64


Adres hosta, na którym Docker tworzy maszyny laboratoryjne.

DOCKER_SSH_USER=lucyna


Użytkownik systemowy używany do połączeń SSH.

DOCKER_SSH_KEY=/data/id_rsa


Ścieżka do klucza SSH wewnątrz kontenera backendu.

🧪 Laboratoria
LAB_PATH=/home/lucyna/Docker_lab_v2/labs/lab-data


Katalog na hoście, w którym przechowywane są dane laboratoriów.

DOCKER_COMPOSE_CREATE_SCRIPT=/home/lucyna/Docker_lab_v2/labs/up.sh


Skrypt tworzący maszyny laboratoryjne.

DOCKER_COMPOSE_TEAR_DOWN_SCRIPT=/home/lucyna/Docker_lab_v2/labs/down.sh


Skrypt usuwający laboratorium.

DOCKER_COMPOSE_REBUILD_MACHINE_SCRIPT=/home/lucyna/Docker_lab_v2/labs/reset.sh


Skrypt resetujący maszyny laboratoryjne.

🌐 Frontend (React)
REACT_APP_DOVES_API_URL=/api


Adres API DoVEs używany przez frontend.

⚠️ Zmienne REACT_APP_* są wczytywane tylko podczas builda
Zmiana wymaga ponownego buildu:

docker compose build --no-cache frontend

🔐 nginx (Basic Auth)
USERNAME=admin
PASSWORD=qazwsx


Dane logowania do panelu DoVEs zabezpieczonego przez nginx.

🌐 nginx i WebSocket (Guacamole)

Apache Guacamole wymaga obsługi WebSocket.
Konfiguracja nginx zawiera m.in.:

proxy_http_version 1.1;
proxy_set_header Upgrade $http_upgrade;
proxy_set_header Connection "upgrade";
proxy_read_timeout 3600s;
proxy_send_timeout 3600s;


Bez tej konfiguracji:

pojedyncze sesje mogą działać

wiele sesji SSH będzie się zawieszać

🖥️ Laboratoria i SSH

każda maszyna laboratoryjna działa jako kontener Docker

dostęp SSH realizowany przez Guacamole

możliwe równoległe połączenia do wielu maszyn

brak konieczności wystawiania portów SSH na hosta

🛠️ Debugowanie
Logi backendu DoVEs
docker logs docker_lab_v2-backend-1

Test API Guacamole
curl http://localhost:8080/guacamole/api/session/data/mysql/self


Odpowiedź PERMISSION_DENIED oznacza, że API działa poprawnie.

📚 Możliwe rozszerzenia

HTTPS (Let’s Encrypt)

JWT zamiast Basic Auth

LDAP / Active Directory

automatyczne generowanie kluczy SSH

profile dev / prod

Kubernetes / Docker Swarm

👩‍💻 Autor

Projekt przygotowany jako środowisko:

dydaktyczne

laboratoryjne

demonstracyjne

z naciskiem na:

Docker i sieci kontenerowe

reverse proxy

dostęp przez przeglądarkę

automatyzację laboratoriów


---

Jeśli chcesz, w kolejnym kroku mogę:
- przygotować **`.env.example`**
- zrobić **README „dla studentów”**
- dodać **diagram Mermaid**
- uporządkować repozytorium pod publikację

To README jest już **w pełni profesjonalne** i gotowe na GitHuba ✔

