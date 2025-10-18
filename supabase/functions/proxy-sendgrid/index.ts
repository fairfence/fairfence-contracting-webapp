import { createClient } from 'npm:@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

interface EmailRequest {
  to: string | string[];
  from?: string;
  subject: string;
  text?: string;
  html?: string;
  replyTo?: string;
}

interface ContactFormData {
  clientname: string;
  email: string;
  phonenumber: string;
  address?: string;
  serviceparts?: string;
  message?: string;
}

interface SiteSurveyData {
  customerName: string;
  phone: string;
  email?: string | null;
  propertyAddress: string;
  removalRequired: boolean;
  additionalNotes?: string | null;
  fenceLines: Array<{
    lineDescription?: string;
    length: number;
    height?: number;
    fenceType: string;
    railWireCount?: number;
    specialNotes?: string;
  }>;
  photoUrls: string[];
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const sendGridApiKey = Deno.env.get('SENDGRID_API_KEY');
    const sendGridFrom = Deno.env.get('SENDGRID_FROM') || 'noreply@fairfence.co.nz';

    if (!sendGridApiKey) {
      console.error('SENDGRID_API_KEY not configured');
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Email service not configured'
        }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const requestData = await req.json();
    const { type, data } = requestData;

    let emailPayload: any;

    if (type === 'contact-form') {
      const contactData = data as ContactFormData;

      emailPayload = {
        personalizations: [{
          to: [{ email: 'info@fairfence.co.nz' }],
          subject: `New Quote Request from ${contactData.clientname}`
        }],
        from: { email: sendGridFrom },
        reply_to: { email: contactData.email },
        content: [{
          type: 'text/html',
          value: `
            <h2>New Quote Request</h2>
            <p><strong>Name:</strong> ${contactData.clientname}</p>
            <p><strong>Email:</strong> ${contactData.email}</p>
            <p><strong>Phone:</strong> ${contactData.phonenumber}</p>
            ${contactData.address ? `<p><strong>Address:</strong> ${contactData.address}</p>` : ''}
            ${contactData.serviceparts ? `<p><strong>Service:</strong> ${contactData.serviceparts}</p>` : ''}
            ${contactData.message ? `<p><strong>Message:</strong><br/>${contactData.message}</p>` : ''}
            <hr/>
            <p><small>Sent from FairFence website contact form</small></p>
          `
        }]
      };
    } else if (type === 'site-survey') {
      const surveyData = data as SiteSurveyData;

      let fenceLinesHtml = surveyData.fenceLines.map((line, index) => `
        <div style="margin: 15px 0; padding: 10px; border-left: 3px solid #4CAF50;">
          <h4>Fence Line ${index + 1}</h4>
          ${line.lineDescription ? `<p><strong>Description:</strong> ${line.lineDescription}</p>` : ''}
          <p><strong>Length:</strong> ${line.length}m</p>
          ${line.height ? `<p><strong>Height:</strong> ${line.height}m</p>` : ''}
          <p><strong>Fence Type:</strong> ${line.fenceType}</p>
          ${line.railWireCount ? `<p><strong>Rails/Wires:</strong> ${line.railWireCount}</p>` : ''}
          ${line.specialNotes ? `<p><strong>Notes:</strong> ${line.specialNotes}</p>` : ''}
        </div>
      `).join('');

      let photosHtml = '';
      if (surveyData.photoUrls && surveyData.photoUrls.length > 0) {
        photosHtml = `
          <h3>Photos</h3>
          <p>${surveyData.photoUrls.length} photo(s) attached</p>
          <ul>
            ${surveyData.photoUrls.map(url => `<li><a href="${url}">View photo</a></li>`).join('')}
          </ul>
        `;
      }

      emailPayload = {
        personalizations: [{
          to: [{ email: 'info@fairfence.co.nz' }],
          subject: `New Site Survey - ${surveyData.customerName}`
        }],
        from: { email: sendGridFrom },
        reply_to: surveyData.email ? { email: surveyData.email } : undefined,
        content: [{
          type: 'text/html',
          value: `
            <h2>New Site Survey Submission</h2>
            <div style="background: #f5f5f5; padding: 15px; margin: 15px 0;">
              <h3>Customer Information</h3>
              <p><strong>Name:</strong> ${surveyData.customerName}</p>
              <p><strong>Phone:</strong> ${surveyData.phone}</p>
              ${surveyData.email ? `<p><strong>Email:</strong> ${surveyData.email}</p>` : ''}
              <p><strong>Property Address:</strong> ${surveyData.propertyAddress}</p>
              <p><strong>Removal Required:</strong> ${surveyData.removalRequired ? 'Yes' : 'No'}</p>
              ${surveyData.additionalNotes ? `<p><strong>Additional Notes:</strong><br/>${surveyData.additionalNotes}</p>` : ''}
            </div>

            <h3>Fence Lines</h3>
            ${fenceLinesHtml}

            ${photosHtml}

            <hr/>
            <p><small>Sent from FairFence website site survey form</small></p>
          `
        }]
      };
    } else if (type === 'custom') {
      const emailData = data as EmailRequest;

      emailPayload = {
        personalizations: [{
          to: Array.isArray(emailData.to)
            ? emailData.to.map(email => ({ email }))
            : [{ email: emailData.to }],
          subject: emailData.subject
        }],
        from: { email: emailData.from || sendGridFrom },
        reply_to: emailData.replyTo ? { email: emailData.replyTo } : undefined,
        content: [{
          type: emailData.html ? 'text/html' : 'text/plain',
          value: emailData.html || emailData.text || ''
        }]
      };
    } else {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Invalid email type'
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${sendGridApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailPayload)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('SendGrid API error:', response.status, errorText);

      return new Response(
        JSON.stringify({
          success: false,
          error: 'Failed to send email',
          details: errorText
        }),
        {
          status: response.status,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Email sent successfully'
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in proxy-sendgrid function:', error);

    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error'
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
