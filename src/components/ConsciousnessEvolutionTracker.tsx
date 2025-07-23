import React, { useState, useEffect, useMemo } from 'react';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Brain, TrendingUp, Lightbulb, Target, Users, BookOpen, Zap, Eye, Clock, BarChart3 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Treemap, Cell } from 'recharts';

interface ConsciousnessEvolutionTrackerProps {
  npcId?: string;
  populationView: boolean;
  evolutionTimeframe: string;
}

interface ConsciousnessMetrics {
  intelligence: number;
  wisdom: number;
  creativity: number;
  selfAwareness: number;
  metacognition: number;
  emotionalIntelligence: number;
  socialAwareness: number;
  moralReasoning: number;
  abstractThinking: number;
  problemSolving: number;
  intuition: number;
  empathy: number;
}

interface LearningProgress {
  skill: string;
  category: 'cognitive' | 'social' | 'practical' | 'creative' | 'spiritual';
  currentLevel: number;
  growthRate: number;
  plateau: boolean;
  breakthroughs: Array<{ timestamp: number; description: string; impact: number }>;
  learningMethod: 'observation' | 'experience' | 'teaching' | 'experimentation' | 'reflection';
  mastery: number;
  transferability: number; // How well this skill applies to other areas
}

interface PersonalityEvolution {
  trait: string;
  baseValue: number;
  currentValue: number;
  changeRate: number;
  influences: Array<{ source: string; impact: number; description: string }>;
  stability: number; // How resistant to change this trait is
  environmentalSensitivity: number;
  ageInfluence: number;
}

interface MemorySystem {
  formation: {
    episodic: number; // Personal experiences
    semantic: number; // General knowledge
    procedural: number; // Skills and habits
    emotional: number; // Emotional associations
  };
  consolidation: {
    rate: number;
    selectivity: number; // How well important memories are preserved
    integration: number; // How well new memories connect to existing ones
  };
  retrieval: {
    accuracy: number;
    speed: number;
    associativeStrength: number; // How well memories connect to each other
    contextualRecall: number; // Ability to remember context
  };
  forgetting: {
    naturalDecay: number;
    interferenceResistance: number;
    traumaticRetention: number;
  };
}

interface GoalEvolution {
  goalId: string;
  description: string;
  originalPriority: number;
  currentPriority: number;
  complexity: number;
  timeHorizon: 'immediate' | 'short_term' | 'medium_term' | 'long_term' | 'life_long';
  adaptations: Array<{ 
    timestamp: number; 
    oldGoal: string; 
    newGoal: string; 
    reason: string; 
    sophistication: number;
  }>;
  subgoalGeneration: number; // Ability to break down complex goals
  strategicThinking: number; // Planning sophistication
  persistenceFactors: Array<{ factor: string; influence: number }>;
}

interface SocialCognition {
  theoryOfMind: number; // Understanding others have different thoughts
  intentionRecognition: number; // Understanding others' goals
  emotionRecognition: number; // Reading others' emotions
  socialNorms: number; // Understanding cultural rules
  cooperation: number; // Ability to work with others
  competition: number; // Strategic thinking in competitive scenarios
  leadership: number; // Ability to guide others
  followership: number; // Ability to be guided by others
  culturalAdaptation: number; // Learning cultural patterns
  groupIdentity: number; // Sense of belonging
}

interface InnovationCapacity {
  originalThinking: number;
  analogicalReasoning: number; // Finding connections between different domains
  hypothesisGeneration: number; // Creating testable ideas
  experimentalThinking: number; // Willingness to try new approaches
  riskTolerance: number; // Comfort with uncertainty
  buildingOnIdeas: number; // Improving existing concepts
  paradigmShifting: number; // Ability to think beyond current frameworks
  creativeCombination: number; // Combining existing ideas in new ways
  iterativeImprovement: number; // Refining through practice
}

interface WisdomDevelopment {
  experientialLearning: number; // Learning from life events
  reflectiveThinking: number; // Deep contemplation
  perspectiveTaking: number; // Seeing multiple viewpoints
  paradoxTolerance: number; // Comfort with contradictions
  temporalThinking: number; // Understanding long-term consequences
  prudentialJudgment: number; // Practical decision-making
  humility: number; // Awareness of limitations
  compassion: number; // Care for others' wellbeing
  transcendence: number; // Moving beyond self-interest
}

