import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Users, Heart, MessageCircle, Zap, TrendingUp, AlertTriangle, Network, Crown, Globe, Share2 } from 'lucide-react';
import { ForceGraph2D } from 'react-force-graph';
import { ResponsiveContainer, Sankey, Tooltip, Cell, PieChart, Pie, LineChart, Line, XAxis, YAxis, CartesianGrid, AreaChart, Area } from 'recharts';

interface SocialNetworkAnalyzerProps {
  worldId: string;
  focusNPC?: string;
  networkDepth: number;
}

interface RelationshipData {
  id: string;
  source: string;
  target: string;
  sourceName: string;
  targetName: string;
  strength: number;
  type: 'friendship' | 'family' | 'romantic' | 'professional' | 'rivalry' | 'mentorship' | 'trade' | 'alliance';
  duration: number; // in days
  interactions: number;
  sentiment: number; // -1 to 1
  influence: number; // 0 to 1
  stability: number; // 0 to 1
  conflictLevel: number; // 0 to 1
  trust: number; // 0 to 1
  dependence: number; // 0 to 1
  powerDynamic: number; // -1 (target dominant) to 1 (source dominant)
}

interface NPCNode {
  id: string;
  name: string;
  x?: number;
  y?: number;
  fx?: number;
  fy?: number;
  group: string;
  influence: number;
  socialStatus: number;
  charisma: number;
  connections: number;
  traits: string[];
  age: number;
  occupation: string;
  location: string;
  faction?: string;
  reputation: number;
  culturalGroup: string;
}

interface SocialGroup {
  id: string;
  name: string;
  members: string[];
  cohesion: number;
  influence: number;
  type: 'family' | 'professional' | 'cultural' | 'political' | 'religious' | 'social' | 'economic';
  leadership: string[];
  goals: string[];
  conflicts: string[];
  alliances: string[];
}

interface CommunicationFlow {
  from: string;
  to: string;
  fromName: string;
  toName: string;
  volume: number;
  sentiment: number;
  topics: string[];
  frequency: number;
  recentActivity: Array<{ timestamp: number; content: string; type: string }>;
}

interface SocialNetworkData {
  nodes: NPCNode[];
  relationships: RelationshipData[];
  groups: SocialGroup[];
  communications: CommunicationFlow[];
  influencePatterns: Array<{
    influencer: string;
    influenced: string[];
    topic: string;
    strength: number;
    propagationSpeed: number;
  }>;
  conflictZones: Array<{
    participants: string[];
    intensity: number;
    cause: string;
    duration: number;
    resolution?: string;
  }>;
  emergentBehaviors: Array<{
    type: string;
    participants: string[];
    description: string;
    significance: number;
    timestamp: number;
  }>;
  culturalTransmission: Array<{
    source: string;
    targets: string[];
    concept: string;
    adoptionRate: number;
    resistance: number;
  }>;
}

