// Email service using Supabase Edge Function proxy
import { edgeFunctionClient } from './edgeFunctionClient';

const USE_EDGE_FUNCTION = true;

interface EmailParams {
  to: string;
  from: string;
  subject: string;
  text?: string;
  html?: string;
  replyTo?: string;
}

export async function sendEmail(params: EmailParams): Promise<boolean> {
  try {
    if (USE_EDGE_FUNCTION) {
      const response = await edgeFunctionClient.sendEmail('custom', params);

      if (response && response.success) {
        console.log(`Email sent successfully via Edge Function to ${params.to}`);
        return true;
      } else {
        console.error('Edge Function email error:', response);
        return false;
      }
    } else {
      console.error('Email service not configured - Edge Function disabled');
      return false;
    }
  } catch (error: any) {
    console.error('Email service error:', {
      message: error.message,
      details: error
    });
    return false;
  }
}

// Function to send contact form notification email
export async function sendContactFormEmail(contactData: {
  clientname: string;
  email?: string | null;
  phonenumber: string;
  serviceparts?: string | null;
  address?: string | null;
  siteaddress?: string | null;
  projectname?: string | null;
}): Promise<boolean> {
  try {
    if (USE_EDGE_FUNCTION) {
      const response = await edgeFunctionClient.sendEmail('contact-form', contactData);

      if (response && response.success) {
        console.log('Contact form email sent successfully via Edge Function');
        return true;
      } else {
        console.error('Edge Function contact form email error:', response);
        return false;
      }
    } else {
      console.error('Email service not configured - Edge Function disabled');
      return false;
    }
  } catch (error: any) {
    console.error('Contact form email error:', error);
    return false;
  }
}

interface FenceLineData {
  lineDescription?: string;
  length: string;
  height?: string;
  fenceType: string;
  railWireCount?: string;
  specialNotes?: string;
}

export async function sendSiteSurveyEmail(surveyData: {
  customerName: string;
  phone: string;
  email?: string | null;
  propertyAddress: string;
  removalRequired?: boolean;
  additionalNotes?: string | null;
  fenceLines: FenceLineData[];
  photoUrls?: string[];
}): Promise<boolean> {
  try {
    if (USE_EDGE_FUNCTION) {
      const response = await edgeFunctionClient.sendEmail('site-survey', surveyData);

      if (response && response.success) {
        console.log('Site survey email sent successfully via Edge Function');
        return true;
      } else {
        console.error('Edge Function site survey email error:', response);
        return false;
      }
    } else {
      console.error('Email service not configured - Edge Function disabled');
      return false;
    }
  } catch (error: any) {
    console.error('Site survey email error:', error);
    return false;
  }
}