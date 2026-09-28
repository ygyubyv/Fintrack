#!/bin/sh
set -e

CERT_DIR="/etc/letsencrypt/live/${APP_DOMAIN}"

if [ ! -f "$CERT_DIR/fullchain.pem" ]; then
  echo "No certificate found for ${APP_DOMAIN}, generating a temporary self-signed one..."
  mkdir -p "$CERT_DIR"
  openssl req -x509 -nodes -newkey rsa:2048 -days 1 \
    -keyout "$CERT_DIR/privkey.pem" \
    -out "$CERT_DIR/fullchain.pem" \
    -subj "/CN=localhost"
fi

for f in /docker-entrypoint.d/*.sh; do
  [ -x "$f" ] && "$f"
done

nginx -g "daemon off;" &
NGINX_PID=$!

trap "kill -TERM $NGINX_PID" TERM INT

while :; do
  sleep 10m &
  wait $!
  nginx -s reload
done &

wait $NGINX_PID
