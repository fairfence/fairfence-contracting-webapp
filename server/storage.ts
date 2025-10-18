import { type IDatabaseStorage } from './database';

// Re-export the database interface for use throughout the application
export { type IDatabaseStorage } from './database';

// Storage factory function - ONLY Supabase storage is supported
// All data persistence uses Supabase
export async function createStorageAsync(databaseUrl?: string): Promise<IDatabaseStorage> {
  if (!databaseUrl) {
    throw new Error('DATABASE_URL is required. Supabase connection must be configured.');
  }

  if (!databaseUrl.includes('postgresql://') && !databaseUrl.includes('postgres://') && !databaseUrl.includes('https://')) {
    throw new Error(`Invalid DATABASE_URL format: ${databaseUrl}. Must be a valid PostgreSQL or Supabase URL.`);
  }

  console.log('📊 Using Supabase database storage');
  const { SupabaseStorage } = await import('./database.js');
  return new SupabaseStorage();
}

