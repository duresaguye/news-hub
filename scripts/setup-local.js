
const fs = require('fs');
const path = require('path');

console.log('Setting up local development environment...');

// Only run locally
if (!process.env.VERCEL) {
  const envPath = path.join(__dirname, '../.env');

  if (fs.existsSync(envPath)) {
    console.log('.env file exists. Skipping creation.');
  } else {
    console.warn('⚠️ No .env file found. Please create one manually.');
  }

  // Prisma setup
  console.log('Setting up Prisma client...');
  try {
    require('../prisma/local-setup');
    console.log('✅ Prisma client setup complete');
  } catch (error) {
    console.error('❌ Error setting up Prisma client:', error.message);
  }

  console.log('\n✅ Local setup complete!');
} else {
  console.log('⚠️ Skipping local setup on Vercel.');
}
