import React, { useState, useEffect, useMemo } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Play, Pause, SkipForward, SkipBack, Settings, Activity, Zap, Database, AlertTriangle, BarChart3, Download, Upload, RotateCcw } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

interface SimulationControlCenterProps {
  worldId: string;
  adminMode: boolean;
}

interface SimulationState {
  isRunning: boolean;
  currentTurn: number;
  speed: number; // 0.1 to 5.0
  lastProcessingTime: number;
  totalSimulatedTime: number;
  pausedAt?: number;
}

interface SimulationPriorities {
  npcProcessing: number;
  environmentalSystems: number;
  socialDynamics: number;
  economicCalculations: number;
  culturalEvolution: number;
  eventGeneration: number;
}

interface SystemToggles {
  npcDecisionMaking: boolean;
  environmentalChanges: boolean;
  socialInteractions: boolean;
  economicTransactions: boolean;
  culturalTransmission: boolean;
  randomEvents: boolean;
  aiAssistance: boolean;
  emergenceDetection: boolean;
}

interface PerformanceMetrics {
  fps: number;
  memoryUsage: number;
  cpuUtilization: number;
  npcProcessingTime: number;
  environmentProcessingTime: number;
  socialProcessingTime: number;
  databaseQueries: number;
  apiResponseTime: number;
  errorRate: number;
}

interface DebugInfo {
  currentNPCDecisions: Array<{
    npcId: string;
    npcName: string;
    decision: string;
    reasoning: string[];
    confidence: number;
    processingTime: number;
  }>;
  systemBottlenecks: Array<{
    system: string;
    processingTime: number;
    queueLength: number;
    errorCount: number;
  }>;
  recentErrors: Array<{
    timestamp: number;
    type: string;
    message: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    resolved: boolean;
  }>;
}

interface SaveState {
  id: string;
  name: string;
  timestamp: number;
  turn: number;
  description: string;
  fileSize: number;
  isAutoSave: boolean;
}

interface SimulationSettings {
  aiModel: 'gpt-4' | 'gpt-3.5-turbo' | 'claude-3' | 'custom';
  maxNPCsPerTurn: number;
  decisionComplexity: 'simple' | 'standard' | 'complex' | 'ultra';
  emergenceThreshold: number;
  autoSaveInterval: number;
  errorRecoveryMode: 'pause' | 'continue' | 'rollback';
  debugLevel: 'none' | 'basic' | 'detailed' | 'verbose';
}

