import { useState } from "react";
import { Network, FileText, HelpCircle } from "lucide-react";
import { QualificationForm } from "@/components/qualification-form";
import { QualificationResults } from "@/components/qualification-results";
import { QuoteRequestModal } from "@/components/quote-request-modal";
import { LoadingState } from "@/components/ui/loading-state";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
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
    // Add a small delay to ensure the qualification data is available
    setTimeout(() => {
      setViewState('results');
    }, 500);
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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card shadow-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <button 
                  onClick={handleNewQualification}
                  className="flex items-center hover:opacity-80 transition-opacity"
                >
                  <Network className="text-primary text-2xl mr-3" />
                  <span className="text-xl font-bold text-foreground">NextGen Telecom</span>
                </button>
              </div>
              <nav className="hidden md:ml-8 md:flex md:space-x-8">
                <button 
                  onClick={handleNewQualification}
                  className={`px-1 pt-1 pb-4 text-sm font-medium ${
                    viewState === 'form' || viewState === 'loading' 
                      ? 'text-primary border-b-2 border-primary' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Service Qualification
                </button>
                <button 
                  className={`px-1 pt-1 pb-4 text-sm font-medium ${
                    viewState === 'results' 
                      ? 'text-primary border-b-2 border-primary' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                  disabled={!qualification}
                  onClick={() => qualification && setViewState('results')}
                >
                  Results
                </button>
                <a href="#" className="text-gray-500 hover:text-gray-700 px-1 pt-1 pb-4 text-sm font-medium">
                  Help
                </a>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              {viewState === 'results' && (
                <Button 
                  variant="outline" 
                  onClick={handleNewQualification}
                  className="border-primary text-primary hover:bg-primary hover:text-white"
                >
                  New Search
                </Button>
              )}
              <Button className="bg-primary text-white hover:bg-primary/90">
                Sign In
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb Navigation */}
        {viewState !== 'form' && (
          <nav className="flex mb-6" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-1 md:space-x-2">
              <li className="flex">
                <button
                  onClick={handleNewQualification}
                  className="text-gray-400 hover:text-gray-500 text-sm font-medium"
                >
                  Service Qualification
                </button>
              </li>
              <li>
                <div className="flex items-center">
                  <svg className="flex-shrink-0 h-4 w-4 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="ml-1 md:ml-2 text-sm font-medium text-gray-500">
                    {viewState === 'loading' ? 'Processing...' : 'Results'}
                  </span>
                </div>
              </li>
            </ol>
          </nav>
        )}

        {viewState === 'form' && (
          <QualificationForm
            onQualificationStart={handleQualificationStart}
            onQualificationComplete={handleQualificationComplete}
          />
        )}

        {viewState === 'loading' && (
          <div className="space-y-4">
            <LoadingState
              title="Checking Service Availability"
              description="Querying multiple providers for the best options..."
              progress={65}
            />
            <div className="text-center">
              <button
                onClick={handleNewQualification}
                className="text-primary hover:text-primary/80 text-sm font-medium"
              >
                Cancel and Start New Search
              </button>
            </div>
          </div>
        )}

        {viewState === 'results' && qualification?.results && (
          <QualificationResults
            address={qualification.address}
            results={qualification.results}
            onRequestQuotes={handleRequestQuotes}
            onNewQualification={handleNewQualification}
          />
        )}

        {viewState === 'results' && qualification && !qualification.results && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
            <div className="text-gray-400 mb-4">
              <Network className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Services Found</h3>
            <p className="text-gray-600 mb-6">
              We couldn't find any available services for this address. This could be due to location limitations or temporary provider issues.
            </p>
            <Button onClick={handleNewQualification} className="bg-primary text-white hover:bg-primary/90">
              Try Another Address
            </Button>
          </div>
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
      <footer className="bg-card border-t border-border mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="col-span-2">
              <h3 className="text-lg font-semibold text-foreground mb-4">NextGen Telecom Marketplace</h3>
              <p className="text-muted-foreground mb-4">
                Simplifying telecom service discovery and qualification for businesses across Australia. 
                Connect with multiple providers and find the best solutions for your needs.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Services</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-foreground">Service Qualification</a></li>
                <li><a href="#" className="hover:text-foreground">Multi-Site Analysis</a></li>
                <li><a href="#" className="hover:text-foreground">Quote Management</a></li>
                <li><a href="#" className="hover:text-foreground">Provider Directory</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Support</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-foreground">Help Center</a></li>
                <li><a href="#" className="hover:text-foreground">Contact Us</a></li>
                <li><a href="#" className="hover:text-foreground">API Documentation</a></li>
                <li><a href="#" className="hover:text-foreground">Status Page</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center">
            <p className="text-muted-foreground text-sm">© 2024 NextGen Telecom Marketplace. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 sm:mt-0">
              <a href="#" className="text-muted-foreground hover:text-foreground text-sm">Privacy Policy</a>
              <a href="#" className="text-muted-foreground hover:text-foreground text-sm">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
