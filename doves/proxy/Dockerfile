FROM nginx:latest

COPY ./default.conf /etc/nginx/conf.d
COPY ./generate_htpasswd.sh /etc/nginx

ARG USERNAME
ARG PASSWORD

ENV USERNAME=${USERNAME}
ENV PASSWORD=${PASSWORD}

RUN apt update
RUN apt install -y openssl
RUN apt install -y apache2-utils

RUN chmod +x /etc/nginx/generate_htpasswd.sh
RUN /etc/nginx/generate_htpasswd.sh
