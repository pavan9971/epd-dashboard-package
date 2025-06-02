import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { ScrollArea } from './ui/scroll-area';

interface ComplianceProps {
  data: any[];
  comparisonMode: boolean;
}

const Compliance: React.FC<ComplianceProps> = ({ data, comparisonMode }) => {
  const [selectedStandard, setSelectedStandard] = useState<string | null>(null);
  const [showRecommendations, setShowRecommendations] = useState(true);

  const productInfo = data[0] || null;

  // Smart recommendations based on compliance data
  const getSmartRecommendations = () => {
    if (!productInfo?.complianceStandards) return [];

    const recommendations: string[] = [];
    const standards = productInfo.complianceStandards;

    // Check for key standards
    if (standards.includes('EN 15804')) {
      recommendations.push("✅ Compliant with EN 15804 - Meets European sustainability standards");
    }
    if (standards.includes('ISO 14025')) {
      recommendations.push("✅ ISO 14025 certified - Ensures high-quality environmental declarations");
    }
    if (standards.includes('B-EPD')) {
      recommendations.push("✅ B-EPD verified - Validated by Belgian national program");
    }

    // Add improvement suggestions
    if (!standards.includes('EN 15804')) {
      recommendations.push("💡 Consider EN 15804 certification for European market access");
    }
    if (!standards.includes('ISO 14025')) {
      recommendations.push("💡 Pursue ISO 14025 certification for international recognition");
    }

    return recommendations;
  };

  if (!productInfo) {
    return (
      <Alert>
        <AlertDescription>
          Please upload an EPD file to view compliance information.
        </AlertDescription>
      </Alert>
    );
  }

  const recommendations = getSmartRecommendations();

  return (
    <div className="space-y-6">
      {showRecommendations && recommendations.length > 0 && (
        <Alert className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
          <AlertTitle className="text-green-800">
            Smart Compliance Insights
          </AlertTitle>
          <AlertDescription className="text-green-700">
            <ul className="list-none space-y-2">
              {recommendations.map((rec, index) => (
                <li key={index}>{rec}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      {/* Product Information Header */}
      <Card className="bg-gradient-to-r from-slate-50 to-blue-50">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-blue-800">
            {productInfo.productName}
          </CardTitle>
          <CardDescription>
            Manufacturer: {productInfo.manufacturer}
            <br />
            Verification Number: {productInfo.metadata?.verificationNumber}
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Standards Compliance */}
      <Card>
        <CardHeader>
          <CardTitle>Compliance Standards</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px]">
            <div className="space-y-4">
              {productInfo.complianceStandards?.map((standard: string) => (
                <Card key={standard} className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold">{standard}</h4>
                      <p className="text-sm text-gray-600">
                        Verified: {productInfo.metadata?.publicationDate}
                      </p>
                    </div>
                    <Badge variant="outline">Compliant</Badge>
                  </div>
                  <Progress
                    value={100}
                    className="mt-2"
                  />
                </Card>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default Compliance;
