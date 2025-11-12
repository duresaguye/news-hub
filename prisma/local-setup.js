// This is a temporary setup file to bypass Prisma client generation
// It creates a minimal Prisma client that won't fail at build time

const { writeFileSync, mkdirSync } = require('fs');
const { join } = require('path');

const prismaClientPath = join(__dirname, '../node_modules/.prisma/client');

// Create the directory if it doesn't exist
mkdirSync(prismaClientPath, { recursive: true });

// Create a minimal package.json
writeFileSync(
  join(prismaClientPath, 'package.json'),
  JSON.stringify({
    name: '.prisma/client',
    main: 'index.js',
    types: 'index.d.ts',
    browser: {
      './runtime/browser': './runtime/browser.js',
      './runtime/browser.js': './runtime/browser.js',
      './runtime/index': './runtime/browser.js',
      './runtime/index.js': './runtime/browser.js',
    },
  }, null, 2)
);

// Create a minimal index.js
writeFileSync(
  join(prismaClientPath, 'index.js'),
  `// This is a minimal Prisma client that won't fail at build time
  
  class PrismaClient {
    constructor() {
      throw new Error('PrismaClient is not configured. Please run \`npx prisma generate\`');
    }
  }
  
  module.exports = {
    PrismaClient,
    prisma: new Proxy({}, {
      get() {
        throw new Error('PrismaClient is not configured. Please run \`npx prisma generate\`');
      }
    })
  };`
);

// Create a minimal index.d.ts
writeFileSync(
  join(prismaClientPath, 'index.d.ts'),
  `// This is a minimal TypeScript definition file for Prisma client
  
  export class PrismaClient {
    constructor(options?: any);
  }
  
  export const prisma: any;`
);

console.log('✅ Created minimal Prisma client setup');
