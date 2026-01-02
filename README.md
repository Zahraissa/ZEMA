## Project info



## How can I edit this code?

There are several ways of editing your application.



**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in egaz.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?



## Can I connect a custom domain to my egaz project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.



## API Configuration

This project uses centralized API configuration for easy switching between development and production environments.

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Development (default)
VITE_API_BASE_URL=http://localhost:8000/api/
VITE_STORAGE_BASE_URL=http://localhost:8000/storage/

# Production
# VITE_API_BASE_URL=http://102.214.44.122:8080/api/
# VITE_STORAGE_BASE_URL=http://102.214.44.122:8080/storage/
```

### Configuration File

The main configuration is in `src/config.ts`:

```typescript
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/';
export const STORAGE_BASE_URL = import.meta.env.VITE_STORAGE_BASE_URL || 'http://localhost:8000/storage/';
```

### Usage

Import the configuration in your components:

```typescript
import { API_BASE_URL, STORAGE_BASE_URL } from '@/config';

// For API calls
const response = await fetch(`${API_BASE_URL}endpoint`);

// For storage URLs (images, files)
const imageUrl = `${STORAGE_BASE_URL}path/to/image.jpg`;
```

### Switching Environments

- **Development**: Use the default localhost URLs
- **Production**: Set the environment variables to your production server URLs
- **Staging**: Create a `.env.staging` file with staging server URLs
