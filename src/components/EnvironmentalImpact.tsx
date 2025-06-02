import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './ui/card';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';

interface EnvironmentalImpactProps {
  data: any[];
  comparisonMode: boolean;
}

const EnvironmentalImpact: React.FC<EnvironmentalImpactProps> = ({
  data,
  comparisonMode,
}) => {
  const [activeMetric, setActiveMetric] = useState('gwpTotal');
  const [showInsights, setShowInsights] = useState(true);
  const [viewMode, setViewMode] = useState<'cards' | 'trends'>('cards');
  const [selectedMetricForDialog, setSelectedMetricForDialog] = useState<string | null>(null);

  // Simulated insights for behavioral nudges
  const insights = {
    gwpTotal: "🌟 This product's GWP is 15% lower than industry average",
    fossilImpact: "💡 Switching to renewable energy could reduce impact by 30%",
    biogenicImpact: "🌱 Strong carbon sequestration potential detected",
    waterUsage: "💧 Water usage optimized compared to similar products",
    luluc: "🌳 Land use change impact is within acceptable limits"
  };

  const metrics = [
    { id: 'gwpTotal', name: 'Global Warming Potential', icon: '🌡️', unit: 'kg CO₂ eq' },
    { id: 'fossilImpact', name: 'Fossil Impact', icon: '⚡', unit: 'MJ' },
    { id: 'biogenicImpact', name: 'Biogenic Impact', icon: '🌱', unit: 'kg CO₂ eq' },
    { id: 'luluc', name: 'Land Use Change', icon: '🌳', unit: 'kg CO₂ eq' },
    { id: 'waterUsage', name: 'Water Usage', icon: '💧', unit: 'm³' }
  ];

  const transformDataForChart = (metricId: string) => {
    if (!data[0]?.environmentalImpacts[metricId]) return [];
    const impacts = data[0].environmentalImpacts[metricId];
    return Object.entries(impacts).map(([stage, value]) => ({
      stage,
      value: Number(value),
      baseline: comparisonMode ? data[1]?.environmentalImpacts[metricId][stage] : null,
    }));
  };

  const renderTrendChart = (metricId: string) => {
    const chartData = transformDataForChart(metricId);
    const metric = metrics.find(m => m.id === metricId);
    
    return (
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart
          data={chartData}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="stage" />
          <YAxis unit={` ${metric?.unit}`} />
          <Tooltip
            formatter={(value: number) => [
              `${value.toFixed(2)} ${metric?.unit}`,
              'Impact'
            ]}
          />
          <Legend />
          <Area
            type="monotone"
            dataKey="value"
            stroke="#3b82f6"
            fill="#3b82f6"
            fillOpacity={0.3}
            name="Current"
          />
          {comparisonMode && (
            <Area
              type="monotone"
              dataKey="baseline"
              stroke="#10b981"
              fill="#10b981"
              fillOpacity={0.3}
              name="Baseline"
            />
          )}
        </AreaChart>
      </ResponsiveContainer>
    );
  };

  const handleMetricClick = (metricId: string) => {
    setSelectedMetricForDialog(metricId);
  };

  const renderDetailedBreakdown = (metricId: string) => {
    const metric = data[0]?.environmentalImpacts[metricId];
    const metricInfo = metrics.find(m => m.id === metricId);
    if (!metric || !metricInfo) return null;

    const chartData = transformDataForChart(metricId);

    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-2">Impact by Life Cycle Stage</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="stage" />
                <YAxis unit={` ${metricInfo.unit}`} />
                <Tooltip
                  formatter={(value: number) => [
                    `${value.toFixed(2)} ${metricInfo.unit}`,
                    'Impact'
                  ]}
                />
                <Legend />
                <Bar dataKey="value" fill="#3b82f6" name="Impact Value" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <ScrollArea className="h-[200px]">
          <div className="space-y-4">
            {Object.entries(metric).map(([stage, value]) => (
              <div key={stage} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-semibold">{stage.toUpperCase()}</h4>
                    <p className="text-sm text-gray-600">
                      {data[0]?.lifeCycleStages?.[stage] || 'Life Cycle Stage'}
                    </p>
                  </div>
                  <span className="font-mono text-lg">
                    {typeof value === 'number' ? 
                      `${value.toFixed(2)} ${metricInfo.unit}` : 
                      String(value)}
                  </span>
                </div>
                <div className="mt-2">
                  <div className="h-2 rounded-full bg-gray-200">
                    <div
                      className="h-2 rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.min(Math.abs((value as number) / 10 * 100), 100)}%`,
                        backgroundColor: (value as number) < 0 ? '#34d399' : '#3b82f6'
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    );
  };

  const renderMetricCard = (metricId: string) => {
    const metric = data[0]?.environmentalImpacts[metricId];
    if (!metric) return null;

    return (
      <Card 
        className="transition-all hover:shadow-lg cursor-pointer"
        onClick={() => handleMetricClick(metricId)}
      >
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {metrics.find(m => m.id === metricId)?.icon}
            {metrics.find(m => m.id === metricId)?.name}
          </CardTitle>
          <CardDescription>
            Click for detailed breakdown
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(metric).map(([stage, value]) => (
              <div key={stage} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>{stage.toUpperCase()}</span>
                  <span className="font-mono">
                    {typeof value === 'number' ? 
                      `${value.toFixed(2)} ${metrics.find(m => m.id === metricId)?.unit}` : 
                      String(value)}
                  </span>
                </div>
                <div className="h-2 rounded-full bg-gray-200">
                  <div
                    className="h-2 rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min(Math.abs((value as number) / 10 * 100), 100)}%`,
                      backgroundColor: (value as number) < 0 ? '#34d399' : '#3b82f6'
                    }}
                  />
                </div>
              </div>
            ))}
            {viewMode === 'cards' && (
              <div className="mt-4">
                {renderTrendChart(metricId)}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  // Get product name from data
  const productName = data[0]?.productName || 'No Product Selected';
  const manufacturer = data[0]?.manufacturer || 'Unknown Manufacturer';

  // Add a header section with product information
  const renderProductHeader = () => (
    <Card className="mb-6 bg-gradient-to-r from-slate-50 to-blue-50">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-blue-800">
          {productName}
        </CardTitle>
        <CardDescription className="text-blue-600">
          Manufacturer: {manufacturer}
        </CardDescription>
      </CardHeader>
    </Card>
  );

  return (
    <div className="space-y-6">
      {renderProductHeader()}
      
      <div className="flex justify-between items-center">
        <div className="space-x-2">
          <Button
            variant={viewMode === 'cards' ? 'default' : 'outline'}
            onClick={() => setViewMode('cards')}
          >
            Card View
          </Button>
          <Button
            variant={viewMode === 'trends' ? 'default' : 'outline'}
            onClick={() => setViewMode('trends')}
          >
            Trend View
          </Button>
        </div>
        <Button
          variant="outline"
          onClick={() => setShowInsights(!showInsights)}
        >
          {showInsights ? 'Hide Insights' : 'Show Insights'}
        </Button>
      </div>

      {showInsights && (
        <Alert className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <AlertTitle className="text-blue-800">
            Smart Insights
          </AlertTitle>
          <AlertDescription className="text-blue-600">
            {insights[activeMetric as keyof typeof insights]}
          </AlertDescription>
        </Alert>
      )}

      <ScrollArea className="h-[600px] pr-4">
        {viewMode === 'trends' ? (
          <div className="space-y-8">
            {metrics.map((metric) => (
              <Card key={metric.id} className="p-4">
                <CardHeader>
                  <CardTitle>{metric.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  {renderTrendChart(metric.id)}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {metrics.map((metric) => (
              <div
                key={metric.id}
                onClick={() => setActiveMetric(metric.id)}
                className="cursor-pointer"
              >
                {renderMetricCard(metric.id)}
              </div>
            ))}
          </div>
        )}
      </ScrollArea>

      {/* Detailed Breakdown Dialog */}
      <Dialog 
        open={selectedMetricForDialog !== null} 
        onOpenChange={() => setSelectedMetricForDialog(null)}
      >
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              {metrics.find(m => m.id === selectedMetricForDialog)?.icon}
              {metrics.find(m => m.id === selectedMetricForDialog)?.name} Detailed Breakdown
            </DialogTitle>
            <DialogDescription>
              Comprehensive analysis of environmental impact across life cycle stages
            </DialogDescription>
          </DialogHeader>
          {selectedMetricForDialog && renderDetailedBreakdown(selectedMetricForDialog)}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EnvironmentalImpact;