export function SocialNetworkAnalyzer({ worldId, focusNPC, networkDepth }: SocialNetworkAnalyzerProps) {
  const [selectedView, setSelectedView] = useState<'network' | 'groups' | 'communication' | 'influence' | 'conflicts' | 'emergence' | 'culture'>('network');
  const [selectedNode, setSelectedNode] = useState<string | null>(focusNPC || null);
  const [graphData, setGraphData] = useState<{ nodes: NPCNode[]; links: RelationshipData[] } | null>(null);
  const [filterType, setFilterType] = useState<string>('all');
  const [timeRange, setTimeRange] = useState<'1d' | '7d' | '30d' | 'all'>('7d');

  // Fetch AI-generated social network data
  const aiSocialData = useQuery(api.aiPoweredComponents.generateSocialNetworkData, { 
    populationId: worldId,
    analysisType: 'comprehensive',
    timeframe: timeRange
  });

  // Process AI data into component format
  const socialData: SocialNetworkData = useMemo(() => {
    if (!aiSocialData) {
      return {
        nodes: [],
        relationships: [],
        groups: [],
        communications: [],
        influencePatterns: [],
        culturalGroups: [],
        events: [],
        conflictZones: [],
        emergentBehaviors: [],
        culturalTransmission: [],
        metrics: {
          totalNodes: 0,
          totalRelationships: 0,
          avgConnections: 0,
          networkDensity: 0,
          clusteringCoefficient: 0,
          avgPathLength: 0,
          centralityDistribution: [],
          communityCount: 0,
          socialTension: 0,
          communicationVolume: 0,
          influenceConcentration: 0,
          culturalDiversity: 0
        },
        timestamp: Date.now()
      };
    }

    // Convert AI data structure to component expected format
    const processedData = {
      nodes: aiSocialData.nodes.map((node: any) => ({
        id: node.id,
        name: node.name,
        group: `group_${node.group}`,
        influence: node.influence,
        socialStatus: node.socialStatus,
        charisma: node.influence, // Use influence as charisma approximation
        connections: node.connections,
        traits: ['ai-generated'], // Simplified for now
        age: node.age,
        occupation: node.profession,
        location: 'AI Generated Location',
        reputation: node.reputation,
        culturalGroup: `group_${node.group}`
      })),
      relationships: aiSocialData.links.map((link: any, index: number) => ({
        id: `rel_${index}`,
        source: link.source,
        target: link.target,
        sourceName: `NPC ${link.source}`,
        targetName: `NPC ${link.target}`,
        strength: link.strength,
        type: link.type || 'friendship',
        duration: Math.floor(Math.random() * 365),
        interactions: Math.floor(link.strength * 100),
        sentiment: (link.strength - 0.5) * 2,
        influence: link.strength,
        stability: link.strength,
        conflictLevel: 1 - link.strength,
        trust: link.strength,
        dependence: link.strength * 0.5,
        powerDynamic: (Math.random() - 0.5) * 2
      })),
      groups: aiSocialData.groups.map((group: any) => ({
        id: group.id,
        name: group.name,
        members: group.members,
        cohesion: group.cohesion,
        influence: group.influence,
        type: group.type,
        leadership: group.leadership,
        goals: group.goals,
        conflicts: group.conflicts || [],
        alliances: group.alliances || []
      })),
      communications: [],
      influencePatterns: [],
      culturalGroups: [],
      events: [],
      conflictZones: [],
      emergentBehaviors: [],
      culturalTransmission: [],
      metrics: aiSocialData.metrics,
      timestamp: Date.now()
    };

    return processedData as SocialNetworkData;
  }, [aiSocialData, timeRange]);
  // Transform data for force graph
  useEffect(() => {
    const filteredRelationships = filterType === 'all' 
      ? socialData.relationships 
      : socialData.relationships.filter(rel => rel.type === filterType);

    const activeNodeIds = new Set([
      ...filteredRelationships.map(rel => rel.source),
      ...filteredRelationships.map(rel => rel.target)
    ]);

    const activeNodes = socialData.nodes.filter(node => activeNodeIds.has(node.id));

    setGraphData({
      nodes: activeNodes,
      links: filteredRelationships
    });
  }, [socialData, filterType]);

  const handleNodeClick = useCallback((node: NPCNode) => {
    setSelectedNode(selectedNode === node.id ? null : node.id);
  }, [selectedNode]);

  const getRelationshipColor = (relationship: RelationshipData) => {
    switch (relationship.type) {
      case 'friendship': return '#10B981';
      case 'family': return '#8B5CF6';
      case 'romantic': return '#EC4899';
      case 'professional': return '#3B82F6';
      case 'rivalry': return '#EF4444';
      case 'mentorship': return '#F59E0B';
      case 'trade': return '#06B6D4';
      case 'alliance': return '#84CC16';
      default: return '#6B7280';
    }
  };

  const NetworkVisualization = () => (
    <div className="bg-gray-900 border-4 border-gray-100 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Network className="w-8 h-8 text-blue-400" />
          <h3 className="text-2xl font-black text-gray-100">SOCIAL NETWORK</h3>
        </div>
        <div className="flex gap-2">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="bg-gray-800 border-2 border-gray-600 text-gray-100 px-3 py-1 font-bold text-sm"
          >
            <option value="all">ALL RELATIONSHIPS</option>
            <option value="friendship">FRIENDSHIP</option>
            <option value="family">FAMILY</option>
            <option value="professional">PROFESSIONAL</option>
            <option value="trade">TRADE</option>
            <option value="rivalry">RIVALRY</option>
          </select>
        </div>
      </div>

      <div className="h-96 bg-gray-800 border-2 border-gray-600 relative">
        {graphData && (
          <ForceGraph2D
            graphData={graphData}
            nodeCanvasObject={(node: any, ctx: CanvasRenderingContext2D, globalScale: number) => {
              const label = node.name;
              const fontSize = 12/globalScale;
              ctx.font = `${fontSize}px Arial`;
              
              // Node circle
              const nodeSize = Math.max(4, node.influence * 20);
              ctx.fillStyle = node.id === selectedNode ? '#EF4444' : 
                             node.group === 'nobles' ? '#8B5CF6' :
                             node.group === 'traders' ? '#F59E0B' :
                             node.group === 'craftspeople' ? '#10B981' :
                             node.group === 'scholars' ? '#3B82F6' : '#6B7280';
              ctx.beginPath();
              ctx.arc(node.x!, node.y!, nodeSize, 0, 2 * Math.PI, false);
              ctx.fill();
              
              // Border
              ctx.strokeStyle = '#F3F4F6';
              ctx.lineWidth = 2/globalScale;
              ctx.stroke();
              
              // Label
              ctx.textAlign = 'center';
              ctx.textBaseline = 'middle';
              ctx.fillStyle = '#F3F4F6';
              ctx.fillText(label, node.x!, node.y! + nodeSize + fontSize);
            }}
            linkCanvasObject={(link: any, ctx: CanvasRenderingContext2D) => {
              const start = link.source;
              const end = link.target;
              
              ctx.strokeStyle = getRelationshipColor(link);
              ctx.lineWidth = Math.max(1, link.strength * 4);
              ctx.globalAlpha = 0.7;
              
              ctx.beginPath();
              ctx.moveTo(start.x, start.y);
              ctx.lineTo(end.x, end.y);
              ctx.stroke();
              
              ctx.globalAlpha = 1;
            }}
            onNodeClick={handleNodeClick}
            cooldownTicks={100}
            d3AlphaDecay={0.0228}
            d3VelocityDecay={0.4}
          />
        )}
      </div>

      {selectedNode && (
        <div className="mt-4 bg-gray-800 border-2 border-gray-600 p-4">
          {(() => {
            const node = socialData.nodes.find(n => n.id === selectedNode);
            const nodeRelationships = socialData.relationships.filter(
              rel => rel.source === selectedNode || rel.target === selectedNode
            );
            
            return node ? (
              <div>
                <h4 className="text-xl font-black text-gray-100 mb-3">{node.name}</h4>
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div>
                    <div className="text-xs text-gray-400 font-bold">INFLUENCE</div>
                    <div className="bg-gray-700 border-2 border-gray-500 h-3 w-full">
                      <div 
                        className="bg-red-500 h-full border-r-2 border-red-400"
                        style={{ width: `${node.influence * 100}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-400 font-bold">SOCIAL STATUS</div>
                    <div className="bg-gray-700 border-2 border-gray-500 h-3 w-full">
                      <div 
                        className="bg-purple-500 h-full border-r-2 border-purple-400"
                        style={{ width: `${node.socialStatus * 100}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-400 font-bold">REPUTATION</div>
                    <div className="bg-gray-700 border-2 border-gray-500 h-3 w-full">
                      <div 
                        className="bg-green-500 h-full border-r-2 border-green-400"
                        style={{ width: `${node.reputation * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
                <div className="text-sm text-gray-300 space-y-1">
                  <div><span className="font-bold">OCCUPATION:</span> {node.occupation}</div>
                  <div><span className="font-bold">LOCATION:</span> {node.location}</div>
                  <div><span className="font-bold">CULTURAL GROUP:</span> {node.culturalGroup}</div>
                  <div><span className="font-bold">CONNECTIONS:</span> {nodeRelationships.length}</div>
                  <div><span className="font-bold">TRAITS:</span> {node.traits.join(', ')}</div>
                </div>
              </div>
            ) : null;
          })()}
        </div>
      )}
    </div>
  );

  const GroupClustering = () => (
    <div className="bg-gray-900 border-4 border-gray-100 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6">
      <div className="flex items-center gap-3 mb-6">
        <Users className="w-8 h-8 text-purple-400" />
        <h3 className="text-2xl font-black text-gray-100">SOCIAL GROUPS</h3>
      </div>
      
      <div className="grid grid-cols-1 gap-4">
        {socialData.groups.map((group) => (
          <div key={group.id} className="bg-gray-800 border-2 border-gray-600 p-4">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h4 className="text-lg font-black text-gray-100">{group.name}</h4>
                <span className={`px-2 py-1 text-xs font-bold border-2 ${
                  group.type === 'political' ? 'bg-red-600 border-red-400 text-red-100' :
                  group.type === 'economic' ? 'bg-yellow-600 border-yellow-400 text-yellow-100' :
                  group.type === 'cultural' ? 'bg-blue-600 border-blue-400 text-blue-100' :
                  group.type === 'professional' ? 'bg-green-600 border-green-400 text-green-100' :
                  'bg-purple-600 border-purple-400 text-purple-100'
                }`}>
                  {group.type.toUpperCase()}
                </span>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-300 font-bold">MEMBERS: {group.members.length}</div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-3">
              <div>
                <div className="text-xs text-gray-400 font-bold mb-1">COHESION</div>
                <div className="bg-gray-700 border-2 border-gray-500 h-3 w-full">
                  <div 
                    className="bg-green-500 h-full border-r-2 border-green-400"
                    style={{ width: `${group.cohesion * 100}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-400 font-bold mb-1">INFLUENCE</div>
                <div className="bg-gray-700 border-2 border-gray-500 h-3 w-full">
                  <div 
                    className="bg-red-500 h-full border-r-2 border-red-400"
                    style={{ width: `${group.influence * 100}%` }}
                  />
                </div>
              </div>
            </div>
            
            <div className="text-xs text-gray-300 space-y-1">
              <div><span className="font-bold">GOALS:</span> {group.goals.join(', ')}</div>
              {group.leadership.length > 0 && (
                <div><span className="font-bold">LEADERSHIP:</span> {group.leadership.map(id => socialData.nodes.find(n => n.id === id)?.name).join(', ')}</div>
              )}
              {group.alliances.length > 0 && (
                <div><span className="font-bold">ALLIES:</span> {group.alliances.join(', ')}</div>
              )}
              {group.conflicts.length > 0 && (
                <div><span className="font-bold text-red-400">CONFLICTS:</span> {group.conflicts.join(', ')}</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const InfluenceFlow = () => (
    <div className="bg-gray-900 border-4 border-gray-100 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6">
      <div className="flex items-center gap-3 mb-6">
        <Zap className="w-8 h-8 text-yellow-400" />
        <h3 className="text-2xl font-black text-gray-100">INFLUENCE PATTERNS</h3>
      </div>
      
      <div className="space-y-4">
        {socialData.influencePatterns.map((pattern, index) => {
          const influencerNode = socialData.nodes.find(n => n.id === pattern.influencer);
          return (
            <div key={index} className="bg-gray-800 border-2 border-gray-600 p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="text-lg font-black text-gray-100">{influencerNode?.name || pattern.influencer}</h4>
                  <span className="text-sm text-gray-400 font-bold">TOPIC: {pattern.topic.toUpperCase()}</span>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-300 font-bold">STRENGTH: {Math.round(pattern.strength * 100)}%</div>
                  <div className="text-xs text-gray-400">SPEED: {Math.round(pattern.propagationSpeed * 100)}%</div>
                </div>
              </div>
              
              <div className="mb-3">
                <div className="text-xs text-gray-400 font-bold mb-1">INFLUENCE DISTRIBUTION</div>
                <div className="bg-gray-700 border-2 border-gray-500 h-3 w-full">
                  <div 
                    className="bg-yellow-500 h-full border-r-2 border-yellow-400"
                    style={{ width: `${pattern.strength * 100}%` }}
                  />
                </div>
              </div>
              
              <div className="text-xs text-gray-300">
                <span className="font-bold">INFLUENCED:</span> {
                  pattern.influenced.map(id => socialData.nodes.find(n => n.id === id)?.name || id).join(', ')
                }
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const ConflictTracking = () => (
    <div className="bg-gray-900 border-4 border-gray-100 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6">
      <div className="flex items-center gap-3 mb-6">
        <AlertTriangle className="w-8 h-8 text-red-400" />
        <h3 className="text-2xl font-black text-gray-100">CONFLICT ZONES</h3>
      </div>
      
      <div className="space-y-4">
        {socialData.conflictZones.map((conflict, index) => (
          <div 
            key={index} 
            className={`border-4 p-4 ${
              conflict.intensity > 0.7 ? 'bg-red-900 border-red-400' :
              conflict.intensity > 0.4 ? 'bg-yellow-900 border-yellow-400' :
              'bg-gray-800 border-gray-600'
            }`}
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <h4 className="text-lg font-black text-gray-100">{conflict.cause}</h4>
                <div className="text-sm text-gray-300">
                  PARTICIPANTS: {conflict.participants.map(id => socialData.nodes.find(n => n.id === id)?.name || id).join(', ')}
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-300 font-bold">INTENSITY: {Math.round(conflict.intensity * 100)}%</div>
                <div className="text-xs text-gray-400">DURATION: {conflict.duration}d</div>
              </div>
            </div>
            
            <div className="mb-3">
              <div className="text-xs text-gray-400 font-bold mb-1">CONFLICT INTENSITY</div>
              <div className="bg-gray-700 border-2 border-gray-500 h-3 w-full">
                <div 
                  className="bg-red-500 h-full border-r-2 border-red-400"
                  style={{ width: `${conflict.intensity * 100}%` }}
                />
              </div>
            </div>
            
            {conflict.resolution && (
              <div className="text-xs text-gray-300">
                <span className="font-bold">STATUS:</span> {conflict.resolution.replace('_', ' ').toUpperCase()}
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
          <Network className="w-12 h-12 text-blue-400" />
          <div>
            <h1 className="text-4xl font-black text-gray-100">SOCIAL NETWORK ANALYZER</h1>
            <p className="text-gray-400 font-mono text-sm">WORLD: {worldId} | DEPTH: {networkDepth} | FOCUS: {focusNPC || 'ALL'}</p>
          </div>
        </div>
        <div className="flex gap-2">
          {['network', 'groups', 'influence', 'conflicts', 'emergence', 'culture'].map((view) => (
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

      {/* Content */}
      {selectedView === 'network' && <NetworkVisualization />}
      {selectedView === 'groups' && <GroupClustering />}
      {selectedView === 'influence' && <InfluenceFlow />}
      {selectedView === 'conflicts' && <ConflictTracking />}

      {selectedView === 'emergence' && (
        <div className="bg-gray-900 border-4 border-gray-100 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6">
          <div className="flex items-center gap-3 mb-6">
            <TrendingUp className="w-8 h-8 text-green-400" />
            <h3 className="text-2xl font-black text-gray-100">EMERGENT BEHAVIORS</h3>
          </div>
          
          <div className="space-y-4">
            {socialData.emergentBehaviors.map((behavior, index) => (
              <div key={index} className="bg-gray-800 border-2 border-gray-600 p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="text-lg font-black text-gray-100">{behavior.type.replace('_', ' ').toUpperCase()}</h4>
                    <div className="text-sm text-gray-300">{behavior.description}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-300 font-bold">SIGNIFICANCE: {Math.round(behavior.significance * 100)}%</div>
                    <div className="text-xs text-gray-400">{new Date(behavior.timestamp).toLocaleDateString()}</div>
                  </div>
                </div>
                
                <div className="text-xs text-gray-300">
                  <span className="font-bold">PARTICIPANTS:</span> {
                    behavior.participants.map(id => socialData.nodes.find(n => n.id === id)?.name || id).join(', ')
                  }
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedView === 'culture' && (
        <div className="bg-gray-900 border-4 border-gray-100 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6">
          <div className="flex items-center gap-3 mb-6">
            <Globe className="w-8 h-8 text-purple-400" />
            <h3 className="text-2xl font-black text-gray-100">CULTURAL TRANSMISSION</h3>
          </div>
          
          <div className="space-y-4">
            {socialData.culturalTransmission.map((transmission, index) => {
              const sourceNode = socialData.nodes.find(n => n.id === transmission.source);
              return (
                <div key={index} className="bg-gray-800 border-2 border-gray-600 p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="text-lg font-black text-gray-100">{transmission.concept.replace('_', ' ').toUpperCase()}</h4>
                      <div className="text-sm text-gray-400 font-bold">SOURCE: {sourceNode?.name || transmission.source}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-300 font-bold">ADOPTION: {Math.round(transmission.adoptionRate * 100)}%</div>
                      <div className="text-xs text-gray-400">RESISTANCE: {Math.round(transmission.resistance * 100)}%</div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <div>
                      <div className="text-xs text-gray-400 font-bold mb-1">ADOPTION RATE</div>
                      <div className="bg-gray-700 border-2 border-gray-500 h-3 w-full">
                        <div 
                          className="bg-green-500 h-full border-r-2 border-green-400"
                          style={{ width: `${transmission.adoptionRate * 100}%` }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-400 font-bold mb-1">RESISTANCE</div>
                      <div className="bg-gray-700 border-2 border-gray-500 h-3 w-full">
                        <div 
                          className="bg-red-500 h-full border-r-2 border-red-400"
                          style={{ width: `${transmission.resistance * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-xs text-gray-300">
                    <span className="font-bold">TARGETS:</span> {
                      transmission.targets.map(id => socialData.nodes.find(n => n.id === id)?.name || id).join(', ')
                    }
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
