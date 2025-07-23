import React, { useState, useEffect, useMemo } from 'react';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Brain, Heart, Target, Users, Clock, TrendingUp, Zap, Eye, Lightbulb, BarChart3 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Treemap, AreaChart, Area } from 'recharts';

interface NPCConsciousnessDashboardProps {
  npcId: string;
  worldId: string;
  realTimeUpdates: boolean;
}

interface ConsciousnessData {
  thoughts: Array<{ timestamp: number; content: string; type: string; intensity: number }>;
  emotions: {
    joy: number; fear: number; anger: number; sadness: number; disgust: number;
    surprise: number; trust: number; anticipation: number; contempt: number; shame: number;
  };
  memories: Array<{ id: string; content: string; importance: number; category: string; age: number; emotionalCharge: number }>;
  goals: Array<{ id: string; description: string; progress: number; priority: number; subgoals: Array<any>; deadline?: number }>;
  relationships: Array<{ targetId: string; name: string; strength: number; type: string; history: Array<any> }>;
  personality: {
    openness: number; conscientiousness: number; extraversion: number;
    agreeableness: number; neuroticism: number; curiosity: number;
    empathy: number; ambition: number; creativity: number; resilience: number;
  };
  needs: {
    hunger: number; thirst: number; sleep: number; safety: number;
    social: number; esteem: number; selfActualization: number; purpose: number;
  };
  decisions: Array<{ timestamp: number; choice: string; reasoning: string; outcome?: string; confidence: number }>;
  learning: Array<{ skill: string; level: number; experience: number; recentGrowth: number }>;
  consciousness: {
    intelligence: number; wisdom: number; creativity: number; selfAwareness: number;
    metacognition: number; introspection: number; philosophicalDepth: number;
  };
}

