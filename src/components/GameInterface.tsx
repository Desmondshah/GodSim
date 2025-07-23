import { useState, useEffect } from "react";
import { useQuery, useMutation, useAction } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { toast } from "sonner";

interface GameInterfaceProps {
  worldId: Id<"worlds">;
}

export function GameInterface({ worldId }: GameInterfaceProps) {
  const [customAction, setCustomAction] = useState("");
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const world = useQuery(api.worldSetup.getUserWorld);
  const currentEvent = useQuery(api.gameEngine.getCurrentEvent, { worldId });
  const hasPlayerDecision = useQuery(api.gameEngine.hasPlayerDecisionForCurrentTurn, { worldId });
  const generateTurnEvent = useAction(api.gameEngine.generateTurnEvent);
  const makePlayerDecision = useMutation(api.gameEngine.makePlayerDecision);

  // Generate initial event if none exists AND no player decision is pending
  useEffect(() => {
    if (world?.isSetupComplete && !currentEvent && !hasPlayerDecision && !isGenerating) {
      setIsGenerating(true);
      generateTurnEvent({ worldId })
        .then(() => setIsGenerating(false))
        .catch((error) => {
          toast.error("[ERROR] EVENT_GENERATION_FAILED: " + error.message);
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
      toast.error("[ERROR] ACTION_PROCESSING_FAILED: " + (error as Error).message);
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
      toast.error("[ERROR] CUSTOM_ACTION_FAILED: " + (error as Error).message);
      setIsGenerating(false);
    }
  };

  if (!world) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="brutal-container text-center">
          <div className="brutal-loading mx-auto mb-6"></div>
          <div className="brutal-text">LOADING_WORLD_DATA...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-6 sm:space-y-8">
      {/* World Header */}
      <div className="brutal-container bg-secondary text-neutral relative overflow-hidden">
        {/* Glitch effect background */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-2 bg-primary animate-flicker"></div>
          <div className="absolute bottom-0 right-0 w-16 sm:w-32 h-16 sm:h-32 bg-accent transform rotate-45"></div>
        </div>
        
        <div className="relative z-10 flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
          <div className="flex-1">
            <h1 className="brutal-header text-accent divine-glitch mb-3 sm:mb-4 text-center sm:text-left" data-text={world.name}>
              {world.name}
            </h1>
            <div className="brutal-text text-neutral mb-2 text-center sm:text-left">
              &gt; YEAR: {world.currentState.year} // {world.currentState.season?.toUpperCase()}
            </div>
            <div className="brutal-text text-accent text-center sm:text-left">
              &gt; WEATHER_STATUS: {world.currentState.weather?.toUpperCase()}
            </div>
          </div>
          <div className="text-center sm:text-right">
            <div className="text-4xl sm:text-6xl mb-2 sm:mb-4 animate-glitch">👁️</div>
            <div className="brutal-text text-accent">DIVINE_OBSERVER</div>
            <div className="brutal-text text-neutral text-xs sm:text-sm">OMNIPOTENT_MODE</div>
          </div>
        </div>
      </div>

      {/* World Status Dashboard */}
      <div className="brutal-grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="brutal-card p-6">
          <h3 className="brutal-subheader mb-4 text-primary">POWER_BALANCE.STATUS</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="brutal-text text-sm">DIVINE_AUTHORITY:</span>
              <div className="bg-secondary h-2 w-24 border-2 border-secondary">
                <div className="bg-primary h-full w-3/4"></div>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="brutal-text text-sm">MORTAL_FAITH:</span>
              <div className="bg-secondary h-2 w-24 border-2 border-secondary">
                <div className="bg-accent h-full w-2/3"></div>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="brutal-text text-sm">CHAOS_LEVEL:</span>
              <div className="bg-secondary h-2 w-24 border-2 border-secondary">
                <div className="bg-danger h-full w-1/3"></div>
              </div>
            </div>
          </div>
        </div>

        <div className="brutal-card p-6">
          <h3 className="brutal-subheader mb-4 text-accent">POPULATION.METRICS</h3>
          <div className="space-y-3">
            <div className="brutal-text">
              WORLD_STATUS: INHABITED
            </div>
            <div className="brutal-text text-sm text-secondary">
              LIFE_CYCLE: ACTIVE
            </div>
            <div className="brutal-text text-sm text-secondary">
              MORTALITY: ENABLED
            </div>
          </div>
        </div>

        <div className="brutal-card p-6">
          <h3 className="brutal-subheader mb-4 text-warning">CIVILIZATION.PROGRESS</h3>
          <div className="space-y-3">
            <div className="brutal-text">
              BALANCE: {world.currentState.balanceOfPower}
            </div>
            <div className="brutal-text text-sm text-secondary">
              EVENTS: {world.currentState.majorEvents?.length || 0}_RECORDED
            </div>
            <div className="brutal-text text-sm text-secondary">
              STATUS: EVOLVING
            </div>
          </div>
        </div>
      </div>

      {/* Current Event */}
      {isGenerating ? (
        <div className="brutal-container text-center">
          <div className="brutal-loading mx-auto mb-6"></div>
          <h2 className="brutal-subheader mb-4">EVENT.GENERATION.IN_PROGRESS</h2>
          <div className="brutal-text text-accent">
            &gt; AI_PROCESSING_DIVINE_INTERVENTION...<br/>
            &gt; CALCULATING_CONSEQUENCES...<br/>
            &gt; REALITY_MATRIX_UPDATING...
          </div>
        </div>
      ) : currentEvent ? (
        <div className="brutal-container">
          <h2 className="brutal-subheader mb-6 text-primary">CURRENT_EVENT.ALERT</h2>
          
          <div className="bg-neutral border-l-8 border-danger p-6 mb-6">
            <div className="brutal-text mb-4">
              {typeof currentEvent.narrative === 'string' 
                ? currentEvent.narrative 
                : (
                  <div className="space-y-4">
                    {currentEvent.narrative.opening && (
                      <div>{currentEvent.narrative.opening}</div>
                    )}
                    {currentEvent.narrative.current_situation && (
                      <div className="mt-3 pt-3 border-t border-secondary/20">
                        <strong>Current Situation:</strong> {currentEvent.narrative.current_situation}
                      </div>
                    )}
                    {currentEvent.narrative.stakes && (
                      <div className="mt-3 pt-3 border-t border-secondary/20">
                        <strong>Stakes:</strong> {currentEvent.narrative.stakes}
                      </div>
                    )}
                    {currentEvent.narrative.divine_perspective && (
                      <div className="mt-3 pt-3 border-t border-secondary/20">
                        <strong>Divine Perspective:</strong> {currentEvent.narrative.divine_perspective}
                      </div>
                    )}
                  </div>
                )
              }
            </div>
            <div className="brutal-text text-sm text-secondary">
              &gt; EVENT_TYPE: {currentEvent.eventType.toUpperCase()}
            </div>
          </div>

          {/* Divine Choices */}
          {currentEvent.choices && currentEvent.choices.length > 0 && (
            <div className="space-y-4">
              <h3 className="brutal-subheader text-accent">DIVINE_OPTIONS.AVAILABLE:</h3>
              <div className="brutal-grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
                {currentEvent.choices.map((choice, index) => (
                  <button
                    key={index}
                    className="brutal-button-primary p-4 sm:p-6 text-left transition-all duration-200 hover:translate-x-[-4px] hover:translate-y-[-4px] hover:shadow-brutal-lg w-full min-h-[80px]"
                    onClick={() => handleChoice(index.toString(), choice.text)}
                    disabled={isGenerating}
                  >
                    <div className="brutal-text mb-2 text-sm sm:text-base">
                      [{index + 1}] {choice.text}
                    </div>
                    <div className="brutal-text text-xs text-neutral opacity-80">
                      &gt; DIVINE_CHOICE // {choice.icon}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Custom Action Input */}
          <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t-4 border-secondary">
            <button
              className="brutal-button mb-4 w-full sm:w-auto"
              onClick={() => setShowCustomInput(!showCustomInput)}
              disabled={isGenerating}
            >
              {showCustomInput ? "CANCEL_CUSTOM_ACTION" : "EXECUTE_CUSTOM_DIVINE_ACTION"}
            </button>

            {showCustomInput && (
              <div className="space-y-4">
                <div>
                  <label className="brutal-text text-secondary mb-2 block">
                    CUSTOM_DIVINE_COMMAND:
                  </label>
                  <textarea
                    className="brutal-textarea w-full"
                    value={customAction}
                    onChange={(e) => setCustomAction(e.target.value)}
                    placeholder="DESCRIBE_YOUR_DIVINE_INTERVENTION..."
                    rows={3}
                  />
                </div>
                <button
                  className="brutal-button-danger w-full sm:w-auto"
                  onClick={handleCustomAction}
                  disabled={!customAction.trim() || isGenerating}
                >
                  EXECUTE_DIVINE_WILL
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="brutal-container text-center">
          <h2 className="brutal-subheader mb-4 text-accent">AWAITING_DIVINE_COMMAND</h2>
          <div className="brutal-text text-secondary">
            &gt; NO_ACTIVE_EVENTS<br/>
            &gt; WORLD_STATE: STABLE<br/>
            &gt; READY_FOR_INTERVENTION
          </div>
          <button
            className="brutal-button-primary mt-6"
            onClick={() => generateTurnEvent({ worldId })}
            disabled={isGenerating}
          >
            GENERATE_NEW_EVENT
          </button>
        </div>
      )}

      {/* Divine Commands Panel */}
      <div className="brutal-container bg-neutral border-4 border-primary">
        <h3 className="brutal-subheader mb-6 text-primary">DIVINE_COMMAND_TERMINAL</h3>
        <div className="bg-secondary text-accent p-4 font-mono text-sm">
          <div className="mb-2">&gt; DIVINE.SIM v2.0 // BRUTALIST_INTERFACE_MODE</div>
          <div className="mb-2">&gt; LOGGED_IN: {world.name}_DEITY</div>
          <div className="mb-2">&gt; PERMISSIONS: OMNIPOTENT</div>
          <div className="mb-2">&gt; STATUS: REALITY_MANIPULATION_ENABLED</div>
          <div>&gt; _</div>
        </div>
      </div>

      {/* Warning Message */}
      <div className="brutal-container bg-danger text-neutral border-4 border-secondary">
        <div className="brutal-text">
          &gt; WARNING: DIVINE_ACTIONS_HAVE_PERMANENT_CONSEQUENCES<br/>
          &gt; REALITY_ALTERATIONS_CANNOT_BE_UNDONE<br/>
          &gt; USE_POWER_RESPONSIBLY // MORTALS_ARE_FRAGILE
        </div>
      </div>
    </div>
  );
}
