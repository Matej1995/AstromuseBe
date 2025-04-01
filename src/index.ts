import fastify from 'fastify';
import { env } from './config/env';

// Vytvoření Fastify instance
const server = fastify({
  logger: true
});

// Definice základního route
server.get('/', async (request, reply) => {
  return { message: 'Hello from Fastify and TypeScript!', env: env.nodeEnv };
});

// Vytvoření jednoduchého health checkpointu
server.get('/health', async (request, reply) => {
  return { 
    status: 'ok', 
    timestamp: new Date(),
    env: env.nodeEnv
  };
});

// Spuštění serveru
const start = async () => {
  try {
    await server.listen({ port: env.port, host: '0.0.0.0' });
    console.log(`🚀 Server běží na http://localhost:${env.port}`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();