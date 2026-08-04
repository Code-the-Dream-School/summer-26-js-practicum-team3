import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';

//build instances of Router
const router = Router();

// 1. Define the basic API information
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'TodayEatz API Docs',
      version: '1.0.0',
      description:
        'Documentation for creating, reading, updating, and deleting recipes.',
    },
  },
  // 2. Point Swagger to the files where we will write our comments
  apis: ['./src/controllers/*.js'],
};

// 3. Build the data map behind the scenes
const swaggerSpec = swaggerJsdoc(options);

// 4. Set up the route to serve the visual webpage
// We use '/' here because the mount this router at '/api-docs' in app.js
router.use('/', swaggerUi.serve);
router.get('/', swaggerUi.setup(swaggerSpec));

export default router;
