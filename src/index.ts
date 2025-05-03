import { env } from './infrastructure/config/env.js';
import { testConnection, setupDatabase } from './infrastructure/db/index.js';
import { buildApp } from './app.js';

// Server startup function
const start = async () => {
  try {
    // Test database connection
    const isConnected = await testConnection();
    if (!isConnected) {
      console.log('⚠️ Proceeding without database, some features may not work.');
    } else {
      // Initialize database tables
      await setupDatabase();
    }
    
    // Build and start the application
    const app = await buildApp();
    
    // Add root route
    app.get('/', async () => {
      return { 
        message: 'Welcome to Astromuse API!', 
        env: env.nodeEnv,
        docs: `/docs` // Link to Swagger documentation
      };
    });
    
    // Start the server
    await app.listen({ port: env.port, host: '0.0.0.0' });
    console.log(`🚀 Server running at http://localhost:${env.port}`);
    console.log(`📚 Swagger documentation available at http://localhost:${env.port}/docs`);
  } catch (err) {
    console.error('❌ Server startup error:', err);
    process.exit(1);
  }
};

// Start the application
start();