import React, { useState, useEffect, useMemo } from 'react';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { BarChart3, TrendingUp, Zap, AlertTriangle, Eye, Target, Brain, Database, Activity, Layers } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, ComposedChart, Bar, Scatter, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Treemap, Cell, PieChart, Pie } from 'recharts';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Box, Sphere, Line as ThreeLine } from '@react-three/drei';
import * as THREE from 'three';

interface AdvancedAnalyticsHubProps {
  worldId: string;
  analysisType: string;
  timeframe: string;
}

interface AnalyticsData {
  multiDimensionalData: Array<{
    id: string;
    dimensions: { [key: string]: number };
    category: string;
    timestamp: number;
    significance: number;
  }>;
  predictiveModels: Array<{
    name: string;
    accuracy: number;
    confidence: number;
    predictions: Array<{ time: number; value: number; uncertainty: number }>;
    scenario: string;
  }>;
  emergenceDetection: Array<{
    type: string;
    probability: number;
    participants: string[];
    description: string;
    novelty: number;
    impact: number;
    timeToEmergence?: number;
  }>;
  systemHealth: {
    overall: number;
    subsystems: { [key: string]: number };
    efficiency: number;
    stability: number;
    adaptability: number;
    resilience: number;
  };
  performanceMetrics: {
    simulationFPS: number;
    memoryUsage: number;
    cpuUtilization: number;
    networkLatency: number;
    dataProcessingRate: number;
    npcComputationTime: number;
    environmentCalculations: number;
    decisionTreeDepth: number;
  };
  historicalTrends: Array<{
    metric: string;
    data: Array<{ time: number; value: number; trend: number }>;
    significance: number;
    periodicity: number;
  }>;
  comparativeAnalysis: Array<{
    period1: { start: number; end: number; metrics: { [key: string]: number } };
    period2: { start: number; end: number; metrics: { [key: string]: number } };
    changes: { [key: string]: number };
    significance: { [key: string]: number };
  }>;
  riskAssessment: Array<{
    riskType: string;
    probability: number;
    impact: number;
    timeframe: number;
    mitigation: string[];
    dependentSystems: string[];
  }>;
  opportunityDetection: Array<{
    type: string;
    potential: number;
    requirements: string[];
    participants: string[];
    timeWindow: number;
    confidence: number;
  }>;
  systemInteractions: Array<{
    system1: string;
    system2: string;
    interactionStrength: number;
    interactionType: 'synergistic' | 'competitive' | 'neutral' | 'parasitic';
    feedback: number;
    stability: number;
  }>;
}

