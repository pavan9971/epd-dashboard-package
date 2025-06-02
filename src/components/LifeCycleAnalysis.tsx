import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { ScrollArea } from './ui/scroll-area';
import { Button } from './ui/button';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';

interface LifeCycleAnalysisProps {
  data: any[];
  comparisonMode: boolean;
}

const LifeCycleAnalysis: React.FC<LifeCycleAnalysisProps> = ({ data, comparisonMode }) => {
  const [selectedMetric, setSelectedMetric] = useState('gwpTotal');
  const [showRecommendations, setShowRecommendations] = useState(true);
  
  const productInfo = data[0] || null;

  // Smart recommendations based on life cycle analysis
  const getSmartRecommendations = () => {
    if (!productInfo?.environmentalImpacts) return [];

    const recommendations: string[] = [];
    const impacts = productInfo.environmentalImpacts;

    // Analyze GWP impacts
    const gwpTotal = Object.values(impacts.gwpTotal).reduce((sum: number, val: any) => sum + Number(val), 0);
    if (gwpTotal < 0) {
      recommendations.push("🌟 Net negative carbon impact achieved - excellent environmental performance!");
    }

    // Analyze stage-specific impacts
    const productionImpact = impacts.gwpTotal.a1a3 || 0;
    const transportImpact = impacts.gwpTotal.a4 || 0;
    const disposalImpact = impacts.gwpTotal.c4 || 0;

    if (transportImpact > productionImpact) {
      recommendations.push("💡 Transport emissions are significant - consider local supply chain optimization");
    }

    if (disposalImpact > productionImpact) {
      recommendations.push("♻️ High end-of-life impact - recommend improving recyclability");
    }

    const benefitsBeyondLifecycle = impacts.gwpTotal.d || 0;
    if (benefitsBeyondLifecycle < 0) {
      recommendations.push("🎯 Positive beyond-lifecycle benefits detected - excellent circular economy potential");
    }

    return recommendations;
  };

  // Process the EPD data for visualization
  const prepareChartData = () => {
    if (!productInfo?.environmentalImpacts || !productInfo?.lifeCycleStages) return [];
    
    const impacts = productInfo.environmentalImpacts[selectedMetric];
    return Object.entries(impacts).map(([stage, value]) => ({
      stage: productInfo.lifeCycleStages[stage] || stage.toUpperCase(),
      value: Number(value),
      originalStage: stage
    }));
  };

  if (!productInfo) {
    return (
      <Alert>
        <AlertDescription>
          Please upload an EPD file to view life cycle analysis.
        </AlertDescription>
      </Alert>
    );
  }

  const recommendations = getSmartRecommendations();
  const chartData = prepareChartData();

  return (
    <div className="space-y-6">
      {showRecommendations && recommendations.length > 0 && (
        <Alert className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <AlertTitle className="text-blue-800">
            Smart Life Cycle Insights
          </AlertTitle>
          <AlertDescription className="text-blue-700">
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
            Life Cycle Assessment Details
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Metrics Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Life Cycle Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Chart */}
            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="stage" 
                    angle={-45} 
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar 
                    dataKey="value" 
                    fill="#3b82f6"
                    name={selectedMetric === 'gwpTotal' ? 'GWP Impact' : 
                          selectedMetric === 'waterUsage' ? 'Water Usage' :
                          selectedMetric === 'gwpFossil' ? 'Fossil Impact' :
                          'Impact Value'}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Stage Details */}
            <ScrollArea className="h-[200px]">
              <div className="space-y-4">
                {chartData.map((item) => (
                  <Card key={item.originalStage} className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold">{item.stage}</h4>
                        <p className="text-sm text-gray-600">Stage: {item.originalStage}</p>
                      </div>
                      <Badge variant="outline">
                        {item.value.toFixed(2)}
                      </Badge>
                    </div>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LifeCycleAnalysis;
