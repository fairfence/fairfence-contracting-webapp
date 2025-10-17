/**
 * Configuration management module
 * Loads configuration from environment variables
 */

export interface AppConfiguration {
  SUPABASE_URL: string;
  SUPABASE_ANON_KEY: string;
  SUPABASE_SERVICE_ROLE_KEY?: string;
  DATABASE_URL?: string;
  SESSION_SECRET?: string;
  STRIPE_PUBLIC_KEY?: string;
  STRIPE_SECRET_KEY?: string;
  SMTP_HOST?: string;
  SMTP_PORT?: string;
  SMTP_USER?: string;
  SMTP_PASSWORD?: string;
  PORT?: string;
}

class ConfigurationManager {
  private config: AppConfiguration | null = null;
  private isInitialized = false;

  /**
   * Initialize configuration by loading from environment variables
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) {
      return;
    }

    console.log('Initializing configuration from environment variables...');
    this.config = this.loadFromEnvironment();
    this.isInitialized = true;
  }

  private loadFromEnvironment(): AppConfiguration {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Missing required Supabase environment variables (SUPABASE_URL, SUPABASE_ANON_KEY)');
    }

    return {
      SUPABASE_URL: supabaseUrl,
      SUPABASE_ANON_KEY: supabaseAnonKey,
      SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
      DATABASE_URL: process.env.DATABASE_URL,
      SESSION_SECRET: process.env.SESSION_SECRET || 'default-dev-secret',
      STRIPE_PUBLIC_KEY: process.env.STRIPE_PUBLIC_KEY,
      STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
      SMTP_HOST: process.env.SMTP_HOST,
      SMTP_PORT: process.env.SMTP_PORT,
      SMTP_USER: process.env.SMTP_USER,
      SMTP_PASSWORD: process.env.SMTP_PASSWORD,
      PORT: process.env.PORT || '5000',
    };
  }

  /**
   * Get a configuration value
   */
  get<K extends keyof AppConfiguration>(key: K): AppConfiguration[K] {
    if (!this.config) {
      throw new Error('Configuration not initialized. Call initialize() first.');
    }
    return this.config[key];
  }

  /**
   * Get all configuration values
   */
  getAll(): AppConfiguration {
    if (!this.config) {
      throw new Error('Configuration not initialized. Call initialize() first.');
    }
    return { ...this.config };
  }

  /**
   * Reload configuration
   */
  async reload(): Promise<void> {
    this.config = this.loadFromEnvironment();
  }

  /**
   * Get configuration status for debugging
   */
  getStatus(): { initialized: boolean; mode: 'environment'; hasServiceKey: boolean } {
    return {
      initialized: this.isInitialized,
      mode: 'environment',
      hasServiceKey: !!this.config?.SUPABASE_SERVICE_ROLE_KEY,
    };
  }
}

// Create singleton instance
const configManager = new ConfigurationManager();

// Export singleton instance and methods
export default configManager;
export const initializeConfig = () => configManager.initialize();
export const getConfig = <K extends keyof AppConfiguration>(key: K) => configManager.get(key);
export const getAllConfig = () => configManager.getAll();
export const reloadConfig = () => configManager.reload();
export const getConfigStatus = () => configManager.getStatus();
