import { config } from 'dotenv';
import { join } from 'path';

// Načtení .env souboru
config({ path: join(process.cwd(), '.env') });

// Konfigurace prostředí
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

// Validace konfigurace
if (env.nodeEnv === 'production' && env.jwt.secret === 'dev_secret') {
  throw new Error('JWT_SECRET musí být nastaveno v produkčním prostředí');
}

// Výpis konfigurace při startu (pouze v režimu vývoje)
if (env.nodeEnv === 'development') {
  console.log('📄 Konfigurace prostředí:');
  console.log(`  • Prostředí: ${env.nodeEnv}`);
  console.log(`  • Port: ${env.port}`);
  console.log(`  • DB URL: ${env.db.url.split('@')[0].replace(/:[^:]*@/, ':****@')}@${env.db.url.split('@')[1]}`);
  console.log(`  • JWT expirace: ${env.jwt.expiresIn}`);
}