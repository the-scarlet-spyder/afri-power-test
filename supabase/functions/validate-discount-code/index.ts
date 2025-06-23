
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    )

    const { code } = await req.json()

    if (!code) {
      return new Response(
        JSON.stringify({ error: 'Discount code is required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    // Query discount code
    const { data: discountCode, error } = await supabaseClient
      .from('discount_codes')
      .select('*')
      .eq('code', code.toUpperCase())
      .eq('is_active', true)
      .single()

    if (error || !discountCode) {
      return new Response(
        JSON.stringify({ valid: false, message: 'Invalid or expired discount code' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Check if code has expired
    if (discountCode.valid_until && new Date(discountCode.valid_until) < new Date()) {
      return new Response(
        JSON.stringify({ valid: false, message: 'Discount code has expired' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Check usage limit
    if (discountCode.usage_limit && discountCode.times_used >= discountCode.usage_limit) {
      return new Response(
        JSON.stringify({ valid: false, message: 'Discount code usage limit exceeded' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({
        valid: true,
        code: discountCode.code,
        discount_percentage: discountCode.discount_percentage,
        discount_amount: discountCode.discount_amount,
        message: 'Discount code applied successfully'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
