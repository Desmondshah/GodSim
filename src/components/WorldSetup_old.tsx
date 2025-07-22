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
          title: "Moral Framework",
          key: "morality",
          options: [
            { value: "defined", label: "⚖️ Defined", desc: "Clear good and evil" },
            { value: "grey", label: "🌫️ Grey", desc: "Moral ambiguity" },
            { value: "none", label: "🚫 None", desc: "No inherent morality" },
          ],
        },
      ],
      key: "creationRules" as keyof SetupAnswers,
    },
    {
      title: "Who will inhabit your world?",
      subtitle: "Choose the primary inhabitants of your realm",
      options: [
        { value: "humans", label: "👥 Humans", desc: "Familiar and relatable beings" },
        { value: "beasts", label: "🐺 Beasts", desc: "Animal-like creatures" },
        { value: "spirits", label: "👻 Spirits", desc: "Ethereal, otherworldly beings" },
        { value: "intelligent", label: "🧠 Highly Intelligent", desc: "Advanced, thinking beings" },
        { value: "defiant", label: "⚔️ Defiant", desc: "Beings who challenge gods" },
      ],
      key: "inhabitants" as keyof SetupAnswers,
    },
    {
      title: "How fast should time flow?",
      subtitle: "Control the pace of your divine simulation",
      options: [
        { value: "real-time", label: "⏰ Real-Time", desc: "Events unfold naturally" },
        { value: "time-skip", label: "⏩ Time-Skip", desc: "Jump through eras quickly" },
        { value: "reactive", label: "⚡ Reactive", desc: "Time moves with your actions" },
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
      toast.info("Creating your divine realm...");
      const worldId = await createWorld({ setupAnswers: answers });
      toast.info("Generating world details with AI...");
      await generateWorld({ worldId });
      toast.success("Your divine realm has been created!");
      onComplete(worldId);
    } catch (error) {
      console.error("World creation error:", error);
      const errorMessage = (error as Error).message;
      
      if (errorMessage.includes("OpenAI") || errorMessage.includes("API")) {
        toast.error("Failed to generate world: AI service unavailable. Please check your API key configuration.");
      } else if (errorMessage.includes("already have a world")) {
        toast.error("You already have a world. Only one world per god is allowed.");
      } else {
        toast.error("Failed to create world: " + errorMessage);
      }
    }
  };

  const question = questions[currentStep];

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-8">
      <div className="text-center space-y-4">
        <div className="text-6xl">🌟</div>
        <h1 className="text-3xl font-bold text-gray-900">Divine Creation</h1>
        <p className="text-lg text-gray-600">
          Step {currentStep + 1} of {questions.length}
        </p>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentStep + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-8 space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-gray-900">{question.title}</h2>
          <p className="text-gray-600">{question.subtitle}</p>
        </div>

        {question.isCustom ? (
          <div className="space-y-4">
            {question.fields?.map((field) => (
              <div key={field.key} className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  {field.label}
                </label>
                {field.options ? (
                  <select
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={(answers[question.key] as any)[field.key] || ""}
                    onChange={(e) => handleAnswer(e.target.value, field.key)}
                  >
                    <option value="">Choose...</option>
                    {field.options.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    placeholder={field.placeholder}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={(answers[question.key] as any)[field.key] || ""}
                    onChange={(e) => handleAnswer(e.target.value, field.key)}
                  />
                )}
              </div>
            ))}
          </div>
        ) : question.isMultiChoice ? (
          <div className="space-y-6">
            {question.sections?.map((section) => (
              <div key={section.key} className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-800">{section.title}</h3>
                <div className="grid gap-3">
                  {section.options.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleAnswer(option.value, section.key)}
                      className={`p-4 rounded-lg border-2 text-left transition-all ${
                        (answers[question.key] as any)[section.key] === option.value
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="font-medium">{option.label}</div>
                      <div className="text-sm text-gray-600">{option.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid gap-4">
            {question.options?.map((option) => (
              <button
                key={option.value}
                onClick={() => handleAnswer(option.value)}
                className={`p-4 rounded-lg border-2 text-left transition-all ${
                  answers[question.key] === option.value
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="font-medium text-lg">{option.label}</div>
                <div className="text-gray-600">{option.desc}</div>
              </button>
            ))}
          </div>
        )}

        <div className="flex justify-between pt-6">
          <button
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            disabled={currentStep === 0}
            className="px-6 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ← Back
          </button>
          <button
            onClick={handleNext}
            disabled={!canProceed()}
            className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {currentStep === questions.length - 1 ? "Create World" : "Next →"}
          </button>
        </div>
      </div>
    </div>
  );
}
