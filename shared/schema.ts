import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const qualifications = pgTable("qualifications", {
  id: serial("id").primaryKey(),
  address: text("address").notNull(),
  serviceTypes: jsonb("service_types").$type<string[]>().notNull(),
  results: jsonb("results").$type<QualificationResult[]>(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const quoteRequests = pgTable("quote_requests", {
  id: serial("id").primaryKey(),
  qualificationId: integer("qualification_id").references(() => qualifications.id),
  providerIds: jsonb("provider_ids").$type<string[]>().notNull(),
  contactName: text("contact_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  company: text("company"),
  requirements: text("requirements"),
  timeline: text("timeline"),
  status: text("status").default("pending").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertQualificationSchema = createInsertSchema(qualifications).pick({
  address: true,
  serviceTypes: true,
});

export const insertQuoteRequestSchema = createInsertSchema(quoteRequests).pick({
  qualificationId: true,
  providerIds: true,
  contactName: true,
  email: true,
  phone: true,
  company: true,
  requirements: true,
  timeline: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertQualification = z.infer<typeof insertQualificationSchema>;
export type Qualification = typeof qualifications.$inferSelect;
export type InsertQuoteRequest = z.infer<typeof insertQuoteRequestSchema>;
export type QuoteRequest = typeof quoteRequests.$inferSelect;

// Additional types for API responses
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

export interface Provider {
  id: string;
  name: string;
  logo: string;
  type: string;
  services: ServiceOffering[];
}

export interface ServiceOffering {
  id: string;
  name: string;
  technology: string;
  maxDownload: number;
  maxUpload: number;
  serviceClass: string;
  sla?: string;
  installTimeMin: number;
  installTimeMax: number;
  features: string[];
  voiceChannels?: number;
  bundleOptions?: string[];
  availabilityCheck: (address: string) => 'available' | 'limited' | 'unavailable' | 'survey_required';
}
