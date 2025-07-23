import React, { useState, useEffect, useMemo } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Zap, Target, Eye, Settings, Clock, TrendingUp, AlertTriangle, Layers, BarChart3, Shield } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, BarChart, Bar, ScatterChart, Scatter, Treemap, Cell } from 'recharts';

interface DivineInterventionDesignerProps {
  availableActions: string[];
  divineEnergyBudget: number;
  simulationState: any;
}

interface InterventionType {
  id: string;
  name: string;
  category: 'environmental' | 'social' | 'economic' | 'technological' | 'spiritual' | 'cognitive' | 'biological' | 'physical';
  description: string;
  baseComplexity: number;
  energyCost: number;
  maxIntensity: number;
  targetingPrecision: number; // How precisely this can be targeted
  subtlety: number; // How obvious the intervention appears
  reversibility: number; // How easily the effects can be undone
  rippleEffect: number; // How much this affects other systems
}

interface TargetingOptions {
  scope: 'individual' | 'group' | 'settlement' | 'region' | 'global';
  specificity: 'precise' | 'broad' | 'random' | 'conditional';
  duration: 'instant' | 'temporary' | 'permanent' | 'gradual';
  timing: 'immediate' | 'delayed' | 'conditional' | 'cyclical';
  conditions: Array<{
    type: string;
    parameter: string;
    value: any;
    operator: '>' | '<' | '=' | '>=' | '<=' | '!=';
  }>;
}

interface ConsequencePrediction {
  systemId: string;
  systemName: string;
  immediateImpact: {
    magnitude: number;
    direction: 'positive' | 'negative' | 'neutral' | 'chaotic';
    confidence: number;
  };
  shortTermEffects: Array<{
    description: string;
    probability: number;
    severity: number;
    timeframe: string;
  }>;
  longTermEffects: Array<{
    description: string;
    probability: number;
    severity: number;
    timeframe: string;
    cascadingEffects: string[];
  }>;
  unintendedConsequences: Array<{
    description: string;
    probability: number;
    risk: 'low' | 'medium' | 'high' | 'extreme';
    mitigation: string;
  }>;
  systemicRisks: Array<{
    type: string;
    probability: number;
    impact: number;
    description: string;
  }>;
}

interface EthicalAssessment {
  autonomyRespect: number; // How much this preserves NPC free will
  harmMinimization: number; // How well this avoids causing suffering
  justiceAlignment: number; // How fair the distribution of effects is
  consequentialismScore: number; // How good the outcomes are
  deontologyScore: number; // How well this follows ethical rules
  virtueEthicsScore: number; // How virtuous the action is
  overallEthicalRating: number;
  ethicalConcerns: Array<{
    category: string;
    severity: 'low' | 'medium' | 'high';
    description: string;
    recommendation: string;
  }>;
}

interface InterventionTemplate {
  id: string;
  name: string;
  description: string;
  interventionType: string;
  targeting: TargetingOptions;
  intensity: number;
  parameters: Record<string, any>;
  estimatedEnergyCost: number;
  complexity: number;
  tags: string[];
}

interface HistoricalIntervention {
  id: string;
  timestamp: number;
  type: string;
  description: string;
  energyUsed: number;
  actualConsequences: Array<{
    system: string;
    outcome: string;
    severity: number;
    duration: number;
  }>;
  effectivenessRating: number;
  unintendedConsequences: number;
  ethicalScore: number;
  lessonsLearned: string[];
}

