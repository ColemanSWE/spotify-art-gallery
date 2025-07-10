# Digital Portfolio Gallery

A 3D digital portfolio showcase built with React, Three.js, and Node.js. Create immersive gallery spaces to display your work, achievements, and projects in a brutalist-inspired 3D environment.

## Features

- **3D Portfolio Galleries**: Walk through immersive 3D spaces showcasing your work
- **Multiple Room Types**: Organize content by achievements, projects, influences, skills, experience, and personal items
- **Brutalist Design**: Clean, geometric aesthetic with bold colors and typography
- **Interactive Navigation**: First-person camera controls with smooth movement
- **User Authentication**: Secure user accounts and gallery management
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

### Frontend
- React 18 with TypeScript
- Three.js for 3D graphics
- React Three Fiber for React/Three.js integration
- React Three Drei for 3D utilities
- Axios for API communication

### Backend
- Node.js with Express
- TypeScript
- Sequelize ORM with SQLite/PostgreSQL
- JWT authentication
- RESTful API design

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd 3dArtProject
```

2. Install dependencies for both frontend and backend:
```bash
npm install
cd packages/frontend && npm install
cd ../api && npm install
```

3. Set up environment variables:
```bash
# In packages/api/.env
PORT=3001
JWT_SECRET=your-secret-key
DATABASE_URL=sqlite:./database.sqlite

# In packages/frontend/.env
REACT_APP_API_URL=http://localhost:3001/api
```

4. Start the development servers:
```bash
# Start backend (from packages/api)
npm run dev

# Start frontend (from packages/frontend) 
npm start
```

## Usage

### Creating Galleries
1. Register an account
2. Create a new gallery with a title, description, and room type
3. Add portfolio items with images, descriptions, and metadata
4. Customize the 3D positioning and styling

### Gallery Types
- **Achievements**: Awards, certifications, milestones
- **Projects**: Code repositories, applications, designs
- **Influences**: Books, mentors, inspirations
- **Skills**: Technical abilities, languages, tools
- **Experience**: Work history, internships, roles
- **Personal**: Hobbies, interests, life events

### Navigation
- **Mouse**: Look around the 3D space
- **Scroll**: Zoom in/out
- **WASD**: Move around (when first-person mode is enabled)
- **ESC**: Pause menu

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Galleries
- `GET /api/galleries/public` - Get public galleries
- `GET /api/galleries/my-galleries` - Get user's galleries
- `GET /api/galleries/:id` - Get specific gallery
- `POST /api/galleries` - Create gallery
- `PUT /api/galleries/:id` - Update gallery
- `DELETE /api/galleries/:id` - Delete gallery

### Artworks
- `GET /api/artworks/my-artworks` - Get user's artworks
- `POST /api/artworks` - Create artwork
- `GET /api/artworks/:id` - Get specific artwork
- `PUT /api/artworks/:id` - Update artwork
- `DELETE /api/artworks/:id` - Delete artwork

## Deployment

### Frontend (Vercel)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Backend (Railway/Render)
1. Connect your GitHub repository
2. Set environment variables
3. Deploy and get the API URL
4. Update frontend environment variables

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details 