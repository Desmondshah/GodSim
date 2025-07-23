import React, { useState, useEffect, useMemo } from 'react';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Cloud, Sun, CloudRain, Thermometer, Droplets, Wind, AlertTriangle, TrendingUp, Globe, Leaf, Fish, TreePine } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, ComposedChart, Bar, Scatter, Cell, PieChart, Pie } from 'recharts';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Box, Sphere } from '@react-three/drei';

interface EnvironmentalSystemsMonitorProps {
  worldId: string;
  viewMode: '2D' | '3D';
  timeRange: string;
}

interface EnvironmentalData {
  weather: {
    temperature: number;
    humidity: number;
    pressure: number;
    windSpeed: number;
    precipitation: number;
    cloudCover: number;
    currentCondition: string;
    forecast: Array<{ time: number; temp: number; condition: string; rain: number }>;
  };
  climate: {
    seasons: Array<{ name: string; avgTemp: number; avgPrecipitation: number; windPatterns: number }>;
    trends: { temperatureChange: number; precipitationChange: number; extremeEventFrequency: number };
  };
  ecosystem: {
    biomes: Array<{ 
      id: string; name: string; health: number; x: number; y: number; 
      temperature: number; moisture: number; biodiversity: number;
      dominantSpecies: string[];
    }>;
    species: Array<{ 
      name: string; population: number; status: string; habitat: string;
      trendDirection: number; extinctionRisk: number;
    }>;
    foodWeb: Array<{ predator: string; prey: string; strength: number }>;
  };
  resources: {
    water: Array<{ location: string; quantity: number; quality: number; accessibility: number }>;
    minerals: Array<{ type: string; abundance: number; renewability: number; extractionRate: number }>;
    vegetation: Array<{ type: string; coverage: number; growthRate: number; seasonalVariation: number }>;
  };
  pollution: {
    air: { particles: number; gases: number; toxicity: number; visibility: number };
    water: { contamination: number; acidity: number; oxygenLevel: number; microplastics: number };
    soil: { toxicity: number; fertility: number; erosion: number; contamination: number };
    noise: { urban: number; industrial: number; natural: number; impact: number };
  };
  disasters: Array<{ 
    type: string; probability: number; severity: number; timeToImpact?: number;
    affectedAreas: string[]; predictedDamage: number;
  }>;
  climateChange: {
    temperatureTrend: Array<{ year: number; temp: number; anomaly: number; historical?: number }>;
    seaLevelRise: Array<{ year: number; level: number; rate: number }>;
    carbonLevels: Array<{ year: number; co2: number; ch4: number; n2o: number }>;
    impacts: Array<{ system: string; impact: number; adaptability: number }>;
    averageTemp: Array<{ month: string; temp: number; historical: number }>;
    precipitation: Array<{ month: string; rain: number; snow: number }>;
  };
}

