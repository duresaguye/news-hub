// This is a temporary setup file to bypass Prisma client generation
// It creates a minimal Prisma client that won't fail at build time

import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

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
    console.warn('Using minimal Prisma client - database operations will not work');
  }
  
  async $connect() {}
  async $disconnect() {}
  async $queryRaw() { return []; }
  async $executeRaw() { return 0; }
  $on() {}
  async $transaction(promises) {
    return Promise.all(promises);
  }
}

module.exports = { PrismaClient };
`
);

// Create a minimal index.d.ts
try {
  writeFileSync(
    join(prismaClientPath, 'index.d.ts'),
    `export class PrismaClient<T = any> {
  constructor(options?: any);
  $connect(): Promise<void>;
  $disconnect(): Promise<void>;
  $executeRaw<T = any>(query: string, ...values: any[]): Promise<number>;
  $queryRaw<T = any>(query: string, ...values: any[]): Promise<T>;
  $transaction<T>(fn: (prisma: any) => Promise<T>): Promise<T>;
  $on(eventType: any, callback: (event: any) => void): void;
}
`
  );
} catch (error) {
  console.error('Error creating TypeScript definitions:', error);
}

console.log('Created minimal Prisma client at:', prismaClientPath);
