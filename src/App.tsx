import React, { useState } from 'react';
import { ThemeProvider } from 'next-themes';
import Dashboard from './components/Dashboard';
import { Toaster } from './components/ui/toaster';
import 'leaflet/dist/leaflet.css';
import { ScrollArea } from './components/ui/scroll-area';
import { Button } from './components/ui/button';
import { Card } from './components/ui/card';
import { getDocument, GlobalWorkerOptions, PDFDocumentProxy, TextItem } from 'pdfjs-dist/build/pdf.js';
import { useToast } from './hooks/use-toast';

// Set worker source for pdfjs-dist
GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.js', import.meta.url).toString();

// Define the type for EPD data based on sampleEpdData structure
type EpdDataType = {
  productName: string;
  manufacturer: string;
  manufacturerLocation: string;
  productDescription: string;
  environmentalImpacts: {
    [key: string]: { [key: string]: number };
  };
  lifeCycleStages: { [key: string]: string };
  complianceStandards: string[];
  metadata: {
    publicationDate: string;
    validUntil: string;
    verificationNumber: string;
  };
};

// Sample EPD data (remains for fallback and structure reference)
const sampleEpdData: EpdDataType[] = [
  {
    "productName": "Gramitherm© 100",
    "manufacturer": "GRAMITHERM",
    "manufacturerLocation": "Belgium",
    "productDescription": "Panneau d'isolation thermoacoustique",
    "environmentalImpacts": {
      "gwpTotal": {
        "a1a3": 5.93e-02,
        "a4": 4.92e-02,
        "a5": 8.68e-01,
        "c1": 8.52e-02,
        "c2": 8.77e-02,
        "c3": 3.54e-01,
        "c4": 1.66e+00,
        "d": -1.00e+00
      },
      "gwpFossil": {
        "a1a3": 1.12e+00,
        "a4": 4.92e-02,
        "a5": 1.35e+00,
        "c1": 8.52e-02,
        "c2": 2.06e+00,
        "c3": 8.70e-04,
        "c4": 1.33e+00,
        "d": -1.50e+00
      },
      "gwpBiogenic": {
        "a1a3": -7.03e+00,
        "a4": 5.00e+00,
        "a5": -4.84e-01,
        "c1": 0.00e+00,
        "c2": 6.72e+00,
        "c3": 3.54e-01,
        "c4": 3.32e-01,
        "d": -2.00e+00
      },
      "gwpLuluc": {
        "a1a3": 9.79e-04,
        "a4": 1.97e-05,
        "a5": 6.31e-04,
        "c1": 3.35e-06,
        "c2": 5.41e-05,
        "c3": 2.27e-07,
        "c4": 2.40e-03,
        "d": -1.00e-03
      },
      "waterUsage": {
        "a1a3": 9.97e-04,
        "a4": 3.24e-05,
        "a5": 5.78e-04,
        "c1": 1.03e-03,
        "c2": 7.91e-04,
        "c3": 4.37e-06,
        "c4": 4.15e-04,
        "d": -2.00e-03
      }
    },
    "lifeCycleStages": {
      "a1a3": "Production",
      "a4": "Transport to construction site",
      "a5": "Installation",
      "b1b7": "Use phase",
      "c1": "Deconstruction",
      "c2": "Transport",
      "c3": "Waste processing",
      "c4": "Disposal",
      "d": "Benefits beyond system boundary"
    },
    "complianceStandards": [
      "EN 15804",
      "ISO 14025",
      "B-EPD"
    ],
    "metadata": {
      "publicationDate": "11/04/2023",
      "validUntil": "07/04/2028",
      "verificationNumber": "B-EPD-23.0183.001-01.00.01"
    }
  },
  // Adding a second sample EPD with slightly different values for comparison testing
  {
    "productName": "EcoInsul 120",
    "manufacturer": "EcoMaterials",
    "manufacturerLocation": "France",
    "productDescription": "Panneau d'isolation écologique",
    "environmentalImpacts": {
      "gwpTotal": {
        "a1a3": 7.25e-02,
        "a4": 5.33e-02,
        "a5": 7.92e-01,
        "c1": 9.12e-02,
        "c2": 7.65e-02,
        "c3": 4.12e-01,
        "c4": 1.45e+00,
        "d": -1.20e+00
      },
      "gwpFossil": {
        "a1a3": 1.35e+00,
        "a4": 5.33e-02,
        "a5": 1.22e+00,
        "c1": 9.12e-02,
        "c2": 1.87e+00,
        "c3": 9.50e-04,
        "c4": 1.25e+00,
        "d": -1.65e+00
      },
      "gwpBiogenic": {
        "a1a3": -6.45e+00,
        "a4": 4.75e+00,
        "a5": -5.12e-01,
        "c1": 0.00e+00,
        "c2": 6.25e+00,
        "c3": 3.87e-01,
        "c4": 3.65e-01,
        "d": -2.15e+00
      },
      "gwpLuluc": {
        "a1a3": 1.12e-03,
        "a4": 2.15e-05,
        "a5": 5.87e-04,
        "c1": 3.85e-06,
        "c2": 6.12e-05,
        "c3": 2.55e-07,
        "c4": 2.25e-03,
        "d": -1.15e-03
      },
      "waterUsage": {
        "a1a3": 1.15e-03,
        "a4": 3.75e-05,
        "a5": 6.25e-04,
        "c1": 1.15e-03,
        "c2": 8.25e-04,
        "c3": 4.85e-06,
        "c4": 4.45e-04,
        "d": -2.25e-03
      }
    },
    "lifeCycleStages": {
      "a1a3": "Production",
      "a4": "Transport to construction site",
      "a5": "Installation",
      "b1b7": "Use phase",
      "c1": "Deconstruction",
      "c2": "Transport",
      "c3": "Waste processing",
      "c4": "Disposal",
      "d": "Benefits beyond system boundary"
    },
    "complianceStandards": [
      "EN 15804",
      "ISO 14025",
      "PEP ecopassport"
    ],
    "metadata": {
      "publicationDate": "15/05/2023",
      "validUntil": "15/05/2028",
      "verificationNumber": "PEP-FR-2023-0125"
    }
  }
  // ... (rest of sampleEpdData remains the same)
];

