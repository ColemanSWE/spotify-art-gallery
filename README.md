# Spotify 3D Art Gallery

A 3D art gallery application that allows users to sign in to Spotify, retrieve their top albums, and display them as 3D assets with album covers as textures.

## Project Structure

This is a monorepo containing both the backend API and frontend application:

```
spotify-3d-art-gallery/
├── packages/
│   ├── api/           # Backend API (Node.js/Express/TypeScript)
│   └── frontend/      # Frontend React App (React/TypeScript)
├── package.json       # Root package.json with workspace configuration
└── README.md          # This file
```

## Features

- **Spotify Integration**: Sign in with Spotify and retrieve user's top albums
- **3D Visualization**: Display albums as 3D assets in a virtual gallery
- **Album Cover Textures**: Use actual album artwork as textures on 3D objects
- **RESTful API**: Backend API for handling Spotify authentication and data

## Technology Stack

### Backend (`packages/api`)
- Node.js
- Express
- TypeScript
- Jest (testing)
- MongoDB (database)

### Frontend (`packages/frontend`)
- React
- TypeScript
- Three.js (3D graphics)
- Create React App

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- MongoDB (for the API)

### Installation

1. Clone the repository
2. Install dependencies for all packages:
   ```bash
   npm run install:all
   ```

### Development

To run both the API and frontend in development mode:
```bash
npm run dev
```

To run them individually:
```bash
# Run API only
npm run dev:api

# Run frontend only
npm run dev:frontend
```

### Building

To build both packages:
```bash
npm run build
```

### Testing

To run tests for both packages:
```bash
npm run test
```

## Package Details

### API (`packages/api`)
- **Port**: 3001 (default)
- **Database**: MongoDB
- **Authentication**: Spotify OAuth
- **Endpoints**: User management, artwork retrieval, gallery management

### Frontend (`packages/frontend`)
- **Port**: 3000 (default)
- **Framework**: React with TypeScript
- **3D Library**: Three.js
- **Styling**: CSS modules

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Commit your changes
6. Push to your fork
7. Create a Pull Request

## License

MIT 