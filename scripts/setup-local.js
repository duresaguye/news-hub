// This script sets up a minimal development environment
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Setting up local development environment...');

// Create .env file if it doesn't exist
const envPath = path.join(__dirname, '../.env');
if (!fs.existsSync(envPath)) {
  console.log('Creating .env file...');
  fs.copyFileSync(path.join(__dirname, '../.env.example'), envPath);
  console.log('✅ Created .env file. Please update it with your API keys.');
}

// Run the local Prisma setup
console.log('Setting up Prisma client...');
try {
  require('../prisma/local-setup');
  console.log('✅ Prisma client setup complete');} catch (error) {
  console.error('❌ Error setting up Prisma client:', error.message);
}

console.log('\n✅ Setup complete! Run `pnpm dev` to start the development server.');
