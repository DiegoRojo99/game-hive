# Game Hive - Steam Gaming Hub

A modern web application that integrates with Steam to provide a personalized gaming experience. View your Steam library, track achievements, and manage your gaming profile all in one place.

**Live Demo**: https://play-hive.vercel.app

## Features

- 🎮 **Steam Authentication**: Login with your Steam account using OpenID 2.0
- 📚 **Game Library**: View your complete Steam game collection with playtime stats
- 🏆 **Achievement Tracking**: Browse and filter achievements across all your games
- 🔍 **Game Filtering**: Filter games and achievements by title
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile devices
- ⚡ **Real-time Data**: Live integration with Steam Web API

## Technologies Used

- **Frontend**: Vite + React + TypeScript
- **Styling**: Tailwind CSS + shadcn/ui components
- **Authentication**: Steam OpenID 2.0
- **Data Fetching**: TanStack Query (React Query)
- **API Integration**: Steam Web API
- **Deployment**: Vercel with serverless functions
- **State Management**: React Context API

## Setup & Development

### Prerequisites
- Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)
- Steam Web API key - [Get your key here](https://steamcommunity.com/dev/apikey)

### Local Development

```sh
# Clone the repository
git clone https://github.com/DiegoRojo99/game-hive.git

# Navigate to the project directory
cd game-hive

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Add your Steam API key to .env
VITE_STEAM_API_KEY=your_steam_api_key_here

# Start development server
npm run dev
```

### Environment Variables

For production deployment, set these environment variables:
- `VITE_STEAM_API_KEY`: Your Steam Web API key

### Deployment

The project is configured for deployment on Vercel:
1. Connect your GitHub repository to Vercel
2. Set the `VITE_STEAM_API_KEY` environment variable in Vercel dashboard
3. Deploy automatically on push to main branch

## API Endpoints

- `/api/steam` - Steam Web API proxy (handles CORS)
- `/api/test` - Health check and environment validation

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/ae2fde84-941a-471b-8da0-ac6c108cfe9b) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
