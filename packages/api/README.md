# Art Gallery API

This is an API for managing an art gallery, allowing users to register, log in, and manage artworks and galleries. Built with Node.js, Express, Sequelize, and SQLite for the backend, and includes testing with Jest and Supertest.

## Table of Contents

- [Getting Started](#getting-started)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Server](#running-the-server)
- [API Endpoints](#api-endpoints)
- [Testing](#testing)
- [Technologies Used](#technologies-used)
- [License](#license)

## Getting Started

These instructions will help you set up and run the project on your local machine for development and testing purposes.

### Prerequisites

Ensure you have the following installed:

- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/)
- [SQLite3](https://www.sqlite.org/)

## Installation

### Clone the repository:

```bash
git clone https://github.com/your-username/art-gallery-api.git
cd art-gallery-api
```

###  Install the dependencies:

```bash

npm install
```
### Configuration

Create a .env file in the root directory and add the following environment variables:

```env

PORT=3000
MONGO_URI=mongodb://localhost:27017/virtual-art-gallery
JWT_SECRET=your_jwt_secret
```

Replace your_jwt_secret with a secret key of your choice.

### Running the Server

To start the server, run:

```bash

npm start
```

The server will start on the port specified in the .env file (default is 3000).
API Endpoints
Users

```bash

POST /api/users/register
```

Request body:

```json

{
  "username": "newuser",
  "email": "newuser@example.com",
  "password": "password123"
}
```

Response:

```json

{
  "message": "User registered successfully"
}
```

Login a user

```bash

POST /api/users/login
```

Request body:

```json

{
  "email": "testuser@example.com",
  "password": "password123"
}
```

Response:

```json

    {
      "token": "your_jwt_token"
    }
```
Artworks

    Upload a new artwork

```bash

POST /api/artworks
```
Request body:

```json

{
  "title": "Mona Lisa",
  "description": "A portrait painting by Leonardo da Vinci",
  "imageUrl": "http://example.com/monalisa.jpg",
  "createdBy": 1
}
```
Response:

```json

{
  "message": "Artwork uploaded successfully"
}
```
Fetch all artworks

```bash

GET /api/artworks
```
Response:

```json

[
  {
    "id": 1,
    "title": "Mona Lisa",
    "description": "A portrait painting by Leonardo da Vinci",
    "imageUrl": "http://example.com/monalisa.jpg",
    "createdBy": 1,
    "createdAt": "2021-01-01T00:00:00.000Z",
    "updatedAt": "2021-01-01T00:00:00.000Z"
  }
]
```
Delete an artwork

```bash

DELETE /api/artworks/:id
```
Response:

```json

    {
      "message": "Artwork deleted successfully"
    }
```
Galleries

    Create a new gallery

```bash

POST /api/galleries
```
Request body:

```json

{
  "name": "Modern Art Gallery",
  "description": "A gallery of modern art",
  "createdBy": 1
}
```
Response:

```json

    {
      "message": "Gallery created successfully"
    }
```
### Testing

To run the tests, use:

```bash

npm test
```
This will run the tests using Jest and Supertest.

### Technologies Used

    Node.js
    Express
    Sequelize
    SQLite
    Jest
    Supertest
    bcryptjs
    jsonwebtoken

## License

This project is licensed under the MIT License - see the LICENSE file for details.
