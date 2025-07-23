import { useState, useEffect } from "react";
import { useQuery, useMutation, useAction } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { toast } from "sonner";

interface AdvancedGameInterfaceProps {
  worldId: Id<"worlds">;
}

export function AdvancedGameInterface({ worldId }: AdvancedGameInterfaceProps) {
  const [customAction, setCustomAction] = useState("");
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState("events");

  const world = useQuery(api.worldSetup.getUserWorld);
  const currentEvent = useQuery(api.gameEngine.getCurrentEvent, { worldId });
  const hasPlayerDecision = useQuery(api.gameEngine.hasPlayerDecisionForCurrentTurn, { worldId });
  const analytics = useQuery(api.aiPoweredComponents.generateAnalyticsData, { 
    worldId, 
    timeRange: "7d", 
    metrics: ["population", "happiness", "productivity", "stability"] 
  });
  const generateTurnEvent = useAction(api.gameEngine.generateAdvancedTurnEvent);
  const makePlayerDecision = useMutation(api.gameEngine.makePlayerDecision);

  // Generate initial event if none exists
  useEffect(() => {
    if (world?.isSetupComplete && !currentEvent && !hasPlayerDecision && !isGenerating) {
      setIsGenerating(true);
      generateTurnEvent({ worldId })
        .then(() => setIsGenerating(false))
        .catch((error) => {
          toast.error("Event Generation Failed: " + error.message);
          setIsGenerating(false);
        });
    }
  }, [world?.isSetupComplete, currentEvent, hasPlayerDecision, worldId, generateTurnEvent, isGenerating]);

  const handleChoice = async (choiceId: string, choiceText: string) => {
    try {
      setIsGenerating(true);
      await makePlayerDecision({
        worldId,
        decision: choiceText,
        isCustomAction: false,
      });
      await generateTurnEvent({ worldId, playerAction: choiceText });
      setIsGenerating(false);
    } catch (error) {
      toast.error("Action Failed: " + (error as Error).message);
      setIsGenerating(false);
    }
  };

  const handleCustomAction = async () => {
    if (!customAction.trim()) return;

    try {
      setIsGenerating(true);
      await makePlayerDecision({
        worldId,
        decision: customAction,
        isCustomAction: true,
      });
      await generateTurnEvent({ worldId, playerAction: customAction });
      setCustomAction("");
      setShowCustomInput(false);
      setIsGenerating(false);
    } catch (error) {
      toast.error("Custom Action Failed: " + (error as Error).message);
      setIsGenerating(false);
    }
  };

  const renderSystemHealthBar = (value: number, label: string) => (
    <div className="mb-3">
      <div className="flex justify-between items-center mb-1">
        <span className="brutal-text text-sm">{label}</span>
        <span className="brutal-text text-xs">{Math.round(value)}/100</span>
      </div>
      <div className="bg-secondary h-3 border-2 border-accent">
        <div 
          className={`h-full transition-all duration-500 ${
            value > 70 ? 'bg-green-500' : 
            value > 40 ? 'bg-yellow-500' : 'bg-red-500'
          }`}
          style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
        />
      </div>
    </div>
  );

  const renderFactionCard = (faction: any) => (
    <div key={faction.name} className="brutal-card p-4 mb-4">
      <h4 className="brutal-subheader text-accent mb-3">{faction.name}</h4>
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div>
          <div className="brutal-text">Population: {faction.population?.toLocaleString() || 0}</div>
          <div className="brutal-text">Wealth: {faction.wealth}/100</div>
          <div className="brutal-text">Military: {faction.military}</div>
        </div>
        <div>
          <div className="brutal-text">Stability: {faction.stability}/100</div>
          <div className="brutal-text">Tech Level: {faction.technology}</div>
          <div className="brutal-text">Power Score: {Math.round(faction.powerScore)}</div>
        </div>
      </div>
      <div className="mt-2">
        <div className="brutal-text text-xs text-secondary">
          Diplomatic Standing: {faction.diplomaticStanding > 0 ? '+' : ''}{Math.round(faction.diplomaticStanding)}
        </div>
      </div>
    </div>
  );

  if (!world) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="brutal-container text-center">
          <div className="brutal-loading mx-auto mb-6"></div>
          <div className="brutal-text">LOADING ADVANCED SYSTEMS...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6">
      {/* Enhanced World Header */}
      <div className="brutal-container bg-gradient-to-r from-secondary to-primary text-neutral relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-full h-3 bg-accent animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-24 h-24 bg-warning transform rotate-45 animate-spin-slow"></div>
        </div>
        
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <h1 className="brutal-header text-accent divine-glitch mb-4" data-text={world.name}>
              {world.name}
            </h1>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="brutal-text text-accent">YEAR: {world.currentState?.year || 1}</div>
                <div className="brutal-text text-neutral">SEASON: {world.currentState?.season?.toUpperCase()}</div>
                <div className="brutal-text text-neutral">WEATHER: {world.currentState?.weather?.toUpperCase()}</div>
              </div>
              <div>
                <div className="brutal-text text-accent">POPULATION: {analytics?.worldOverview.totalPopulation?.toLocaleString() || 'Unknown'}</div>
                <div className="brutal-text text-neutral">AVG WEALTH: {Math.round(analytics?.worldOverview.averageWealth || 50)}/100</div>
                <div className="brutal-text text-neutral">TECH LEVEL: {(analytics?.worldOverview.technologicalLevel || 1).toFixed(1)}</div>
              </div>
            </div>
          </div>
          <div className="text-center lg:text-right">
            <div className="text-6xl mb-4 animate-float">👁️</div>
            <div className="brutal-text text-accent font-bold">OMNISCIENT OBSERVER</div>
            <div className="brutal-text text-neutral text-sm">REALITY ARCHITECT</div>
            <div className="mt-3 text-xs text-secondary">
              Turn {world.currentTurn || 0} | Advanced Simulation Active
            </div>
          </div>
        </div>
      </div>

      {/* Advanced Navigation Tabs */}
      <div className="brutal-container p-0">
        <div className="flex flex-wrap border-b-4 border-secondary">
          {[
            { id: 'events', label: 'EVENTS', icon: '⚡' },
            { id: 'analytics', label: 'ANALYTICS', icon: '📊' },
            { id: 'factions', label: 'FACTIONS', icon: '🏛️' },
            { id: 'systems', label: 'SYSTEMS', icon: '⚙️' },
            { id: 'predictions', label: 'ORACLES', icon: '🔮' }
          ].map(tab => (
            <button
              key={tab.id}
              className={`brutal-button px-6 py-3 rounded-none border-0 border-r-2 border-secondary ${
                activeTab === tab.id ? 'bg-primary text-neutral' : 'bg-secondary text-accent hover:bg-accent hover:text-neutral'
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'events' && (
        <div className="space-y-6">
          {/* Current Event */}
          {isGenerating ? (
            <div className="brutal-container text-center">
              <div className="brutal-loading mx-auto mb-6"></div>
              <h2 className="brutal-subheader mb-4">ADVANCED EVENT PROCESSING</h2>
              <div className="brutal-text text-accent">
                &gt; ANALYZING SYSTEMIC INTERACTIONS...<br/>
                &gt; CALCULATING EMERGENT BEHAVIORS...<br/>
                &gt; PROCESSING CLIMATE AND DIPLOMATIC DATA...<br/>
                &gt; GENERATING SOPHISTICATED NARRATIVE...
              </div>
            </div>
          ) : currentEvent ? (
            <div className="brutal-container">
              <h2 className="brutal-subheader mb-6 text-primary">
                CURRENT SIMULATION EVENT
                {currentEvent.eventAnalysis && (
                  <span className="text-sm text-secondary ml-4">
                    Complexity: {currentEvent.eventAnalysis.complexity_rating}/10 | 
                    Urgency: {currentEvent.eventAnalysis.urgency_level}/10
                  </span>
                )}
              </h2>
              
              <div className="bg-neutral border-l-8 border-danger p-6 mb-6">
                <div className="brutal-text mb-4">
                  {typeof currentEvent.narrative === 'string' 
                    ? currentEvent.narrative 
                    : currentEvent.narrative?.opening || 'Event details unavailable'}
                </div>
                {typeof currentEvent.narrative === 'object' && currentEvent.narrative?.current_situation && (
                  <div className="brutal-text mb-4 text-secondary">
                    {currentEvent.narrative.current_situation}
                  </div>
                )}
                {typeof currentEvent.narrative === 'object' && currentEvent.narrative?.stakes && (
                  <div className="brutal-text mb-4 text-warning">
                    <strong>Stakes:</strong> {currentEvent.narrative.stakes}
                  </div>
                )}
                <div className="brutal-text text-sm text-accent">
                  &gt; EVENT_TYPE: {currentEvent.eventType.toUpperCase()}
                  {currentEvent.eventAnalysis?.primary_drivers && (
                    <span className="ml-4">| DRIVERS: {currentEvent.eventAnalysis.primary_drivers.join(', ')}</span>
                  )}
                </div>
              </div>

              {/* Enhanced Choices */}
              {currentEvent.choices && currentEvent.choices.length > 0 && (
                <div className="space-y-4">
                  <h3 className="brutal-subheader text-accent">DIVINE INTERVENTION OPTIONS:</h3>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {currentEvent.choices.map((choice: any, index: number) => (
                      <button
                        key={index}
                        className="brutal-button-primary p-6 text-left transition-all duration-200 hover:scale-105 hover:shadow-brutal-lg w-full"
                        onClick={() => handleChoice(index.toString(), choice.text)}
                        disabled={isGenerating}
                      >
                        <div className="brutal-text mb-3 text-base">
                          [{index + 1}] {choice.text}
                        </div>
                        {choice.divine_cost && (
                          <div className="brutal-text text-xs text-warning mb-2">
                            Divine Energy Cost: {choice.divine_cost}/10
                          </div>
                        )}
                        {choice.immediate_effects && choice.immediate_effects.length > 0 && (
                          <div className="brutal-text text-xs text-green-400 mb-1">
                            Immediate: {choice.immediate_effects.join(', ')}
                          </div>
                        )}
                        {choice.long_term_consequences && choice.long_term_consequences.length > 0 && (
                          <div className="brutal-text text-xs text-red-400">
                            Long-term: {choice.long_term_consequences.join(', ')}
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Custom Action */}
              <div className="mt-8 pt-6 border-t-4 border-secondary">
                <button
                  className="brutal-button mb-4"
                  onClick={() => setShowCustomInput(!showCustomInput)}
                  disabled={isGenerating}
                >
                  {showCustomInput ? "CANCEL CUSTOM INTERVENTION" : "FORGE CUSTOM DIVINE ACTION"}
                </button>

                {showCustomInput && (
                  <div className="space-y-4">
                    <div>
                      <label className="brutal-text text-secondary mb-2 block">
                        DIVINE COMMAND MATRIX:
                      </label>
                      <textarea
                        className="brutal-textarea w-full"
                        value={customAction}
                        onChange={(e) => setCustomAction(e.target.value)}
                        placeholder="Describe your divine intervention in detail..."
                        rows={4}
                      />
                    </div>
                    <button
                      className="brutal-button-danger"
                      onClick={handleCustomAction}
                      disabled={!customAction.trim() || isGenerating}
                    >
                      EXECUTE DIVINE WILL
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="brutal-container text-center">
              <h2 className="brutal-subheader mb-4 text-accent">SIMULATION READY</h2>
              <div className="brutal-text text-secondary mb-6">
                &gt; ALL SYSTEMS OPERATIONAL<br/>
                &gt; AWAITING DIVINE GUIDANCE<br/>
                &gt; REALITY MATRIX STABLE
              </div>
              <button
                className="brutal-button-primary"
                onClick={() => generateTurnEvent({ worldId })}
                disabled={isGenerating}
              >
                INITIATE NEW EVENT CYCLE
              </button>
            </div>
          )}
        </div>
      )}

      {activeTab === 'analytics' && analytics && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* World Overview */}
          <div className="brutal-card p-6">
            <h3 className="brutal-subheader mb-4 text-primary">CIVILIZATION METRICS</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="brutal-text">World Age:</span>
                <span className="brutal-text text-accent">{analytics.worldOverview.age} years</span>
              </div>
              <div className="flex justify-between">
                <span className="brutal-text">Total Population:</span>
                <span className="brutal-text text-accent">{analytics.worldOverview.totalPopulation.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="brutal-text">Average Wealth:</span>
                <span className="brutal-text text-accent">{Math.round(analytics.worldOverview.averageWealth)}/100</span>
              </div>
              <div className="flex justify-between">
                <span className="brutal-text">Militarization:</span>
                <span className="brutal-text text-accent">{analytics.worldOverview.militarization.toLocaleString()} troops</span>
              </div>
              <div className="flex justify-between">
                <span className="brutal-text">Tech Level:</span>
                <span className="brutal-text text-accent">{analytics.worldOverview.technologicalLevel.toFixed(1)}</span>
              </div>
            </div>
          </div>

          {/* System Health */}
          <div className="brutal-card p-6">
            <h3 className="brutal-subheader mb-4 text-warning">SYSTEMIC HEALTH</h3>
            {renderSystemHealthBar(analytics.systemicHealth.economic, "ECONOMIC")}
            {renderSystemHealthBar(analytics.systemicHealth.environmental, "ENVIRONMENTAL")}
            {renderSystemHealthBar(analytics.systemicHealth.social, "SOCIAL")}
            {renderSystemHealthBar(analytics.systemicHealth.political, "POLITICAL")}
            {renderSystemHealthBar(analytics.systemicHealth.technological, "TECHNOLOGICAL")}
          </div>

          {/* Event Analysis */}
          <div className="brutal-card p-6">
            <h3 className="brutal-subheader mb-4 text-accent">EVENT ANALYSIS</h3>
            <div className="space-y-3">
              <div>
                <div className="brutal-text text-sm text-secondary mb-1">Recent Trends:</div>
                {analytics.eventAnalysis.recentTrends.map((trend: string, i: number) => (
                  <div key={i} className="brutal-text text-xs">• {trend}</div>
                ))}
              </div>
              <div>
                <div className="brutal-text text-sm text-secondary">Crisis Frequency:</div>
                <div className="brutal-text text-accent">{Math.round(analytics.eventAnalysis.crisisFrequency)}%</div>
              </div>
              <div>
                <div className="brutal-text text-sm text-secondary">Divine Impact:</div>
                <div className="brutal-text text-accent">{analytics.eventAnalysis.divineInterventionImpact}</div>
              </div>
            </div>
          </div>

          {/* Emerging Threats */}
          <div className="brutal-card p-6">
            <h3 className="brutal-subheader mb-4 text-danger">THREAT ASSESSMENT</h3>
            {analytics.eventAnalysis.emergingThreats.length > 0 ? (
              analytics.eventAnalysis.emergingThreats.map((threat: string, i: number) => (
                <div key={i} className="brutal-text text-sm mb-2 text-red-400">
                  ⚠️ {threat}
                </div>
              ))
            ) : (
              <div className="brutal-text text-green-400">No immediate threats detected</div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'factions' && analytics && (
        <div className="space-y-6">
          <div className="brutal-container">
            <h2 className="brutal-subheader mb-6 text-primary">FACTION POWER RANKINGS</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {analytics.factionPowerRankings.map((faction: any, index: number) => (
                <div key={faction.name} className="relative">
                  {index === 0 && (
                    <div className="absolute -top-2 -right-2 text-2xl">👑</div>
                  )}
                  {renderFactionCard(faction)}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'predictions' && analytics && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Short-term Predictions */}
          <div className="brutal-card p-6">
            <h3 className="brutal-subheader mb-4 text-accent">SHORT-TERM ORACLES</h3>
            {analytics.predictions.shortTerm.length > 0 ? (
              analytics.predictions.shortTerm.map((prediction: string, i: number) => (
                <div key={i} className="brutal-text text-sm mb-2">
                  🔮 {prediction}
                </div>
              ))
            ) : (
              <div className="brutal-text text-secondary">No clear short-term patterns detected</div>
            )}
          </div>

          {/* Long-term Predictions */}
          <div className="brutal-card p-6">
            <h3 className="brutal-subheader mb-4 text-warning">LONG-TERM VISIONS</h3>
            {analytics.predictions.longTerm.length > 0 ? (
              analytics.predictions.longTerm.map((prediction: string, i: number) => (
                <div key={i} className="brutal-text text-sm mb-2">
                  🌟 {prediction}
                </div>
              ))
            ) : (
              <div className="brutal-text text-secondary">Long-term future remains unclear</div>
            )}
          </div>

          {/* Risk Factors */}
          <div className="brutal-card p-6">
            <h3 className="brutal-subheader mb-4 text-danger">RISK MATRIX</h3>
            {analytics.predictions.riskFactors.length > 0 ? (
              analytics.predictions.riskFactors.map((risk: string, i: number) => (
                <div key={i} className="brutal-text text-sm mb-2 text-red-400">
                  ⚠️ {risk}
                </div>
              ))
            ) : (
              <div className="brutal-text text-green-400">Risk levels within acceptable parameters</div>
            )}
          </div>

          {/* Opportunities */}
          <div className="brutal-card p-6">
            <h3 className="brutal-subheader mb-4 text-success">OPPORTUNITY MATRIX</h3>
            {analytics.predictions.opportunities.length > 0 ? (
              analytics.predictions.opportunities.map((opportunity: string, i: number) => (
                <div key={i} className="brutal-text text-sm mb-2 text-green-400">
                  ✨ {opportunity}
                </div>
              ))
            ) : (
              <div className="brutal-text text-secondary">No significant opportunities identified</div>
            )}
          </div>
        </div>
      )}

      {/* Divine Status Terminal */}
      <div className="brutal-container bg-neutral border-4 border-primary">
        <h3 className="brutal-subheader mb-6 text-primary">DIVINE COMMAND INTERFACE</h3>
        <div className="bg-secondary text-accent p-4 font-mono text-sm">
          <div className="mb-2">&gt; ADVANCED_SIMULATION_ENGINE v3.0 // ONLINE</div>
          <div className="mb-2">&gt; DEITY: {world.setupAnswers?.supremeBeing?.name || 'UNKNOWN'} // AUTHENTICATED</div>
          <div className="mb-2">&gt; PERMISSIONS: REALITY_MANIPULATION_ENABLED</div>
          <div className="mb-2">&gt; SYSTEMS: ALL_OPERATIONAL</div>
          <div className="mb-2">&gt; STATUS: {isGenerating ? 'PROCESSING_DIVINE_WILL' : 'AWAITING_COMMANDS'}</div>
          <div>&gt; _</div>
        </div>
      </div>
    </div>
  );
}

export default AdvancedGameInterface;
