import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { ScrollArea } from './ui/scroll-area';
import { Alert, AlertDescription } from './ui/alert';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './LocationDetails.css';

interface LocationDetailsProps {
  data: any[];
  comparisonMode?: boolean;
}

const LocationDetails: React.FC<LocationDetailsProps> = ({ data }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<L.Map | null>(null);

  const productInfo = data[0] || null;

  useEffect(() => {
    if (!mapRef.current || !productInfo) return;

    // Clean up existing map instance
    if (map) {
      map.remove();
    }

    // Default to Belgium coordinates
    const coordinates = { lat: 50.8503, lng: 4.3517 };

    // Initialize map
    const mapInstance = L.map(mapRef.current).setView([coordinates.lat, coordinates.lng], 6);

    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(mapInstance);

    // Add marker for manufacturer location
    L.marker([coordinates.lat, coordinates.lng])
      .addTo(mapInstance)
      .bindPopup(`
        <b>${productInfo.manufacturer}</b><br>
        ${productInfo.manufacturerLocation}
      `).openPopup();

    setMap(mapInstance);

    // Cleanup function
    return () => {
      mapInstance.remove();
    };
  }, [productInfo]);

  if (!productInfo) {
    return (
      <Alert>
        <AlertDescription>
          Please upload an EPD file to view location details.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* Product Information Header */}
      <Card className="bg-gradient-to-r from-slate-50 to-blue-50">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-blue-800">
            {productInfo.productName}
          </CardTitle>
          <CardDescription>
            Manufacturer: {productInfo.manufacturer}
            <br />
            Location: {productInfo.manufacturerLocation}
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Map Container */}
      <Card>
        <CardHeader>
          <CardTitle>Manufacturing Location</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="map-container">
            <div 
              ref={mapRef} 
              className="leaflet-container"
            />
          </div>
        </CardContent>
      </Card>

      {/* Additional Location Details */}
      <Card>
        <CardHeader>
          <CardTitle>Location Details</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[200px]">
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold">Manufacturing Facility</h4>
                <p className="text-sm text-gray-600">{productInfo.manufacturerLocation}</p>
              </div>
              {productInfo.metadata && (
                <div>
                  <h4 className="font-semibold">Publication Details</h4>
                  <p className="text-sm text-gray-600">
                    Published: {productInfo.metadata.publicationDate}
                    <br />
                    Valid Until: {productInfo.metadata.validUntil}
                  </p>
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default LocationDetails;
