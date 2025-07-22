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
          toast.error("Failed to generate event: " + error.message);
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
      toast.error("Failed to process action: " + (error as Error).message);
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
      toast.error("Failed to process custom action: " + (error as Error).message);
      setIsGenerating(false);
    }
  };

  if (!world) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      {/* World Header */}
      <div className="bg-gradient-to-r from-purple-900 to-blue-900 text-white rounded-lg p-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold">{world.name}</h1>
            <p className="text-purple-200 mt-2">
              Year {world.currentState.year} • {world.currentState.season} • {world.currentState.weather}
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl mb-2">👁️</div>
            <p className="text-sm text-purple-200">Divine Observer</p>
          </div>
        </div>
      </div>

      {/* World Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg p-4 shadow">
          <h3 className="font-semibold text-gray-800 mb-2">Balance of Power</h3>
          <p className="text-gray-600">{world.currentState.balanceOfPower}</p>
        </div>
        <div className="bg-white rounded-lg p-4 shadow">
          <h3 className="font-semibold text-gray-800 mb-2">Active Factions</h3>
          <p className="text-gray-600">{world.factions.length} civilizations</p>
        </div>
        <div className="bg-white rounded-lg p-4 shadow">
          <h3 className="font-semibold text-gray-800 mb-2">Turn</h3>
          <p className="text-gray-600">#{world.currentTurn}</p>
        </div>
      </div>

      {/* Current Event */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        {isGenerating ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">The divine narrative unfolds...</p>
          </div>
        ) : currentEvent ? (
          <div className="space-y-6">
            {/* Narrative Section */}
            <div className="bg-gradient-to-br from-amber-50 to-purple-50 rounded-lg p-6 border border-amber-200">
              <div className="flex items-center mb-4">
                <span className="text-3xl mr-3">📜</span>
                <h3 className="text-xl font-semibold text-gray-800">The Divine Chronicle</h3>
              </div>
              <div className="prose max-w-none">
                <div className="text-lg leading-relaxed text-gray-800 whitespace-pre-line font-serif">
                  {currentEvent.narrative}
                </div>
              </div>
            </div>

            {/* Divine Choices */}
            <div className="space-y-4">
              <div className="flex items-center mb-4">
                <span className="text-2xl mr-3">⚡</span>
                <h3 className="text-xl font-semibold text-gray-800">Divine Intervention</h3>
              </div>
              <p className="text-gray-600 mb-4">Your people look to the heavens. What is your divine will?</p>
              
              <div className="grid gap-3">
                {currentEvent.choices?.map((choice) => (
                  <button
                    key={choice.id}
                    onClick={() => handleChoice(choice.id, choice.text)}
                    className="flex items-center p-4 bg-white hover:bg-blue-50 rounded-lg border-2 border-gray-200 hover:border-blue-300 transition-all text-left shadow-sm hover:shadow-md"
                    disabled={isGenerating}
                  >
                    <span className="text-3xl mr-4">{choice.icon}</span>
                    <span className="font-medium text-gray-800 text-lg">{choice.text}</span>
                  </button>
                ))}
              </div>

              {/* Custom Action */}
              <div className="border-t-2 border-gray-200 pt-6 mt-6">
                {showCustomInput ? (
                  <div className="space-y-3">
                    <div className="flex items-center mb-3">
                      <span className="text-2xl mr-3">✨</span>
                      <h4 className="text-lg font-semibold text-gray-800">Custom Divine Action</h4>
                    </div>
                    <textarea
                      value={customAction}
                      onChange={(e) => setCustomAction(e.target.value)}
                      placeholder="Describe your divine intervention... (e.g., 'I create a golden bridge across the great chasm' or 'I whisper wisdom to the village elder in their dreams')"
                      className="w-full p-4 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 resize-none text-lg"
                      rows={3}
                    />
                    <div className="flex gap-3">
                      <button
                        onClick={handleCustomAction}
                        disabled={!customAction.trim() || isGenerating}
                        className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-lg"
                      >
                        ⚡ Enact Divine Will
                      </button>
                      <button
                        onClick={() => {
                          setShowCustomInput(false);
                          setCustomAction("");
                        }}
                        className="px-6 py-3 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg font-semibold"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowCustomInput(true)}
                    className="flex items-center p-4 text-purple-600 hover:text-purple-800 hover:bg-purple-50 rounded-lg transition-all border-2 border-purple-200 hover:border-purple-300 w-full"
                  >
                    <span className="text-2xl mr-3">✨</span>
                    <div className="text-left">
                      <div className="font-semibold text-lg">Custom Divine Action</div>
                      <div className="text-sm text-purple-500">Create your own intervention</div>
                    </div>
                  </button>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🌟</div>
            <p className="text-gray-600">Preparing your divine realm...</p>
          </div>
        )}
      </div>

      {/* Factions Overview */}
      {world.factions.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Your Subjects</h3>
          <div className="grid gap-4">
            {world.factions.map((faction, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-gray-800">{faction.name}</h4>
                  <span className="text-sm text-gray-500">{faction.type}</span>
                </div>
                <p className="text-sm text-gray-600 mb-2">{faction.beliefs}</p>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Strength: {faction.strength}/100</span>
                  <span className="text-gray-500">Population: {faction.population.toLocaleString()}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${faction.strength}%` }}
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