export function NPCConsciousnessDashboard({ npcId, worldId, realTimeUpdates }: NPCConsciousnessDashboardProps) {
  const [selectedView, setSelectedView] = useState<'overview' | 'thoughts' | 'emotions' | 'memories' | 'goals' | 'relationships' | 'learning'>('overview');
  const [timeRange, setTimeRange] = useState<'1h' | '6h' | '24h' | '7d'>('6h');
  const [searchTerm, setSearchTerm] = useState('');

  // AI-generated consciousness data using Convex queries
  const consciousnessData = useQuery(api.aiPoweredComponents.generateNPCConsciousnessData, {
    npcId: npcId || 'default_npc',
    timeRange: timeRange,
    analysisDepth: 'comprehensive'
  });

  // Process AI-generated data into component format
  const processedData: ConsciousnessData = useMemo(() => {
    if (!consciousnessData) {
      return {
        thoughts: [],
        emotions: { joy: 0, fear: 0, anger: 0, sadness: 0, disgust: 0, surprise: 0, trust: 0, anticipation: 0, contempt: 0, shame: 0 },
        memories: [],
        goals: [],
        relationships: [],
        personality: { openness: 0, conscientiousness: 0, extraversion: 0, agreeableness: 0, neuroticism: 0, curiosity: 0, empathy: 0, ambition: 0, creativity: 0, resilience: 0 },
        needs: { hunger: 0, thirst: 0, sleep: 0, safety: 0, social: 0, esteem: 0, selfActualization: 0, purpose: 0 },
        decisions: [],
        learning: [],
        consciousness: { intelligence: 0, wisdom: 0, creativity: 0, selfAwareness: 0, metacognition: 0, introspection: 0, philosophicalDepth: 0 }
      };
    }

    return consciousnessData;
  }, [consciousnessData]);

  const emotionData = Object.entries(processedData.emotions).map(([emotion, value]) => ({
    emotion: emotion.charAt(0).toUpperCase() + emotion.slice(1),
    value: (value as number) * 100,
    fullMark: 100
  }));

  const personalityData = Object.entries(processedData.personality).map(([trait, value]) => ({
    trait: trait.charAt(0).toUpperCase() + trait.slice(1),
    value: (value as number) * 100
  }));

  const filteredMemories = processedData.memories.filter((memory: any) =>
    memory.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    memory.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const ThoughtStream = () => (
    <div className="bg-gray-900 border-4 border-gray-100 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6">
      <div className="flex items-center gap-3 mb-6">
        <Brain className="w-8 h-8 text-blue-400" />
        <h3 className="text-2xl font-black text-gray-100">THOUGHT STREAM</h3>
      </div>
      <div className="space-y-4 max-h-80 overflow-y-auto">
        {processedData.thoughts.map((thought: any, index: number) => (
          <div key={index} className="bg-gray-800 border-2 border-gray-600 p-4 relative">
            <div className="flex justify-between items-start mb-2">
              <span className={`px-3 py-1 text-xs font-bold border-2 ${
                thought.type === 'contemplation' ? 'bg-purple-600 border-purple-400 text-purple-100' :
                thought.type === 'observation' ? 'bg-green-600 border-green-400 text-green-100' :
                thought.type === 'planning' ? 'bg-blue-600 border-blue-400 text-blue-100' :
                'bg-orange-600 border-orange-400 text-orange-100'
              }`}>
                {thought.type.toUpperCase()}
              </span>
              <span className="text-xs text-gray-400 font-mono">
                {new Date(thought.timestamp).toLocaleTimeString()}
              </span>
            </div>
            <p className="text-gray-100 text-sm leading-relaxed">{thought.content}</p>
            <div className="mt-3">
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400 font-bold">INTENSITY:</span>
                <div className="bg-gray-700 border-2 border-gray-500 h-2 w-24 relative">
                  <div 
                    className="bg-red-500 h-full border-r-2 border-red-400"
                    style={{ width: `${thought.intensity * 100}%` }}
                  />
                </div>
                <span className="text-xs text-gray-300 font-bold">{Math.round(thought.intensity * 100)}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const EmotionalState = () => (
    <div className="bg-gray-900 border-4 border-gray-100 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6">
      <div className="flex items-center gap-3 mb-6">
        <Heart className="w-8 h-8 text-red-400" />
        <h3 className="text-2xl font-black text-gray-100">EMOTIONAL STATE</h3>
      </div>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={emotionData}>
            <PolarGrid stroke="#374151" strokeWidth={2} />
            <PolarAngleAxis 
              dataKey="emotion" 
              tick={{ fill: '#F3F4F6', fontSize: 12, fontWeight: 'bold' }}
              className="font-mono"
            />
            <PolarRadiusAxis 
              angle={90} 
              domain={[0, 100]} 
              tick={{ fill: '#9CA3AF', fontSize: 10 }}
              tickCount={6}
            />
            <Radar
              name="Emotion"
              dataKey="value"
              stroke="#EF4444"
              fill="#EF4444"
              fillOpacity={0.3}
              strokeWidth={3}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );

  const MemoryBrowser = () => (
    <div className="bg-gray-900 border-4 border-gray-100 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6">
      <div className="flex items-center gap-3 mb-6">
        <Eye className="w-8 h-8 text-purple-400" />
        <h3 className="text-2xl font-black text-gray-100">MEMORY SYSTEM</h3>
      </div>
      <div className="mb-4">
        <input
          type="text"
          placeholder="SEARCH MEMORIES..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-gray-800 border-2 border-gray-600 text-gray-100 p-3 font-mono text-sm focus:border-blue-400 focus:outline-none"
        />
      </div>
      <div className="space-y-3 max-h-64 overflow-y-auto">
        {filteredMemories.map((memory: any) => (
          <div key={memory.id} className="bg-gray-800 border-2 border-gray-600 p-4">
            <div className="flex justify-between items-start mb-2">
              <span className={`px-2 py-1 text-xs font-bold border-2 ${
                memory.category === 'achievement' ? 'bg-yellow-600 border-yellow-400 text-yellow-100' :
                memory.category === 'relationship' ? 'bg-pink-600 border-pink-400 text-pink-100' :
                'bg-blue-600 border-blue-400 text-blue-100'
              }`}>
                {memory.category.toUpperCase()}
              </span>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <span className="text-xs text-gray-400 font-bold">IMP:</span>
                  <div className="bg-gray-700 border border-gray-500 h-2 w-16">
                    <div 
                      className="bg-green-500 h-full"
                      style={{ width: `${memory.importance * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
            <p className="text-gray-100 text-sm mb-2">{memory.content}</p>
            <div className="flex justify-between text-xs text-gray-400 font-mono">
              <span>AGE: {Math.round(memory.age / 86400000)}d</span>
              <span>CHARGE: {Math.round(memory.emotionalCharge * 100)}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const GoalTracking = () => (
    <div className="bg-gray-900 border-4 border-gray-100 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6">
      <div className="flex items-center gap-3 mb-6">
        <Target className="w-8 h-8 text-green-400" />
        <h3 className="text-2xl font-black text-gray-100">GOAL HIERARCHY</h3>
      </div>
      <div className="space-y-4">
        {processedData.goals.map((goal: any) => (
          <div key={goal.id} className="bg-gray-800 border-2 border-gray-600 p-4">
            <div className="flex justify-between items-start mb-3">
              <h4 className="text-gray-100 font-bold text-sm">{goal.description}</h4>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400 font-bold">PRIORITY:</span>
                <div className="bg-gray-700 border border-gray-500 h-2 w-16">
                  <div 
                    className="bg-red-500 h-full"
                    style={{ width: `${goal.priority * 100}%` }}
                  />
                </div>
              </div>
            </div>
            <div className="mb-3">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs text-gray-400 font-bold">PROGRESS:</span>
                <span className="text-xs text-gray-300 font-bold">{Math.round(goal.progress * 100)}%</span>
              </div>
              <div className="bg-gray-700 border-2 border-gray-500 h-3 w-full">
                <div 
                  className="bg-green-500 h-full border-r-2 border-green-400"
                  style={{ width: `${goal.progress * 100}%` }}
                />
              </div>
            </div>
            {goal.subgoals.length > 0 && (
              <div className="ml-4 space-y-2">
                {goal.subgoals.map((subgoal: any) => (
                  <div key={subgoal.id} className="bg-gray-700 border border-gray-500 p-2">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-gray-200 text-xs">{subgoal.description}</span>
                      <span className="text-xs text-gray-300 font-bold">{Math.round(subgoal.progress * 100)}%</span>
                    </div>
                    <div className="bg-gray-600 border border-gray-400 h-2 w-full">
                      <div 
                        className="bg-blue-500 h-full"
                        style={{ width: `${subgoal.progress * 100}%` }}
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

  const ConsciousnessMetrics = () => (
    <div className="bg-gray-900 border-4 border-gray-100 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6">
      <div className="flex items-center gap-3 mb-6">
        <Lightbulb className="w-8 h-8 text-yellow-400" />
        <h3 className="text-2xl font-black text-gray-100">CONSCIOUSNESS EVOLUTION</h3>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {Object.entries(processedData.consciousness).map(([metric, value]) => (
          <div key={metric} className="bg-gray-800 border-2 border-gray-600 p-3">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs text-gray-300 font-bold">{metric.toUpperCase()}</span>
              <span className="text-sm text-gray-100 font-black">{Math.round((value as number) * 100)}%</span>
            </div>
            <div className="bg-gray-700 border-2 border-gray-500 h-3 w-full">
              <div 
                className="bg-yellow-500 h-full border-r-2 border-yellow-400"
                style={{ width: `${(value as number) * 100}%` }}
              />
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
          <Brain className="w-12 h-12 text-blue-400" />
          <div>
            <h1 className="text-4xl font-black text-gray-100">NPC CONSCIOUSNESS</h1>
            <p className="text-gray-400 font-mono text-sm">ID: {npcId} | REAL-TIME: {realTimeUpdates ? 'ACTIVE' : 'DISABLED'}</p>
          </div>
        </div>
        <div className="flex gap-2">
          {['overview', 'thoughts', 'emotions', 'memories', 'goals', 'relationships', 'learning'].map((view) => (
            <button
              key={view}
              onClick={() => setSelectedView(view as any)}
              className={`px-4 py-2 font-bold text-sm border-2 transition-colors ${
                selectedView === view
                  ? 'bg-blue-600 border-blue-400 text-blue-100'
                  : 'bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {view.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Content Grid */}
      {selectedView === 'overview' && (
        <div className="grid grid-cols-2 gap-6">
          <ThoughtStream />
          <EmotionalState />
          <MemoryBrowser />
          <GoalTracking />
        </div>
      )}

      {selectedView === 'thoughts' && <ThoughtStream />}
      {selectedView === 'emotions' && <EmotionalState />}
      {selectedView === 'memories' && <MemoryBrowser />}
      {selectedView === 'goals' && <GoalTracking />}

      {selectedView === 'learning' && (
        <div className="grid grid-cols-1 gap-6">
          <div className="bg-gray-900 border-4 border-gray-100 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6">
            <div className="flex items-center gap-3 mb-6">
              <TrendingUp className="w-8 h-8 text-blue-400" />
              <h3 className="text-2xl font-black text-gray-100">LEARNING PROGRESSION</h3>
            </div>
            <div className="space-y-4">
              {processedData.learning.map((skill: any, index: number) => (
                <div key={index} className="bg-gray-800 border-2 border-gray-600 p-4">
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="text-gray-100 font-bold">{skill.skill}</h4>
                    <div className="text-right">
                      <div className="text-sm text-gray-300 font-bold">LVL {Math.round(skill.level * 100)}</div>
                      <div className="text-xs text-gray-400">+{Math.round(skill.recentGrowth * 100)}% recent</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <div className="bg-gray-700 border-2 border-gray-500 h-3 w-full">
                        <div 
                          className="bg-blue-500 h-full border-r-2 border-blue-400"
                          style={{ width: `${skill.level * 100}%` }}
                        />
                      </div>
                    </div>
                    <span className="text-xs text-gray-400 font-mono">{skill.experience} XP</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <ConsciousnessMetrics />
        </div>
      )}
    </div>
  );
}
