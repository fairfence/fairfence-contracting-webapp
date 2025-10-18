import { createClient } from 'npm:@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

interface PricingRow {
  id: string;
  servicetype: string;
  name: string;
  height: number;
  totallmincgst: string;
  code?: string;
  created_at?: string;
}

interface TransformedPricing {
  [key: string]: {
    [height: string]: number;
    perMeter: boolean;
    description?: string;
    materials?: string;
  };
}

const fallbackPricing = {
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
};

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('Missing Supabase configuration');
      return new Response(
        JSON.stringify({
          success: true,
          data: {
            tables: [],
            data: {},
            fallback: true,
            pricing: fallbackPricing,
            source: 'fallback-config-missing'
          }
        }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    const { data: rawPricingData, error } = await supabase
      .from('pricing')
      .select('id,servicetype,name,height,totallmincgst,code,created_at')
      .order('servicetype', { ascending: true })
      .order('height', { ascending: true });

    if (error) {
      console.error('Error fetching pricing from database:', error);
      return new Response(
        JSON.stringify({
          success: true,
          data: {
            tables: [],
            data: {},
            fallback: true,
            pricing: fallbackPricing,
            source: 'fallback-db-error',
            error: error.message
          }
        }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const serviceTypeMapping: Record<string, string> = {
      'Timber Slat Fence': 'timber',
      'Timber Fence': 'timber',
      'Aluminium Fence': 'aluminum',
      'Aluminum Fence': 'aluminum',
      'PVC/Vinyl Fence': 'pvc',
      'PVC Fence': 'pvc',
      'Vinyl Fence': 'pvc',
      'Rural Fence': 'rural',
      'Rural Fencing': 'rural'
    };

    const transformedPricing: TransformedPricing = {};
    let hasData = false;

    if (rawPricingData && rawPricingData.length > 0) {
      hasData = true;

      for (const row of rawPricingData as PricingRow[]) {
        let fenceTypeKey = 'timber';

        if (serviceTypeMapping[row.servicetype]) {
          fenceTypeKey = serviceTypeMapping[row.servicetype];
        } else {
          const serviceTypeLower = row.servicetype?.toLowerCase() || '';
          if (serviceTypeLower.includes('timber')) {
            fenceTypeKey = 'timber';
          } else if (serviceTypeLower.includes('aluminium') || serviceTypeLower.includes('aluminum')) {
            fenceTypeKey = 'aluminum';
          } else if (serviceTypeLower.includes('pvc') || serviceTypeLower.includes('vinyl')) {
            fenceTypeKey = 'pvc';
          } else if (serviceTypeLower.includes('rural')) {
            fenceTypeKey = 'rural';
          }
        }

        if (!transformedPricing[fenceTypeKey]) {
          transformedPricing[fenceTypeKey] = {
            perMeter: true
          };
        }

        const height = String(row.height);
        const price = parseFloat(row.totallmincgst) || 0;

        transformedPricing[fenceTypeKey][height] = price;
      }

      for (const [key, value] of Object.entries(fallbackPricing)) {
        if (transformedPricing[key]) {
          transformedPricing[key].description = value.description;
          transformedPricing[key].materials = value.materials;
        }
      }
    }

    const responseData = {
      tables: [{ table_name: 'pricing', table_schema: 'public' }],
      data: { pricing: rawPricingData },
      fallback: !hasData,
      pricing: hasData ? transformedPricing : fallbackPricing,
      source: hasData ? 'database' : 'fallback-no-data',
      timestamp: new Date().toISOString()
    };

    return new Response(
      JSON.stringify({
        success: true,
        data: responseData
      }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=300, s-maxage=1800'
        },
      }
    );

  } catch (error) {
    console.error('Unexpected error in get-pricing function:', error);

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          tables: [],
          data: {},
          fallback: true,
          pricing: fallbackPricing,
          source: 'fallback-exception',
          error: error instanceof Error ? error.message : String(error)
        }
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