export function EnvironmentalSystemsMonitor({ worldId, viewMode, timeRange }: EnvironmentalSystemsMonitorProps) {
  const [selectedSystem, setSelectedSystem] = useState<'weather' | 'climate' | 'ecosystem' | 'resources' | 'pollution' | 'disasters' | 'trends'>('weather');
  const [selectedBiome, setSelectedBiome] = useState<string | null>(null);
  const [alertLevel, setAlertLevel] = useState<'low' | 'medium' | 'high' | 'critical'>('low');

  // AI-generated environmental data using Convex queries
  const environmentalData = useQuery(api.aiPoweredComponents.generateEnvironmentalData, {
    worldId: worldId || 'default_world',
    timeRange: timeRange,
    systems: [selectedSystem]
  });

  // Process AI-generated data
  const processedData: EnvironmentalData = useMemo(() => {
    if (!environmentalData) {
      return {
        weather: {
          temperature: 0, humidity: 0, pressure: 0, windSpeed: 0, precipitation: 0,
          cloudCover: 0, currentCondition: 'sunny', forecast: []
        },
        climate: { seasons: [], trends: { temperatureChange: 0, precipitationChange: 0, extremeEventFrequency: 0 } },
        ecosystem: { biomes: [], species: [], foodWeb: [] },
        resources: { water: [], minerals: [], vegetation: [] },
        pollution: {
          air: { particles: 0, gases: 0, toxicity: 0, visibility: 0 },
          water: { contamination: 0, acidity: 0, oxygenLevel: 0, microplastics: 0 },
          soil: { toxicity: 0, fertility: 0, erosion: 0, contamination: 0 },
          noise: { urban: 0, industrial: 0, natural: 0, impact: 0 }
        },
        disasters: [],
        climateChange: {
          temperatureTrend: [], seaLevelRise: [], carbonLevels: [], impacts: [],
          averageTemp: [], precipitation: []
        }
      };
    }

    return environmentalData;
  }, [environmentalData]);

  const BiomeHealthMap = () => (
    <div className="bg-gray-900 border-4 border-gray-100 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6">
      <div className="flex items-center gap-3 mb-6">
        <Globe className="w-8 h-8 text-green-400" />
        <h3 className="text-2xl font-black text-gray-100">ECOSYSTEM HEALTH MAP</h3>
      </div>
      
      {viewMode === '2D' ? (
        <div className="relative bg-gray-800 border-2 border-gray-600 h-80 w-full">
          {processedData.ecosystem?.biomes?.map((biome: any) => (
            <div
              key={biome.id}
              className={`absolute cursor-pointer transition-all duration-200 ${
                selectedBiome === biome.id ? 'scale-110 z-10' : 'hover:scale-105'
              }`}
              style={{
                left: `${biome.x * 100}%`,
                top: `${biome.y * 100}%`,
                transform: 'translate(-50%, -50%)'
              }}
              onClick={() => setSelectedBiome(selectedBiome === biome.id ? null : biome.id)}
            >
              <div 
                className={`w-16 h-16 border-4 border-gray-100 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center ${
                  biome.health > 0.8 ? 'bg-green-600' :
                  biome.health > 0.6 ? 'bg-yellow-600' :
                  biome.health > 0.4 ? 'bg-orange-600' : 'bg-red-600'
                }`}
              >
                <span className="text-white font-black text-xs">
                  {Math.round(biome.health * 100)}%
                </span>
              </div>
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-black border-2 border-gray-100 px-2 py-1 text-xs text-white font-bold whitespace-nowrap">
                {biome.name}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="h-80 bg-gray-800 border-2 border-gray-600">
          <Canvas camera={{ position: [5, 5, 5] }}>
            <ambientLight intensity={0.6} />
            <pointLight position={[10, 10, 10]} />
            <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
            {processedData.ecosystem?.biomes?.map((biome: any, index: number) => (
              <Box
                key={biome.id}
                position={[biome.x * 10 - 5, biome.health * 3, biome.y * 10 - 5]}
                scale={[1, biome.health * 2 + 0.5, 1]}
                onClick={() => setSelectedBiome(selectedBiome === biome.id ? null : biome.id)}
              >
                <meshStandardMaterial 
                  color={
                    biome.health > 0.8 ? '#16a34a' :
                    biome.health > 0.6 ? '#eab308' :
                    biome.health > 0.4 ? '#ea580c' : '#dc2626'
                  } 
                />
              </Box>
            ))}
          </Canvas>
        </div>
      )}

      {selectedBiome && (
        <div className="mt-4 bg-gray-800 border-2 border-gray-600 p-4">
          {(() => {
            const biome = processedData.ecosystem?.biomes?.find((b: any) => b.id === selectedBiome);
            return biome ? (
              <div>
                <h4 className="text-xl font-black text-gray-100 mb-3">{biome.name}</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-400 font-bold">HEALTH: {Math.round(biome.health * 100)}%</div>
                    <div className="text-sm text-gray-400 font-bold">TEMPERATURE: {biome.temperature}°C</div>
                    <div className="text-sm text-gray-400 font-bold">MOISTURE: {Math.round(biome.moisture * 100)}%</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-400 font-bold">BIODIVERSITY: {Math.round(biome.biodiversity * 100)}%</div>
                    <div className="text-sm text-gray-400 font-bold">DOMINANT SPECIES:</div>
                    <div className="text-xs text-gray-300">{biome.dominantSpecies.join(', ')}</div>
                  </div>
                </div>
              </div>
            ) : null;
          })()}
        </div>
      )}
    </div>
  );

  const WeatherVisualization = () => (
    <div className="bg-gray-900 border-4 border-gray-100 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6">
      <div className="flex items-center gap-3 mb-6">
        <Cloud className="w-8 h-8 text-blue-400" />
        <h3 className="text-2xl font-black text-gray-100">WEATHER SYSTEM</h3>
      </div>
      
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-800 border-2 border-gray-600 p-4 text-center">
          <Thermometer className="w-8 h-8 text-red-400 mx-auto mb-2" />
          <div className="text-2xl font-black text-gray-100">{processedData.weather?.temperature}°C</div>
          <div className="text-xs text-gray-400 font-bold">TEMPERATURE</div>
        </div>
        <div className="bg-gray-800 border-2 border-gray-600 p-4 text-center">
          <Droplets className="w-8 h-8 text-blue-400 mx-auto mb-2" />
          <div className="text-2xl font-black text-gray-100">{processedData.weather?.humidity}%</div>
          <div className="text-xs text-gray-400 font-bold">HUMIDITY</div>
        </div>
        <div className="bg-gray-800 border-2 border-gray-600 p-4 text-center">
          <Wind className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <div className="text-2xl font-black text-gray-100">{processedData.weather?.windSpeed} km/h</div>
          <div className="text-xs text-gray-400 font-bold">WIND SPEED</div>
        </div>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={processedData.weather?.forecast || []}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" strokeWidth={2} />
            <XAxis 
              dataKey="time" 
              tickFormatter={(time) => new Date(time).toLocaleTimeString([], { hour: '2-digit' })}
              tick={{ fill: '#F3F4F6', fontSize: 12, fontWeight: 'bold' }}
            />
            <YAxis 
              tick={{ fill: '#F3F4F6', fontSize: 12, fontWeight: 'bold' }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1F2937', 
                border: '2px solid #374151',
                color: '#F3F4F6',
                fontWeight: 'bold'
              }}
            />
            <Area
              type="monotone"
              dataKey="rain"
              stackId="1"
              stroke="#3B82F6"
              fill="#3B82F6"
              fillOpacity={0.6}
            />
            <Line
              type="monotone"
              dataKey="temp"
              stroke="#EF4444"
              strokeWidth={3}
              dot={{ fill: '#EF4444', strokeWidth: 2, r: 4 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );

  const PollutionMonitor = () => (
    <div className="bg-gray-900 border-4 border-gray-100 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6">
      <div className="flex items-center gap-3 mb-6">
        <AlertTriangle className="w-8 h-8 text-red-400" />
        <h3 className="text-2xl font-black text-gray-100">POLLUTION MONITORING</h3>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        {Object.entries(processedData.pollution || {}).map(([type, data]) => (
          <div key={type} className="bg-gray-800 border-2 border-gray-600 p-4">
            <h4 className="text-lg font-black text-gray-100 mb-3">{type.toUpperCase()}</h4>
            {type === 'noise' && typeof data === 'object' ? (
              <div className="space-y-2">
                <div className="mb-2">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-gray-400 font-bold">URBAN NOISE</span>
                    <span className="text-sm text-gray-100 font-bold">{Math.round((data as any).urban * 100)}%</span>
                  </div>
                  <div className="bg-gray-700 border-2 border-gray-500 h-3 w-full">
                    <div 
                      className="bg-orange-500 h-full border-r-2 border-orange-400"
                      style={{ width: `${(data as any).urban * 100}%` }}
                    />
                  </div>
                </div>
                <div className="mb-2">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-gray-400 font-bold">INDUSTRIAL</span>
                    <span className="text-sm text-gray-100 font-bold">{Math.round((data as any).industrial * 100)}%</span>
                  </div>
                  <div className="bg-gray-700 border-2 border-gray-500 h-3 w-full">
                    <div 
                      className="bg-red-500 h-full border-r-2 border-red-400"
                      style={{ width: `${(data as any).industrial * 100}%` }}
                    />
                  </div>
                </div>
                <div className="text-xs text-gray-300">
                  Wildlife Impact: {Math.round((data as any).impact * 100)}%
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                {Object.entries(data as Record<string, number>).map(([metric, value]) => (
                  <div key={metric}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs text-gray-400 font-bold">{metric.toUpperCase()}</span>
                      <span className="text-sm text-gray-100 font-bold">{Math.round(value * 100)}%</span>
                    </div>
                    <div className="bg-gray-700 border-2 border-gray-500 h-2 w-full">
                      <div 
                        className={`h-full border-r-2 ${
                          value < 0.3 ? 'bg-green-500 border-green-400' :
                          value < 0.6 ? 'bg-yellow-500 border-yellow-400' :
                          'bg-red-500 border-red-400'
                        }`}
                        style={{ width: `${value * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const DisasterWarningSystem = () => (
    <div className="bg-gray-900 border-4 border-gray-100 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6">
      <div className="flex items-center gap-3 mb-6">
        <AlertTriangle className="w-8 h-8 text-yellow-400" />
        <h3 className="text-2xl font-black text-gray-100">DISASTER EARLY WARNING</h3>
      </div>
      
      <div className="space-y-4">
        {processedData.disasters?.map((disaster: any, index: number) => (
          <div 
            key={index} 
            className={`border-4 p-4 ${
              disaster.probability > 0.7 ? 'bg-red-900 border-red-400' :
              disaster.probability > 0.4 ? 'bg-yellow-900 border-yellow-400' :
              'bg-gray-800 border-gray-600'
            }`}
          >
            <div className="flex justify-between items-start mb-3">
              <h4 className="text-xl font-black text-gray-100">{disaster.type.toUpperCase()}</h4>
              <div className="text-right">
                <div className="text-lg font-black text-gray-100">{Math.round(disaster.probability * 100)}%</div>
                <div className="text-xs text-gray-400 font-bold">PROBABILITY</div>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4 mb-3">
              <div>
                <div className="text-xs text-gray-400 font-bold">SEVERITY</div>
                <div className="bg-gray-700 border-2 border-gray-500 h-3 w-full">
                  <div 
                    className="bg-red-500 h-full border-r-2 border-red-400"
                    style={{ width: `${disaster.severity * 100}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-400 font-bold">PREDICTED DAMAGE</div>
                <div className="bg-gray-700 border-2 border-gray-500 h-3 w-full">
                  <div 
                    className="bg-orange-500 h-full border-r-2 border-orange-400"
                    style={{ width: `${disaster.predictedDamage * 100}%` }}
                  />
                </div>
              </div>
              {disaster.timeToImpact && (
                <div>
                  <div className="text-xs text-gray-400 font-bold">TIME TO IMPACT</div>
                  <div className="text-sm text-gray-100 font-bold">
                    {Math.round(disaster.timeToImpact / 86400000)}d
                  </div>
                </div>
              )}
            </div>
            
            <div className="text-xs text-gray-300">
              <span className="font-bold">AFFECTED AREAS: </span>
              {disaster.affectedAreas.join(', ')}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="bg-black border-8 border-gray-100 shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Globe className="w-12 h-12 text-green-400" />
          <div>
            <h1 className="text-4xl font-black text-gray-100">ENVIRONMENTAL SYSTEMS</h1>
            <p className="text-gray-400 font-mono text-sm">WORLD: {worldId} | MODE: {viewMode} | RANGE: {timeRange}</p>
          </div>
        </div>
        <div className="flex gap-2">
          {['weather', 'climate', 'ecosystem', 'resources', 'pollution', 'disasters', 'trends'].map((system) => (
            <button
              key={system}
              onClick={() => setSelectedSystem(system as any)}
              className={`px-4 py-2 font-bold text-sm border-2 transition-colors ${
                selectedSystem === system
                  ? 'bg-green-600 border-green-400 text-green-100'
                  : 'bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {system.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      {selectedSystem === 'weather' && (
        <div className="grid grid-cols-1 gap-6">
          <WeatherVisualization />
        </div>
      )}

      {selectedSystem === 'ecosystem' && (
        <div className="grid grid-cols-1 gap-6">
          <BiomeHealthMap />
        </div>
      )}

      {selectedSystem === 'pollution' && (
        <div className="grid grid-cols-1 gap-6">
          <PollutionMonitor />
        </div>
      )}

      {selectedSystem === 'disasters' && (
        <div className="grid grid-cols-1 gap-6">
          <DisasterWarningSystem />
        </div>
      )}

      {selectedSystem === 'climate' && (
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-gray-900 border-4 border-gray-100 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6">
            <div className="flex items-center gap-3 mb-6">
              <TrendingUp className="w-8 h-8 text-blue-400" />
              <h3 className="text-2xl font-black text-gray-100">CLIMATE TRENDS</h3>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={processedData.climateChange?.averageTemp || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" strokeWidth={2} />
                  <XAxis 
                    dataKey="month" 
                    tick={{ fill: '#F3F4F6', fontSize: 12, fontWeight: 'bold' }}
                  />
                  <YAxis 
                    tick={{ fill: '#F3F4F6', fontSize: 12, fontWeight: 'bold' }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1F2937', 
                      border: '2px solid #374151',
                      color: '#F3F4F6',
                      fontWeight: 'bold'
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="temp"
                    stroke="#EF4444"
                    strokeWidth={3}
                    dot={{ fill: '#EF4444', strokeWidth: 2, r: 4 }}
                    name="Current"
                  />
                  <Line
                    type="monotone"
                    dataKey="historical"
                    stroke="#6B7280"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={{ fill: '#6B7280', strokeWidth: 2, r: 3 }}
                    name="Historical"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-gray-900 border-4 border-gray-100 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6">
            <div className="flex items-center gap-3 mb-6">
              <CloudRain className="w-8 h-8 text-blue-400" />
              <h3 className="text-2xl font-black text-gray-100">PRECIPITATION</h3>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={processedData.climateChange?.precipitation || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" strokeWidth={2} />
                  <XAxis 
                    dataKey="month" 
                    tick={{ fill: '#F3F4F6', fontSize: 12, fontWeight: 'bold' }}
                  />
                  <YAxis 
                    tick={{ fill: '#F3F4F6', fontSize: 12, fontWeight: 'bold' }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1F2937', 
                      border: '2px solid #374151',
                      color: '#F3F4F6',
                      fontWeight: 'bold'
                    }}
                  />
                  <Bar dataKey="rain" fill="#3B82F6" />
                  <Bar dataKey="snow" fill="#E5E7EB" />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