export function SimulationControlCenter({ worldId, adminMode }: SimulationControlCenterProps) {
  const [activeTab, setActiveTab] = useState<'control' | 'performance' | 'debug' | 'settings' | 'saves'>('control');
  const [simulationState, setSimulationState] = useState<SimulationState>({
    isRunning: false,
    currentTurn: 1,
    speed: 1.0,
    lastProcessingTime: 0,
    totalSimulatedTime: 0
  });
  const [priorities, setPriorities] = useState<SimulationPriorities>({
    npcProcessing: 30,
    environmentalSystems: 20,
    socialDynamics: 20,
    economicCalculations: 15,
    culturalEvolution: 10,
    eventGeneration: 5
  });
  const [systemToggles, setSystemToggles] = useState<SystemToggles>({
    npcDecisionMaking: true,
    environmentalChanges: true,
    socialInteractions: true,
    economicTransactions: true,
    culturalTransmission: true,
    randomEvents: true,
    aiAssistance: true,
    emergenceDetection: true
  });
  const [selectedNPCDebug, setSelectedNPCDebug] = useState<string | null>(null);
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);

  // Mock data - replace with actual Convex queries
  const performanceMetrics: PerformanceMetrics = useMemo(() => ({
    fps: 42.3,
    memoryUsage: 67.8,
    cpuUtilization: 73.2,
    npcProcessingTime: 15.4,
    environmentProcessingTime: 8.7,
    socialProcessingTime: 12.1,
    databaseQueries: 156,
    apiResponseTime: 234,
    errorRate: 0.02
  }), []);

  const debugInfo: DebugInfo = useMemo(() => ({
    currentNPCDecisions: [
      {
        npcId: 'npc_001',
        npcName: 'Elena the Craftsperson',
        decision: 'Invest in new workshop tools',
        reasoning: ['Current tools are 67% efficient', 'Market demand for crafted goods is high', 'Has sufficient savings'],
        confidence: 0.82,
        processingTime: 12.4
      },
      {
        npcId: 'npc_002',
        npcName: 'Marcus the Trader',
        decision: 'Establish new trade route',
        reasoning: ['Identified profitable market gap', 'Has necessary connections', 'Risk assessment favorable'],
        confidence: 0.74,
        processingTime: 18.7
      }
    ],
    systemBottlenecks: [
      { system: 'Social Network Calculation', processingTime: 45.2, queueLength: 12, errorCount: 0 },
      { system: 'Environmental Updates', processingTime: 23.1, queueLength: 3, errorCount: 1 },
      { system: 'Economic Transactions', processingTime: 34.6, queueLength: 8, errorCount: 0 }
    ],
    recentErrors: [
      {
        timestamp: Date.now() - 300000,
        type: 'NPC_DECISION_TIMEOUT',
        message: 'NPC decision processing exceeded timeout threshold',
        severity: 'medium',
        resolved: true
      },
      {
        timestamp: Date.now() - 600000,
        type: 'MEMORY_USAGE_HIGH',
        message: 'Memory usage exceeded 80% threshold',
        severity: 'high',
        resolved: false
      }
    ]
  }), []);

  const saveStates: SaveState[] = useMemo(() => [
    {
      id: 'save_001',
      name: 'Golden Age Beginning',
      timestamp: Date.now() - 7200000,
      turn: 245,
      description: 'Stable period with high prosperity and social cohesion',
      fileSize: 45.2,
      isAutoSave: false
    },
    {
      id: 'save_002',
      name: 'Auto-Save',
      timestamp: Date.now() - 3600000,
      turn: 289,
      description: 'Automatic save point',
      fileSize: 47.8,
      isAutoSave: true
    }
  ], []);

  const performanceHistory = useMemo(() =>
    Array.from({ length: 60 }, (_, i) => ({
      time: Date.now() - (60 - i) * 60000,
      fps: 40 + Math.sin(i * 0.1) * 5 + Math.random() * 3,
      memory: 65 + Math.sin(i * 0.05) * 10 + Math.random() * 5,
      cpu: 70 + Math.sin(i * 0.08) * 15 + Math.random() * 8
    })), []
  );

  const SimulationControls = () => (
    <div className="bg-gray-900 border-4 border-gray-100 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6">
      <div className="flex items-center gap-3 mb-6">
        <Play className="w-8 h-8 text-green-400" />
        <h3 className="text-2xl font-black text-gray-100">SIMULATION CONTROL</h3>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Playback Controls */}
        <div className="bg-gray-800 border-2 border-gray-600 p-4">
          <h4 className="text-lg font-black text-gray-100 mb-4">PLAYBACK</h4>
          
          <div className="flex items-center gap-3 mb-6">
            <button
              onClick={() => setSimulationState(prev => ({ ...prev, isRunning: !prev.isRunning }))}
              className={`p-3 border-2 font-black ${
                simulationState.isRunning
                  ? 'bg-red-600 border-red-400 text-red-100'
                  : 'bg-green-600 border-green-400 text-green-100'
              } shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 transition-all`}
            >
              {simulationState.isRunning ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
            </button>
            
            <button className="p-3 bg-gray-700 border-2 border-gray-500 text-gray-200 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 transition-all">
              <SkipBack className="w-6 h-6" />
            </button>
            
            <button className="p-3 bg-gray-700 border-2 border-gray-500 text-gray-200 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 transition-all">
              <SkipForward className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <div className="text-sm font-bold text-gray-200 mb-2">SIMULATION SPEED: {simulationState.speed}x</div>
              <input
                type="range"
                min="0.1"
                max="5.0"
                step="0.1"
                value={simulationState.speed}
                onChange={(e) => setSimulationState(prev => ({ ...prev, speed: parseFloat(e.target.value) }))}
                className="w-full"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-gray-400 font-bold">CURRENT TURN</div>
                <div className="text-xl font-black text-gray-100">{simulationState.currentTurn}</div>
              </div>
              <div>
                <div className="text-gray-400 font-bold">SIMULATED TIME</div>
                <div className="text-lg font-black text-gray-100">{Math.round(simulationState.totalSimulatedTime / 86400000)}d</div>
              </div>
            </div>
          </div>
        </div>

        {/* System Priorities */}
        <div className="bg-gray-800 border-2 border-gray-600 p-4">
          <h4 className="text-lg font-black text-gray-100 mb-4">PROCESSING PRIORITIES</h4>
          
          <div className="space-y-3">
            {Object.entries(priorities).map(([system, priority]) => (
              <div key={system}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-bold text-gray-200">
                    {system.replace(/([A-Z])/g, ' $1').toUpperCase()}
                  </span>
                  <span className="text-sm text-gray-100 font-bold">{priority}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="50"
                  value={priority}
                  onChange={(e) => setPriorities(prev => ({ 
                    ...prev, 
                    [system]: parseInt(e.target.value) 
                  }))}
                  className="w-full"
                />
              </div>
            ))}
          </div>
          
          <div className="mt-4 text-xs text-gray-400">
            TOTAL: {Object.values(priorities).reduce((a, b) => a + b, 0)}%
          </div>
        </div>

        {/* System Toggles */}
        <div className="col-span-2 bg-gray-800 border-2 border-gray-600 p-4">
          <h4 className="text-lg font-black text-gray-100 mb-4">SYSTEM TOGGLES</h4>
          
          <div className="grid grid-cols-4 gap-4">
            {Object.entries(systemToggles).map(([system, enabled]) => (
              <label key={system} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={enabled}
                  onChange={(e) => setSystemToggles(prev => ({
                    ...prev,
                    [system]: e.target.checked
                  }))}
                  className="w-4 h-4"
                />
                <span className="text-sm font-bold text-gray-200">
                  {system.replace(/([A-Z])/g, ' $1').toUpperCase()}
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const PerformanceMonitoring = () => (
    <div className="bg-gray-900 border-4 border-gray-100 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6">
      <div className="flex items-center gap-3 mb-6">
        <Activity className="w-8 h-8 text-blue-400" />
        <h3 className="text-2xl font-black text-gray-100">PERFORMANCE MONITORING</h3>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Real-time Metrics */}
        <div className="bg-gray-800 border-2 border-gray-600 p-4">
          <h4 className="text-lg font-black text-gray-100 mb-4">REAL-TIME METRICS</h4>
          
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(performanceMetrics).map(([metric, value]) => (
              <div key={metric} className="bg-gray-700 border border-gray-500 p-3 text-center">
                <div className="text-2xl font-black text-gray-100">
                  {typeof value === 'number' ? value.toFixed(1) : value}
                  {metric.includes('Usage') || metric.includes('Utilization') || metric === 'errorRate' ? '%' : 
                   metric === 'fps' ? '' :
                   metric.includes('Time') ? 'ms' :
                   metric === 'databaseQueries' ? '' : 'ms'}
                </div>
                <div className="text-xs text-gray-400 font-bold">
                  {metric.replace(/([A-Z])/g, ' $1').toUpperCase()}
                </div>
                <div className="mt-2">
                  <div className="bg-gray-600 border border-gray-400 h-2 w-full">
                    <div 
                      className={`h-full ${
                        (metric.includes('Usage') || metric.includes('Utilization')) && value > 80 ? 'bg-red-500' :
                        (metric.includes('Usage') || metric.includes('Utilization')) && value > 60 ? 'bg-yellow-500' :
                        metric === 'fps' && value > 30 ? 'bg-green-500' :
                        metric === 'errorRate' && value < 5 ? 'bg-green-500' :
                        'bg-blue-500'
                      }`}
                      style={{ 
                        width: `${
                          metric.includes('Usage') || metric.includes('Utilization') ? value :
                          metric === 'fps' ? Math.min(100, (value / 60) * 100) :
                          metric === 'errorRate' ? Math.min(100, value * 10) :
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

        {/* Performance History */}
        <div className="bg-gray-800 border-2 border-gray-600 p-4">
          <h4 className="text-lg font-black text-gray-100 mb-4">PERFORMANCE HISTORY</h4>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={performanceHistory}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" strokeWidth={1} />
                <XAxis 
                  dataKey="time"
                  tickFormatter={(time) => new Date(time).toLocaleTimeString([], { minute: '2-digit', second: '2-digit' })}
                  tick={{ fill: '#F3F4F6', fontSize: 10 }}
                />
                <YAxis 
                  tick={{ fill: '#F3F4F6', fontSize: 10 }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151',
                    color: '#F3F4F6'
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="fps"
                  stroke="#10B981"
                  strokeWidth={2}
                  dot={false}
                  name="FPS"
                />
                <Line
                  type="monotone"
                  dataKey="memory"
                  stroke="#3B82F6"
                  strokeWidth={2}
                  dot={false}
                  name="Memory %"
                />
                <Line
                  type="monotone"
                  dataKey="cpu"
                  stroke="#EF4444"
                  strokeWidth={2}
                  dot={false}
                  name="CPU %"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* System Bottlenecks */}
        <div className="col-span-2 bg-gray-800 border-2 border-gray-600 p-4">
          <h4 className="text-lg font-black text-gray-100 mb-4">SYSTEM BOTTLENECKS</h4>
          
          <div className="space-y-3">
            {debugInfo.systemBottlenecks.map((bottleneck, index) => (
              <div key={index} className="bg-gray-700 border border-gray-500 p-3">
                <div className="flex justify-between items-start mb-2">
                  <h5 className="font-bold text-gray-100">{bottleneck.system}</h5>
                  <div className="text-right">
                    <div className="text-sm text-gray-300 font-bold">{bottleneck.processingTime.toFixed(1)}ms</div>
                    <div className="text-xs text-gray-400">Queue: {bottleneck.queueLength}</div>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <div className="text-xs text-gray-400 font-bold">PROCESSING TIME</div>
                    <div className="bg-gray-600 border border-gray-400 h-2 w-full">
                      <div 
                        className={`h-full ${
                          bottleneck.processingTime > 40 ? 'bg-red-500' :
                          bottleneck.processingTime > 25 ? 'bg-yellow-500' : 'bg-green-500'
                        }`}
                        style={{ width: `${Math.min(100, (bottleneck.processingTime / 50) * 100)}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-400 font-bold">QUEUE LENGTH</div>
                    <div className="bg-gray-600 border border-gray-400 h-2 w-full">
                      <div 
                        className={`h-full ${
                          bottleneck.queueLength > 10 ? 'bg-red-500' :
                          bottleneck.queueLength > 5 ? 'bg-yellow-500' : 'bg-green-500'
                        }`}
                        style={{ width: `${Math.min(100, (bottleneck.queueLength / 20) * 100)}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-400 font-bold">ERRORS</div>
                    <div className="text-sm font-bold text-gray-100">{bottleneck.errorCount}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const DebuggingTools = () => (
    <div className="bg-gray-900 border-4 border-gray-100 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6">
      <div className="flex items-center gap-3 mb-6">
        <Zap className="w-8 h-8 text-yellow-400" />
        <h3 className="text-2xl font-black text-gray-100">DEBUGGING TOOLS</h3>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* NPC Decision Debug */}
        <div className="bg-gray-800 border-2 border-gray-600 p-4">
          <h4 className="text-lg font-black text-gray-100 mb-4">NPC DECISION DEBUGGING</h4>
          
          <div className="space-y-3">
            {debugInfo.currentNPCDecisions.map((npc) => (
              <div 
                key={npc.npcId}
                className={`border-2 p-3 cursor-pointer transition-colors ${
                  selectedNPCDebug === npc.npcId 
                    ? 'bg-blue-900 border-blue-400' 
                    : 'bg-gray-700 border-gray-500 hover:bg-gray-600'
                }`}
                onClick={() => setSelectedNPCDebug(selectedNPCDebug === npc.npcId ? null : npc.npcId)}
              >
                <div className="flex justify-between items-start mb-2">
                  <h5 className="font-bold text-gray-100">{npc.npcName}</h5>
                  <div className="text-right">
                    <div className="text-sm text-gray-300 font-bold">{Math.round(npc.confidence * 100)}%</div>
                    <div className="text-xs text-gray-400">{npc.processingTime.toFixed(1)}ms</div>
                  </div>
                </div>
                
                <div className="text-sm text-gray-300 mb-2">{npc.decision}</div>
                
                {selectedNPCDebug === npc.npcId && (
                  <div className="mt-3 space-y-2">
                    <div className="text-xs font-bold text-gray-200">REASONING:</div>
                    {npc.reasoning.map((reason, index) => (
                      <div key={index} className="text-xs text-gray-300 bg-gray-600 border border-gray-400 p-2">
                        • {reason}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Error Monitoring */}
        <div className="bg-gray-800 border-2 border-gray-600 p-4">
          <h4 className="text-lg font-black text-gray-100 mb-4">ERROR MONITORING</h4>
          
          <div className="space-y-3">
            {debugInfo.recentErrors.map((error, index) => (
              <div 
                key={index}
                className={`border-2 p-3 ${
                  error.severity === 'critical' ? 'bg-red-900 border-red-400' :
                  error.severity === 'high' ? 'bg-orange-900 border-orange-400' :
                  error.severity === 'medium' ? 'bg-yellow-900 border-yellow-400' :
                  'bg-gray-700 border-gray-500'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h5 className="font-bold text-gray-100">{error.type}</h5>
                    <div className="text-xs text-gray-400">
                      {new Date(error.timestamp).toLocaleString()}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 text-xs font-bold border ${
                      error.severity === 'critical' ? 'bg-red-600 border-red-400 text-red-100' :
                      error.severity === 'high' ? 'bg-orange-600 border-orange-400 text-orange-100' :
                      error.severity === 'medium' ? 'bg-yellow-600 border-yellow-400 text-yellow-100' :
                      'bg-gray-600 border-gray-400 text-gray-100'
                    }`}>
                      {error.severity.toUpperCase()}
                    </span>
                    <span className={`px-2 py-1 text-xs font-bold border ${
                      error.resolved 
                        ? 'bg-green-600 border-green-400 text-green-100' 
                        : 'bg-red-600 border-red-400 text-red-100'
                    }`}>
                      {error.resolved ? 'RESOLVED' : 'ACTIVE'}
                    </span>
                  </div>
                </div>
                
                <div className="text-sm text-gray-300">{error.message}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const SaveStateManagement = () => (
    <div className="bg-gray-900 border-4 border-gray-100 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6">
      <div className="flex items-center gap-3 mb-6">
        <Database className="w-8 h-8 text-purple-400" />
        <h3 className="text-2xl font-black text-gray-100">SAVE STATE MANAGEMENT</h3>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Quick Actions */}
        <div className="bg-gray-800 border-2 border-gray-600 p-4">
          <h4 className="text-lg font-black text-gray-100 mb-4">QUICK ACTIONS</h4>
          
          <div className="flex gap-4">
            <button className="flex items-center gap-2 px-4 py-2 bg-green-600 border-2 border-green-400 text-green-100 font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 transition-all">
              <Download className="w-4 h-4" />
              CREATE SAVE
            </button>
            
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 border-2 border-blue-400 text-blue-100 font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 transition-all">
              <Upload className="w-4 h-4" />
              EXPORT DATA
            </button>
            
            <button className="flex items-center gap-2 px-4 py-2 bg-orange-600 border-2 border-orange-400 text-orange-100 font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 transition-all">
              <RotateCcw className="w-4 h-4" />
              ROLLBACK
            </button>
          </div>
        </div>

        {/* Save States List */}
        <div className="bg-gray-800 border-2 border-gray-600 p-4">
          <h4 className="text-lg font-black text-gray-100 mb-4">AVAILABLE SAVES</h4>
          
          <div className="space-y-3">
            {saveStates.map((save) => (
              <div key={save.id} className="bg-gray-700 border-2 border-gray-500 p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h5 className="font-bold text-gray-100">{save.name}</h5>
                    <div className="text-sm text-gray-300">{save.description}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-300 font-bold">Turn {save.turn}</div>
                    <div className="text-xs text-gray-400">{save.fileSize.toFixed(1)} MB</div>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="text-xs text-gray-400">
                    {new Date(save.timestamp).toLocaleString()}
                    {save.isAutoSave && <span className="ml-2 px-1 py-0.5 bg-blue-600 text-blue-100 rounded">AUTO</span>}
                  </div>
                  
                  <div className="flex gap-2">
                    <button className="px-3 py-1 bg-blue-600 border border-blue-400 text-blue-100 text-xs font-bold">
                      LOAD
                    </button>
                    <button className="px-3 py-1 bg-red-600 border border-red-400 text-red-100 text-xs font-bold">
                      DELETE
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-black border-8 border-gray-100 shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Settings className="w-12 h-12 text-blue-400" />
          <div>
            <h1 className="text-4xl font-black text-gray-100">SIMULATION CONTROL CENTER</h1>
            <p className="text-gray-400 font-mono text-sm">
              WORLD: {worldId} | STATUS: {simulationState.isRunning ? 'RUNNING' : 'PAUSED'} | ADMIN: {adminMode ? 'ENABLED' : 'DISABLED'}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          {['control', 'performance', 'debug', 'saves', 'settings'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-4 py-2 font-bold text-sm border-2 transition-colors ${
                activeTab === tab
                  ? 'bg-blue-600 border-blue-400 text-blue-100'
                  : 'bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {tab.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      {activeTab === 'control' && <SimulationControls />}
      {activeTab === 'performance' && <PerformanceMonitoring />}
      {activeTab === 'debug' && <DebuggingTools />}
      {activeTab === 'saves' && <SaveStateManagement />}

      {activeTab === 'settings' && (
        <div className="bg-gray-900 border-4 border-gray-100 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6">
          <div className="flex items-center gap-3 mb-6">
            <Settings className="w-8 h-8 text-gray-400" />
            <h3 className="text-2xl font-black text-gray-100">ADVANCED SETTINGS</h3>
          </div>
          
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-gray-800 border-2 border-gray-600 p-4">
              <h4 className="text-lg font-black text-gray-100 mb-4">AI CONFIGURATION</h4>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-200 mb-2">AI MODEL</label>
                  <select className="w-full bg-gray-700 border-2 border-gray-500 text-gray-100 p-2 font-bold">
                    <option value="gpt-4">GPT-4</option>
                    <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                    <option value="claude-3">Claude-3</option>
                    <option value="custom">Custom Model</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-gray-200 mb-2">DECISION COMPLEXITY</label>
                  <select className="w-full bg-gray-700 border-2 border-gray-500 text-gray-100 p-2 font-bold">
                    <option value="simple">Simple</option>
                    <option value="standard">Standard</option>
                    <option value="complex">Complex</option>
                    <option value="ultra">Ultra-Complex</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-gray-200 mb-2">MAX NPCS PER TURN</label>
                  <input 
                    type="number" 
                    defaultValue={50} 
                    className="w-full bg-gray-700 border-2 border-gray-500 text-gray-100 p-2 font-bold"
                  />
                </div>
              </div>
            </div>

            <div className="bg-gray-800 border-2 border-gray-600 p-4">
              <h4 className="text-lg font-black text-gray-100 mb-4">SYSTEM CONFIGURATION</h4>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-200 mb-2">AUTO-SAVE INTERVAL (minutes)</label>
                  <input 
                    type="number" 
                    defaultValue={10} 
                    className="w-full bg-gray-700 border-2 border-gray-500 text-gray-100 p-2 font-bold"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-gray-200 mb-2">ERROR RECOVERY MODE</label>
                  <select className="w-full bg-gray-700 border-2 border-gray-500 text-gray-100 p-2 font-bold">
                    <option value="pause">Pause on Error</option>
                    <option value="continue">Continue with Warning</option>
                    <option value="rollback">Auto-Rollback</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-gray-200 mb-2">DEBUG LEVEL</label>
                  <select className="w-full bg-gray-700 border-2 border-gray-500 text-gray-100 p-2 font-bold">
                    <option value="none">None</option>
                    <option value="basic">Basic</option>
                    <option value="detailed">Detailed</option>
                    <option value="verbose">Verbose</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SimulationControlCenter;
