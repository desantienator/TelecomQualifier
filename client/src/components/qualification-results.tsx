import { useState } from "react";
import { Check, Clock, AlertTriangle, Download, CheckSquare, Square } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { QualificationResult } from "@/lib/types";

interface QualificationResultsProps {
  address: string;
  results: QualificationResult[];
  onRequestQuotes: (selectedProviders: string[]) => void;
  onNewQualification: () => void;
}

export function QualificationResults({ 
  address, 
  results, 
  onRequestQuotes, 
  onNewQualification 
}: QualificationResultsProps) {
  const [selectedProviders, setSelectedProviders] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("provider");
  const [filterBy, setFilterBy] = useState("all");

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'available':
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            <Check className="w-3 h-3 mr-1" />
            Available
          </Badge>
        );
      case 'survey_required':
        return (
          <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">
            <Clock className="w-3 h-3 mr-1" />
            Subject to Survey
          </Badge>
        );
      case 'limited':
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
            <AlertTriangle className="w-3 h-3 mr-1" />
            Limited
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary">
            Unavailable
          </Badge>
        );
    }
  };

  const getProviderLogo = (logo: string, name: string) => {
    const colors = {
      'NBN': 'from-blue-600 to-green-600',
      'T': 'from-purple-600 to-pink-600', 
      'O': 'from-yellow-500 to-yellow-600',
      'TPG': 'from-green-600 to-blue-600'
    };
    
    return (
      <div className={`w-12 h-12 bg-gradient-to-br ${colors[logo as keyof typeof colors] || 'from-gray-600 to-gray-700'} rounded-lg flex items-center justify-center mr-4`}>
        <span className="text-white font-bold text-lg">{logo}</span>
      </div>
    );
  };

  const toggleProvider = (providerId: string) => {
    setSelectedProviders(prev => 
      prev.includes(providerId) 
        ? prev.filter(id => id !== providerId)
        : [...prev, providerId]
    );
  };

  const selectAll = () => {
    const availableProviders = results
      .filter(r => r.status === 'available' || r.status === 'survey_required')
      .map(r => r.providerId);
    setSelectedProviders(availableProviders);
  };

  const clearSelection = () => {
    setSelectedProviders([]);
  };

  const filteredResults = results.filter(result => {
    if (filterBy === 'all') return true;
    return result.technology.toLowerCase().includes(filterBy.toLowerCase());
  });

  const sortedResults = [...filteredResults].sort((a, b) => {
    switch (sortBy) {
      case 'speed':
        const speedA = parseInt(a.maxSpeed.split('/')[0]);
        const speedB = parseInt(b.maxSpeed.split('/')[0]);
        return speedB - speedA;
      case 'technology':
        return a.technology.localeCompare(b.technology);
      default:
        return a.providerName.localeCompare(b.providerName);
    }
  });

  const totalProviders = new Set(results.map(r => r.providerId)).size;
  const totalServices = results.length;
  const maxSpeed = Math.max(...results.map(r => parseInt(r.maxSpeed.split('/')[0])));

  return (
    <div className="space-y-6">
      {/* Results Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Available Services</h2>
          <p className="text-gray-600">{address}</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700">Sort by:</label>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="provider">Provider</SelectItem>
                <SelectItem value="speed">Speed</SelectItem>
                <SelectItem value="technology">Technology</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700">Filter:</label>
            <Select value={filterBy} onValueChange={setFilterBy}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Technologies</SelectItem>
                <SelectItem value="fibre">Fibre</SelectItem>
                <SelectItem value="nbn">NBN</SelectItem>
                <SelectItem value="ethernet">Ethernet</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Results Summary */}
      <Card>
        <CardContent className="p-6 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{totalProviders}</div>
                <div className="text-sm text-gray-600">Providers</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{totalServices}</div>
                <div className="text-sm text-gray-600">Services Available</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-amber-600">{maxSpeed}</div>
                <div className="text-sm text-gray-600">Mbps Max Speed</div>
              </div>
            </div>
            <Button 
              onClick={() => onRequestQuotes(selectedProviders)}
              disabled={selectedProviders.length === 0}
              className="bg-primary text-white hover:bg-primary/90"
            >
              Request Selected Quotes
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Service Results */}
      <Card>
        <CardContent className="divide-y divide-gray-200">
          {sortedResults.map((result, index) => (
            <div key={`${result.providerId}-${index}`} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <Checkbox
                    checked={selectedProviders.includes(result.providerId)}
                    onCheckedChange={() => toggleProvider(result.providerId)}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      {getProviderLogo(result.providerLogo, result.providerName)}
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900">{result.providerName}</h4>
                        <p className="text-sm text-gray-600">{result.serviceType}</p>
                      </div>
                    </div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-3">
                      <div>
                        <div className="text-sm font-medium text-gray-700">Technology</div>
                        <div className="text-sm text-gray-900">{result.technology}</div>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-700">Max Speed</div>
                        <div className="text-sm text-gray-900">{result.maxSpeed}</div>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-700">Service Class</div>
                        <div className="text-sm text-gray-900">{result.serviceClass}</div>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-700">Install Time</div>
                        <div className="text-sm text-gray-900">{result.installTime}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      {getStatusBadge(result.status)}
                      <span className="text-sm text-gray-600">
                        {result.features[0]}
                      </span>
                    </div>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  onClick={() => onRequestQuotes([result.providerId])}
                  className="border-primary text-primary hover:bg-primary hover:text-white"
                >
                  Request Quote
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Results Actions */}
      <Card>
        <CardContent className="p-6 bg-gray-50">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={selectAll} className="text-primary">
                <CheckSquare className="w-4 h-4 mr-2" />
                Select All
              </Button>
              <Button variant="ghost" onClick={clearSelection}>
                <Square className="w-4 h-4 mr-2" />
                Clear Selection
              </Button>
              <Button variant="ghost">
                <Download className="w-4 h-4 mr-2" />
                Export Results
              </Button>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" onClick={onNewQualification}>
                New Qualification
              </Button>
              <Button 
                onClick={() => onRequestQuotes(selectedProviders)}
                disabled={selectedProviders.length === 0}
                className="bg-primary text-white hover:bg-primary/90"
              >
                Request Quotes for Selected ({selectedProviders.length})
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
