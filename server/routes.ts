import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertQualificationSchema, insertQuoteRequestSchema, type QualificationResult } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Get all providers
  app.get("/api/providers", async (req, res) => {
    try {
      const providers = await storage.getProviders();
      res.json(providers);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch providers" });
    }
  });

  // Create qualification and run checks
  app.post("/api/qualifications", async (req, res) => {
    try {
      const validatedData = insertQualificationSchema.parse(req.body);
      
      // Create qualification record
      const qualification = await storage.createQualification(validatedData);
      
      // Simulate provider API calls and generate results
      const providers = await storage.getProviders();
      const results: QualificationResult[] = [];
      
      for (const provider of providers) {
        for (const service of provider.services) {
          // Check if service type matches requested types
          const serviceTypeMatch = validatedData.serviceTypes.some(type => 
            type === 'internet' || type === 'fiber' || type === 'voice' || type === 'ethernet'
          );
          
          if (serviceTypeMatch) {
            const status = service.availabilityCheck(validatedData.address);
            
            results.push({
              providerId: provider.id,
              providerName: provider.name,
              providerLogo: provider.logo,
              serviceType: service.name,
              technology: service.technology,
              maxSpeed: `${service.maxDownload}/${service.maxUpload} Mbps`,
              uploadSpeed: `${service.maxUpload} Mbps`,
              serviceClass: service.serviceClass,
              sla: service.sla,
              installTime: `${service.installTimeMin}-${service.installTimeMax} business days`,
              status,
              features: service.features,
              voiceChannels: service.voiceChannels,
              bundleOptions: service.bundleOptions
            });
          }
        }
      }
      
      // Update qualification with results
      const updatedQualification = await storage.updateQualificationResults(qualification.id, results);
      
      res.json(updatedQualification);
    } catch (error) {
      res.status(400).json({ message: "Invalid qualification data" });
    }
  });

  // Get qualification results
  app.get("/api/qualifications/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const qualification = await storage.getQualification(id);
      
      if (!qualification) {
        return res.status(404).json({ message: "Qualification not found" });
      }
      
      res.json(qualification);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch qualification" });
    }
  });

  // Create quote request
  app.post("/api/quote-requests", async (req, res) => {
    try {
      const validatedData = insertQuoteRequestSchema.parse(req.body);
      
      const quoteRequest = await storage.createQuoteRequest(validatedData);
      
      // In a real application, this would send emails to providers
      // For now, we'll just simulate the process
      console.log(`Quote request ${quoteRequest.id} created for providers:`, validatedData.providerIds);
      console.log(`Contact: ${validatedData.contactName} (${validatedData.email})`);
      
      res.json({ 
        success: true, 
        message: "Quote request sent successfully",
        quoteRequestId: quoteRequest.id 
      });
    } catch (error) {
      res.status(400).json({ message: "Invalid quote request data" });
    }
  });

  // Get all quote requests (admin endpoint)
  app.get("/api/quote-requests", async (req, res) => {
    try {
      const quoteRequests = await storage.getQuoteRequests();
      res.json(quoteRequests);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch quote requests" });
    }
  });

  // Validate address (mock implementation)
  app.post("/api/validate-address", async (req, res) => {
    try {
      const { address } = req.body;
      
      if (!address || address.trim().length < 5) {
        return res.status(400).json({ 
          valid: false, 
          message: "Please enter a complete address" 
        });
      }
      
      // Mock address validation - in real app would use Google Places API
      const formattedAddress = address.trim();
      
      res.json({
        valid: true,
        formatted: formattedAddress,
        message: "Address validated successfully"
      });
    } catch (error) {
      res.status(500).json({ message: "Address validation failed" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
