# EPD Interactive Dashboard

A modern, interactive dashboard for analyzing Environmental Product Declaration (EPD) data with a focus on environmental impact metrics, location information, compliance standards, and life cycle analysis.

## 🌟 Features

- **Environmental Impact Analysis**: Visualize and analyze various environmental impact metrics
  - Global Warming Potential (GWP)
  - Fossil Impact
  - Biogenic Impact
  - Land Use and Land Use Change (LULUC)
  - Water Usage

- **Location Details**: 
  - Interactive map visualization
  - Manufacturer location tracking
  - Supply chain visualization (when available)
  - Regional context and benchmarks

- **Compliance Tracking**:
  - Standards compliance indicators
  - Certification status timeline
  - Verification details

- **Life Cycle Analysis**:
  - Stage-by-stage environmental impact breakdown
  - Smart recommendations and insights
  - Comparative analysis
  - Production phase (A1-A3) detailed metrics
  - End of life impact assessment

- **Interactive Features**:
  - Multi-EPD comparison mode
  - Dynamic data filtering
  - Responsive visualizations
  - Export capabilities

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/pavan9971/epd-dashboard-package.git
cd epd-dashboard-package
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## 🛠️ Built With

- **Framework**: React with TypeScript
- **Styling**: TailwindCSS + Radix UI Components
- **Data Visualization**: 
  - Recharts for charts
  - Leaflet for maps
- **State Management**: React Hooks
- **Build Tool**: Vite

## 📦 Project Structure

```
src/
├── components/          # React components
│   ├── Dashboard.tsx   # Main dashboard component
│   ├── Environmental.tsx
│   ├── LocationDetails.tsx
│   ├── Compliance.tsx
│   ├── LifeCycleAnalysis.tsx
│   └── ui/            # Reusable UI components
├── hooks/             # Custom React hooks
├── assets/           # Static assets
└── lib/              # Utility functions
```

## 🔧 Configuration

### Environment Variables

The project uses the following environment variables:

- `VITE_API_URL`: API endpoint (if connecting to a backend)
- `VITE_MAP_TOKEN`: Map service token (if required)

Create a `.env` file in the root directory and add these variables as needed.

## 📊 Data Format

The dashboard expects EPD data in the following format:

```typescript
interface EPDData {
  productName: string;
  manufacturer: string;
  manufacturerLocation: string;
  environmentalImpacts: {
    gwpTotal: Record<string, number>;
    // other metrics...
  };
  lifeCycleStages: Record<string, string>;
  // other properties...
}
```

## 🎨 Customization

### Themes

The dashboard supports light and dark themes through the `next-themes` package. Customize the theme in `tailwind.config.js`.

### Charts

Modify chart configurations in the respective component files:
- `EnvironmentalImpact.tsx`
- `LifeCycleAnalysis.tsx`

## 📱 Responsive Design

The dashboard is fully responsive with specific layouts for:
- Desktop (> 1024px)
- Tablet (768px - 1024px)
- Mobile (< 768px)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details
