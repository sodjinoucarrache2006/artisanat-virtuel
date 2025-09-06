# Première étape : on utilise une image de base pour PHP et Nginx
FROM php:8.2-fpm-alpine

# Installe les dépendances système nécessaires
RUN apk update && apk add --no-cache \
    nginx \
    supervisor \
    openssl \
    libzip-dev \
    libpng-dev \
    jpeg-dev \
    git \
    npm

# Installe les extensions PHP
RUN docker-php-ext-install pdo_mysql opcache bcmath gd

# Configure Nginx
COPY ./nginx.conf /etc/nginx/http.d/default.conf

# Définit le répertoire de travail
WORKDIR /var/www/html

# Copie le code de l'application
COPY . .

# Installe Composer et les dépendances du projet
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer
RUN composer install --no-dev --optimize-autoloader

# Crée le fichier .env
RUN cp .env.example .env

# Exécute les commandes d'artisan pour la production
RUN php artisan cache:clear
RUN php artisan config:cache
RUN php artisan route:cache
RUN php artisan view:cache

# Démarre Nginx et PHP-FPM avec Supervisor
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]

# Expose le port 80 pour que Nginx puisse être accessible
EXPOSE 80