const App: React.FC = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [extractedData, setExtractedData] = useState<EpdDataType[] | null>(null);
  const [isProcessingPdf, setIsProcessingPdf] = useState(false);
  const { toast } = useToast();

  const onFileUpload = async (files: FileList | null) => {
    setIsProcessingPdf(true);
    try {
      if (!files || files.length === 0) {
        console.log('No files selected.');
        setExtractedData(null); // Clear previous data if no file is selected
        return;
      }

      const file = files[0];
    const reader = new FileReader();

    reader.onload = async (event) => {
      if (event.target?.result) {
        const arrayBuffer = event.target.result as ArrayBuffer;
        try {
          const pdf: PDFDocumentProxy = await getDocument({ data: arrayBuffer }).promise;
          let fullText = '';

          for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            const pageText = textContent.items.map(item => (item as TextItem).str).join(' ');
            fullText += pageText + '\n';
          }

          console.log('Extracted Text:', fullText);

          // Placeholder: Create dummy data (using a modified version of the first sampleEpdData item)
          const dummyEpdData: EpdDataType = {
            ...sampleEpdData[0], // Base it on the first sample
            productName: "Extracted Product Alpha",
            manufacturer: "PDF Extractor Inc.",
            productDescription: "This data was extracted from a PDF (dummy). Original text logged to console.",
            environmentalImpacts: {
              ...sampleEpdData[0].environmentalImpacts,
              gwpTotal: {
                ...sampleEpdData[0].environmentalImpacts.gwpTotal,
                a1a3: 0.123, // Dummy value
                c4: 2.345,   // Dummy value
              }
            },
            metadata: {
              ...sampleEpdData[0].metadata,
              publicationDate: new Date().toLocaleDateString(),
              verificationNumber: "PDF-EXTRACTED-" + new Date().getTime(),
            }
          };
          setExtractedData([dummyEpdData]); // Set as an array
          toast({
            title: "PDF Processed (Placeholder Data)",
            description: "Text extracted from PDF. Displaying placeholder EPD data for now.",
          });

        } catch (error) {
          console.error('Error parsing PDF:', error);
          setExtractedData(null); // Reset or handle error state
          toast({
            variant: "destructive",
            title: "Error Processing PDF",
            description: "Could not extract data from the PDF. Please ensure it's a valid EPD document and try again.",
          });
        }
      }
    };

    reader.onerror = (error) => {
      console.error('Error reading file:', error);
      setExtractedData(null);
      toast({
        variant: "destructive",
        title: "Error Reading File",
        description: "Could not read the selected file.",
      });
      // setIsProcessingPdf(false); // Moved to finally
    };

    reader.readAsArrayBuffer(file);
    } catch (outerError) {
      console.error("Outer error in onFileUpload:", outerError);
      setExtractedData(null);
      toast({
        variant: "destructive",
        title: "Unexpected Error",
        description: "An unexpected error occurred during file processing.",
      });
      // setIsProcessingPdf(false); // Moved to finally
    } finally {
      setIsProcessingPdf(false);
    }
  };

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <div className={`min-h-screen ${darkMode ? 'dark' : ''} bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-indigo-950`}>
        <div className="container mx-auto px-4 py-8">
          <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-xl rounded-xl p-6">
            <ScrollArea className="h-[90vh]">
              <Dashboard
                data={extractedData || sampleEpdData}
                onFileUpload={onFileUpload}
                isProcessingPdf={isProcessingPdf}
              />
            </ScrollArea>
          </Card>
          <Button
            variant="outline"
            size="icon"
            className="fixed bottom-4 right-4 rounded-full"
            onClick={() => setDarkMode(!darkMode)}
          >
            {darkMode ? '🌞' : '🌙'}
          </Button>
        </div>
        <Toaster />
      </div>
    </ThemeProvider>
  );
}

export default App;
