import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { QualificationFormData, Qualification, QuoteRequestData } from "@/lib/types";

export function useCreateQualification() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: QualificationFormData): Promise<Qualification> => {
      const response = await apiRequest("POST", "/api/qualifications", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/qualifications"] });
    },
  });
}

export function useQualification(id: number | undefined) {
  return useQuery<Qualification>({
    queryKey: ["/api/qualifications", id],
    enabled: !!id,
  });
}

export function useCreateQuoteRequest() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: QuoteRequestData) => {
      const response = await apiRequest("POST", "/api/quote-requests", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/quote-requests"] });
    },
  });
}

export function useValidateAddress() {
  return useMutation({
    mutationFn: async (address: string) => {
      const response = await apiRequest("POST", "/api/validate-address", { address });
      return response.json();
    },
  });
}
