import { useState } from "react";
import { useMutation, useAction } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";

interface SetupAnswers {
  worldType: string;
  supremeBeing: {
    name: string;
    type: string;
    purpose: string;
  };
  creationRules: {
    time: string;
    death: string;
    nature: string;
    morality: string;
  };
  inhabitants: string;
  simulationSpeed: string;
}

export function WorldSetup({ onComplete }: { onComplete: (worldId: string) => void }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<SetupAnswers>({
    worldType: "",
    supremeBeing: { name: "", type: "", purpose: "" },
    creationRules: { time: "", death: "", nature: "", morality: "" },
    inhabitants: "",
    simulationSpeed: "",
  });

  const createWorld = useMutation(api.worldSetup.createWorld);
  const generateWorld = useAction(api.gameEngine.generateWorld);

  const questions = [
    {
      title: "WORLD_TYPE.SELECTION",
      subtitle: "CHOOSE THE FUNDAMENTAL NATURE OF YOUR REALM",
      options: [
        { value: "organic", label: "🌿 ORGANIC", desc: "LIVING_BREATHING_WORLD_OF_NATURE" },
        { value: "sci-fi", label: "🚀 SCI-FI", desc: "ADVANCED_TECHNOLOGY_AND_SPACE" },
        { value: "magical", label: "✨ MAGICAL", desc: "MYSTICAL_FORCES_AND_ENCHANTMENT" },
        { value: "surreal", label: "🌀 SURREAL", desc: "DREAM-LIKE_AND_IMPOSSIBLE" },
        { value: "post-apocalyptic", label: "☢️ POST-APOCALYPTIC", desc: "AFTER_THE_GREAT_COLLAPSE" },
      ],
      key: "worldType" as keyof SetupAnswers,
    },
    {
      title: "SUPREME_BEING.CONFIGURATION",
      subtitle: "DEFINE YOUR DIVINE NATURE AND PURPOSE",
      isCustom: true,
      fields: [
        { key: "name", label: "DIVINE_NAME:", placeholder: "ENTER_GODLY_IDENTIFIER..." },
        { 
          key: "type", 
          label: "DIVINE_NATURE:",
          options: [
            { value: "benevolent", label: "BENEVOLENT_CREATOR" },
            { value: "neutral", label: "NEUTRAL_OBSERVER" },
            { value: "chaotic", label: "CHAOTIC_FORCE" },
            { value: "pantheon", label: "PANTHEON_MEMBER" },
            { value: "ai", label: "DIGITAL_CONSCIOUSNESS" },
          ]
        },
        { key: "purpose", label: "DIVINE_PURPOSE:", placeholder: "WHY_DO_YOU_CREATE_AND_GUIDE?" },
      ],
      key: "supremeBeing" as keyof SetupAnswers,
    },
    {
      title: "CREATION_RULES.ESTABLISHMENT",
      subtitle: "ESTABLISH THE FUNDAMENTAL LAWS OF YOUR WORLD",
      isMultiChoice: true,
      sections: [
        {
          title: "TIME_FLOW.PROTOCOL",
          key: "time",
          options: [
            { value: "linear", label: "⏳ LINEAR", desc: "TIME_MOVES_FORWARD_STEADILY" },
            { value: "fluid", label: "🌊 FLUID", desc: "TIME_CAN_BEND_AND_FLOW" },
          ],
        },
        {
          title: "DEATH_AND_LIFE.SYSTEM",
          key: "death",
          options: [
            { value: "permanent", label: "💀 PERMANENT", desc: "DEATH_IS_FINAL" },
            { value: "rebirth", label: "🔄 REBIRTH", desc: "SOULS_RETURN_IN_NEW_FORMS" },
          ],
        },
        {
          title: "NATURE_STABILITY.MATRIX",
          key: "nature",
          options: [
            { value: "stable", label: "🏔️ STABLE", desc: "NATURAL_LAWS_ARE_CONSTANT" },
            { value: "chaotic", label: "⚡ CHAOTIC", desc: "REALITY_SHIFTS_UNPREDICTABLY" },
            { value: "controlled", label: "🎛️ USER-CONTROLLED", desc: "YOU_CONTROL_ALL_ASPECTS" },
          ],
        },
        {
          title: "MORAL_FRAMEWORK.SYSTEM",
          key: "morality",
          options: [
            { value: "defined", label: "⚖️ DEFINED", desc: "CLEAR_GOOD_AND_EVIL" },
            { value: "grey", label: "🌫️ GREY", desc: "MORAL_AMBIGUITY" },
            { value: "none", label: "🚫 NONE", desc: "NO_INHERENT_MORALITY" },
          ],
        },
      ],
      key: "creationRules" as keyof SetupAnswers,
    },
    {
      title: "INHABITANTS.SELECTION",
      subtitle: "CHOOSE THE PRIMARY INHABITANTS OF YOUR REALM",
      options: [
        { value: "humans", label: "👥 HUMANS", desc: "FAMILIAR_AND_RELATABLE_BEINGS" },
        { value: "beasts", label: "🐺 BEASTS", desc: "ANIMAL-LIKE_CREATURES" },
        { value: "spirits", label: "👻 SPIRITS", desc: "ETHEREAL_OTHERWORLDLY_BEINGS" },
        { value: "intelligent", label: "🧠 HIGHLY_INTELLIGENT", desc: "ADVANCED_THINKING_BEINGS" },
        { value: "defiant", label: "⚔️ DEFIANT", desc: "BEINGS_WHO_CHALLENGE_GODS" },
      ],
      key: "inhabitants" as keyof SetupAnswers,
    },
    {
      title: "TIME_FLOW.SPEED",
      subtitle: "CONTROL THE PACE OF YOUR DIVINE SIMULATION",
      options: [
        { value: "real-time", label: "⏰ REAL-TIME", desc: "EVENTS_UNFOLD_NATURALLY" },
        { value: "time-skip", label: "⏩ TIME-SKIP", desc: "JUMP_THROUGH_ERAS_QUICKLY" },
        { value: "reactive", label: "⚡ REACTIVE", desc: "TIME_MOVES_WITH_YOUR_ACTIONS" },
      ],
      key: "simulationSpeed" as keyof SetupAnswers,
    },
  ];

  const handleAnswer = (value: string, subKey?: string) => {
    const question = questions[currentStep];
    
    if (question.isCustom && subKey) {
      setAnswers(prev => ({
        ...prev,
        [question.key]: {
          ...(prev[question.key as keyof SetupAnswers] as any),
          [subKey]: value,
        },
      }));
    } else if (question.isMultiChoice && subKey) {
      setAnswers(prev => ({
        ...prev,
        [question.key]: {
          ...(prev[question.key as keyof SetupAnswers] as any),
          [subKey]: value,
        },
      }));
    } else {
      setAnswers(prev => ({
        ...prev,
        [question.key]: value,
      }));
    }
  };

  const canProceed = () => {
    const question = questions[currentStep];
    const currentAnswer = answers[question.key];
    
    if (question.isCustom) {
      const obj = currentAnswer as any;
      return obj.name && obj.type && obj.purpose;
    } else if (question.isMultiChoice) {
      const obj = currentAnswer as any;
      return question.sections?.every(section => obj[section.key]);
    } else {
      return currentAnswer;
    }
  };

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleComplete = async () => {
    try {
      toast.info("[SYSTEM] CREATING_DIVINE_REALM...");
      const worldId = await createWorld({ setupAnswers: answers });
      toast.info("[AI] GENERATING_WORLD_DETAILS...");
      await generateWorld({ worldId });
      toast.success("[SUCCESS] DIVINE_REALM_CREATED!");
      onComplete(worldId);
    } catch (error) {
      console.error("World creation error:", error);
      const errorMessage = (error as Error).message;
      
      if (errorMessage.includes("OpenAI") || errorMessage.includes("API")) {
        toast.error("[ERROR] AI_SERVICE_UNAVAILABLE // CHECK_API_KEY");
      } else {
        toast.error("[FATAL] WORLD_CREATION_FAILED // " + errorMessage);
      }
    }
  };

  const currentQuestion = questions[currentStep];

  return (
    <div className="max-w-4xl mx-auto px-6">
      {/* Progress Bar */}
      <div className="mb-12">
        <div className="brutal-text text-accent mb-4">
          STEP_{currentStep + 1}_OF_{questions.length} // WORLD.GENESIS.PROTOCOL
        </div>
        <div className="bg-secondary h-4 border-4 border-secondary shadow-brutal">
          <div 
            className="bg-primary h-full transition-all duration-300 shadow-inset"
            style={{ width: `${((currentStep + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="brutal-container mb-12">
        <h2 className="brutal-header mb-4 divine-glitch" data-text={currentQuestion.title}>
          {currentQuestion.title}
        </h2>
        <p className="brutal-text text-accent mb-8">
          &gt; {currentQuestion.subtitle}
        </p>

        {/* Regular Options */}
        {currentQuestion.options && (
          <div className="brutal-grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {currentQuestion.options.map((option) => (
              <button
                key={option.value}
                className={`brutal-card p-6 text-left transition-all duration-200 hover:translate-x-[-4px] hover:translate-y-[-4px] hover:shadow-brutal-lg ${
                  answers[currentQuestion.key] === option.value 
                    ? 'bg-primary border-accent shadow-brutal-lg transform translate-x-[-2px] translate-y-[-2px]' 
                    : 'hover:bg-accent'
                }`}
                onClick={() => handleAnswer(option.value)}
              >
                <div className="brutal-text text-lg mb-2">
                  {option.label}
                </div>
                <div className="brutal-text text-sm text-secondary">
                  {option.desc}
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Custom Fields */}
        {currentQuestion.isCustom && (
          <div className="space-y-6">
            {currentQuestion.fields?.map((field) => (
              <div key={field.key}>
                <label className="brutal-text text-secondary mb-2 block">
                  {field.label}
                </label>
                {field.options ? (
                  <select
                    className="brutal-select w-full"
                    value={(answers[currentQuestion.key] as any)?.[field.key] || ""}
                    onChange={(e) => handleAnswer(e.target.value, field.key)}
                  >
                    <option value="">SELECT_OPTION...</option>
                    {field.options.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    className="brutal-input w-full"
                    type="text"
                    placeholder={field.placeholder}
                    value={(answers[currentQuestion.key] as any)?.[field.key] || ""}
                    onChange={(e) => handleAnswer(e.target.value, field.key)}
                  />
                )}
              </div>
            ))}
          </div>
        )}

        {/* Multi-Choice Sections */}
        {currentQuestion.isMultiChoice && (
          <div className="space-y-8">
            {currentQuestion.sections?.map((section) => (
              <div key={section.key} className="brutal-card p-6">
                <h3 className="brutal-subheader mb-4">
                  {section.title}
                </h3>
                <div className="brutal-grid grid-cols-1 md:grid-cols-2">
                  {section.options.map((option) => (
                    <button
                      key={option.value}
                      className={`brutal-card p-4 text-left transition-all duration-200 hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-brutal ${
                        (answers[currentQuestion.key] as any)?.[section.key] === option.value
                          ? 'bg-accent border-primary shadow-brutal transform translate-x-[-2px] translate-y-[-2px]'
                          : 'hover:bg-accent-orange'
                      }`}
                      onClick={() => handleAnswer(option.value, section.key)}
                    >
                      <div className="brutal-text mb-2">
                        {option.label}
                      </div>
                      <div className="brutal-text text-xs text-secondary">
                        {option.desc}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center mb-12">
        <button
          className="brutal-button-secondary"
          onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
          disabled={currentStep === 0}
        >
          PREVIOUS_STEP
        </button>

        <div className="brutal-text text-accent">
          {canProceed() ? "READY_TO_PROCEED" : "COMPLETE_ALL_FIELDS"}
        </div>

        <button
          className="brutal-button-primary"
          onClick={handleNext}
          disabled={!canProceed()}
        >
          {currentStep === questions.length - 1 ? "CREATE_WORLD" : "NEXT_STEP"}
        </button>
      </div>

      {/* Divine Warning */}
      <div className="brutal-container bg-secondary text-neutral">
        <div className="brutal-text text-accent">
          &gt; WARNING: ONCE_CREATED_WORLD_CANNOT_BE_UNDONE<br/>
          &gt; DIVINE_RESPONSIBILITY_INCLUDES_ALL_INHABITANTS<br/>
          &gt; PROCEED_WITH_CAUTION // OMNIPOTENCE_IS_PERMANENT
        </div>
      </div>
    </div>
  );
}
