import configManager from './config';

interface RetryOptions {
  maxRetries?: number;
  initialDelay?: number;
  maxDelay?: number;
  backoffMultiplier?: number;
}

interface EdgeFunctionCallOptions extends RetryOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers?: Record<string, string>;
  body?: any;
  timeout?: number;
}

export class EdgeFunctionClient {
  private baseUrl: string | null = null;
  private anonKey: string | null = null;
  private initialized = false;

  constructor() {
    // Don't initialize here - wait for lazy init
  }

  private ensureInitialized() {
    if (!this.initialized) {
      this.baseUrl = configManager.get('SUPABASE_URL') || '';
      this.anonKey = configManager.get('SUPABASE_ANON_KEY') || '';

      if (!this.baseUrl || !this.anonKey) {
        throw new Error('Supabase configuration missing for Edge Function client');
      }

      this.initialized = true;
    }
  }

  private async sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private calculateBackoffDelay(attempt: number, options: RetryOptions): number {
    const initialDelay = options.initialDelay || 1000;
    const maxDelay = options.maxDelay || 10000;
    const backoffMultiplier = options.backoffMultiplier || 2;

    const delay = Math.min(
      initialDelay * Math.pow(backoffMultiplier, attempt),
      maxDelay
    );

    const jitter = Math.random() * 0.3 * delay;
    return delay + jitter;
  }

  private shouldRetry(error: any, attempt: number, maxRetries: number): boolean {
    if (attempt >= maxRetries) {
      return false;
    }

    if (error.name === 'AbortError') {
      return true;
    }

    if (error.message?.includes('fetch failed')) {
      return true;
    }

    if (error.message?.includes('ECONNRESET')) {
      return true;
    }

    if (error.message?.includes('ETIMEDOUT')) {
      return true;
    }

    if (error.status >= 500 && error.status < 600) {
      return true;
    }

    if (error.status === 429) {
      return true;
    }

    return false;
  }

  async callFunction<T = any>(
    functionName: string,
    options: EdgeFunctionCallOptions = {}
  ): Promise<T> {
    // Ensure config is loaded before using it
    this.ensureInitialized();

    const {
      method = 'GET',
      headers = {},
      body,
      timeout = 30000,
      maxRetries = 3,
      initialDelay = 1000,
      maxDelay = 10000,
      backoffMultiplier = 2
    } = options;

    const url = `${this.baseUrl}/functions/v1/${functionName}`;

    const requestHeaders: Record<string, string> = {
      'Authorization': `Bearer ${this.anonKey}`,
      'Content-Type': 'application/json',
      ...headers
    };

    let lastError: any;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);

        const fetchOptions: RequestInit = {
          method,
          headers: requestHeaders,
          signal: controller.signal
        };

        if (body && method !== 'GET') {
          fetchOptions.body = JSON.stringify(body);
        }

        console.log(`[EdgeFunction] Calling ${functionName} (attempt ${attempt + 1}/${maxRetries + 1})`);

        const response = await fetch(url, fetchOptions);
        clearTimeout(timeoutId);

        if (!response.ok) {
          const errorText = await response.text();
          const error: any = new Error(`Edge Function ${functionName} failed: ${response.status}`);
          error.status = response.status;
          error.response = errorText;
          throw error;
        }

        const data = await response.json();
        console.log(`[EdgeFunction] ${functionName} succeeded on attempt ${attempt + 1}`);
        return data as T;

      } catch (error: any) {
        lastError = error;
        console.error(`[EdgeFunction] ${functionName} failed on attempt ${attempt + 1}:`, error.message);

        if (this.shouldRetry(error, attempt, maxRetries)) {
          const delay = this.calculateBackoffDelay(attempt, {
            initialDelay,
            maxDelay,
            backoffMultiplier
          });

          console.log(`[EdgeFunction] Retrying ${functionName} after ${Math.round(delay)}ms...`);
          await this.sleep(delay);
          continue;
        }

        throw error;
      }
    }

    throw lastError || new Error(`Failed to call Edge Function ${functionName} after ${maxRetries + 1} attempts`);
  }

  async getPricing(): Promise<any> {
    try {
      return await this.callFunction('get-pricing', {
        method: 'GET',
        maxRetries: 3,
        timeout: 15000
      });
    } catch (error) {
      console.error('[EdgeFunction] Failed to get pricing, using fallback:', error);

      return {
        success: true,
        data: {
          tables: [],
          data: {},
          fallback: true,
          pricing: {
            timber: {
              "1.2": 150,
              "1.5": 165,
              "1.8": 180,
              "2.1": 210,
              perMeter: true,
              description: "Quality timber fencing",
              materials: "H4 treated pine posts, H3.2 treated palings"
            },
            aluminum: {
              "1.2": 190,
              "1.5": 205,
              "1.8": 220,
              "2.1": 260,
              perMeter: true,
              description: "Modern aluminum fencing",
              materials: "Powder-coated aluminum, stainless steel fixings"
            },
            pvc: {
              "1.2": 210,
              "1.5": 230,
              "1.8": 250,
              "2.1": 290,
              perMeter: true,
              description: "Low-maintenance PVC/Vinyl fencing",
              materials: "UV-stabilized PVC, aluminum reinforced posts"
            },
            rural: {
              "1.2": 100,
              "1.5": 110,
              "1.8": 120,
              "2.1": 140,
              perMeter: true,
              description: "Rural and lifestyle fencing",
              materials: "H5 treated posts, H3.2 rails, 2.5mm HT wire"
            }
          },
          source: 'local-fallback-after-edge-function-failure'
        }
      };
    }
  }

  async sendEmail(type: 'contact-form' | 'site-survey' | 'custom', data: any): Promise<any> {
    return await this.callFunction('proxy-sendgrid', {
      method: 'POST',
      body: { type, data },
      maxRetries: 2,
      timeout: 20000
    });
  }

  async getSecret(secretName: string): Promise<any> {
    return await this.callFunction('manage-secrets', {
      method: 'POST',
      body: { action: 'get', secretName },
      maxRetries: 1,
      timeout: 10000
    });
  }

  async listSecrets(): Promise<any> {
    return await this.callFunction('manage-secrets', {
      method: 'POST',
      body: { action: 'list' },
      maxRetries: 1,
      timeout: 10000
    });
  }
}

export const edgeFunctionClient = new EdgeFunctionClient();
