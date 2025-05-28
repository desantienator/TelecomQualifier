import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X, Mail, User, Building, Phone, MessageSquare, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useCreateQuoteRequest } from "@/hooks/use-qualification";
import type { QuoteRequestData, QualificationResult } from "@/lib/types";

const quoteRequestSchema = z.object({
  contactName: z.string().min(2, "Please enter your full name"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional(),
  company: z.string().optional(),
  requirements: z.string().optional(),
  timeline: z.string().optional(),
});

interface QuoteRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedProviders: string[];
  qualificationResults: QualificationResult[];
  qualificationId?: number;
}

export function QuoteRequestModal({ 
  isOpen, 
  onClose, 
  selectedProviders, 
  qualificationResults,
  qualificationId 
}: QuoteRequestModalProps) {
  const { toast } = useToast();
  const createQuoteRequest = useCreateQuoteRequest();
  
  const form = useForm<QuoteRequestData>({
    resolver: zodResolver(quoteRequestSchema),
    defaultValues: {
      contactName: "",
      email: "",
      phone: "",
      company: "",
      requirements: "",
      timeline: "1-3 months",
    },
  });

  const selectedServices = qualificationResults.filter(result => 
    selectedProviders.includes(result.providerId)
  );

  const onSubmit = async (data: QuoteRequestData) => {
    try {
      await createQuoteRequest.mutateAsync({
        ...data,
        qualificationId,
        providerIds: selectedProviders,
      });
      
      toast({
        title: "Quote Request Sent!",
        description: "Your request has been sent to the selected providers. You'll receive a response within 24-48 hours.",
      });
      
      form.reset();
      onClose();
    } catch (error) {
      toast({
        title: "Failed to Send Request",
        description: "Please try again or contact support if the problem persists.",
        variant: "destructive",
      });
    }
  };

  const getProviderLogo = (logo: string) => {
    const colors = {
      'NBN': 'from-blue-600 to-green-600',
      'T': 'from-purple-600 to-pink-600', 
      'O': 'from-yellow-500 to-yellow-600',
      'TPG': 'from-green-600 to-blue-600'
    };
    
    return (
      <div className={`w-8 h-8 bg-gradient-to-br ${colors[logo as keyof typeof colors] || 'from-gray-600 to-gray-700'} rounded-lg flex items-center justify-center mr-3`}>
        <span className="text-white font-bold text-sm">{logo}</span>
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Mail className="w-5 h-5 mr-2" />
            Request Quote
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Selected Services */}
          <div className="bg-muted rounded-lg p-4">
            <h4 className="font-medium text-foreground mb-3">Selected Services</h4>
            <div className="space-y-2">
              {selectedServices.map((service, index) => (
                <div key={`${service.providerId}-${index}`} className="flex items-center justify-between">
                  <div className="flex items-center">
                    {getProviderLogo(service.providerLogo)}
                    <div>
                      <p className="font-medium text-foreground">{service.providerName}</p>
                      <p className="text-sm text-muted-foreground">{service.serviceType} - {service.maxSpeed}</p>
                    </div>
                  </div>
                  <Badge className="bg-primary/10 text-primary hover:bg-primary/10">
                    {service.status === 'available' ? 'Available' : 'Survey Required'}
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="contactName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center">
                        <User className="w-4 h-4 mr-2" />
                        Contact Name *
                      </FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center">
                        <Mail className="w-4 h-4 mr-2" />
                        Email Address *
                      </FormLabel>
                      <FormControl>
                        <Input type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center">
                        <Phone className="w-4 h-4 mr-2" />
                        Phone Number
                      </FormLabel>
                      <FormControl>
                        <Input type="tel" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="company"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center">
                        <Building className="w-4 h-4 mr-2" />
                        Company Name
                      </FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="requirements"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Additional Requirements
                    </FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Please describe any specific requirements, preferred installation timeframes, or questions..."
                        rows={4}
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="timeline"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center">
                      <Clock className="w-4 h-4 mr-2" />
                      Preferred Installation Timeline
                    </FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="within-30-days">Within 30 days</SelectItem>
                        <SelectItem value="1-3 months">1-3 months</SelectItem>
                        <SelectItem value="3-6 months">3-6 months</SelectItem>
                        <SelectItem value="flexible">Flexible timeline</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={createQuoteRequest.isPending}
                  className="bg-primary text-white hover:bg-primary/90"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Send Quote Request
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
