#!/bin/sh
# Reemplaza variables de entorno en config.template.json y genera config.json
envsubst < /usr/share/nginx/html/config.template.json > /usr/share/nginx/html/config.json

# Ejecuta Nginx (u otro proceso) en primer plano
exec "$@"