export function AdvancedAnalyticsHub({ worldId, analysisType, timeframe }: AdvancedAnalyticsHubProps) {
  const [selectedAnalysis, setSelectedAnalysis] = useState<'overview' | 'prediction' | 'emergence' | 'performance' | 'trends' | 'comparison' | 'risks' | 'opportunities' | 'interactions'>('overview');
  const [selectedMetric, setSelectedMetric] = useState<string>('population');
  const [viewMode, setViewMode] = useState<'2D' | '3D'>('2D');
  const [timeWindow, setTimeWindow] = useState<'1h' | '1d' | '7d' | '30d' | '1y'>('7d');

  // Mock analytics data - replace with actual Convex queries
  const analyticsData: AnalyticsData = useMemo(() => ({
    multiDimensionalData: Array.from({ length: 100 }, (_, i) => ({
      id: `point_${i}`,
      dimensions: {
        population: Math.random() * 1000 + 500,
        happiness: Math.random() * 100,
        productivity: Math.random() * 100,
        innovation: Math.random() * 100,
        stability: Math.random() * 100,
        resources: Math.random() * 100
      },
      category: ['urban', 'rural', 'trade', 'academic', 'agricultural'][Math.floor(Math.random() * 5)],
      timestamp: Date.now() - Math.random() * 2592000000,
      significance: Math.random()
    })),
    predictiveModels: [
      {
        name: 'Population Growth',
        accuracy: 0.87,
        confidence: 0.82,
        predictions: Array.from({ length: 30 }, (_, i) => ({
          time: Date.now() + i * 86400000,
          value: 1000 + i * 10 + Math.random() * 50,
          uncertainty: 20 + Math.random() * 30
        })),
        scenario: 'baseline'
      },
      {
        name: 'Economic Stability',
        accuracy: 0.75,
        confidence: 0.68,
        predictions: Array.from({ length: 30 }, (_, i) => ({
          time: Date.now() + i * 86400000,
          value: 70 + Math.sin(i * 0.2) * 15 + Math.random() * 10,
          uncertainty: 15 + Math.random() * 20
        })),
        scenario: 'optimistic'
      }
    ],
    emergenceDetection: [
      {
        type: 'Cultural Renaissance',
        probability: 0.72,
        participants: ['Scholars', 'Artists', 'Merchants'],
        description: 'Convergence of intellectual and economic factors leading to cultural flowering',
        novelty: 0.85,
        impact: 0.9,
        timeToEmergence: 1209600000 // 14 days
      },
      {
        type: 'Trade Network Expansion',
        probability: 0.68,
        participants: ['Traders', 'Nobles', 'Craftspeople'],
        description: 'Formation of new trade routes and commercial alliances',
        novelty: 0.6,
        impact: 0.7,
        timeToEmergence: 2592000000 // 30 days
      },
      {
        type: 'Social Uprising',
        probability: 0.23,
        participants: ['Workers', 'Farmers'],
        description: 'Growing discontent due to resource inequality',
        novelty: 0.4,
        impact: 0.8
      }
    ],
    systemHealth: {
      overall: 0.78,
      subsystems: {
        'Social Cohesion': 0.82,
        'Economic Stability': 0.75,
        'Environmental Health': 0.68,
        'Political Stability': 0.85,
        'Cultural Vitality': 0.79,
        'Technological Progress': 0.71
      },
      efficiency: 0.83,
      stability: 0.76,
      adaptability: 0.69,
      resilience: 0.74
    },
    performanceMetrics: {
      simulationFPS: 45.2,
      memoryUsage: 68.4,
      cpuUtilization: 72.1,
      networkLatency: 23.7,
      dataProcessingRate: 2840.5,
      npcComputationTime: 12.8,
      environmentCalculations: 156.3,
      decisionTreeDepth: 8.4
    },
    historicalTrends: [
      {
        metric: 'Population',
        data: Array.from({ length: 365 }, (_, i) => ({
          time: Date.now() - (365 - i) * 86400000,
          value: 800 + i * 0.5 + Math.sin(i * 0.1) * 50,
          trend: 0.5 + Math.sin(i * 0.05) * 0.3
        })),
        significance: 0.85,
        periodicity: 0.1
      },
      {
        metric: 'Happiness',
        data: Array.from({ length: 365 }, (_, i) => ({
          time: Date.now() - (365 - i) * 86400000,
          value: 65 + Math.sin(i * 0.02) * 20 + Math.random() * 10,
          trend: Math.sin(i * 0.02) * 0.5
        })),
        significance: 0.72,
        periodicity: 0.02
      }
    ],
    comparativeAnalysis: [
      {
        period1: { start: Date.now() - 5184000000, end: Date.now() - 2592000000, metrics: { population: 950, happiness: 72, productivity: 68 } },
        period2: { start: Date.now() - 2592000000, end: Date.now(), metrics: { population: 1050, happiness: 78, productivity: 74 } },
        changes: { population: 10.5, happiness: 8.3, productivity: 8.8 },
        significance: { population: 0.9, happiness: 0.7, productivity: 0.6 }
      }
    ],
    riskAssessment: [
      {
        riskType: 'Resource Depletion',
        probability: 0.45,
        impact: 0.8,
        timeframe: 5184000000, // 60 days
        mitigation: ['Resource diversification', 'Conservation measures', 'Alternative sources'],
        dependentSystems: ['Economic Stability', 'Population Growth', 'Social Cohesion']
      },
      {
        riskType: 'Social Fragmentation',
        probability: 0.28,
        impact: 0.9,
        timeframe: 7776000000, // 90 days
        mitigation: ['Community programs', 'Cultural events', 'Conflict resolution'],
        dependentSystems: ['Political Stability', 'Cultural Vitality', 'Economic Stability']
      }
    ],
    opportunityDetection: [
      {
        type: 'Technological Innovation',
        potential: 0.82,
        requirements: ['Research facilities', 'Skilled artisans', 'Resource investment'],
        participants: ['Scholars', 'Craftspeople', 'Merchants'],
        timeWindow: 2592000000, // 30 days
        confidence: 0.74
      },
      {
        type: 'Cultural Exchange',
        potential: 0.67,
        requirements: ['Trade relationships', 'Cultural openness', 'Communication infrastructure'],
        participants: ['Traders', 'Diplomats', 'Artists'],
        timeWindow: 1728000000, // 20 days
        confidence: 0.69
      }
    ],
    systemInteractions: [
      {
        system1: 'Economic Stability',
        system2: 'Social Cohesion',
        interactionStrength: 0.78,
        interactionType: 'synergistic',
        feedback: 0.65,
        stability: 0.82
      },
      {
        system1: 'Environmental Health',
        system2: 'Population Growth',
        interactionStrength: 0.84,
        interactionType: 'competitive',
        feedback: -0.42,
        stability: 0.67
      },
      {
        system1: 'Technological Progress',
        system2: 'Cultural Vitality',
        interactionStrength: 0.56,
        interactionType: 'synergistic',
        feedback: 0.38,
        stability: 0.71
      }
    ]
  }), []);

  const MultiDimensionalVisualization = () => (
    <div className="bg-gray-900 border-4 border-gray-100 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Layers className="w-8 h-8 text-blue-400" />
          <h3 className="text-2xl font-black text-gray-100">MULTI-DIMENSIONAL ANALYSIS</h3>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode(viewMode === '2D' ? '3D' : '2D')}
            className={`px-4 py-2 font-bold text-sm border-2 ${
              viewMode === '3D' ? 'bg-blue-600 border-blue-400 text-blue-100' : 'bg-gray-800 border-gray-600 text-gray-300'
            }`}
          >
            {viewMode}
          </button>
        </div>
      </div>

      {viewMode === '2D' ? (
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <Scatter data={analyticsData.multiDimensionalData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" strokeWidth={2} />
              <XAxis 
                dataKey="dimensions.happiness" 
                name="Happiness"
                tick={{ fill: '#F3F4F6', fontSize: 12, fontWeight: 'bold' }}
              />
              <YAxis 
                dataKey="dimensions.productivity" 
                name="Productivity"
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
              <Scatter name="Data Points" dataKey="dimensions.productivity" fill="#3B82F6" />
            </Scatter>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="h-96 bg-gray-800 border-2 border-gray-600">
          <Canvas camera={{ position: [10, 10, 10] }}>
            <ambientLight intensity={0.6} />
            <pointLight position={[10, 10, 10]} />
            <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
            {analyticsData.multiDimensionalData.slice(0, 50).map((point, index) => (
              <Sphere
                key={point.id}
                position={[
                  (point.dimensions.happiness - 50) / 10,
                  (point.dimensions.productivity - 50) / 10,
                  (point.dimensions.innovation - 50) / 10
                ]}
                scale={[0.2, 0.2, 0.2]}
              >
                <meshStandardMaterial 
                  color={
                    point.category === 'urban' ? '#3B82F6' :
                    point.category === 'rural' ? '#10B981' :
                    point.category === 'trade' ? '#F59E0B' :
                    point.category === 'academic' ? '#8B5CF6' : '#EF4444'
                  } 
                />
              </Sphere>
            ))}
          </Canvas>
        </div>
      )}
    </div>
  );

  const PredictiveAnalytics = () => (
    <div className="bg-gray-900 border-4 border-gray-100 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6">
      <div className="flex items-center gap-3 mb-6">
        <TrendingUp className="w-8 h-8 text-green-400" />
        <h3 className="text-2xl font-black text-gray-100">PREDICTIVE MODELS</h3>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {analyticsData.predictiveModels.map((model, index) => (
          <div key={index} className="bg-gray-800 border-2 border-gray-600 p-4">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 className="text-xl font-black text-gray-100">{model.name}</h4>
                <span className={`px-2 py-1 text-xs font-bold border-2 ${
                  model.scenario === 'baseline' ? 'bg-blue-600 border-blue-400 text-blue-100' :
                  model.scenario === 'optimistic' ? 'bg-green-600 border-green-400 text-green-100' :
                  'bg-red-600 border-red-400 text-red-100'
                }`}>
                  {model.scenario.toUpperCase()}
                </span>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-300 font-bold">ACCURACY: {Math.round(model.accuracy * 100)}%</div>
                <div className="text-xs text-gray-400">CONFIDENCE: {Math.round(model.confidence * 100)}%</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <div className="text-xs text-gray-400 font-bold mb-1">MODEL ACCURACY</div>
                <div className="bg-gray-700 border-2 border-gray-500 h-3 w-full">
                  <div 
                    className="bg-green-500 h-full border-r-2 border-green-400"
                    style={{ width: `${model.accuracy * 100}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-400 font-bold mb-1">CONFIDENCE LEVEL</div>
                <div className="bg-gray-700 border-2 border-gray-500 h-3 w-full">
                  <div 
                    className="bg-blue-500 h-full border-r-2 border-blue-400"
                    style={{ width: `${model.confidence * 100}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={model.predictions}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" strokeWidth={2} />
                  <XAxis 
                    dataKey="time"
                    tickFormatter={(time) => new Date(time).toLocaleDateString()}
                    tick={{ fill: '#F3F4F6', fontSize: 10, fontWeight: 'bold' }}
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
                    dataKey="uncertainty"
                    stackId="1"
                    stroke="#6B7280"
                    fill="#6B7280"
                    fillOpacity={0.3}
                  />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#10B981"
                    strokeWidth={3}
                    dot={{ fill: '#10B981', strokeWidth: 2, r: 3 }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const EmergenceDetection = () => (
    <div className="bg-gray-900 border-4 border-gray-100 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6">
      <div className="flex items-center gap-3 mb-6">
        <Zap className="w-8 h-8 text-yellow-400" />
        <h3 className="text-2xl font-black text-gray-100">EMERGENCE DETECTION</h3>
      </div>

      <div className="space-y-4">
        {analyticsData.emergenceDetection.map((emergence, index) => (
          <div 
            key={index} 
            className={`border-4 p-4 ${
              emergence.probability > 0.7 ? 'bg-green-900 border-green-400' :
              emergence.probability > 0.4 ? 'bg-yellow-900 border-yellow-400' :
              'bg-gray-800 border-gray-600'
            }`}
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <h4 className="text-xl font-black text-gray-100">{emergence.type}</h4>
                <p className="text-sm text-gray-300 mt-1">{emergence.description}</p>
              </div>
              <div className="text-right">
                <div className="text-lg font-black text-gray-100">{Math.round(emergence.probability * 100)}%</div>
                <div className="text-xs text-gray-400 font-bold">PROBABILITY</div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-3">
              <div>
                <div className="text-xs text-gray-400 font-bold mb-1">NOVELTY</div>
                <div className="bg-gray-700 border-2 border-gray-500 h-3 w-full">
                  <div 
                    className="bg-purple-500 h-full border-r-2 border-purple-400"
                    style={{ width: `${emergence.novelty * 100}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-400 font-bold mb-1">IMPACT</div>
                <div className="bg-gray-700 border-2 border-gray-500 h-3 w-full">
                  <div 
                    className="bg-red-500 h-full border-r-2 border-red-400"
                    style={{ width: `${emergence.impact * 100}%` }}
                  />
                </div>
              </div>
              {emergence.timeToEmergence && (
                <div>
                  <div className="text-xs text-gray-400 font-bold mb-1">TIME TO EMERGENCE</div>
                  <div className="text-sm text-gray-100 font-bold">
                    {Math.round(emergence.timeToEmergence / 86400000)}d
                  </div>
                </div>
              )}
            </div>

            <div className="text-xs text-gray-300">
              <span className="font-bold">PARTICIPANTS:</span> {emergence.participants.join(', ')}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const SystemHealthDashboard = () => (
    <div className="bg-gray-900 border-4 border-gray-100 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6">
      <div className="flex items-center gap-3 mb-6">
        <Activity className="w-8 h-8 text-red-400" />
        <h3 className="text-2xl font-black text-gray-100">SYSTEM HEALTH</h3>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Overall Health */}
        <div className="bg-gray-800 border-2 border-gray-600 p-4">
          <h4 className="text-lg font-black text-gray-100 mb-4">OVERALL HEALTH</h4>
          <div className="text-center mb-4">
            <div className="text-4xl font-black text-gray-100">{Math.round(analyticsData.systemHealth.overall * 100)}%</div>
            <div 
              className={`text-sm font-bold ${
                analyticsData.systemHealth.overall > 0.8 ? 'text-green-400' :
                analyticsData.systemHealth.overall > 0.6 ? 'text-yellow-400' : 'text-red-400'
              }`}
            >
              {analyticsData.systemHealth.overall > 0.8 ? 'EXCELLENT' :
               analyticsData.systemHealth.overall > 0.6 ? 'GOOD' : 'NEEDS ATTENTION'}
            </div>
          </div>
          
          <div className="space-y-3">
            {['efficiency', 'stability', 'adaptability', 'resilience'].map((metric) => (
              <div key={metric}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs text-gray-400 font-bold">{metric.toUpperCase()}</span>
                  <span className="text-sm text-gray-100 font-bold">
                    {Math.round((analyticsData.systemHealth[metric as keyof typeof analyticsData.systemHealth] as number) * 100)}%
                  </span>
                </div>
                <div className="bg-gray-700 border-2 border-gray-500 h-2 w-full">
                  <div 
                    className={`h-full border-r-2 ${
                      metric === 'efficiency' ? 'bg-blue-500 border-blue-400' :
                      metric === 'stability' ? 'bg-green-500 border-green-400' :
                      metric === 'adaptability' ? 'bg-purple-500 border-purple-400' :
                      'bg-orange-500 border-orange-400'
                    }`}
                    style={{ width: `${(analyticsData.systemHealth[metric as keyof typeof analyticsData.systemHealth] as number) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Subsystem Health */}
        <div className="bg-gray-800 border-2 border-gray-600 p-4">
          <h4 className="text-lg font-black text-gray-100 mb-4">SUBSYSTEMS</h4>
          <div className="space-y-3">
            {Object.entries(analyticsData.systemHealth.subsystems).map(([system, health]) => (
              <div key={system}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs text-gray-400 font-bold">{system.toUpperCase()}</span>
                  <span className="text-sm text-gray-100 font-bold">{Math.round(health * 100)}%</span>
                </div>
                <div className="bg-gray-700 border-2 border-gray-500 h-2 w-full">
                  <div 
                    className={`h-full border-r-2 ${
                      health > 0.8 ? 'bg-green-500 border-green-400' :
                      health > 0.6 ? 'bg-yellow-500 border-yellow-400' :
                      'bg-red-500 border-red-400'
                    }`}
                    style={{ width: `${health * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const PerformanceDashboard = () => (
    <div className="bg-gray-900 border-4 border-gray-100 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6">
      <div className="flex items-center gap-3 mb-6">
        <Database className="w-8 h-8 text-cyan-400" />
        <h3 className="text-2xl font-black text-gray-100">PERFORMANCE METRICS</h3>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {Object.entries(analyticsData.performanceMetrics).map(([metric, value]) => (
          <div key={metric} className="bg-gray-800 border-2 border-gray-600 p-4 text-center">
            <div className="text-2xl font-black text-gray-100 mb-1">
              {typeof value === 'number' ? value.toFixed(1) : value}
              {metric.includes('Usage') || metric.includes('Utilization') ? '%' : 
               metric.includes('FPS') ? '' :
               metric.includes('Latency') ? 'ms' :
               metric.includes('Rate') ? '/s' :
               metric.includes('Time') ? 'ms' : ''}
            </div>
            <div className="text-xs text-gray-400 font-bold">
              {metric.replace(/([A-Z])/g, ' $1').toUpperCase()}
            </div>
            <div className="mt-2">
              <div className="bg-gray-700 border border-gray-500 h-2 w-full">
                <div 
                  className={`h-full ${
                    (metric.includes('Usage') || metric.includes('Utilization')) && value > 80 ? 'bg-red-500' :
                    (metric.includes('Usage') || metric.includes('Utilization')) && value > 60 ? 'bg-yellow-500' :
                    metric.includes('FPS') && value > 30 ? 'bg-green-500' :
                    metric.includes('Latency') && value < 50 ? 'bg-green-500' :
                    'bg-blue-500'
                  }`}
                  style={{ 
                    width: `${
                      metric.includes('Usage') || metric.includes('Utilization') ? value :
                      metric.includes('FPS') ? Math.min(100, (value / 60) * 100) :
                      metric.includes('Latency') ? Math.max(0, 100 - value) :
                      50
                    }%` 
                  }}
                />
              </div>
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
          <BarChart3 className="w-12 h-12 text-blue-400" />
          <div>
            <h1 className="text-4xl font-black text-gray-100">ADVANCED ANALYTICS HUB</h1>
            <p className="text-gray-400 font-mono text-sm">WORLD: {worldId} | ANALYSIS: {analysisType} | TIMEFRAME: {timeframe}</p>
          </div>
        </div>
        <div className="flex gap-2">
          {['overview', 'prediction', 'emergence', 'performance', 'trends', 'comparison', 'risks', 'opportunities', 'interactions'].map((analysis) => (
            <button
              key={analysis}
              onClick={() => setSelectedAnalysis(analysis as any)}
              className={`px-3 py-2 font-bold text-xs border-2 transition-colors ${
                selectedAnalysis === analysis
                  ? 'bg-blue-600 border-blue-400 text-blue-100'
                  : 'bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {analysis.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      {selectedAnalysis === 'overview' && (
        <div className="grid grid-cols-2 gap-6">
          <MultiDimensionalVisualization />
          <SystemHealthDashboard />
          <PredictiveAnalytics />
          <EmergenceDetection />
        </div>
      )}

      {selectedAnalysis === 'prediction' && <PredictiveAnalytics />}
      {selectedAnalysis === 'emergence' && <EmergenceDetection />}
      {selectedAnalysis === 'performance' && <PerformanceDashboard />}

      {selectedAnalysis === 'risks' && (
        <div className="bg-gray-900 border-4 border-gray-100 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6">
          <div className="flex items-center gap-3 mb-6">
            <AlertTriangle className="w-8 h-8 text-red-400" />
            <h3 className="text-2xl font-black text-gray-100">RISK ASSESSMENT</h3>
          </div>
          
          <div className="space-y-4">
            {analyticsData.riskAssessment.map((risk, index) => (
              <div 
                key={index} 
                className={`border-4 p-4 ${
                  risk.probability * risk.impact > 0.6 ? 'bg-red-900 border-red-400' :
                  risk.probability * risk.impact > 0.3 ? 'bg-yellow-900 border-yellow-400' :
                  'bg-gray-800 border-gray-600'
                }`}
              >
                <div className="flex justify-between items-start mb-3">
                  <h4 className="text-xl font-black text-gray-100">{risk.riskType}</h4>
                  <div className="text-right">
                    <div className="text-sm text-gray-300 font-bold">
                      RISK SCORE: {Math.round(risk.probability * risk.impact * 100)}
                    </div>
                    <div className="text-xs text-gray-400">
                      TIMEFRAME: {Math.round(risk.timeframe / 86400000)}d
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div>
                    <div className="text-xs text-gray-400 font-bold mb-1">PROBABILITY</div>
                    <div className="bg-gray-700 border-2 border-gray-500 h-3 w-full">
                      <div 
                        className="bg-orange-500 h-full border-r-2 border-orange-400"
                        style={{ width: `${risk.probability * 100}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-400 font-bold mb-1">IMPACT</div>
                    <div className="bg-gray-700 border-2 border-gray-500 h-3 w-full">
                      <div 
                        className="bg-red-500 h-full border-r-2 border-red-400"
                        style={{ width: `${risk.impact * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="text-xs text-gray-300 space-y-1">
                  <div><span className="font-bold">MITIGATION:</span> {risk.mitigation.join(', ')}</div>
                  <div><span className="font-bold">DEPENDENT SYSTEMS:</span> {risk.dependentSystems.join(', ')}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedAnalysis === 'opportunities' && (
        <div className="bg-gray-900 border-4 border-gray-100 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6">
          <div className="flex items-center gap-3 mb-6">
            <Target className="w-8 h-8 text-green-400" />
            <h3 className="text-2xl font-black text-gray-100">OPPORTUNITY DETECTION</h3>
          </div>
          
          <div className="space-y-4">
            {analyticsData.opportunityDetection.map((opportunity, index) => (
              <div 
                key={index} 
                className={`border-4 p-4 ${
                  opportunity.potential > 0.7 ? 'bg-green-900 border-green-400' :
                  opportunity.potential > 0.5 ? 'bg-blue-900 border-blue-400' :
                  'bg-gray-800 border-gray-600'
                }`}
              >
                <div className="flex justify-between items-start mb-3">
                  <h4 className="text-xl font-black text-gray-100">{opportunity.type}</h4>
                  <div className="text-right">
                    <div className="text-lg font-black text-gray-100">{Math.round(opportunity.potential * 100)}%</div>
                    <div className="text-xs text-gray-400 font-bold">POTENTIAL</div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div>
                    <div className="text-xs text-gray-400 font-bold mb-1">CONFIDENCE</div>
                    <div className="bg-gray-700 border-2 border-gray-500 h-3 w-full">
                      <div 
                        className="bg-blue-500 h-full border-r-2 border-blue-400"
                        style={{ width: `${opportunity.confidence * 100}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-400 font-bold mb-1">TIME WINDOW</div>
                    <div className="text-sm text-gray-100 font-bold">
                      {Math.round(opportunity.timeWindow / 86400000)}d
                    </div>
                  </div>
                </div>
                
                <div className="text-xs text-gray-300 space-y-1">
                  <div><span className="font-bold">REQUIREMENTS:</span> {opportunity.requirements.join(', ')}</div>
                  <div><span className="font-bold">PARTICIPANTS:</span> {opportunity.participants.join(', ')}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
