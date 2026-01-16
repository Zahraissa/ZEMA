# Use official PHP image with extensions needed for Laravel
FROM php:8.2-cli

# Set working directory
WORKDIR /var/www/html

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    unzip \
    libzip-dev \
    && docker-php-ext-install zip pdo pdo_mysql

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Copy project files
COPY . .

# Install PHP dependencies
RUN composer install



# Expose port
EXPOSE 8080

# Command to run Laravel server
CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8080"]
