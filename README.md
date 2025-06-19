# Backend API - Herbarium Management System

## Prerequisites
- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- Git

## Installation

1. Clone the repository
```bash
git clone https://github.com/josegabrielfc/api_herbario_ufps
cd backend
```

2. Install dependencies
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```env
# Server
PORT=3000
NODE_ENV=development

# Database
DATABASE_URL="postgresql://user:password@localhost:5432/mydatabase"

# JWT
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=24h

# Email (for password recovery)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=465
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_specific_password
```

4. Create required directories
```bash
mkdir -p uploads/plants/oldPlants
```

5. Run database migrations (if available)
```bash
# TODO: Add migration commands
```

## Development

To start the development server with hot-reload:
```bash
npm run dev
```

To build the project:
```bash
npm run build
```

## Project Structure
```
backend/
├── src/
│   ├── application/
│   │   └── use-cases/
│   ├── config/
│   ├── domain/
│   │   ├── entities/
│   │   └── repositories/
│   ├── infrastructure/
│   │   ├── controllers/
│   │   ├── implementations/
│   │   ├── middlewares/
│   │   └── routes/
│   └── main/
│       └── server.ts
├── uploads/
│   └── plants/
│       └── oldPlants/
├── .env
├── .gitignore
├── package.json
└── tsconfig.json
```

## API Documentation

### Authentication Endpoints
- POST `/auth/login` - User login
- POST `/auth/register` - Create new user
- POST `/auth/forgot-password` - Request password reset
- POST `/auth/validate-code` - Validate reset code
- PUT `/auth/update-password` - Update password

### Herbarium Management
- GET `/home/getHerbariums` - Get all herbarium types
- POST `/home/createHerbarium` - Create new herbarium type
- PUT `/home/updateHerbarium/:id` - Update herbarium type
- PATCH `/home/toggleHerbariumStatus/:id` - Toggle herbarium status
- PATCH `/home/softDelete/:id` - Soft delete herbarium

### Family Management
- GET `/home/getFamiliesById/:id` - Get families by herbarium type
- POST `/home/createFamily` - Create new family
- PUT `/home/updateFamily/:id` - Update family
- PATCH `/home/toggleFamilyStatus/:id` - Toggle family status
- PATCH `/home/softDeleteFamily/:id` - Soft delete family

### Plant Management
- GET `/home/getPlants` - Get all plants
- POST `/createPlant` - Create new plant
- PUT `/updatePlant/:id` - Update plant
- PATCH `/togglePlantStatus/:id` - Toggle plant status
- PATCH `/softDeletePlant/:id` - Soft delete plant

### Plant Image Management
- POST `/img/plants/:plantId` - Upload multiple plant images (max 3)
- GET `/img/getImgPlantsById/:plantId` - Get plant images
- GET `/img/getAllPlantImages` - Get all plants with their primary image
- PUT `/img/updateImage/:id` - Update plant image
- PATCH `/img/toggleImageStatus/:id` - Toggle image status
- PATCH `/img/softDeleteImage/:id` - Soft delete image

## Error Handling

The API uses standard HTTP response codes:
- 200: Success
- 400: Bad Request
- 401: Unauthorized
- 404: Not Found
- 500: Internal Server Error

## File Storage

Images are stored in the following locations:
- New images: `/uploads/plants/`
- Replaced images: `/uploads/plants/oldPlants/`

## Contributing

1. Create a new branch for your feature
2. Make your changes
3. Submit a pull request

## License

Este software fue desarrollado por Jose Gabriel Fuentes Chona como proyecto de grado para la Universidad Francisco de Paula Santander.

Su uso está restringido exclusivamente a la Universidad y no puede ser copiado, modificado ni distribuido sin autorización expresa del autor y de la Universidad.

Cualquier uso externo debe contar con aprobación por escrito.
