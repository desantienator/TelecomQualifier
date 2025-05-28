import { 
  users, 
  qualifications, 
  quoteRequests,
  type User, 
  type InsertUser,
  type Qualification,
  type InsertQualification,
  type QuoteRequest,
  type InsertQuoteRequest,
  type Provider,
  type ServiceOffering,
  type QualificationResult
} from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  createQualification(qualification: InsertQualification): Promise<Qualification>;
  getQualification(id: number): Promise<Qualification | undefined>;
  updateQualificationResults(id: number, results: QualificationResult[]): Promise<Qualification | undefined>;
  
  createQuoteRequest(quoteRequest: InsertQuoteRequest): Promise<QuoteRequest>;
  getQuoteRequests(): Promise<QuoteRequest[]>;
  
  getProviders(): Promise<Provider[]>;
  getProvider(id: string): Promise<Provider | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private qualifications: Map<number, Qualification>;
  private quoteRequests: Map<number, QuoteRequest>;
  private providers: Map<string, Provider>;
  private currentUserId: number;
  private currentQualificationId: number;
  private currentQuoteRequestId: number;

  constructor() {
    this.users = new Map();
    this.qualifications = new Map();
    this.quoteRequests = new Map();
    this.providers = new Map();
    this.currentUserId = 1;
    this.currentQualificationId = 1;
    this.currentQuoteRequestId = 1;
    
    this.initializeProviders();
  }

  private initializeProviders() {
    const providers: Provider[] = [
      {
        id: 'nbn',
        name: 'NBN Co',
        logo: 'NBN',
        type: 'National Broadband',
        services: [
          {
            id: 'nbn-business',
            name: 'Business NBN',
            technology: 'Fiber to the Premises (FTTP)',
            maxDownload: 1000,
            maxUpload: 50,
            serviceClass: 'Business Grade',
            sla: '99.5% Uptime',
            installTimeMin: 15,
            installTimeMax: 20,
            features: ['Multiple speed tiers available', 'Business support', 'Priority assistance'],
            availabilityCheck: () => 'available'
          }
        ]
      },
      {
        id: 'telstra',
        name: 'Telstra',
        logo: 'T',
        type: 'Enterprise Provider',
        services: [
          {
            id: 'telstra-business-fiber',
            name: 'Business Fiber + Voice',
            technology: 'Dedicated Fiber',
            maxDownload: 1000,
            maxUpload: 1000,
            serviceClass: 'Enterprise',
            sla: '99.95% Uptime',
            installTimeMin: 20,
            installTimeMax: 30,
            features: ['Enterprise-grade with managed services', '24/7 support', 'Dedicated account manager'],
            voiceChannels: 100,
            bundleOptions: ['Voice', 'Cloud', 'Security'],
            availabilityCheck: () => 'available'
          }
        ]
      },
      {
        id: 'optus',
        name: 'Optus Business',
        logo: 'O',
        type: 'Business Solutions',
        services: [
          {
            id: 'optus-metro-ethernet',
            name: 'Fiber + Cloud Solutions',
            technology: 'Metro Ethernet',
            maxDownload: 500,
            maxUpload: 500,
            serviceClass: 'Business Premium',
            sla: '99.9% Uptime',
            installTimeMin: 25,
            installTimeMax: 35,
            features: ['Site survey required for confirmation', 'Cloud integration', 'Scalable bandwidth'],
            bundleOptions: ['Voice', 'Cloud', 'Mobile'],
            availabilityCheck: () => 'survey_required'
          }
        ]
      },
      {
        id: 'tpg',
        name: 'TPG Telecom',
        logo: 'TPG',
        type: 'Business Internet',
        services: [
          {
            id: 'tpg-business',
            name: 'Business Internet',
            technology: 'NBN Business',
            maxDownload: 250,
            maxUpload: 25,
            serviceClass: 'Business',
            sla: 'Business Hours Support',
            installTimeMin: 10,
            installTimeMax: 15,
            features: ['Cost-effective business solution', '24 month contract', 'Local support'],
            availabilityCheck: () => 'available'
          }
        ]
      }
    ];

    providers.forEach(provider => {
      this.providers.set(provider.id, provider);
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createQualification(insertQualification: InsertQualification): Promise<Qualification> {
    const id = this.currentQualificationId++;
    const qualification: Qualification = {
      ...insertQualification,
      id,
      results: null,
      createdAt: new Date()
    };
    this.qualifications.set(id, qualification);
    return qualification;
  }

  async getQualification(id: number): Promise<Qualification | undefined> {
    return this.qualifications.get(id);
  }

  async updateQualificationResults(id: number, results: QualificationResult[]): Promise<Qualification | undefined> {
    const qualification = this.qualifications.get(id);
    if (qualification) {
      qualification.results = results;
      this.qualifications.set(id, qualification);
    }
    return qualification;
  }

  async createQuoteRequest(insertQuoteRequest: InsertQuoteRequest): Promise<QuoteRequest> {
    const id = this.currentQuoteRequestId++;
    const quoteRequest: QuoteRequest = {
      ...insertQuoteRequest,
      id,
      status: 'pending',
      createdAt: new Date()
    };
    this.quoteRequests.set(id, quoteRequest);
    return quoteRequest;
  }

  async getQuoteRequests(): Promise<QuoteRequest[]> {
    return Array.from(this.quoteRequests.values());
  }

  async getProviders(): Promise<Provider[]> {
    return Array.from(this.providers.values());
  }

  async getProvider(id: string): Promise<Provider | undefined> {
    return this.providers.get(id);
  }
}

export const storage = new MemStorage();
