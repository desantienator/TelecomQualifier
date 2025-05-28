export interface QualificationFormData {
  address: string;
  serviceTypes: string[];
}

export interface QualificationResult {
  providerId: string;
  providerName: string;
  providerLogo: string;
  serviceType: string;
  technology: string;
  maxSpeed: string;
  uploadSpeed?: string;
  serviceClass: string;
  sla?: string;
  installTime: string;
  status: 'available' | 'limited' | 'unavailable' | 'survey_required';
  features: string[];
  voiceChannels?: number;
  bundleOptions?: string[];
}

export interface Qualification {
  id: number;
  address: string;
  serviceTypes: string[];
  results: QualificationResult[] | null;
  createdAt: string;
}

export interface QuoteRequestData {
  qualificationId?: number;
  providerIds: string[];
  contactName: string;
  email: string;
  phone?: string;
  company?: string;
  requirements?: string;
  timeline?: string;
}

export interface Provider {
  id: string;
  name: string;
  logo: string;
  type: string;
}
