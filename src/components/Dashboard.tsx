import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { Alert, AlertDescription } from './ui/alert';
import EnvironmentalImpact from './EnvironmentalImpact';
import LocationDetails from './LocationDetails';
import Compliance from './Compliance';
import LifeCycleAnalysis from './LifeCycleAnalysis';

interface DashboardProps {
  data: any[];
  onFileUpload: (files: FileList) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ data, onFileUpload }) => {
  const [activeTab, setActiveTab] = useState('environmental');
  const [comparisonMode, setComparisonMode] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const calculateTotalImpact = (metricKey: string) => {
    if (!data?.[0]?.environmentalImpacts?.[metricKey]) return 0;
    return Object.values(data[0].environmentalImpacts[metricKey])
      .reduce((sum, val) => sum + (typeof val === 'number' ? val : 0), 0);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      // Simulate upload progress
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        setUploadProgress(progress);
        if (progress >= 100) {
          clearInterval(interval);
          onFileUpload(event.target.files!);
          setTimeout(() => setUploadProgress(0), 1000);
        }
      }, 200);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Section with Visual Hierarchy */}
      <Card className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
        <CardHeader className="space-y-4">
          <CardTitle className="text-3xl font-bold tracking-tight">
            EPD Interactive Dashboard
          </CardTitle>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <input
                type="file"
                multiple
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
              />
              <Button
                asChild
                variant="secondary"
                className="relative overflow-hidden"
              >
                <label htmlFor="file-upload" className="cursor-pointer">
                  Upload EPD Files
                </label>
              </Button>
              {uploadProgress > 0 && (
                <Progress value={uploadProgress} className="w-full mt-2" />
              )}
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                checked={comparisonMode}
                onCheckedChange={setComparisonMode}
                id="comparison-mode"
              />
              <Label htmlFor="comparison-mode">Comparison Mode</Label>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Quick Metrics Overview */}
      {data.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-gradient-to-br from-green-50 to-emerald-100">
            <CardHeader>
              <CardTitle className="text-sm font-medium">Total GWP Impact</CardTitle>
              <CardDescription>
                {calculateTotalImpact('gwpTotal').toFixed(2)} kg CO₂ eq
              </CardDescription>
            </CardHeader>
          </Card>
          <Card className="bg-gradient-to-br from-blue-50 to-sky-100">
            <CardHeader>
              <CardTitle className="text-sm font-medium">Water Usage</CardTitle>
              <CardDescription>
                {calculateTotalImpact('waterUsage').toFixed(2)} m³
              </CardDescription>
            </CardHeader>
          </Card>
          <Card className="bg-gradient-to-br from-purple-50 to-violet-100">
            <CardHeader>
              <CardTitle className="text-sm font-medium">Fossil Impact</CardTitle>
              <CardDescription>
                {calculateTotalImpact('gwpFossil').toFixed(2)} MJ
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      )}

      {/* No Data Alert */}
      {!data.length && (
        <Alert variant="default" className="bg-blue-50">
          <AlertDescription>
            Upload an EPD file to start analyzing environmental impacts.
          </AlertDescription>
        </Alert>
      )}

      {/* Main Navigation with Visual Feedback */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-4 gap-4">
          <TabsTrigger value="environmental" className="data-[state=active]:bg-primary">
            Environmental Impact
          </TabsTrigger>
          <TabsTrigger value="location" className="data-[state=active]:bg-primary">
            Location Details
          </TabsTrigger>
          <TabsTrigger value="compliance" className="data-[state=active]:bg-primary">
            Compliance
          </TabsTrigger>
          <TabsTrigger value="lifecycle" className="data-[state=active]:bg-primary">
            Life Cycle Analysis
          </TabsTrigger>
        </TabsList>

        {/* Content Areas with Consistent Visual Language */}
        <Card className="mt-4">
          <CardContent className="p-6">
            <TabsContent value="environmental">
              <EnvironmentalImpact 
                data={data} 
                comparisonMode={comparisonMode} 
              />
            </TabsContent>
            <TabsContent value="location">
              <LocationDetails data={data} />
            </TabsContent>
            <TabsContent value="compliance">
              <Compliance data={data} />
            </TabsContent>
            <TabsContent value="lifecycle">
              <LifeCycleAnalysis data={data} />
            </TabsContent>
          </CardContent>
        </Card>
      </Tabs>
    </div>
  );
};

export default Dashboard;
