import React, { useState, useEffect, useMemo } from 'react';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Scroll, Users, Eye, Brain, Zap, AlertTriangle, Clock, Compass, BookOpen, MessageSquare } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar } from 'recharts';

interface UltraAdvancedEventInterfaceProps {
  eventData: any;
  worldState: any;
  onChoice: Function;
}

interface EventChoice {
  id: string;
  text: string;
  description: string;
  requirements: string[];
  consequences: {
    immediate: Array<{ system: string; change: number; description: string }>;
    delayed: Array<{ system: string; change: number; description: string; delay: number }>;
    rippleEffects: Array<{ target: string; effect: string; probability: number }>;
  };
  divineEnergyCost: number;
  complexity: number;
  moralImplications: {
    beneficiaries: string[];
    harmed: string[];
    ethicalScore: number;
  };
  emergenceProbability: number;
  historicalPrecedent?: string;
  culturalImpact: number;
  environmentalImpact: number;
}

interface NPCPerspective {
  npcId: string;
  name: string;
  thoughts: string[];
  emotions: { [emotion: string]: number };
  expectedReaction: string;
  personalStake: number;
  influence: number;
  relationshipChanges: Array<{ target: string; change: number; reason: string }>;
  memoryFormation: { importance: number; emotionalCharge: number; category: string };
}

interface SystemicImpact {
  system: string;
  currentState: number;
  projectedChange: number;
  confidence: number;
  timeToEffect: number;
  cascadeEffects: Array<{ target: string; magnitude: number; delay: number }>;
  adaptability: number;
  reversibility: number;
}

interface EventContext {
  historicalEvents: Array<{ 
    description: string; 
    similarity: number; 
    outcome: string; 
    timestamp: number 
  }>;
  environmentalFactors: Array<{ 
    factor: string; 
    influence: number; 
    description: string 
  }>;
  socialFactors: Array<{ 
    factor: string; 
    influence: number; 
    description: string 
  }>;
  culturalResonance: {
    traditions: string[];
    conflicts: string[];
    opportunities: string[];
  };
}