interface CollectiveConsciousness {
  totalPopulation: number;
  averageConsciousnessLevel: number;
  collectiveIntelligence: number;
  sharedKnowledge: number;
  culturalTransmission: number;
  groupProblemSolving: number;
  emergentBehaviors: Array<{
    type: string;
    participants: number;
    complexity: number;
    novelty: number;
    sustainability: number;
  }>;
  socialCoherence: number;
  distributedCognition: number; // How well the group thinks together
  collectiveMemory: number; // Preservation of group experiences
  groupDecisionMaking: number; // Quality of collective choices
}

export function ConsciousnessEvolutionTracker({ npcId, populationView, evolutionTimeframe }: ConsciousnessEvolutionTrackerProps) {
  const [selectedView, setSelectedView] = useState<'individual' | 'learning' | 'personality' | 'memory' | 'goals' | 'social' | 'innovation' | 'wisdom' | 'collective'>('individual');
  const [selectedNPC, setSelectedNPC] = useState<string>(npcId || 'npc_001');
  const [timeRange, setTimeRange] = useState<'1d' | '7d' | '30d' | '1y' | 'lifetime'>('30d');
  const [comparisonMode, setComparisonMode] = useState<boolean>(false);
  const [selectedMetric, setSelectedMetric] = useState<string>('intelligence');

  // Mock consciousness evolution data - replace with actual Convex queries
  const mockData = useMemo(() => ({
    individual: {
      npcId: 'npc_001',
      name: 'Elena the Artisan',
      age: 34,
      consciousnessLevel: 0.78,
      evolutionRate: 0.12,
      
      metrics: {
        intelligence: 0.82,
        wisdom: 0.67,
        creativity: 0.91,
        selfAwareness: 0.74,
        metacognition: 0.69,
        emotionalIntelligence: 0.85,
        socialAwareness: 0.79,
        moralReasoning: 0.71,
        abstractThinking: 0.76,
        problemSolving: 0.88,
        intuition: 0.65,
        empathy: 0.83
      } as ConsciousnessMetrics,

      learningProgress: [
        {
          skill: 'Advanced Craftsmanship',
          category: 'practical',
          currentLevel: 0.85,
          growthRate: 0.15,
          plateau: false,
          breakthroughs: [
            { timestamp: Date.now() - 2592000000, description: 'Discovered new joinery technique', impact: 0.2 },
            { timestamp: Date.now() - 1296000000, description: 'Invented tool modification', impact: 0.15 }
          ],
          learningMethod: 'experimentation',
          mastery: 0.78,
          transferability: 0.6
        },
        {
          skill: 'Social Leadership',
          category: 'social',
          currentLevel: 0.62,
          growthRate: 0.08,
          plateau: false,
          breakthroughs: [
            { timestamp: Date.now() - 1728000000, description: 'Successfully mediated guild dispute', impact: 0.25 }
          ],
          learningMethod: 'experience',
          mastery: 0.45,
          transferability: 0.8
        },
        {
          skill: 'Philosophical Thinking',
          category: 'cognitive',
          currentLevel: 0.41,
          growthRate: 0.05,
          plateau: true,
          breakthroughs: [],
          learningMethod: 'reflection',
          mastery: 0.3,
          transferability: 0.9
        }
      ] as LearningProgress[],

      personalityEvolution: [
        {
          trait: 'Openness to Experience',
          baseValue: 0.75,
          currentValue: 0.82,
          changeRate: 0.01,
          influences: [
            { source: 'New trade contacts', impact: 0.05, description: 'Exposure to foreign crafting techniques' },
            { source: 'Guild responsibilities', impact: 0.02, description: 'Leadership role encouraging innovation' }
          ],
          stability: 0.7,
          environmentalSensitivity: 0.6,
          ageInfluence: -0.01
        },
        {
          trait: 'Conscientiousness',
          baseValue: 0.68,
          currentValue: 0.74,
          changeRate: 0.008,
          influences: [
            { source: 'Craft mastery', impact: 0.04, description: 'Increased attention to detail' },
            { source: 'Mentorship duties', impact: 0.02, description: 'Responsibility for teaching others' }
          ],
          stability: 0.8,
          environmentalSensitivity: 0.3,
          ageInfluence: 0.005
        }
      ] as PersonalityEvolution[],

      memorySystem: {
        formation: { episodic: 0.78, semantic: 0.85, procedural: 0.92, emotional: 0.76 },
        consolidation: { rate: 0.82, selectivity: 0.79, integration: 0.74 },
        retrieval: { accuracy: 0.83, speed: 0.77, associativeStrength: 0.81, contextualRecall: 0.75 },
        forgetting: { naturalDecay: 0.15, interferenceResistance: 0.72, traumaticRetention: 0.89 }
      } as MemorySystem,

      goalEvolution: [
        {
          goalId: 'master_artisan',
          description: 'Become the greatest artisan in the region',
          originalPriority: 0.9,
          currentPriority: 0.85,
          complexity: 0.8,
          timeHorizon: 'long_term',
          adaptations: [
            {
              timestamp: Date.now() - 5184000000,
              oldGoal: 'Learn all traditional techniques',
              newGoal: 'Innovate new techniques while mastering traditional ones',
              reason: 'Realized innovation is part of true mastery',
              sophistication: 0.7
            }
          ],
          subgoalGeneration: 0.75,
          strategicThinking: 0.68,
          persistenceFactors: [
            { factor: 'Personal satisfaction', influence: 0.8 },
            { factor: 'Social recognition', influence: 0.6 },
            { factor: 'Economic security', influence: 0.4 }
          ]
        }
      ] as GoalEvolution[],

      socialCognition: {
        theoryOfMind: 0.81,
        intentionRecognition: 0.76,
        emotionRecognition: 0.84,
        socialNorms: 0.78,
        cooperation: 0.87,
        competition: 0.62,
        leadership: 0.69,
        followership: 0.74,
        culturalAdaptation: 0.71,
        groupIdentity: 0.83
      } as SocialCognition,

      innovation: {
        originalThinking: 0.78,
        analogicalReasoning: 0.72,
        hypothesisGeneration: 0.65,
        experimentalThinking: 0.84,
        riskTolerance: 0.67,
        buildingOnIdeas: 0.89,
        paradigmShifting: 0.54,
        creativeCombination: 0.81,
        iterativeImprovement: 0.92
      } as InnovationCapacity,

      wisdom: {
        experientialLearning: 0.75,
        reflectiveThinking: 0.68,
        perspectiveTaking: 0.72,
        paradoxTolerance: 0.58,
        temporalThinking: 0.65,
        prudentialJudgment: 0.79,
        humility: 0.71,
        compassion: 0.82,
        transcendence: 0.45
      } as WisdomDevelopment
    },

    collective: {
      totalPopulation: 127,
      averageConsciousnessLevel: 0.64,
      collectiveIntelligence: 0.71,
      
      sharedKnowledge: 0.68,
      culturalTransmission: 0.74,
      groupProblemSolving: 0.66,
      emergentBehaviors: [
        {
          type: 'Collaborative Innovation Networks',
          participants: 23,
          complexity: 0.7,
          novelty: 0.8,
          sustainability: 0.6
        },
        {
          type: 'Distributed Decision Making',
          participants: 45,
          complexity: 0.5,
          novelty: 0.4,
          sustainability: 0.9
        }
      ],
      socialCoherence: 0.72,
      distributedCognition: 0.59,
      collectiveMemory: 0.81,
      groupDecisionMaking: 0.67
    } as CollectiveConsciousness,

    evolutionTimeline: Array.from({ length: 365 }, (_, i) => ({
      day: i,
      timestamp: Date.now() - (365 - i) * 86400000,
      intelligence: 0.6 + (i * 0.0006) + Math.sin(i * 0.02) * 0.05,
      wisdom: 0.5 + (i * 0.0004) + Math.sin(i * 0.01) * 0.03,
      creativity: 0.7 + (i * 0.0003) + Math.sin(i * 0.03) * 0.08,
      selfAwareness: 0.55 + (i * 0.0005) + Math.sin(i * 0.015) * 0.04,
      consciousness: 0.58 + (i * 0.0005) + Math.sin(i * 0.02) * 0.06
    }))
  }), []);

  const IndividualConsciousnessView = () => (
    <div className="bg-gray-900 border-4 border-gray-100 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6">
      <div className="flex items-center gap-3 mb-6">
        <Brain className="w-8 h-8 text-blue-400" />
        <h3 className="text-2xl font-black text-gray-100">INDIVIDUAL CONSCIOUSNESS</h3>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Consciousness Metrics Radar */}
        <div className="bg-gray-800 border-2 border-gray-600 p-4">
          <h4 className="text-lg font-black text-gray-100 mb-4">{mockData.individual.name} - CONSCIOUSNESS PROFILE</h4>
          
          <div className="h-64 mb-4">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={Object.entries(mockData.individual.metrics).map(([metric, value]) => ({
                metric: metric.charAt(0).toUpperCase() + metric.slice(1).replace(/([A-Z])/g, ' $1'),
                value: value * 100,
                fullMark: 100
              }))}>
                <PolarGrid stroke="#374151" strokeWidth={1} />
                <PolarAngleAxis 
                  dataKey="metric" 
                  tick={{ fill: '#F3F4F6', fontSize: 10, fontWeight: 'bold' }}
                  className="font-mono"
                />
                <PolarRadiusAxis 
                  angle={90} 
                  domain={[0, 100]} 
                  tick={{ fill: '#9CA3AF', fontSize: 8 }}
                  tickCount={6}
                />
                <Radar
                  name="Consciousness"
                  dataKey="value"
                  stroke="#3B82F6"
                  fill="#3B82F6"
                  fillOpacity={0.3}
                  strokeWidth={2}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-gray-400 font-bold">CONSCIOUSNESS LEVEL</div>
              <div className="text-2xl font-black text-blue-400">{Math.round(mockData.individual.consciousnessLevel * 100)}%</div>
            </div>
            <div>
              <div className="text-gray-400 font-bold">EVOLUTION RATE</div>
              <div className="text-2xl font-black text-green-400">+{Math.round(mockData.individual.evolutionRate * 100)}%</div>
            </div>
          </div>
        </div>

        {/* Evolution Timeline */}
        <div className="bg-gray-800 border-2 border-gray-600 p-4">
          <h4 className="text-lg font-black text-gray-100 mb-4">CONSCIOUSNESS EVOLUTION TIMELINE</h4>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockData.evolutionTimeline.slice(-30)}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" strokeWidth={1} />
                <XAxis 
                  dataKey="day" 
                  tick={{ fill: '#F3F4F6', fontSize: 10 }}
                />
                <YAxis 
                  domain={[0.4, 1.0]}
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
                  dataKey="consciousness"
                  stroke="#3B82F6"
                  strokeWidth={3}
                  dot={false}
                  name="Overall Consciousness"
                />
                <Line
                  type="monotone"
                  dataKey="intelligence"
                  stroke="#10B981"
                  strokeWidth={2}
                  dot={false}
                  name="Intelligence"
                />
                <Line
                  type="monotone"
                  dataKey="wisdom"
                  stroke="#F59E0B"
                  strokeWidth={2}
                  dot={false}
                  name="Wisdom"
                />
                <Line
                  type="monotone"
                  dataKey="creativity"
                  stroke="#8B5CF6"
                  strokeWidth={2}
                  dot={false}
                  name="Creativity"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );

  const LearningProgressView = () => (
    <div className="bg-gray-900 border-4 border-gray-100 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6">
      <div className="flex items-center gap-3 mb-6">
        <BookOpen className="w-8 h-8 text-green-400" />
        <h3 className="text-2xl font-black text-gray-100">LEARNING PROGRESSION</h3>
      </div>

      <div className="space-y-4">
        {mockData.individual.learningProgress.map((skill, index) => (
          <div key={index} className="bg-gray-800 border-2 border-gray-600 p-4">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 className="text-lg font-black text-gray-100">{skill.skill}</h4>
                <span className={`px-2 py-1 text-xs font-bold border-2 ${
                  skill.category === 'cognitive' ? 'bg-blue-600 border-blue-400 text-blue-100' :
                  skill.category === 'social' ? 'bg-purple-600 border-purple-400 text-purple-100' :
                  skill.category === 'practical' ? 'bg-green-600 border-green-400 text-green-100' :
                  skill.category === 'creative' ? 'bg-pink-600 border-pink-400 text-pink-100' :
                  'bg-yellow-600 border-yellow-400 text-yellow-100'
                }`}>
                  {skill.category.toUpperCase()}
                </span>
              </div>
              <div className="text-right">
                <div className="text-lg font-black text-gray-100">{Math.round(skill.currentLevel * 100)}%</div>
                <div className="text-xs text-gray-400">MASTERY</div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-4">
              <div>
                <div className="text-xs text-gray-400 font-bold mb-1">CURRENT LEVEL</div>
                <div className="bg-gray-700 border-2 border-gray-500 h-3 w-full">
                  <div 
                    className="bg-blue-500 h-full border-r-2 border-blue-400"
                    style={{ width: `${skill.currentLevel * 100}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-400 font-bold mb-1">GROWTH RATE</div>
                <div className="bg-gray-700 border-2 border-gray-500 h-3 w-full">
                  <div 
                    className="bg-green-500 h-full border-r-2 border-green-400"
                    style={{ width: `${skill.growthRate * 500}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-400 font-bold mb-1">TRANSFERABILITY</div>
                <div className="bg-gray-700 border-2 border-gray-500 h-3 w-full">
                  <div 
                    className="bg-purple-500 h-full border-r-2 border-purple-400"
                    style={{ width: `${skill.transferability * 100}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="text-sm text-gray-300 space-y-1">
              <div><span className="font-bold">LEARNING METHOD:</span> {skill.learningMethod.replace('_', ' ').toUpperCase()}</div>
              <div><span className="font-bold">STATUS:</span> {skill.plateau ? 'PLATEAU PHASE' : 'ACTIVE GROWTH'}</div>
              {skill.breakthroughs.length > 0 && (
                <div>
                  <span className="font-bold">RECENT BREAKTHROUGH:</span> {skill.breakthroughs[0].description}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const MemorySystemView = () => (
    <div className="bg-gray-900 border-4 border-gray-100 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6">
      <div className="flex items-center gap-3 mb-6">
        <Eye className="w-8 h-8 text-purple-400" />
        <h3 className="text-2xl font-black text-gray-100">MEMORY SYSTEM</h3>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Memory Formation */}
        <div className="bg-gray-800 border-2 border-gray-600 p-4">
          <h4 className="text-lg font-black text-gray-100 mb-4">MEMORY FORMATION</h4>
          
          <div className="space-y-3">
            {Object.entries(mockData.individual.memorySystem.formation).map(([type, value]) => (
              <div key={type}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-bold text-gray-200">{type.toUpperCase()}</span>
                  <span className="text-sm text-gray-100 font-bold">{Math.round(value * 100)}%</span>
                </div>
                <div className="bg-gray-700 border-2 border-gray-500 h-3 w-full">
                  <div 
                    className={`h-full border-r-2 ${
                      type === 'episodic' ? 'bg-blue-500 border-blue-400' :
                      type === 'semantic' ? 'bg-green-500 border-green-400' :
                      type === 'procedural' ? 'bg-purple-500 border-purple-400' :
                      'bg-red-500 border-red-400'
                    }`}
                    style={{ width: `${value * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Memory Consolidation & Retrieval */}
        <div className="bg-gray-800 border-2 border-gray-600 p-4">
          <h4 className="text-lg font-black text-gray-100 mb-4">PROCESSING EFFICIENCY</h4>
          
          <div className="space-y-4">
            <div>
              <h5 className="text-sm font-bold text-gray-200 mb-2">CONSOLIDATION</h5>
              {Object.entries(mockData.individual.memorySystem.consolidation).map(([metric, value]) => (
                <div key={metric} className="flex justify-between items-center mb-1">
                  <span className="text-xs text-gray-400">{metric.toUpperCase()}</span>
                  <span className="text-xs text-gray-100 font-bold">{Math.round(value * 100)}%</span>
                </div>
              ))}
            </div>
            
            <div>
              <h5 className="text-sm font-bold text-gray-200 mb-2">RETRIEVAL</h5>
              {Object.entries(mockData.individual.memorySystem.retrieval).map(([metric, value]) => (
                <div key={metric} className="flex justify-between items-center mb-1">
                  <span className="text-xs text-gray-400">{metric.toUpperCase()}</span>
                  <span className="text-xs text-gray-100 font-bold">{Math.round(value * 100)}%</span>
                </div>
              ))}
            </div>

            <div>
              <h5 className="text-sm font-bold text-gray-200 mb-2">FORGETTING PATTERNS</h5>
              {Object.entries(mockData.individual.memorySystem.forgetting).map(([metric, value]) => (
                <div key={metric} className="flex justify-between items-center mb-1">
                  <span className="text-xs text-gray-400">{metric.toUpperCase()}</span>
                  <span className="text-xs text-gray-100 font-bold">{Math.round(value * 100)}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const CollectiveConsciousnessView = () => (
    <div className="bg-gray-900 border-4 border-gray-100 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6">
      <div className="flex items-center gap-3 mb-6">
        <Users className="w-8 h-8 text-orange-400" />
        <h3 className="text-2xl font-black text-gray-100">COLLECTIVE CONSCIOUSNESS</h3>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Population Overview */}
        <div className="bg-gray-800 border-2 border-gray-600 p-4">
          <h4 className="text-lg font-black text-gray-100 mb-4">POPULATION OVERVIEW</h4>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="text-center">
              <div className="text-3xl font-black text-blue-400">{mockData.collective.totalPopulation}</div>
              <div className="text-xs text-gray-400 font-bold">TOTAL NPCS</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-black text-green-400">{Math.round(mockData.collective.averageConsciousnessLevel * 100)}%</div>
              <div className="text-xs text-gray-400 font-bold">AVG CONSCIOUSNESS</div>
            </div>
          </div>

          <div className="space-y-3">
            {Object.entries({
              'Shared Knowledge': mockData.collective.sharedKnowledge,
              'Cultural Transmission': mockData.collective.culturalTransmission,
              'Group Problem Solving': mockData.collective.groupProblemSolving,
              'Social Coherence': mockData.collective.socialCoherence,
              'Distributed Cognition': mockData.collective.distributedCognition,
              'Collective Memory': mockData.collective.collectiveMemory
            }).map(([metric, value]) => (
              <div key={metric}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-bold text-gray-200">{metric.toUpperCase()}</span>
                  <span className="text-sm text-gray-100 font-bold">{Math.round(value * 100)}%</span>
                </div>
                <div className="bg-gray-700 border-2 border-gray-500 h-2 w-full">
                  <div 
                    className="bg-orange-500 h-full border-r-2 border-orange-400"
                    style={{ width: `${value * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Emergent Behaviors */}
        <div className="bg-gray-800 border-2 border-gray-600 p-4">
          <h4 className="text-lg font-black text-gray-100 mb-4">EMERGENT BEHAVIORS</h4>
          
          <div className="space-y-4">
            {mockData.collective.emergentBehaviors.map((behavior, index) => (
              <div key={index} className="bg-gray-700 border-2 border-gray-500 p-3">
                <h5 className="font-bold text-gray-100 mb-2">{behavior.type}</h5>
                
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-gray-400 font-bold">PARTICIPANTS:</span>
                    <span className="text-gray-100 ml-1">{behavior.participants}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 font-bold">COMPLEXITY:</span>
                    <span className="text-gray-100 ml-1">{Math.round(behavior.complexity * 100)}%</span>
                  </div>
                  <div>
                    <span className="text-gray-400 font-bold">NOVELTY:</span>
                    <span className="text-gray-100 ml-1">{Math.round(behavior.novelty * 100)}%</span>
                  </div>
                  <div>
                    <span className="text-gray-400 font-bold">SUSTAINABILITY:</span>
                    <span className="text-gray-100 ml-1">{Math.round(behavior.sustainability * 100)}%</span>
                  </div>
                </div>

                <div className="mt-2">
                  <div className="text-xs text-gray-400 font-bold mb-1">EMERGENCE STRENGTH</div>
                  <div className="bg-gray-600 border border-gray-400 h-2 w-full">
                    <div 
                      className="bg-yellow-500 h-full"
                      style={{ width: `${(behavior.complexity * behavior.novelty * behavior.sustainability) * 100}%` }}
                    />
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
          <Brain className="w-12 h-12 text-blue-400" />
          <div>
            <h1 className="text-4xl font-black text-gray-100">CONSCIOUSNESS EVOLUTION TRACKER</h1>
            <p className="text-gray-400 font-mono text-sm">
              {populationView ? 'POPULATION VIEW' : `INDIVIDUAL: ${npcId || 'ALL'}`} | TIMEFRAME: {evolutionTimeframe}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          {['individual', 'learning', 'memory', 'goals', 'social', 'innovation', 'wisdom', 'collective'].map((view) => (
            <button
              key={view}
              onClick={() => setSelectedView(view as any)}
              className={`px-3 py-2 font-bold text-xs border-2 transition-colors ${
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

      {/* Content */}
      {selectedView === 'individual' && <IndividualConsciousnessView />}
      {selectedView === 'learning' && <LearningProgressView />}
      {selectedView === 'memory' && <MemorySystemView />}
      {selectedView === 'collective' && <CollectiveConsciousnessView />}

      {selectedView === 'goals' && (
        <div className="bg-gray-900 border-4 border-gray-100 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6">
          <div className="flex items-center gap-3 mb-6">
            <Target className="w-8 h-8 text-red-400" />
            <h3 className="text-2xl font-black text-gray-100">GOAL EVOLUTION</h3>
          </div>
          
          <div className="space-y-4">
            {mockData.individual.goalEvolution.map((goal) => (
              <div key={goal.goalId} className="bg-gray-800 border-2 border-gray-600 p-4">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="text-lg font-black text-gray-100">{goal.description}</h4>
                    <span className={`px-2 py-1 text-xs font-bold border-2 ${
                      goal.timeHorizon === 'life_long' ? 'bg-purple-600 border-purple-400 text-purple-100' :
                      goal.timeHorizon === 'long_term' ? 'bg-blue-600 border-blue-400 text-blue-100' :
                      goal.timeHorizon === 'medium_term' ? 'bg-green-600 border-green-400 text-green-100' :
                      goal.timeHorizon === 'short_term' ? 'bg-yellow-600 border-yellow-400 text-yellow-100' :
                      'bg-red-600 border-red-400 text-red-100'
                    }`}>
                      {goal.timeHorizon.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-black text-gray-100">{Math.round(goal.currentPriority * 100)}%</div>
                    <div className="text-xs text-gray-400">PRIORITY</div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div>
                    <div className="text-xs text-gray-400 font-bold mb-1">COMPLEXITY</div>
                    <div className="bg-gray-700 border-2 border-gray-500 h-3 w-full">
                      <div 
                        className="bg-purple-500 h-full border-r-2 border-purple-400"
                        style={{ width: `${goal.complexity * 100}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-400 font-bold mb-1">STRATEGIC THINKING</div>
                    <div className="bg-gray-700 border-2 border-gray-500 h-3 w-full">
                      <div 
                        className="bg-blue-500 h-full border-r-2 border-blue-400"
                        style={{ width: `${goal.strategicThinking * 100}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-400 font-bold mb-1">SUBGOAL GENERATION</div>
                    <div className="bg-gray-700 border-2 border-gray-500 h-3 w-full">
                      <div 
                        className="bg-green-500 h-full border-r-2 border-green-400"
                        style={{ width: `${goal.subgoalGeneration * 100}%` }}
                      />
                    </div>
                  </div>
                </div>

                {goal.adaptations.length > 0 && (
                  <div className="text-sm text-gray-300">
                    <div className="font-bold mb-1">RECENT ADAPTATION:</div>
                    <div className="bg-gray-700 border border-gray-500 p-2">
                      <div><span className="text-gray-400">FROM:</span> {goal.adaptations[0].oldGoal}</div>
                      <div><span className="text-gray-400">TO:</span> {goal.adaptations[0].newGoal}</div>
                      <div><span className="text-gray-400">REASON:</span> {goal.adaptations[0].reason}</div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedView === 'wisdom' && (
        <div className="bg-gray-900 border-4 border-gray-100 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6">
          <div className="flex items-center gap-3 mb-6">
            <Lightbulb className="w-8 h-8 text-yellow-400" />
            <h3 className="text-2xl font-black text-gray-100">WISDOM DEVELOPMENT</h3>
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            {Object.entries(mockData.individual.wisdom).map(([aspect, value]) => (
              <div key={aspect} className="bg-gray-800 border-2 border-gray-600 p-4 text-center">
                <div className="text-2xl font-black text-yellow-400 mb-2">{Math.round(value * 100)}%</div>
                <div className="text-xs text-gray-400 font-bold mb-2">
                  {aspect.replace(/([A-Z])/g, ' $1').toUpperCase()}
                </div>
                <div className="bg-gray-700 border-2 border-gray-500 h-3 w-full">
                  <div 
                    className="bg-yellow-500 h-full border-r-2 border-yellow-400"
                    style={{ width: `${value * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default ConsciousnessEvolutionTracker;
