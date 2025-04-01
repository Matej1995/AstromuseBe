import fastify, { FastifyInstance } from 'fastify';
import cors from '@fastify/cors';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
// import authPlugin from './plugins/auth.js'; // Will be implemented later
import routes from './routes/index.js';
import { env } from './config/env.js';

export async function buildApp(): Promise<FastifyInstance> {
  const app = fastify({
    logger: {
      transport: env.nodeEnv === 'development'
        ? {
            target: 'pino-pretty',
            options: {
              translateTime: 'HH:MM:ss Z',
              ignore: 'pid,hostname',
            },
          }
        : undefined,
    },
  });

  // Register plugins
  await app.register(cors, {
    origin: true, // Should be restricted in production
    credentials: true,
  });

  // Register Swagger
  await app.register(swagger, {
    swagger: {
      info: {
        title: 'Astromuse API',
        description: 'API documentation for Astromuse',
        version: '1.0.0',
      },
      externalDocs: {
        url: 'https://swagger.io',
        description: 'More information about Swagger',
      },
      host: `localhost:${env.port}`,
      schemes: ['http'],
      consumes: ['application/json'],
      produces: ['application/json'],
    },
  });
  
  // Register Swagger UI
  await app.register(swaggerUi, {
    routePrefix: '/docs',
    uiConfig: {
      docExpansion: 'list',
      deepLinking: false
    },
  });

  // Authentication plugin will be implemented later
  // await app.register(authPlugin);

  // Register routes
  await app.register(routes, { prefix: '/api' });

  return app;
}