export function UltraAdvancedEventInterface({ eventData, worldState, onChoice }: UltraAdvancedEventInterfaceProps) {
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<'narrative' | 'npcs' | 'systems' | 'context' | 'consequences' | 'designer'>('narrative');
  const [selectedNPC, setSelectedNPC] = useState<string | null>(null);
  const [customParameters, setCustomParameters] = useState<{ [key: string]: number }>({});
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);

  // Mock event data - replace with actual props
  const mockEventData = useMemo(() => ({
    id: 'event_001',
    title: 'The Great Harvest Festival Dispute',
    description: 'A disagreement has erupted between the merchant class and agricultural communities over the distribution of festival proceeds. The merchants claim their organizational efforts deserve a larger share, while farmers argue their produce is the foundation of the celebration.',
    type: 'social_economic',
    urgency: 0.7,
    complexity: 0.8,
    timestamp: Date.now(),
    location: 'Central Market Square',
    involvedFactions: ['Merchants', 'Farmers', 'Artisans'],
    
    choices: [
      {
        id: 'choice_1',
        text: 'Support Merchant Claims',
        description: 'Favor the merchants\' organizational contributions and grant them a larger share of festival proceeds',
        requirements: ['Trade Influence > 0.5', 'Economic Stability'],
        consequences: {
          immediate: [
            { system: 'Economic Growth', change: 0.15, description: 'Increased trade activity and merchant satisfaction' },
            { system: 'Social Cohesion', change: -0.1, description: 'Farmer resentment and class tensions' }
          ],
          delayed: [
            { system: 'Agricultural Production', change: -0.05, description: 'Reduced farmer motivation', delay: 7 },
            { system: 'Trade Networks', change: 0.1, description: 'Expanded merchant connections', delay: 14 }
          ],
          rippleEffects: [
            { target: 'Rural Communities', effect: 'Increased migration to cities', probability: 0.6 },
            { target: 'Artisan Guilds', effect: 'Alignment with merchant interests', probability: 0.8 }
          ]
        },
        divineEnergyCost: 25,
        complexity: 0.6,
        moralImplications: {
          beneficiaries: ['Merchants', 'Urban Population'],
          harmed: ['Farmers', 'Rural Communities'],
          ethicalScore: 0.4
        },
        emergenceProbability: 0.3,
        historicalPrecedent: 'The Silk Road Privileges of 1456',
        culturalImpact: 0.2,
        environmentalImpact: 0.1
      },
      {
        id: 'choice_2',
        text: 'Support Farmer Rights',
        description: 'Emphasize the fundamental importance of agricultural production and maintain traditional distribution',
        requirements: ['Agricultural Stability > 0.6', 'Rural Support'],
        consequences: {
          immediate: [
            { system: 'Agricultural Morale', change: 0.2, description: 'Increased farmer dedication and pride' },
            { system: 'Trade Relations', change: -0.1, description: 'Merchant disappointment and reduced investment' }
          ],
          delayed: [
            { system: 'Food Security', change: 0.08, description: 'Improved agricultural output', delay: 10 },
            { system: 'Economic Innovation', change: -0.05, description: 'Reduced merchant-driven development', delay: 21 }
          ],
          rippleEffects: [
            { target: 'Traditional Values', effect: 'Strengthened cultural identity', probability: 0.9 },
            { target: 'Youth Migration', effect: 'Increased rural retention', probability: 0.5 }
          ]
        },
        divineEnergyCost: 20,
        complexity: 0.5,
        moralImplications: {
          beneficiaries: ['Farmers', 'Traditional Communities', 'Food Security'],
          harmed: ['Merchants', 'Economic Modernization'],
          ethicalScore: 0.7
        },
        emergenceProbability: 0.2,
        culturalImpact: 0.4,
        environmentalImpact: 0.3
      },
      {
        id: 'choice_3',
        text: 'Innovative Compromise',
        description: 'Propose a new system that recognizes both contributions while creating opportunities for collaboration',
        requirements: ['Innovation > 0.7', 'Diplomatic Relations', 'Divine Energy > 40'],
        consequences: {
          immediate: [
            { system: 'Social Innovation', change: 0.15, description: 'Creative problem-solving precedent established' },
            { system: 'Political Complexity', change: 0.1, description: 'More nuanced governance expectations' }
          ],
          delayed: [
            { system: 'Collaborative Economy', change: 0.12, description: 'New partnership models emerge', delay: 14 },
            { system: 'Cultural Evolution', change: 0.08, description: 'Adaptive traditions develop', delay: 30 }
          ],
          rippleEffects: [
            { target: 'Other Disputes', effect: 'Preference for innovative solutions', probability: 0.7 },
            { target: 'Institutional Change', effect: 'Evolution of governance structures', probability: 0.6 }
          ]
        },
        divineEnergyCost: 45,
        complexity: 0.9,
        moralImplications: {
          beneficiaries: ['All Parties', 'Future Generations', 'Social Progress'],
          harmed: ['Traditional Power Structures'],
          ethicalScore: 0.9
        },
        emergenceProbability: 0.8,
        historicalPrecedent: 'The Great Synthesis of 1789',
        culturalImpact: 0.6,
        environmentalImpact: 0.2
      }
    ] as EventChoice[],

    npcPerspectives: [
      {
        npcId: 'merchant_leader',
        name: 'Marcus the Trader',
        thoughts: [
          'Our organizational efforts made this festival possible',
          'Without trade networks, there would be no festival prosperity',
          'The farmers benefit from our marketing and distribution'
        ],
        emotions: { frustration: 0.7, determination: 0.8, pride: 0.6, anxiety: 0.4 },
        expectedReaction: 'Will likely organize merchant coalition if unsupported',
        personalStake: 0.9,
        influence: 0.8,
        relationshipChanges: [
          { target: 'farmer_representatives', change: -0.3, reason: 'Economic competition' },
          { target: 'artisan_guilds', change: 0.2, reason: 'Potential alliance' }
        ],
        memoryFormation: { importance: 0.9, emotionalCharge: 0.8, category: 'economic_conflict' }
      },
      {
        npcId: 'farmer_elder',
        name: 'Elena of the Fields',
        thoughts: [
          'The land provides the foundation for all prosperity',
          'Merchants profit from our labor without true contribution',
          'Traditional ways have sustained us for generations'
        ],
        emotions: { indignation: 0.8, protectiveness: 0.9, worry: 0.6, hope: 0.3 },
        expectedReaction: 'May lead agricultural strike if rights not protected',
        personalStake: 0.95,
        influence: 0.7,
        relationshipChanges: [
          { target: 'merchant_leader', change: -0.4, reason: 'Fundamental disagreement' },
          { target: 'rural_communities', change: 0.3, reason: 'Solidarity building' }
        ],
        memoryFormation: { importance: 0.95, emotionalCharge: 0.9, category: 'community_defense' }
      },
      {
        npcId: 'young_artisan',
        name: 'Sofia the Craftsperson',
        thoughts: [
          'Both sides have valid points about contribution',
          'Maybe there\'s a way to honor everyone\'s work',
          'The festival should bring us together, not divide us'
        ],
        emotions: { curiosity: 0.7, concern: 0.6, optimism: 0.5, uncertainty: 0.8 },
        expectedReaction: 'Likely to support innovative solutions that bridge divides',
        personalStake: 0.6,
        influence: 0.4,
        relationshipChanges: [
          { target: 'both_factions', change: 0.1, reason: 'Diplomatic approach' }
        ],
        memoryFormation: { importance: 0.7, emotionalCharge: 0.5, category: 'social_learning' }
      }
    ] as NPCPerspective[],

    systemicImpacts: [
      {
        system: 'Economic Balance',
        currentState: 0.72,
        projectedChange: 0.15,
        confidence: 0.85,
        timeToEffect: 3,
        cascadeEffects: [
          { target: 'Trade Volume', magnitude: 0.12, delay: 7 },
          { target: 'Income Distribution', magnitude: -0.08, delay: 14 }
        ],
        adaptability: 0.7,
        reversibility: 0.6
      },
      {
        system: 'Social Harmony',
        currentState: 0.68,
        projectedChange: -0.1,
        confidence: 0.9,
        timeToEffect: 1,
        cascadeEffects: [
          { target: 'Interpersonal Trust', magnitude: -0.15, delay: 5 },
          { target: 'Collaborative Projects', magnitude: -0.2, delay: 10 }
        ],
        adaptability: 0.5,
        reversibility: 0.8
      },
      {
        system: 'Cultural Identity',
        currentState: 0.81,
        projectedChange: 0.05,
        confidence: 0.7,
        timeToEffect: 7,
        cascadeEffects: [
          { target: 'Traditional Practices', magnitude: 0.1, delay: 14 },
          { target: 'Innovation Acceptance', magnitude: -0.05, delay: 21 }
        ],
        adaptability: 0.3,
        reversibility: 0.4
      }
    ] as SystemicImpact[],

    context: {
      historicalEvents: [
        { description: 'The Wheat Wars of three decades ago', similarity: 0.75, outcome: 'Led to permanent class divisions', timestamp: Date.now() - 946080000000 },
        { description: 'The Artisan Uprising resolution', similarity: 0.6, outcome: 'Successful compromise through innovation', timestamp: Date.now() - 473040000000 }
      ],
      environmentalFactors: [
        { factor: 'Exceptionally good harvest', influence: 0.3, description: 'Abundant crops reduce scarcity fears' },
        { factor: 'Market day weather', influence: 0.1, description: 'Clear skies encourage public gathering' }
      ],
      socialFactors: [
        { factor: 'Recent trade agreement success', influence: 0.4, description: 'Merchants have increased confidence' },
        { factor: 'Generational shift in farming', influence: 0.3, description: 'Younger farmers more open to change' }
      ],
      culturalResonance: {
        traditions: ['Harvest Festival ancestral customs', 'Community sharing principles'],
        conflicts: ['Economic class tensions', 'Traditional vs. modern values'],
        opportunities: ['Festival innovation', 'Cross-class collaboration']
      }
    } as EventContext
  }), []);

  const NarrativePresentation = () => (
    <div className="bg-gray-900 border-4 border-gray-100 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6">
      <div className="flex items-center gap-3 mb-6">
        <Scroll className="w-8 h-8 text-blue-400" />
        <h3 className="text-2xl font-black text-gray-100">EVENT NARRATIVE</h3>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Main Narrative */}
        <div className="col-span-2 bg-gray-800 border-2 border-gray-600 p-4">
          <h4 className="text-xl font-black text-gray-100 mb-4">{mockEventData.title}</h4>
          <p className="text-gray-300 leading-relaxed mb-6">{mockEventData.description}</p>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <div className="text-xs text-gray-400 font-bold mb-1">URGENCY</div>
              <div className="bg-gray-700 border-2 border-gray-500 h-4 w-full">
                <div 
                  className="bg-red-500 h-full border-r-2 border-red-400"
                  style={{ width: `${mockEventData.urgency * 100}%` }}
                />
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-400 font-bold mb-1">COMPLEXITY</div>
              <div className="bg-gray-700 border-2 border-gray-500 h-4 w-full">
                <div 
                  className="bg-purple-500 h-full border-r-2 border-purple-400"
                  style={{ width: `${mockEventData.complexity * 100}%` }}
                />
              </div>
            </div>
          </div>

          <div className="text-sm text-gray-300 space-y-2">
            <div><span className="font-bold text-gray-100">LOCATION:</span> {mockEventData.location}</div>
            <div><span className="font-bold text-gray-100">INVOLVED FACTIONS:</span> {mockEventData.involvedFactions.join(', ')}</div>
            <div><span className="font-bold text-gray-100">TYPE:</span> {mockEventData.type.replace('_', ' ').toUpperCase()}</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-gray-800 border-2 border-gray-600 p-4">
          <h4 className="text-lg font-black text-gray-100 mb-4">DIVINE CHOICES</h4>
          <div className="space-y-3">
            {mockEventData.choices.map((choice) => (
              <button
                key={choice.id}
                onClick={() => setSelectedChoice(selectedChoice === choice.id ? null : choice.id)}
                className={`w-full text-left p-3 border-2 transition-colors ${
                  selectedChoice === choice.id
                    ? 'bg-blue-600 border-blue-400 text-blue-100'
                    : 'bg-gray-700 border-gray-500 text-gray-200 hover:bg-gray-600'
                }`}
              >
                <div className="font-bold text-sm mb-1">{choice.text}</div>
                <div className="text-xs opacity-80">{choice.description}</div>
                <div className="flex justify-between mt-2 text-xs">
                  <span>COST: {choice.divineEnergyCost}</span>
                  <span>ETHICS: {Math.round(choice.moralImplications.ethicalScore * 100)}%</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const NPCConsciousnessPanels = () => (
    <div className="bg-gray-900 border-4 border-gray-100 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6">
      <div className="flex items-center gap-3 mb-6">
        <Brain className="w-8 h-8 text-purple-400" />
        <h3 className="text-2xl font-black text-gray-100">NPC CONSCIOUSNESS</h3>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {mockEventData.npcPerspectives.map((npc) => (
          <div 
            key={npc.npcId} 
            className={`border-2 p-4 cursor-pointer transition-colors ${
              selectedNPC === npc.npcId 
                ? 'bg-purple-900 border-purple-400' 
                : 'bg-gray-800 border-gray-600 hover:bg-gray-700'
            }`}
            onClick={() => setSelectedNPC(selectedNPC === npc.npcId ? null : npc.npcId)}
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <h4 className="text-lg font-black text-gray-100">{npc.name}</h4>
                <div className="text-sm text-gray-400">Personal Stake: {Math.round(npc.personalStake * 100)}% | Influence: {Math.round(npc.influence * 100)}%</div>
              </div>
              <div className="text-right">
                <div className="text-xs text-gray-400 font-bold">MEMORY IMPORTANCE</div>
                <div className="text-sm text-gray-100 font-black">{Math.round(npc.memoryFormation.importance * 100)}%</div>
              </div>
            </div>

            {selectedNPC === npc.npcId && (
              <div className="space-y-4">
                {/* Thoughts */}
                <div>
                  <div className="text-sm font-bold text-gray-200 mb-2">CURRENT THOUGHTS:</div>
                  <div className="space-y-2">
                    {npc.thoughts.map((thought, index) => (
                      <div key={index} className="bg-gray-700 border border-gray-500 p-2 text-sm text-gray-300">
                        "{thought}"
                      </div>
                    ))}
                  </div>
                </div>

                {/* Emotions */}
                <div>
                  <div className="text-sm font-bold text-gray-200 mb-2">EMOTIONAL STATE:</div>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(npc.emotions).map(([emotion, intensity]) => (
                      <div key={emotion} className="flex justify-between items-center">
                        <span className="text-xs text-gray-400 font-bold">{emotion.toUpperCase()}</span>
                        <div className="bg-gray-700 border border-gray-500 h-2 w-16">
                          <div 
                            className="bg-red-500 h-full"
                            style={{ width: `${intensity * 100}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Expected Reaction */}
                <div>
                  <div className="text-sm font-bold text-gray-200 mb-2">EXPECTED REACTION:</div>
                  <div className="bg-gray-700 border border-gray-500 p-2 text-sm text-gray-300">
                    {npc.expectedReaction}
                  </div>
                </div>

                {/* Relationship Changes */}
                <div>
                  <div className="text-sm font-bold text-gray-200 mb-2">RELATIONSHIP IMPACTS:</div>
                  <div className="space-y-1">
                    {npc.relationshipChanges.map((change, index) => (
                      <div key={index} className="flex justify-between items-center text-xs">
                        <span className="text-gray-400">{change.target}</span>
                        <span className={`font-bold ${change.change > 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {change.change > 0 ? '+' : ''}{Math.round(change.change * 100)}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const SystemicImpactVisualization = () => (
    <div className="bg-gray-900 border-4 border-gray-100 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6">
      <div className="flex items-center gap-3 mb-6">
        <Zap className="w-8 h-8 text-yellow-400" />
        <h3 className="text-2xl font-black text-gray-100">SYSTEMIC IMPACT</h3>
      </div>

      <div className="space-y-4">
        {mockEventData.systemicImpacts.map((impact) => (
          <div key={impact.system} className="bg-gray-800 border-2 border-gray-600 p-4">
            <div className="flex justify-between items-start mb-4">
              <h4 className="text-lg font-black text-gray-100">{impact.system}</h4>
              <div className="text-right">
                <div className="text-sm text-gray-300 font-bold">
                  {Math.round(impact.currentState * 100)}% → {Math.round((impact.currentState + impact.projectedChange) * 100)}%
                </div>
                <div className="text-xs text-gray-400">CONFIDENCE: {Math.round(impact.confidence * 100)}%</div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-4">
              <div>
                <div className="text-xs text-gray-400 font-bold mb-1">CURRENT STATE</div>
                <div className="bg-gray-700 border-2 border-gray-500 h-3 w-full">
                  <div 
                    className="bg-blue-500 h-full border-r-2 border-blue-400"
                    style={{ width: `${impact.currentState * 100}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-400 font-bold mb-1">PROJECTED CHANGE</div>
                <div className="bg-gray-700 border-2 border-gray-500 h-3 w-full">
                  <div 
                    className={`h-full border-r-2 ${
                      impact.projectedChange > 0 ? 'bg-green-500 border-green-400' : 'bg-red-500 border-red-400'
                    }`}
                    style={{ width: `${Math.abs(impact.projectedChange) * 500}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-400 font-bold mb-1">REVERSIBILITY</div>
                <div className="bg-gray-700 border-2 border-gray-500 h-3 w-full">
                  <div 
                    className="bg-purple-500 h-full border-r-2 border-purple-400"
                    style={{ width: `${impact.reversibility * 100}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="text-xs text-gray-300">
              <div className="mb-1"><span className="font-bold">TIME TO EFFECT:</span> {impact.timeToEffect} days</div>
              <div><span className="font-bold">CASCADE EFFECTS:</span> {impact.cascadeEffects.length} downstream impacts detected</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const ConsequenceModeling = () => {
    if (!selectedChoice) {
      return (
        <div className="bg-gray-900 border-4 border-gray-100 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6">
          <div className="flex items-center gap-3 mb-6">
            <Eye className="w-8 h-8 text-green-400" />
            <h3 className="text-2xl font-black text-gray-100">CONSEQUENCE MODELING</h3>
          </div>
          <div className="text-center py-8">
            <div className="text-gray-400 text-lg font-bold">SELECT A CHOICE TO VIEW CONSEQUENCES</div>
          </div>
        </div>
      );
    }

    const choice = mockEventData.choices.find(c => c.id === selectedChoice)!;

    return (
      <div className="bg-gray-900 border-4 border-gray-100 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6">
        <div className="flex items-center gap-3 mb-6">
          <Eye className="w-8 h-8 text-green-400" />
          <h3 className="text-2xl font-black text-gray-100">CONSEQUENCE MODELING: {choice.text}</h3>
        </div>

        <div className="grid grid-cols-2 gap-6">
          {/* Immediate Consequences */}
          <div className="bg-gray-800 border-2 border-gray-600 p-4">
            <h4 className="text-lg font-black text-gray-100 mb-4">IMMEDIATE EFFECTS</h4>
            <div className="space-y-3">
              {choice.consequences.immediate.map((effect, index) => (
                <div key={index} className="bg-gray-700 border border-gray-500 p-3">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-bold text-gray-100">{effect.system}</span>
                    <span className={`font-bold ${effect.change > 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {effect.change > 0 ? '+' : ''}{Math.round(effect.change * 100)}%
                    </span>
                  </div>
                  <div className="text-sm text-gray-300">{effect.description}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Delayed Consequences */}
          <div className="bg-gray-800 border-2 border-gray-600 p-4">
            <h4 className="text-lg font-black text-gray-100 mb-4">DELAYED EFFECTS</h4>
            <div className="space-y-3">
              {choice.consequences.delayed.map((effect, index) => (
                <div key={index} className="bg-gray-700 border border-gray-500 p-3">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-bold text-gray-100">{effect.system}</span>
                    <div className="text-right">
                      <span className={`font-bold ${effect.change > 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {effect.change > 0 ? '+' : ''}{Math.round(effect.change * 100)}%
                      </span>
                      <div className="text-xs text-gray-400">{effect.delay}d delay</div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-300">{effect.description}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Ripple Effects */}
          <div className="col-span-2 bg-gray-800 border-2 border-gray-600 p-4">
            <h4 className="text-lg font-black text-gray-100 mb-4">RIPPLE EFFECTS</h4>
            <div className="grid grid-cols-2 gap-4">
              {choice.consequences.rippleEffects.map((effect, index) => (
                <div key={index} className="bg-gray-700 border border-gray-500 p-3">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-bold text-gray-100">{effect.target}</span>
                    <span className="text-sm text-blue-400 font-bold">{Math.round(effect.probability * 100)}%</span>
                  </div>
                  <div className="text-sm text-gray-300">{effect.effect}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-6 text-center">
          <button
            onClick={() => onChoice(selectedChoice, choice)}
            className="px-8 py-4 bg-blue-600 border-4 border-blue-400 text-blue-100 font-black text-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 transition-all"
          >
            EXECUTE DIVINE WILL
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-black border-8 border-gray-100 shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Scroll className="w-12 h-12 text-blue-400" />
          <div>
            <h1 className="text-4xl font-black text-gray-100">DIVINE EVENT INTERFACE</h1>
            <p className="text-gray-400 font-mono text-sm">EMERGENCE PROBABILITY: {Math.round((selectedChoice ? mockEventData.choices.find(c => c.id === selectedChoice)?.emergenceProbability || 0 : 0) * 100)}%</p>
          </div>
        </div>
        <div className="flex gap-2">
          {['narrative', 'npcs', 'systems', 'consequences', 'context'].map((view) => (
            <button
              key={view}
              onClick={() => setActiveView(view as any)}
              className={`px-4 py-2 font-bold text-sm border-2 transition-colors ${
                activeView === view
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
      {activeView === 'narrative' && <NarrativePresentation />}
      {activeView === 'npcs' && <NPCConsciousnessPanels />}
      {activeView === 'systems' && <SystemicImpactVisualization />}
      {activeView === 'consequences' && <ConsequenceModeling />}

      {activeView === 'context' && (
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-gray-900 border-4 border-gray-100 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6">
            <div className="flex items-center gap-3 mb-6">
              <Clock className="w-8 h-8 text-orange-400" />
              <h3 className="text-2xl font-black text-gray-100">HISTORICAL CONTEXT</h3>
            </div>
            <div className="space-y-4">
              {mockEventData.context.historicalEvents.map((event, index) => (
                <div key={index} className="bg-gray-800 border-2 border-gray-600 p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="text-sm font-bold text-gray-100">{event.description}</h4>
                    <span className="text-xs text-blue-400 font-bold">{Math.round(event.similarity * 100)}% similar</span>
                  </div>
                  <div className="text-sm text-gray-300 mb-2">{event.outcome}</div>
                  <div className="text-xs text-gray-400">{new Date(event.timestamp).toLocaleDateString()}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-900 border-4 border-gray-100 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6">
            <div className="flex items-center gap-3 mb-6">
              <Compass className="w-8 h-8 text-green-400" />
              <h3 className="text-2xl font-black text-gray-100">CONTEXTUAL FACTORS</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <h4 className="text-lg font-bold text-gray-100 mb-2">Environmental</h4>
                {mockEventData.context.environmentalFactors.map((factor, index) => (
                  <div key={index} className="bg-gray-800 border border-gray-600 p-2 mb-2">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-bold text-gray-200">{factor.factor}</span>
                      <span className="text-xs text-green-400 font-bold">{Math.round(factor.influence * 100)}%</span>
                    </div>
                    <div className="text-xs text-gray-400">{factor.description}</div>
                  </div>
                ))}
              </div>

              <div>
                <h4 className="text-lg font-bold text-gray-100 mb-2">Social</h4>
                {mockEventData.context.socialFactors.map((factor, index) => (
                  <div key={index} className="bg-gray-800 border border-gray-600 p-2 mb-2">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-bold text-gray-200">{factor.factor}</span>
                      <span className="text-xs text-blue-400 font-bold">{Math.round(factor.influence * 100)}%</span>
                    </div>
                    <div className="text-xs text-gray-400">{factor.description}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UltraAdvancedEventInterface;
