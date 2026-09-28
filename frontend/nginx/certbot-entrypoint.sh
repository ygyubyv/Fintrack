#!/bin/sh

trap exit TERM

while :; do
  RENEWAL_CONF="/etc/letsencrypt/renewal/${APP_DOMAIN}.conf"

  if [ ! -f "$RENEWAL_CONF" ]; then
    echo "No certificate found for ${APP_DOMAIN}, requesting a new one..."
    rm -rf "/etc/letsencrypt/live/${APP_DOMAIN}" "/etc/letsencrypt/archive/${APP_DOMAIN}"

    if [ -n "$CERTBOT_EMAIL" ]; then
      EMAIL_ARG="--email $CERTBOT_EMAIL"
    else
      EMAIL_ARG="--register-unsafely-without-email"
    fi

    certbot certonly --webroot -w /var/www/certbot \
      -d "$APP_DOMAIN" \
      $EMAIL_ARG \
      --agree-tos --no-eff-email --non-interactive || true
  else
    certbot renew || true
  fi

  sleep 12h &
  wait $!
done
