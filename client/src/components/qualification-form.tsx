import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { MapPin, Network, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useCreateQualification } from "@/hooks/use-qualification";
import type { QualificationFormData } from "@/lib/types";

const qualificationSchema = z.object({
  address: z.string().min(5, "Please enter a complete address"),
  serviceTypes: z.array(z.string()).min(1, "Please select at least one service type"),
});

const serviceTypeOptions = [
  { id: "internet", label: "Business Internet / Fiber" },
  { id: "voice", label: "Voice Services / SIP Trunks" },
  { id: "nbn", label: "NBN Services" },
  { id: "ethernet", label: "Ethernet / Dedicated Lines" },
];

interface QualificationFormProps {
  onQualificationStart: () => void;
  onQualificationComplete: (qualificationId: number) => void;
}

export function QualificationForm({ onQualificationStart, onQualificationComplete }: QualificationFormProps) {
  const { toast } = useToast();
  const createQualification = useCreateQualification();
  
  const form = useForm<QualificationFormData>({
    resolver: zodResolver(qualificationSchema),
    defaultValues: {
      address: "",
      serviceTypes: ["internet"],
    },
  });

  const onSubmit = async (data: QualificationFormData) => {
    try {
      onQualificationStart();
      
      // Simulate API processing time
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const qualification = await createQualification.mutateAsync(data);
      onQualificationComplete(qualification.id);
      
      toast({
        title: "Qualification Complete",
        description: "Found available services from multiple providers.",
      });
    } catch (error) {
      toast({
        title: "Qualification Failed",
        description: "Please check your address and try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Find Available Telecom Services</h1>
        <p className="text-gray-600">Enter an address to discover available internet, voice, and data services from multiple providers.</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center text-sm font-medium text-gray-700">
                      <MapPin className="w-4 h-4 mr-2" />
                      Address
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Start typing an address..."
                        className="text-base"
                        {...field}
                      />
                    </FormControl>
                    <p className="text-sm text-gray-500">We'll automatically validate and format your address</p>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div>
              <FormField
                control={form.control}
                name="serviceTypes"
                render={() => (
                  <FormItem>
                    <FormLabel className="flex items-center text-sm font-medium text-gray-700">
                      <Network className="w-4 h-4 mr-2" />
                      Service Types
                    </FormLabel>
                    <div className="space-y-3">
                      {serviceTypeOptions.map((option) => (
                        <FormField
                          key={option.id}
                          control={form.control}
                          name="serviceTypes"
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={option.id}
                                className="flex flex-row items-start space-x-3 space-y-0"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(option.id)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([...field.value, option.id])
                                        : field.onChange(
                                            field.value?.filter(
                                              (value) => value !== option.id
                                            )
                                          );
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="text-sm font-normal">
                                  {option.label}
                                </FormLabel>
                              </FormItem>
                            );
                          }}
                        />
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="flex justify-between items-center">
            <Button type="button" variant="ghost" className="text-primary">
              <Plus className="w-4 h-4 mr-2" />
              Add Multiple Locations
            </Button>
            <Button 
              type="submit" 
              disabled={createQualification.isPending}
              className="bg-primary text-white hover:bg-primary/90"
            >
              <MapPin className="w-4 h-4 mr-2" />
              Find Services
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
