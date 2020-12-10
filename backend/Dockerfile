FROM php:7.4-cli AS php
COPY . /usr/src/app

WORKDIR /usr/src/app

FROM composer:2.0.7
WORKDIR /app
COPY --from=php /usr/src/app /app/

RUN composer install

EXPOSE 3000

ENTRYPOINT php -S 0.0.0.0:3000 -t public
