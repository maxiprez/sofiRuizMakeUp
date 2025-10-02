declare module 'sib-api-v3-sdk' {
  export interface Authentication {
    apiKey: {
      apiKey: string;
    };
    partnerKey: {
      apiKey: string;
    };
  }

  export class ApiClient {
    static instance: ApiClient;
    authentications: Authentication;
    constructor();
  }

  export interface SendSmtpEmail {
    to?: { email: string; name?: string }[];
    templateId?: number;
    params?: Record<string, string | number | boolean | null | undefined>;
    subject?: string;
    htmlContent?: string;
    sender?: { email: string; name: string };
  }

  export interface SendSmtpEmailResponse {
    messageId: string;
    messageIds?: string[];
    envelope?: {
      from: string;
      to: string[];
    };
  }

  export interface ApiResponseError {
    code: number;
    message: string;
  }

  export class TransactionalEmailsApi {
    sendTransacEmail(sendSmtpEmail: SendSmtpEmail): Promise<{ 
      response: {
        statusCode: number;
        statusMessage: string;
        headers: Record<string, string>;
      }; 
      body: SendSmtpEmailResponse | ApiResponseError;
    }>;
  }
}
