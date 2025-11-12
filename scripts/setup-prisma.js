const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Setting up Prisma...');

// Create default Prisma client if it doesn't exist
const prismaClientPath = path.join(__dirname, '../node_modules/.prisma/client');
if (!fs.existsSync(prismaClientPath)) {
  console.log('Creating Prisma client directory...');
  fs.mkdirSync(prismaClientPath, { recursive: true });
  
  // Create minimal package.json for the client
  fs.writeFileSync(
    path.join(prismaClientPath, 'package.json'),
    JSON.stringify({
      name: '.prisma/client',
      main: 'index.js',
      types: 'index.d.ts',
      browser: {
        './runtime/browser': './runtime/browser.js',
        './runtime/browser.js': './runtime/browser.js',
        './runtime/index': './runtime/browser.js',
        './runtime/index.js': './runtime/browser.js',
        './runtime/query': './runtime/query.js',
        './runtime/query.js': './runtime/query.js',
      },
    }, null, 2)
  );
  
  // Create minimal index files
  fs.writeFileSync(
    path.join(prismaClientPath, 'index.js'),
    'module.exports = { PrismaClient: class PrismaClient {} }'
  );
  
  fs.writeFileSync(
    path.join(prismaClientPath, 'index.d.ts'),
    'export class PrismaClient {\n  constructor(options?: any);\n  $connect(): Promise<void>;\n  $disconnect(): Promise<void>;\n  $executeRaw<T = any>(query: string, ...values: any[]): Promise<number>;\n  $queryRaw<T = any>(query: string, ...values: any[]): Promise<T>;\n  $transaction<T>(fn: (prisma: any) => Promise<T>): Promise<T>;\n  $on(eventType: any, callback: (event: any) => void): void;\n}'
  );
  
  console.log('Created minimal Prisma client');
} else {
  console.log('Prisma client already exists');
}

console.log('Prisma setup complete');
