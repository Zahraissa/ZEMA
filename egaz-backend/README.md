# Egaz Website Backend API

This is the Laravel backend API for the Egaz website CMS system. It provides RESTful APIs for managing website content including sliders, news articles, services, band members, about content, and menu management.

## Features

- **Authentication**: Laravel Sanctum for API authentication
- **Content Management**: Full CRUD operations for all content types
- **Image Upload**: File upload handling for images
- **Database**: SQLite database with migrations and seeders
- **CORS**: Configured for frontend communication
- **Validation**: Comprehensive input validation
- **API Documentation**: RESTful API endpoints

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd egaz-backend
   ```

2. **Install dependencies**
   ```bash
   composer install
   ```

3. **Environment setup**
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```

4. **Database setup**
   ```bash
   php artisan migrate:fresh --seed
   ```

5. **Storage setup**
   ```bash
   php artisan storage:link
   ```

6. **Start the server**
   ```bash
   php artisan serve
   ```

The API will be available at `http://localhost:8000/api`

## Default Users

The seeder creates two default users:

- **Admin User**: `admin@demo.com` / `admin123`
- **Demo User**: `demo@example.com` / `password`

## API Endpoints

### Authentication

- `POST /api/login` - User login
- `POST /api/register` - User registration
- `POST /api/logout` - User logout (authenticated)
- `GET /api/user` - Get current user (authenticated)

### Public Content Endpoints

#### Sliders
- `GET /api/sliders/active` - Get active sliders for website

#### News Articles
- `GET /api/news/published` - Get published articles
- `GET /api/news/featured` - Get featured articles
- `GET /api/news/categories` - Get article categories

#### Services
- `GET /api/services/active` - Get active services
- `GET /api/services/featured` - Get featured services
- `GET /api/services/categories` - Get service categories

#### Band Members
- `GET /api/band-members/active` - Get active band members

#### About Content
- `GET /api/about/active` - Get active about content
- `GET /api/about/sections` - Get about sections
- `GET /api/about/section/{section}` - Get content by section

#### Menu
- `GET /api/menu/structure` - Get complete menu structure

### Protected Management Endpoints (Require Authentication)

#### Sliders Management
- `GET /api/sliders` - List all sliders
- `POST /api/sliders` - Create new slider
- `GET /api/sliders/{id}` - Get specific slider
- `PUT /api/sliders/{id}` - Update slider
- `DELETE /api/sliders/{id}` - Delete slider
- `POST /api/sliders/reorder` - Reorder sliders

#### News Management
- `GET /api/news` - List all articles
- `POST /api/news` - Create new article
- `GET /api/news/{id}` - Get specific article
- `PUT /api/news/{id}` - Update article
- `DELETE /api/news/{id}` - Delete article

#### Services Management
- `GET /api/services` - List all services
- `POST /api/services` - Create new service
- `GET /api/services/{id}` - Get specific service
- `PUT /api/services/{id}` - Update service
- `DELETE /api/services/{id}` - Delete service

#### Band Members Management
- `GET /api/band-members` - List all members
- `POST /api/band-members` - Create new member
- `GET /api/band-members/{id}` - Get specific member
- `PUT /api/band-members/{id}` - Update member
- `DELETE /api/band-members/{id}` - Delete member
- `POST /api/band-members/reorder` - Reorder members

#### About Content Management
- `GET /api/about` - List all content
- `POST /api/about` - Create new content
- `GET /api/about/{id}` - Get specific content
- `PUT /api/about/{id}` - Update content
- `DELETE /api/about/{id}` - Delete content

#### Menu Management

**Menu Types**
- `GET /api/menu/types` - List menu types
- `POST /api/menu/types` - Create menu type
- `PUT /api/menu/types/{id}` - Update menu type
- `DELETE /api/menu/types/{id}` - Delete menu type

**Menu Groups**
- `GET /api/menu/groups` - List menu groups
- `POST /api/menu/groups` - Create menu group
- `PUT /api/menu/groups/{id}` - Update menu group
- `DELETE /api/menu/groups/{id}` - Delete menu group

**Menu Items**
- `GET /api/menu/items` - List menu items
- `POST /api/menu/items` - Create menu item
- `PUT /api/menu/items/{id}` - Update menu item
- `DELETE /api/menu/items/{id}` - Delete menu item

## Database Structure

### Tables

1. **users** - User authentication
2. **sliders** - Homepage slider content
3. **news_articles** - News and blog articles
4. **services** - Company services
5. **band_members** - Team/band member information
6. **about_content** - About page content sections
7. **menu_types** - Menu type definitions
8. **menu_groups** - Menu group definitions
9. **menu_items** - Individual menu items

### Relationships

- Menu Groups belong to Menu Types
- Menu Items belong to Menu Groups
- All content has status and ordering fields

## File Upload

The API supports image uploads for:
- Slider images
- News featured images
- Service images
- Band member photos
- About content images

Images are stored in the `storage/app/public` directory and accessible via `/storage/` URL.

## Authentication

The API uses Laravel Sanctum for authentication. To access protected endpoints:

1. Login via `POST /api/login`
2. Include the returned token in subsequent requests:
   ```
   Authorization: Bearer {token}
   ```

## Error Handling

The API returns consistent JSON responses:

**Success Response:**
```json
{
    "success": true,
    "message": "Operation successful",
    "data": {...}
}
```

**Error Response:**
```json
{
    "success": false,
    "message": "Error description",
    "errors": {...}
}
```

## Development

### Running Tests
```bash
php artisan test
```

### Database Migrations
```bash
php artisan migrate
php artisan migrate:rollback
php artisan migrate:fresh --seed
```

### Clearing Caches
```bash
php artisan config:clear
php artisan cache:clear
php artisan route:clear
```

## Frontend Integration

To connect your React frontend to this API:

1. Set the API base URL in your frontend configuration
2. Use the authentication endpoints for login/logout
3. Include the Bearer token in API requests
4. Handle the consistent JSON response format

Example API call:
```javascript
const response = await fetch('http://localhost:8000/api/sliders/active', {
    headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    }
});
const data = await response.json();
```

## Security

- All protected routes require authentication
- Input validation on all endpoints
- CORS configured for frontend communication
- File upload validation and storage
- SQL injection protection via Eloquent ORM

## License

This project is part of the Egaz website system.
