import { FastifyInstance, FastifyPluginAsync } from 'fastify';
// import authRoutes from './auth.js'; // Will be implemented later
import userRoutes from './users.js';

const routes: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  // Register user routes
  fastify.register(userRoutes, { prefix: '/users' });
  
  // Health check endpoint to verify API is running
  fastify.get('/health', async () => {
    return { 
      status: 'ok', 
      timestamp: new Date(),
      message: 'API is working'
    };
  });

  // Placeholder for auth routes, will be implemented later
  // fastify.register(authRoutes, { prefix: '/auth' });
};

export default routes;