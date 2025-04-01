import { config } from 'dotenv';
import { join } from 'path';

// Load .env file
config({ path: join(process.cwd(), '.env') });

// Environment configuration
export const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '8000', 10),
  db: {
    url: process.env.DATABASE_URL || 'postgres://localhost:5432/astromuse',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'dev_secret',
    expiresIn: '7d',
  }
};

// Configuration validation
if (env.nodeEnv === 'production' && env.jwt.secret === 'dev_secret') {
  throw new Error('JWT_SECRET must be set in production environment');
}

// Print configuration at startup (only in development mode)
if (env.nodeEnv === 'development') {
  console.log('📄 Environment configuration:');
  console.log(`  • Environment: ${env.nodeEnv}`);
  console.log(`  • Port: ${env.port}`);
  console.log(`  • DB URL: ${env.db.url.split('@')[0].replace(/:[^:]*@/, ':****@')}@${env.db.url.split('@')[1]}`);
  console.log(`  • JWT expiration: ${env.jwt.expiresIn}`);
}