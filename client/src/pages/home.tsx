import { useState } from "react";
import { Network, FileText, HelpCircle } from "lucide-react";
import { QualificationForm } from "@/components/qualification-form";
import { QualificationResults } from "@/components/qualification-results";
import { QuoteRequestModal } from "@/components/quote-request-modal";
import { LoadingState } from "@/components/ui/loading-state";
import { Button } from "@/components/ui/button";
import { useQualification } from "@/hooks/use-qualification";

type ViewState = 'form' | 'loading' | 'results';

export default function Home() {
  const [viewState, setViewState] = useState<ViewState>('form');
  const [qualificationId, setQualificationId] = useState<number>();
  const [selectedProviders, setSelectedProviders] = useState<string[]>([]);
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);

  const { data: qualification } = useQualification(qualificationId);

  const handleQualificationStart = () => {
    setViewState('loading');
  };

  const handleQualificationComplete = (id: number) => {
    setQualificationId(id);
    setViewState('results');
  };

  const handleRequestQuotes = (providerIds: string[]) => {
    setSelectedProviders(providerIds);
    setIsQuoteModalOpen(true);
  };

  const handleNewQualification = () => {
    setViewState('form');
    setQualificationId(undefined);
    setSelectedProviders([]);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="flex items-center">
                  <Network className="text-primary text-2xl mr-3" />
                  <span className="text-xl font-bold text-gray-900">NextGen Telecom</span>
                </div>
              </div>
              <nav className="hidden md:ml-8 md:flex md:space-x-8">
                <a href="#" className="text-primary border-b-2 border-primary px-1 pt-1 pb-4 text-sm font-medium">
                  Service Qualification
                </a>
                <a href="#" className="text-gray-500 hover:text-gray-700 px-1 pt-1 pb-4 text-sm font-medium">
                  My Quotes
                </a>
                <a href="#" className="text-gray-500 hover:text-gray-700 px-1 pt-1 pb-4 text-sm font-medium">
                  Help
                </a>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <Button className="bg-primary text-white hover:bg-primary/90">
                Sign In
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {viewState === 'form' && (
          <QualificationForm
            onQualificationStart={handleQualificationStart}
            onQualificationComplete={handleQualificationComplete}
          />
        )}

        {viewState === 'loading' && (
          <LoadingState
            title="Checking Service Availability"
            description="Querying multiple providers for the best options..."
            progress={65}
          />
        )}

        {viewState === 'results' && qualification?.results && (
          <QualificationResults
            address={qualification.address}
            results={qualification.results}
            onRequestQuotes={handleRequestQuotes}
            onNewQualification={handleNewQualification}
          />
        )}

        {/* Quote Request Modal */}
        <QuoteRequestModal
          isOpen={isQuoteModalOpen}
          onClose={() => setIsQuoteModalOpen(false)}
          selectedProviders={selectedProviders}
          qualificationResults={qualification?.results || []}
          qualificationId={qualificationId}
        />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="col-span-2">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">NextGen Telecom Marketplace</h3>
              <p className="text-gray-600 mb-4">
                Simplifying telecom service discovery and qualification for businesses across Australia. 
                Connect with multiple providers and find the best solutions for your needs.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Services</h4>
              <ul className="space-y-2 text-gray-600">
                <li><a href="#" className="hover:text-gray-900">Service Qualification</a></li>
                <li><a href="#" className="hover:text-gray-900">Multi-Site Analysis</a></li>
                <li><a href="#" className="hover:text-gray-900">Quote Management</a></li>
                <li><a href="#" className="hover:text-gray-900">Provider Directory</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Support</h4>
              <ul className="space-y-2 text-gray-600">
                <li><a href="#" className="hover:text-gray-900">Help Center</a></li>
                <li><a href="#" className="hover:text-gray-900">Contact Us</a></li>
                <li><a href="#" className="hover:text-gray-900">API Documentation</a></li>
                <li><a href="#" className="hover:text-gray-900">Status Page</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-200 mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm">© 2024 NextGen Telecom Marketplace. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 sm:mt-0">
              <a href="#" className="text-gray-500 hover:text-gray-700 text-sm">Privacy Policy</a>
              <a href="#" className="text-gray-500 hover:text-gray-700 text-sm">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
