require('dotenv').config({ path: './frontend/.env.local' });
const { createClient } = require('@supabase/supabase-js');

async function test() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error('Supabase service role environment variables are not configured');
  }
  const supabase = createClient(url, key);

  console.log("Supabase initialized", url);
  
  const body = {
    "companyName": "Test",
    "teamSize": 10,
    "industry": "Tech",
    "tools": [
      {
        "name": "chatgpt",
        "plan": "pro",
        "seats": 5,
        "annualBilling": false,
        "monthlySpend": 100
      }
    ]
  };

  const auditResult = { recommendations: [], totalMonthlySavings: 0, totalAnnualSavings: 0, totalCurrentSpend: 100 };
  const aiSummary = "Summary";

  const slug = "testslug123";

  console.log("Attempting to insert to Supabase...");
  const { data, error } = await supabase.from('audits').insert({
    slug,
    spend_data: body,
    audit_result: auditResult,
    ai_summary: aiSummary,
  });

  if (error) {
    console.error("Supabase insert failed:", error);
  } else {
    console.log("Success:", data);
  }
}

test().catch(console.error);