export function DivineInterventionDesigner({ availableActions, divineEnergyBudget, simulationState }: DivineInterventionDesignerProps) {
  const [selectedIntervention, setSelectedIntervention] = useState<string>('');
  const [targeting, setTargeting] = useState<TargetingOptions>({
    scope: 'individual',
    specificity: 'precise',
    duration: 'temporary',
    timing: 'immediate',
    conditions: []
  });
  const [intensity, setIntensity] = useState<number>(0.5);
  const [customParameters, setCustomParameters] = useState<Record<string, any>>({});
  const [previewMode, setPreviewMode] = useState<boolean>(true);
  const [selectedView, setSelectedView] = useState<'design' | 'consequences' | 'ethics' | 'templates' | 'history' | 'analysis'>('design');
  const [energyBudgetWarning, setEnergyBudgetWarning] = useState<boolean>(false);

  // Mock divine intervention data - replace with actual Convex queries
  const mockData = useMemo(() => ({
    interventionTypes: [
      {
        id: 'weather_control',
        name: 'Weather Manipulation',
        category: 'environmental',
        description: 'Control local or regional weather patterns',
        baseComplexity: 0.6,
        energyCost: 150,
        maxIntensity: 1.0,
        targetingPrecision: 0.8,
        subtlety: 0.3,
        reversibility: 0.7,
        rippleEffect: 0.8
      },
      {
        id: 'inspiration_surge',
        name: 'Divine Inspiration',
        category: 'cognitive',
        description: 'Grant sudden insights or creative breakthroughs',
        baseComplexity: 0.4,
        energyCost: 80,
        maxIntensity: 0.9,
        targetingPrecision: 0.95,
        subtlety: 0.9,
        reversibility: 0.2,
        rippleEffect: 0.6
      },
      {
        id: 'resource_discovery',
        name: 'Resource Manifestation',
        category: 'physical',
        description: 'Create or reveal new natural resources',
        baseComplexity: 0.8,
        energyCost: 300,
        maxIntensity: 0.8,
        targetingPrecision: 0.7,
        subtlety: 0.1,
        reversibility: 0.3,
        rippleEffect: 0.9
      },
      {
        id: 'social_harmony',
        name: 'Social Harmonization',
        category: 'social',
        description: 'Reduce conflicts and increase cooperation',
        baseComplexity: 0.7,
        energyCost: 200,
        maxIntensity: 0.7,
        targetingPrecision: 0.6,
        subtlety: 0.8,
        reversibility: 0.5,
        rippleEffect: 0.7
      },
      {
        id: 'technological_leap',
        name: 'Technological Advancement',
        category: 'technological',
        description: 'Accelerate technological development',
        baseComplexity: 0.9,
        energyCost: 400,
        maxIntensity: 0.6,
        targetingPrecision: 0.5,
        subtlety: 0.4,
        reversibility: 0.1,
        rippleEffect: 0.95
      },
      {
        id: 'healing_wave',
        name: 'Mass Healing',
        category: 'biological',
        description: 'Cure diseases or heal injuries across a population',
        baseComplexity: 0.5,
        energyCost: 250,
        maxIntensity: 0.8,
        targetingPrecision: 0.8,
        subtlety: 0.2,
        reversibility: 0.0,
        rippleEffect: 0.4
      }
    ] as InterventionType[],

    consequencePredictions: {
      weather_control: {
        systemId: 'environmental',
        systemName: 'Environmental Systems',
        immediateImpact: {
          magnitude: 0.8,
          direction: 'chaotic',
          confidence: 0.75
        },
        shortTermEffects: [
          {
            description: 'Agricultural productivity changes',
            probability: 0.9,
            severity: 0.7,
            timeframe: '1-6 months'
          },
          {
            description: 'Migration pattern disruption',
            probability: 0.6,
            severity: 0.5,
            timeframe: '2-12 months'
          }
        ],
        longTermEffects: [
          {
            description: 'Climate adaptation strategies',
            probability: 0.8,
            severity: 0.6,
            timeframe: '1-5 years',
            cascadingEffects: ['technological development', 'social organization']
          },
          {
            description: 'Ecosystem shifts',
            probability: 0.7,
            severity: 0.8,
            timeframe: '5-20 years',
            cascadingEffects: ['biodiversity changes', 'resource availability']
          }
        ],
        unintendedConsequences: [
          {
            description: 'Butterfly effect on distant weather systems',
            probability: 0.4,
            risk: 'medium',
            mitigation: 'Gradual intensity scaling and monitoring'
          },
          {
            description: 'NPCs may lose appreciation for natural weather',
            probability: 0.3,
            risk: 'low',
            mitigation: 'Maintain natural variation in interventions'
          }
        ],
        systemicRisks: [
          {
            type: 'Ecological Collapse',
            probability: 0.1,
            impact: 0.9,
            description: 'Extreme weather changes could destabilize ecosystems'
          },
          {
            type: 'Social Disruption',
            probability: 0.3,
            impact: 0.6,
            description: 'Sudden weather changes could displace populations'
          }
        ]
      }
    } as Record<string, ConsequencePrediction>,

    ethicalAssessments: {
      weather_control: {
        autonomyRespect: 0.6,
        harmMinimization: 0.7,
        justiceAlignment: 0.5,
        consequentialismScore: 0.8,
        deontologyScore: 0.4,
        virtueEthicsScore: 0.6,
        overallEthicalRating: 0.6,
        ethicalConcerns: [
          {
            category: 'Autonomy',
            severity: 'medium',
            description: 'NPCs cannot consent to environmental changes',
            recommendation: 'Consider gradual changes that allow adaptation'
          },
          {
            category: 'Justice',
            severity: 'medium',
            description: 'Weather changes may benefit some regions while harming others',
            recommendation: 'Ensure equitable distribution of beneficial effects'
          }
        ]
      }
    } as Record<string, EthicalAssessment>,

    templates: [
      {
        id: 'gentle_inspiration',
        name: 'Gentle Inspiration Package',
        description: 'Low-intensity inspiration surge for creative breakthroughs',
        interventionType: 'inspiration_surge',
        targeting: {
          scope: 'individual',
          specificity: 'precise',
          duration: 'temporary',
          timing: 'conditional',
          conditions: [
            { type: 'creativity', parameter: 'blockade', value: true, operator: '=' }
          ]
        },
        intensity: 0.3,
        parameters: { creativity_boost: 0.4, duration_hours: 24 },
        estimatedEnergyCost: 25,
        complexity: 0.2,
        tags: ['low-risk', 'ethical', 'creative']
      },
      {
        id: 'ecological_restoration',
        name: 'Ecosystem Restoration',
        description: 'Careful environmental healing with minimal disruption',
        interventionType: 'weather_control',
        targeting: {
          scope: 'region',
          specificity: 'broad',
          duration: 'gradual',
          timing: 'immediate',
          conditions: []
        },
        intensity: 0.4,
        parameters: { restoration_type: 'gradual', focus: 'biodiversity' },
        estimatedEnergyCost: 120,
        complexity: 0.5,
        tags: ['environmental', 'restoration', 'gradual']
      }
    ] as InterventionTemplate[],

    history: [
      {
        id: 'hist_001',
        timestamp: Date.now() - 2592000000, // 30 days ago
        type: 'inspiration_surge',
        description: 'Inspired Elena the Artisan with new crafting technique',
        energyUsed: 45,
        actualConsequences: [
          {
            system: 'Economic',
            outcome: 'Increased craft quality led to higher trade value',
            severity: 0.6,
            duration: 180 // days
          },
          {
            system: 'Social',
            outcome: 'Other artisans sought to learn the technique',
            severity: 0.4,
            duration: 90
          }
        ],
        effectivenessRating: 0.85,
        unintendedConsequences: 0.1,
        ethicalScore: 0.9,
        lessonsLearned: [
          'Individual inspiration can have broader social effects',
          'Artisan networks amplify technological improvements'
        ]
      },
      {
        id: 'hist_002',
        timestamp: Date.now() - 1296000000, // 15 days ago
        type: 'weather_control',
        description: 'Minor rainfall increase to aid struggling crops',
        energyUsed: 85,
        actualConsequences: [
          {
            system: 'Agricultural',
            outcome: 'Crop yields increased by 15%',
            severity: 0.7,
            duration: 120
          },
          {
            system: 'Environmental',
            outcome: 'Slight ecosystem moisture increase',
            severity: 0.3,
            duration: 60
          }
        ],
        effectivenessRating: 0.78,
        unintendedConsequences: 0.05,
        ethicalScore: 0.85,
        lessonsLearned: [
          'Small weather adjustments have predictable outcomes',
          'Agricultural interventions are generally well-received'
        ]
      }
    ] as HistoricalIntervention[]
  }), []);

  const calculateEnergyCost = () => {
    if (!selectedIntervention) return 0;
    
    const intervention = mockData.interventionTypes.find(i => i.id === selectedIntervention);
    if (!intervention) return 0;

    let cost = intervention.energyCost;
    
    // Intensity scaling
    cost *= Math.pow(intensity, 1.5);
    
    // Scope scaling
    const scopeMultipliers = {
      'individual': 1,
      'group': 2.5,
      'settlement': 6,
      'region': 15,
      'global': 40
    };
    cost *= scopeMultipliers[targeting.scope] || 1;
    
    // Precision scaling
    const precisionMultipliers = {
      'precise': 1.5,
      'broad': 1,
      'random': 0.8,
      'conditional': 2
    };
    cost *= precisionMultipliers[targeting.specificity] || 1;
    
    // Duration scaling
    const durationMultipliers = {
      'instant': 1,
      'temporary': 1.2,
      'permanent': 3,
      'gradual': 1.8
    };
    cost *= durationMultipliers[targeting.duration] || 1;

    return Math.round(cost);
  };

  const InterventionDesignView = () => (
    <div className="bg-gray-900 border-4 border-gray-100 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6">
      <div className="flex items-center gap-3 mb-6">
        <Settings className="w-8 h-8 text-blue-400" />
        <h3 className="text-2xl font-black text-gray-100">INTERVENTION DESIGN</h3>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Intervention Selection */}
        <div className="bg-gray-800 border-2 border-gray-600 p-4">
          <h4 className="text-lg font-black text-gray-100 mb-4">INTERVENTION TYPE</h4>
          
          <div className="space-y-3 mb-6">
            {mockData.interventionTypes.map((intervention) => (
              <div
                key={intervention.id}
                onClick={() => setSelectedIntervention(intervention.id)}
                className={`p-3 border-2 cursor-pointer transition-colors ${
                  selectedIntervention === intervention.id
                    ? 'bg-blue-700 border-blue-400'
                    : 'bg-gray-700 border-gray-500 hover:bg-gray-600'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <h5 className="font-bold text-gray-100">{intervention.name}</h5>
                  <span className={`px-2 py-1 text-xs font-bold border ${
                    intervention.category === 'environmental' ? 'bg-green-600 border-green-400 text-green-100' :
                    intervention.category === 'social' ? 'bg-purple-600 border-purple-400 text-purple-100' :
                    intervention.category === 'cognitive' ? 'bg-blue-600 border-blue-400 text-blue-100' :
                    intervention.category === 'technological' ? 'bg-yellow-600 border-yellow-400 text-yellow-100' :
                    intervention.category === 'physical' ? 'bg-red-600 border-red-400 text-red-100' :
                    'bg-pink-600 border-pink-400 text-pink-100'
                  }`}>
                    {intervention.category.toUpperCase()}
                  </span>
                </div>
                <p className="text-sm text-gray-300 mb-2">{intervention.description}</p>
                <div className="text-xs text-gray-400">
                  <span>BASE COST: {intervention.energyCost} | </span>
                  <span>COMPLEXITY: {Math.round(intervention.baseComplexity * 100)}% | </span>
                  <span>SUBTLETY: {Math.round(intervention.subtlety * 100)}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Targeting Configuration */}
        <div className="bg-gray-800 border-2 border-gray-600 p-4">
          <h4 className="text-lg font-black text-gray-100 mb-4">TARGETING & PARAMETERS</h4>
          
          <div className="space-y-4">
            {/* Scope */}
            <div>
              <label className="block text-sm font-bold text-gray-200 mb-2">SCOPE</label>
              <select
                value={targeting.scope}
                onChange={(e) => setTargeting({...targeting, scope: e.target.value as any})}
                className="w-full bg-gray-700 border-2 border-gray-500 text-gray-100 font-bold p-2"
              >
                <option value="individual">INDIVIDUAL</option>
                <option value="group">GROUP</option>
                <option value="settlement">SETTLEMENT</option>
                <option value="region">REGION</option>
                <option value="global">GLOBAL</option>
              </select>
            </div>

            {/* Specificity */}
            <div>
              <label className="block text-sm font-bold text-gray-200 mb-2">SPECIFICITY</label>
              <select
                value={targeting.specificity}
                onChange={(e) => setTargeting({...targeting, specificity: e.target.value as any})}
                className="w-full bg-gray-700 border-2 border-gray-500 text-gray-100 font-bold p-2"
              >
                <option value="precise">PRECISE</option>
                <option value="broad">BROAD</option>
                <option value="random">RANDOM</option>
                <option value="conditional">CONDITIONAL</option>
              </select>
            </div>

            {/* Duration */}
            <div>
              <label className="block text-sm font-bold text-gray-200 mb-2">DURATION</label>
              <select
                value={targeting.duration}
                onChange={(e) => setTargeting({...targeting, duration: e.target.value as any})}
                className="w-full bg-gray-700 border-2 border-gray-500 text-gray-100 font-bold p-2"
              >
                <option value="instant">INSTANT</option>
                <option value="temporary">TEMPORARY</option>
                <option value="permanent">PERMANENT</option>
                <option value="gradual">GRADUAL</option>
              </select>
            </div>

            {/* Intensity */}
            <div>
              <label className="block text-sm font-bold text-gray-200 mb-2">
                INTENSITY: {Math.round(intensity * 100)}%
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={intensity}
                onChange={(e) => setIntensity(parseFloat(e.target.value))}
                className="w-full h-3 bg-gray-700 border-2 border-gray-500"
              />
            </div>

            {/* Energy Cost Display */}
            <div className="bg-gray-700 border-2 border-gray-500 p-3">
              <div className="flex justify-between items-center">
                <span className="font-bold text-gray-200">ESTIMATED ENERGY COST:</span>
                <span className={`text-lg font-black ${
                  calculateEnergyCost() > divineEnergyBudget ? 'text-red-400' : 'text-green-400'
                }`}>
                  {calculateEnergyCost()}
                </span>
              </div>
              <div className="text-xs text-gray-400 mt-1">
                AVAILABLE: {divineEnergyBudget} | REMAINING: {divineEnergyBudget - calculateEnergyCost()}
              </div>
              
              {calculateEnergyCost() > divineEnergyBudget && (
                <div className="flex items-center gap-2 mt-2 text-red-400 text-sm">
                  <AlertTriangle className="w-4 h-4" />
                  <span className="font-bold">INSUFFICIENT ENERGY</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const ConsequencePredictionView = () => {
    const prediction = selectedIntervention ? mockData.consequencePredictions[selectedIntervention] : null;
    
    if (!prediction) {
      return (
        <div className="bg-gray-900 border-4 border-gray-100 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6">
          <div className="flex items-center gap-3 mb-6">
            <Eye className="w-8 h-8 text-purple-400" />
            <h3 className="text-2xl font-black text-gray-100">CONSEQUENCE PREDICTION</h3>
          </div>
          <div className="text-center text-gray-400 py-12">
            <Eye className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-bold">SELECT AN INTERVENTION TO VIEW PREDICTIONS</p>
          </div>
        </div>
      );
    }

    return (
      <div className="bg-gray-900 border-4 border-gray-100 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6">
        <div className="flex items-center gap-3 mb-6">
          <Eye className="w-8 h-8 text-purple-400" />
          <h3 className="text-2xl font-black text-gray-100">CONSEQUENCE PREDICTION</h3>
        </div>

        <div className="grid grid-cols-2 gap-6">
          {/* Immediate Impact */}
          <div className="bg-gray-800 border-2 border-gray-600 p-4">
            <h4 className="text-lg font-black text-gray-100 mb-4">IMMEDIATE IMPACT</h4>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-bold text-gray-200">MAGNITUDE</span>
                  <span className="text-lg font-black text-purple-400">
                    {Math.round(prediction.immediateImpact.magnitude * 100)}%
                  </span>
                </div>
                <div className="bg-gray-700 border-2 border-gray-500 h-3 w-full">
                  <div 
                    className="bg-purple-500 h-full border-r-2 border-purple-400"
                    style={{ width: `${prediction.immediateImpact.magnitude * 100}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-bold text-gray-200">DIRECTION</span>
                  <span className={`px-2 py-1 text-xs font-bold border-2 ${
                    prediction.immediateImpact.direction === 'positive' ? 'bg-green-600 border-green-400 text-green-100' :
                    prediction.immediateImpact.direction === 'negative' ? 'bg-red-600 border-red-400 text-red-100' :
                    prediction.immediateImpact.direction === 'chaotic' ? 'bg-yellow-600 border-yellow-400 text-yellow-100' :
                    'bg-gray-600 border-gray-400 text-gray-100'
                  }`}>
                    {prediction.immediateImpact.direction.toUpperCase()}
                  </span>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-bold text-gray-200">CONFIDENCE</span>
                  <span className="text-lg font-black text-blue-400">
                    {Math.round(prediction.immediateImpact.confidence * 100)}%
                  </span>
                </div>
                <div className="bg-gray-700 border-2 border-gray-500 h-3 w-full">
                  <div 
                    className="bg-blue-500 h-full border-r-2 border-blue-400"
                    style={{ width: `${prediction.immediateImpact.confidence * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Temporal Effects */}
          <div className="bg-gray-800 border-2 border-gray-600 p-4">
            <h4 className="text-lg font-black text-gray-100 mb-4">TEMPORAL EFFECTS</h4>
            
            <div className="space-y-4">
              <div>
                <h5 className="text-sm font-bold text-gray-200 mb-2">SHORT-TERM EFFECTS</h5>
                {prediction.shortTermEffects.map((effect, index) => (
                  <div key={index} className="bg-gray-700 border border-gray-500 p-2 mb-2">
                    <div className="text-sm text-gray-100 mb-1">{effect.description}</div>
                    <div className="flex justify-between text-xs text-gray-400">
                      <span>PROBABILITY: {Math.round(effect.probability * 100)}%</span>
                      <span>SEVERITY: {Math.round(effect.severity * 100)}%</span>
                      <span>TIME: {effect.timeframe}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div>
                <h5 className="text-sm font-bold text-gray-200 mb-2">LONG-TERM EFFECTS</h5>
                {prediction.longTermEffects.map((effect, index) => (
                  <div key={index} className="bg-gray-700 border border-gray-500 p-2 mb-2">
                    <div className="text-sm text-gray-100 mb-1">{effect.description}</div>
                    <div className="flex justify-between text-xs text-gray-400 mb-1">
                      <span>PROBABILITY: {Math.round(effect.probability * 100)}%</span>
                      <span>SEVERITY: {Math.round(effect.severity * 100)}%</span>
                      <span>TIME: {effect.timeframe}</span>
                    </div>
                    {effect.cascadingEffects.length > 0 && (
                      <div className="text-xs text-yellow-400">
                        CASCADE: {effect.cascadingEffects.join(', ')}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Unintended Consequences */}
          <div className="bg-gray-800 border-2 border-gray-600 p-4">
            <h4 className="text-lg font-black text-gray-100 mb-4">UNINTENDED CONSEQUENCES</h4>
            
            <div className="space-y-3">
              {prediction.unintendedConsequences.map((consequence, index) => (
                <div key={index} className="bg-gray-700 border border-gray-500 p-3">
                  <div className="flex justify-between items-start mb-2">
                    <div className="text-sm text-gray-100">{consequence.description}</div>
                    <span className={`px-2 py-1 text-xs font-bold border ${
                      consequence.risk === 'low' ? 'bg-green-600 border-green-400 text-green-100' :
                      consequence.risk === 'medium' ? 'bg-yellow-600 border-yellow-400 text-yellow-100' :
                      consequence.risk === 'high' ? 'bg-red-600 border-red-400 text-red-100' :
                      'bg-purple-600 border-purple-400 text-purple-100'
                    }`}>
                      {consequence.risk.toUpperCase()}
                    </span>
                  </div>
                  <div className="text-xs text-gray-400 mb-2">
                    PROBABILITY: {Math.round(consequence.probability * 100)}%
                  </div>
                  <div className="text-xs text-blue-300">
                    <span className="font-bold">MITIGATION:</span> {consequence.mitigation}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Systemic Risks */}
          <div className="bg-gray-800 border-2 border-gray-600 p-4">
            <h4 className="text-lg font-black text-gray-100 mb-4">SYSTEMIC RISKS</h4>
            
            <div className="space-y-3">
              {prediction.systemicRisks.map((risk, index) => (
                <div key={index} className="bg-gray-700 border border-gray-500 p-3">
                  <div className="flex justify-between items-center mb-2">
                    <h5 className="text-sm font-bold text-gray-100">{risk.type}</h5>
                    <div className="text-xs text-gray-400">
                      RISK SCORE: {Math.round(risk.probability * risk.impact * 100)}
                    </div>
                  </div>
                  <div className="text-sm text-gray-300 mb-2">{risk.description}</div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-gray-400">PROBABILITY:</span>
                      <span className="text-gray-100 ml-1">{Math.round(risk.probability * 100)}%</span>
                    </div>
                    <div>
                      <span className="text-gray-400">IMPACT:</span>
                      <span className="text-gray-100 ml-1">{Math.round(risk.impact * 100)}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const EthicalAssessmentView = () => {
    const assessment = selectedIntervention ? mockData.ethicalAssessments[selectedIntervention] : null;
    
    if (!assessment) {
      return (
        <div className="bg-gray-900 border-4 border-gray-100 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6">
          <div className="flex items-center gap-3 mb-6">
            <Shield className="w-8 h-8 text-green-400" />
            <h3 className="text-2xl font-black text-gray-100">ETHICAL ASSESSMENT</h3>
          </div>
          <div className="text-center text-gray-400 py-12">
            <Shield className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-bold">SELECT AN INTERVENTION FOR ETHICAL ANALYSIS</p>
          </div>
        </div>
      );
    }

    const ethicsData = [
      { metric: 'Autonomy Respect', value: assessment.autonomyRespect * 100 },
      { metric: 'Harm Minimization', value: assessment.harmMinimization * 100 },
      { metric: 'Justice Alignment', value: assessment.justiceAlignment * 100 },
      { metric: 'Consequentialism', value: assessment.consequentialismScore * 100 },
      { metric: 'Deontology', value: assessment.deontologyScore * 100 },
      { metric: 'Virtue Ethics', value: assessment.virtueEthicsScore * 100 }
    ];

    return (
      <div className="bg-gray-900 border-4 border-gray-100 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6">
        <div className="flex items-center gap-3 mb-6">
          <Shield className="w-8 h-8 text-green-400" />
          <h3 className="text-2xl font-black text-gray-100">ETHICAL ASSESSMENT</h3>
        </div>

        <div className="grid grid-cols-2 gap-6">
          {/* Ethics Radar Chart */}
          <div className="bg-gray-800 border-2 border-gray-600 p-4">
            <h4 className="text-lg font-black text-gray-100 mb-4">ETHICAL FRAMEWORK ANALYSIS</h4>
            
            <div className="h-64 mb-4">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={ethicsData}>
                  <PolarGrid stroke="#374151" strokeWidth={1} />
                  <PolarAngleAxis 
                    dataKey="metric" 
                    tick={{ fill: '#F3F4F6', fontSize: 10, fontWeight: 'bold' }}
                  />
                  <PolarRadiusAxis 
                    angle={90} 
                    domain={[0, 100]} 
                    tick={{ fill: '#9CA3AF', fontSize: 8 }}
                    tickCount={6}
                  />
                  <Radar
                    name="Ethics Score"
                    dataKey="value"
                    stroke="#10B981"
                    fill="#10B981"
                    fillOpacity={0.3}
                    strokeWidth={2}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            <div className="text-center">
              <div className="text-3xl font-black text-green-400 mb-1">
                {Math.round(assessment.overallEthicalRating * 100)}%
              </div>
              <div className="text-sm text-gray-400 font-bold">OVERALL ETHICAL RATING</div>
            </div>
          </div>

          {/* Ethical Concerns */}
          <div className="bg-gray-800 border-2 border-gray-600 p-4">
            <h4 className="text-lg font-black text-gray-100 mb-4">ETHICAL CONCERNS</h4>
            
            <div className="space-y-4">
              {assessment.ethicalConcerns.map((concern, index) => (
                <div key={index} className="bg-gray-700 border border-gray-500 p-3">
                  <div className="flex justify-between items-start mb-2">
                    <h5 className="text-sm font-bold text-gray-100">{concern.category}</h5>
                    <span className={`px-2 py-1 text-xs font-bold border ${
                      concern.severity === 'low' ? 'bg-green-600 border-green-400 text-green-100' :
                      concern.severity === 'medium' ? 'bg-yellow-600 border-yellow-400 text-yellow-100' :
                      'bg-red-600 border-red-400 text-red-100'
                    }`}>
                      {concern.severity.toUpperCase()}
                    </span>
                  </div>
                  <div className="text-sm text-gray-300 mb-2">{concern.description}</div>
                  <div className="text-xs text-blue-300">
                    <span className="font-bold">RECOMMENDATION:</span> {concern.recommendation}
                  </div>
                </div>
              ))}
            </div>

            {/* Ethical Guidelines */}
            <div className="mt-6 bg-gray-700 border border-gray-500 p-3">
              <h5 className="text-sm font-bold text-gray-100 mb-2">DIVINE INTERVENTION PRINCIPLES</h5>
              <div className="text-xs text-gray-300 space-y-1">
                <div>• Respect NPC autonomy and free will</div>
                <div>• Minimize harm and suffering</div>
                <div>• Ensure fair distribution of benefits</div>
                <div>• Consider long-term consequences</div>
                <div>• Preserve the natural order when possible</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const HistoryAnalysisView = () => (
    <div className="bg-gray-900 border-4 border-gray-100 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6">
      <div className="flex items-center gap-3 mb-6">
        <Clock className="w-8 h-8 text-orange-400" />
        <h3 className="text-2xl font-black text-gray-100">INTERVENTION HISTORY</h3>
      </div>

      <div className="space-y-4">
        {mockData.history.map((intervention) => (
          <div key={intervention.id} className="bg-gray-800 border-2 border-gray-600 p-4">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 className="text-lg font-black text-gray-100">{intervention.description}</h4>
                <div className="text-sm text-gray-400">
                  {new Date(intervention.timestamp).toLocaleDateString()} | {intervention.type.replace('_', ' ').toUpperCase()}
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-black text-orange-400">{intervention.energyUsed}</div>
                <div className="text-xs text-gray-400">ENERGY USED</div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="text-center">
                <div className="text-xl font-black text-green-400">{Math.round(intervention.effectivenessRating * 100)}%</div>
                <div className="text-xs text-gray-400">EFFECTIVENESS</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-black text-yellow-400">{Math.round(intervention.unintendedConsequences * 100)}%</div>
                <div className="text-xs text-gray-400">UNINTENDED</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-black text-blue-400">{Math.round(intervention.ethicalScore * 100)}%</div>
                <div className="text-xs text-gray-400">ETHICAL</div>
              </div>
            </div>

            <div className="space-y-2">
              <h5 className="text-sm font-bold text-gray-200">ACTUAL CONSEQUENCES:</h5>
              {intervention.actualConsequences.map((consequence, index) => (
                <div key={index} className="bg-gray-700 border border-gray-500 p-2 text-sm">
                  <div className="text-gray-100">{consequence.outcome}</div>
                  <div className="text-xs text-gray-400">
                    {consequence.system} | SEVERITY: {Math.round(consequence.severity * 100)}% | 
                    DURATION: {consequence.duration} days
                  </div>
                </div>
              ))}
            </div>

            {intervention.lessonsLearned.length > 0 && (
              <div className="mt-3">
                <h5 className="text-sm font-bold text-gray-200 mb-1">LESSONS LEARNED:</h5>
                {intervention.lessonsLearned.map((lesson, index) => (
                  <div key={index} className="text-xs text-blue-300">• {lesson}</div>
                ))}
              </div>
            )}
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
          <Zap className="w-12 h-12 text-yellow-400" />
          <div>
            <h1 className="text-4xl font-black text-gray-100">DIVINE INTERVENTION DESIGNER</h1>
            <p className="text-gray-400 font-mono text-sm">
              DIVINE ENERGY: {divineEnergyBudget} | AVAILABLE ACTIONS: {availableActions.length}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          {['design', 'consequences', 'ethics', 'templates', 'history', 'analysis'].map((view) => (
            <button
              key={view}
              onClick={() => setSelectedView(view as any)}
              className={`px-3 py-2 font-bold text-xs border-2 transition-colors ${
                selectedView === view
                  ? 'bg-yellow-600 border-yellow-400 text-yellow-100'
                  : 'bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {view.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      {selectedView === 'design' && <InterventionDesignView />}
      {selectedView === 'consequences' && <ConsequencePredictionView />}
      {selectedView === 'ethics' && <EthicalAssessmentView />}
      {selectedView === 'history' && <HistoryAnalysisView />}

      {selectedView === 'templates' && (
        <div className="bg-gray-900 border-4 border-gray-100 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6">
          <div className="flex items-center gap-3 mb-6">
            <Layers className="w-8 h-8 text-pink-400" />
            <h3 className="text-2xl font-black text-gray-100">INTERVENTION TEMPLATES</h3>
          </div>
          
          <div className="space-y-4">
            {mockData.templates.map((template) => (
              <div key={template.id} className="bg-gray-800 border-2 border-gray-600 p-4">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="text-lg font-black text-gray-100">{template.name}</h4>
                    <p className="text-sm text-gray-300">{template.description}</p>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedIntervention(template.interventionType);
                      setTargeting(template.targeting);
                      setIntensity(template.intensity);
                      setCustomParameters(template.parameters);
                    }}
                    className="px-3 py-2 bg-pink-600 border-2 border-pink-400 text-pink-100 font-bold text-xs hover:bg-pink-700"
                  >
                    LOAD
                  </button>
                </div>

                <div className="grid grid-cols-4 gap-4 mb-3">
                  <div className="text-center">
                    <div className="text-lg font-black text-pink-400">{template.estimatedEnergyCost}</div>
                    <div className="text-xs text-gray-400">ENERGY</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-black text-gray-100">{Math.round(template.complexity * 100)}%</div>
                    <div className="text-xs text-gray-400">COMPLEXITY</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-black text-gray-100">{Math.round(template.intensity * 100)}%</div>
                    <div className="text-xs text-gray-400">INTENSITY</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-black text-gray-100">{template.tags.length}</div>
                    <div className="text-xs text-gray-400">TAGS</div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1">
                  {template.tags.map((tag) => (
                    <span key={tag} className="px-2 py-1 bg-gray-700 border border-gray-500 text-xs text-gray-300">
                      {tag.toUpperCase()}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedView === 'analysis' && (
        <div className="bg-gray-900 border-4 border-gray-100 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6">
          <div className="flex items-center gap-3 mb-6">
            <BarChart3 className="w-8 h-8 text-blue-400" />
            <h3 className="text-2xl font-black text-gray-100">INTERVENTION ANALYSIS</h3>
          </div>
          
          <div className="grid grid-cols-2 gap-6">
            {/* Effectiveness Trends */}
            <div className="bg-gray-800 border-2 border-gray-600 p-4">
              <h4 className="text-lg font-black text-gray-100 mb-4">EFFECTIVENESS TRENDS</h4>
              
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={mockData.history}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis 
                      dataKey="timestamp" 
                      type="number"
                      scale="time"
                      domain={['dataMin', 'dataMax']}
                      tickFormatter={(timestamp) => new Date(timestamp).toLocaleDateString()}
                      tick={{ fill: '#F3F4F6', fontSize: 10 }}
                    />
                    <YAxis 
                      domain={[0, 1]}
                      tick={{ fill: '#F3F4F6', fontSize: 10 }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1F2937', 
                        border: '1px solid #374151',
                        color: '#F3F4F6'
                      }}
                      labelFormatter={(timestamp) => new Date(timestamp as number).toLocaleDateString()}
                    />
                    <Line
                      type="monotone"
                      dataKey="effectivenessRating"
                      stroke="#10B981"
                      strokeWidth={3}
                      dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                      name="Effectiveness"
                    />
                    <Line
                      type="monotone"
                      dataKey="ethicalScore"
                      stroke="#3B82F6"
                      strokeWidth={2}
                      dot={{ fill: '#3B82F6', strokeWidth: 2, r: 3 }}
                      name="Ethical Score"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Energy Efficiency */}
            <div className="bg-gray-800 border-2 border-gray-600 p-4">
              <h4 className="text-lg font-black text-gray-100 mb-4">ENERGY EFFICIENCY</h4>
              
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart data={mockData.history}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis 
                      dataKey="energyUsed" 
                      tick={{ fill: '#F3F4F6', fontSize: 10 }}
                      name="Energy Used"
                    />
                    <YAxis 
                      dataKey="effectivenessRating" 
                      tick={{ fill: '#F3F4F6', fontSize: 10 }}
                      name="Effectiveness"
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1F2937', 
                        border: '1px solid #374151',
                        color: '#F3F4F6'
                      }}
                      cursor={{ strokeDasharray: '3 3' }}
                    />
                    <Scatter 
                      dataKey="effectivenessRating" 
                      fill="#F59E0B"
                      name="Interventions"
                    />
                  </ScatterChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-4 text-sm text-gray-300">
                <div className="font-bold mb-1">EFFICIENCY INSIGHTS:</div>
                <div>• Higher energy costs don't always guarantee better results</div>
                <div>• Sweet spot appears around 50-150 energy units</div>
                <div>• Diminishing returns above 300 energy units</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-between items-center mt-8">
        <div className="flex gap-4">
          <button
            onClick={() => setPreviewMode(!previewMode)}
            className={`px-4 py-2 font-bold border-2 transition-colors ${
              previewMode
                ? 'bg-blue-600 border-blue-400 text-blue-100'
                : 'bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700'
            }`}
          >
            {previewMode ? 'PREVIEW MODE' : 'EXECUTION MODE'}
          </button>
        </div>

        <div className="flex gap-4">
          <button className="px-6 py-3 bg-gray-800 border-2 border-gray-600 text-gray-300 font-bold hover:bg-gray-700">
            SAVE TEMPLATE
          </button>
          <button 
            disabled={!selectedIntervention || calculateEnergyCost() > divineEnergyBudget}
            className="px-6 py-3 bg-yellow-600 border-2 border-yellow-400 text-yellow-100 font-bold hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {previewMode ? 'PREVIEW INTERVENTION' : 'EXECUTE INTERVENTION'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default DivineInterventionDesigner;
