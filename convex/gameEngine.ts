import { action, mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";
import { api, internal } from "./_generated/api";

export const generateWorld = action({
  args: {
    worldId: v.id("worlds"),
  },
  handler: async (ctx, args): Promise<any> => {
    // First check if API key is available
    if (!process.env.OPENAI_API_KEY) {
      throw new Error("OPENAI_API_KEY environment variable is not set. Please add it to your Convex dashboard.");
    }

    const world = await ctx.runQuery(api.worldSetup.getUserWorld);
    if (!world || world._id !== args.worldId) {
      throw new Error("World not found");
    }

    const { setupAnswers } = world;
    
    // Define civilization stage based on world type
    const getWorldStageContext = (worldType: string) => {
      switch (worldType) {
        case 'organic':
          return {
            stage: 'primitive hunter-gatherer',
            description: 'small tribes just discovering fire and basic tools',
            factionTypes: ['nomadic tribe', 'hunter clan', 'gatherer band', 'cave dwelling group'],
            leadershipTypes: ['tribal elder', 'strongest hunter', 'wise shaman', 'clan matriarch'],
            populationRange: [20, 100],
            strengthRange: [30, 60],
            locations: ['caves', 'river valleys', 'forest clearings', 'mountain passes'],
            resources: ['wild fruits', 'fresh water', 'flint', 'animal hides', 'wood', 'clay'],
            conflicts: ['territory disputes', 'hunting ground competition', 'water access', 'seasonal migration paths']
          };
        case 'sci-fi':
          return {
            stage: 'early space exploration or post-crash colonists',
            description: 'survivors or pioneers struggling with basic technology',
            factionTypes: ['crash survivors', 'research outpost', 'mining colony', 'exploration team'],
            leadershipTypes: ['elected commander', 'chief scientist', 'senior engineer', 'council democracy'],
            populationRange: [50, 500],
            strengthRange: [40, 80],
            locations: ['crashed ships', 'research stations', 'makeshift settlements', 'underground bunkers'],
            resources: ['salvaged tech', 'energy cells', 'raw materials', 'food synthesizers', 'medical supplies'],
            conflicts: ['resource scarcity', 'equipment failure', 'ideological differences', 'survival priorities']
          };
        case 'fantasy':
          return {
            stage: 'early magical awakening',
            description: 'people just discovering magic exists in their world',
            factionTypes: ['magic discoverers', 'traditional village', 'fearful isolationists', 'curious scholars'],
            leadershipTypes: ['village elder', 'first mage', 'scared chieftain', 'wise woman'],
            populationRange: [100, 800],
            strengthRange: [35, 65],
            locations: ['small villages', 'ancient ruins', 'mystical groves', 'stone circles'],
            resources: ['magical herbs', 'ancient artifacts', 'crystal formations', 'enchanted springs'],
            conflicts: ['fear of magic', 'old vs new ways', 'magical accidents', 'power awakening']
          };
        case 'medieval':
          return {
            stage: 'early feudal development',
            description: 'small settlements forming the first bonds of loyalty and protection',
            factionTypes: ['farming settlement', 'warrior band', 'craftsman guild', 'trading post'],
            leadershipTypes: ['village headman', 'warrior captain', 'master craftsman', 'merchant leader'],
            populationRange: [80, 600],
            strengthRange: [40, 70],
            locations: ['farming villages', 'hilltop forts', 'crossroads markets', 'riverside mills'],
            resources: ['grain', 'iron ore', 'timber', 'stone', 'wool', 'pottery'],
            conflicts: ['land ownership', 'trade disputes', 'protection agreements', 'crop failures']
          };
        default:
          return {
            stage: 'early tribal civilization',
            description: 'simple groups forming the first communities',
            factionTypes: ['tribal group', 'family clan', 'nomad band', 'settlement'],
            leadershipTypes: ['tribal elder', 'family head', 'group leader', 'chosen speaker'],
            populationRange: [30, 200],
            strengthRange: [35, 60],
            locations: ['natural shelters', 'river banks', 'hills', 'valleys'],
            resources: ['water', 'food', 'basic materials', 'shelter materials'],
            conflicts: ['basic survival', 'territory', 'resources', 'leadership']
          };
      }
    };

    const stageContext = getWorldStageContext(setupAnswers.worldType);
    
    const prompt = `You are creating the BEGINNING of civilization for a god simulation game! This is ${stageContext.stage} stage - ${stageContext.description}.

World Type: ${setupAnswers.worldType}
Your God: ${setupAnswers.supremeBeing.name} (${setupAnswers.supremeBeing.type}) - Purpose: ${setupAnswers.supremeBeing.purpose}
World Rules: Time flows ${setupAnswers.creationRules.time}, Death is ${setupAnswers.creationRules.death}, Nature is ${setupAnswers.creationRules.nature}, Morality is ${setupAnswers.creationRules.morality}
Who Lives Here: ${setupAnswers.inhabitants}
Development Stage: ${stageContext.stage}

CRITICAL: This is the VERY BEGINNING of civilization. No kingdoms, no councils, no complex politics yet! Create:
- Small, struggling groups (${stageContext.populationRange[0]}-${stageContext.populationRange[1]} people each)
- Simple leadership (${stageContext.leadershipTypes.join(', ')})
- Basic survival concerns (${stageContext.conflicts.join(', ')})
- Primitive locations (${stageContext.locations.join(', ')})

IMPORTANT: Return ONLY valid JSON, no extra text. Use this exact format:
{
  "worldName": "Simple, descriptive name for this early world",
  "regions": [
    {
      "name": "Basic geographical area name",
      "geography": "Simple terrain description focused on survival needs",
      "resources": ["basic survival resources from: ${stageContext.resources.join(', ')}"]
    }
  ],
  "factions": [
    {
      "name": "Simple group name (not grand titles)",
      "type": "one of: ${stageContext.factionTypes.join(', ')}",
      "alignment": "peaceful/aggressive/neutral/cautious",
      "beliefs": "Simple beliefs about survival, your god, and their world",
      "leadership": "one of: ${stageContext.leadershipTypes.join(', ')}",
      "strength": ${stageContext.strengthRange[0]}-${stageContext.strengthRange[1]},
      "population": ${stageContext.populationRange[0]}-${stageContext.populationRange[1]}
    }
  ],
  "beliefSystems": [
    "Simple belief about the god and basic survival",
    "Basic myth or legend about creation",
    "Simple hope or fear about the future"
  ]
}

Create 2-4 regions and 2-3 small factions. Focus on basic survival, not politics! RESPOND WITH ONLY THE JSON OBJECT.`;

    // Initialize worldData variable at function scope
    let worldData: any;

    try {
      console.log("Making OpenAI API request...");
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.8,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("OpenAI API error:", response.status, errorText);
        throw new Error(`OpenAI API error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log("OpenAI response received");
      
      if (!data.choices || !data.choices[0] || !data.choices[0].message) {
        throw new Error("Invalid response from OpenAI API");
      }

      try {
        let content = data.choices[0].message.content;
        console.log("Raw AI content:", content);
        
        // Extract JSON from markdown code blocks if present
        const jsonMatch = content.match(/```(?:json)?\s*(\{[\s\S]*\})\s*```/);
        if (jsonMatch) {
          content = jsonMatch[1];
        }
        
        // Try to find JSON object in the content
        const jsonStart = content.indexOf('{');
        const jsonEnd = content.lastIndexOf('}');
        
        if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
          content = content.substring(jsonStart, jsonEnd + 1);
        }
        
        worldData = JSON.parse(content);
        console.log("Parsed world data:", worldData);
        
        // Validate required fields
        if (!worldData.worldName || !worldData.regions || !worldData.factions) {
          throw new Error("Missing required fields in generated world data");
        }
        
      } catch (parseError) {
        console.error("JSON parsing error:", parseError);
        console.error("Raw AI response:", data.choices[0].message.content);
        throw parseError; // Re-throw to trigger fallback
      }

    } catch (error) {
      console.error("Error in world generation:", error instanceof Error ? error.message : String(error));
      
      // Fallback to a basic generated world
      console.log("Using fallback world generation due to error:", error instanceof Error ? error.message : String(error));
      worldData = {
        worldName: `Realm of ${world.setupAnswers.supremeBeing.name}`,
        regions: [
          {
            name: "The Central Lands",
            geography: "Rolling hills and fertile valleys with moderate climate",
            resources: ["grain", "stone", "timber"]
          },
          {
            name: "The Borderlands",
            geography: "Rugged terrain at the edge of civilization",
            resources: ["iron", "wild game", "medicinal herbs"]
          },
          {
            name: "The Sacred Grove",
            geography: "Ancient forest with mystical properties",
            resources: ["rare woods", "magical essence", "fresh water"]
          }
        ],
        factions: [
          {
            name: "The Faithful",
            type: "religious order",
            alignment: "peaceful",
            beliefs: `Devoted followers of ${world.setupAnswers.supremeBeing.name}`,
            leadership: "Council of Elders",
            strength: 60,
            population: 3000
          },
          {
            name: "The Free Folk",
            type: "independent settlements",
            alignment: "neutral",
            beliefs: "Believe in self-determination and freedom",
            leadership: "Elected representatives",
            strength: 45,
            population: 2000
          }
        ],
        beliefSystems: [
          `${world.setupAnswers.supremeBeing.name} is the creator and guide of all life`,
          "The world exists in a delicate balance that must be maintained",
          "Great changes are foretold to come with divine intervention"
        ]
      };
    }

    console.log("Updating world with generated data...");
    await ctx.runMutation(api.worldSetup.updateWorldGeneration, {
      worldId: args.worldId,
      worldData: {
        name: worldData.worldName,
        regions: worldData.regions,
        factions: worldData.factions,
        beliefSystems: worldData.beliefSystems,
      },
    });

    console.log("World generation completed successfully");
    return worldData;
  },
});

export const generateTurnEvent = action({
  args: {
    worldId: v.id("worlds"),
    playerAction: v.optional(v.string()),
  },
  handler: async (ctx, args): Promise<any> => {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error("OPENAI_API_KEY environment variable is not set. Please add it to your Convex dashboard.");
    }

    const world = await ctx.runQuery(api.gameEngine.getWorldForEvent, {
      worldId: args.worldId,
    });

    if (!world) {
      throw new Error("World not found");
    }

    const recentEvents = await ctx.runQuery(api.gameEngine.getRecentEvents, {
      worldId: args.worldId,
      limit: 3,
    });

    // Get stage context for events too
    const getEventStageContext = (worldType: string, year: number) => {
      const baseContext: Record<string, {
        early: string;
        activities: string;
        discoveries: string;
        conflicts: string;
      }> = {
        'organic': {
          early: 'discovering fire, making first tools, finding shelter',
          activities: 'hunting, gathering, cave painting, seasonal migrations',
          discoveries: 'fire making, tool crafting, animal tracking, weather patterns',
          conflicts: 'predator attacks, food scarcity, territory disputes, harsh weather'
        },
        'sci-fi': {
          early: 'repairing basic equipment, establishing communications, surviving on alien world',
          activities: 'salvaging technology, growing food, maintaining life support, exploring terrain',
          discoveries: 'new technologies, alien life forms, resource deposits, communication signals',
          conflicts: 'equipment failures, resource depletion, hostile environment, isolation'
        },
        'fantasy': {
          early: 'learning magic exists, coping with magical phenomena, first spells',
          activities: 'farming with magic, healing with herbs, reading omens, ritual ceremonies',
          discoveries: 'magical abilities, ancient artifacts, mystical creatures, prophecies',
          conflicts: 'magical accidents, fear of the unknown, power struggles, supernatural threats'
        },
        'medieval': {
          early: 'forming first alliances, establishing trade, building defenses',
          activities: 'farming, crafting weapons, building homes, training warriors',
          discoveries: 'better farming methods, trade routes, metalworking, fortification techniques',
          conflicts: 'bandits, crop diseases, trade disputes, succession questions'
        }
      };
      
      return baseContext[worldType] || baseContext['organic'];
    };

    const eventContext = getEventStageContext(world.setupAnswers.worldType, world.currentState.year);

    const contextPrompt = `You are narrating the early days of civilization in ${world.name}, a ${world.setupAnswers.worldType} world. This is Year ${world.currentState.year} - still VERY early in development!

REMEMBER: These are primitive people ${eventContext.early}. No complex politics, grand councils, or advanced technology yet!

CURRENT SITUATION:
- It's Year ${world.currentState.year} during ${world.currentState.season}
- Weather: ${world.currentState.weather}
- The balance of power: ${world.currentState.balanceOfPower}
- Recent major events: ${world.currentState.majorEvents.join(", ")}

THE SMALL GROUPS IN YOUR WORLD:
${world.factions.map((f: any) => `- The ${f.name}: ${f.beliefs} (${f.population} people, ${f.strength > 60 ? 'doing well' : f.strength > 40 ? 'struggling' : 'barely surviving'})`).join("\n")}

REGIONS IN YOUR WORLD:
${world.regions.map((r: any) => `- ${r.name}: ${r.geography}`).join("\n")}

WHAT HAPPENED RECENTLY:
${recentEvents.map((e: any) => `Turn ${e.turnNumber}: ${e.narrative}`).join("\n")}

${args.playerAction ? `YOUR LAST DIVINE ACTION: ${args.playerAction}` : "You have been watching silently from the heavens..."}

Now write what happens next! Focus on:
- Basic survival: ${eventContext.activities}
- Simple discoveries: ${eventContext.discoveries}  
- Primitive conflicts: ${eventContext.conflicts}
- How your small groups are trying to survive and grow

Write like you're telling a story about people just beginning civilization. Use simple, vivid language about daily survival, not complex politics.

CRITICAL: You are writing choices for GOD, not for humans! The player is the divine being watching from heaven.
- WRONG: "Gather fish from the river" (that's human work)
- RIGHT: "Command the fish to multiply in the river" (that's divine intervention)
- WRONG: "Build fortifications" (humans build)  
- RIGHT: "Send visions of defensive strategies" (gods send visions)
- WRONG: "Explore the forest" (humans explore)
- RIGHT: "Part the forest canopy to reveal hidden paths" (gods manipulate nature)

IMPORTANT: Return ONLY valid JSON, no markdown. Use this exact format:
{
  "narrative": "Write 2-3 paragraphs about simple people doing basic survival activities. Show what they're discovering, struggling with, or trying to achieve. Focus on daily life, not grand politics. Use names that fit the civilization stage - simple, descriptive names, not elaborate titles.",
  "choices": [
    {
      "id": "choice1",
      "text": "🔥 DIVINE ACTION: [GOD INTERVENES] in [REGION] (may [POSITIVE] or [NEGATIVE])",
      "icon": "🔥"
    },
    {
      "id": "choice2", 
      "text": "🌊 DIVINE WILL: [GOD CAUSES/COMMANDS] for [FACTION] (could [BENEFIT] but risks [DANGER])",
      "icon": "🌊"
    },
    {
      "id": "choice3",
      "text": "⚡ GODLY POWER: [GOD MANIFESTS] affecting [SITUATION] (might [HELP] or [BACKFIRE])",
      "icon": "⚡"
    },
    {
      "id": "choice4",
      "text": "👁️ Remain Silent and observe how your people adapt to their current challenges",
      "icon": "👁️"
    }
  ],
  "worldStateChanges": {
    "factionChanges": [
      {
        "factionName": "Name of affected group",
        "changes": "Simple description of how their survival situation changed"
      }
    ],
    "environmentChanges": "Basic changes to the world that affect survival",
    "newEvents": ["Simple events that primitive people would understand"]
  }
}

CRITICAL CHOICE FORMATTING RULES:
- Write from GOD'S PERSPECTIVE: "Command the fish to swarm" NOT "Gather fish"
- Use DIVINE ACTIONS: "Send lightning", "Cause earthquake", "Bless with visions", "Curse with plague"
- Divine Action Examples:
  * "Multiply the [resource] in [region]" 
  * "Send [weather/disaster] to [location]"
  * "Grant divine [knowledge/ability] to [faction]"
  * "Cause the [terrain] to [change]"
  * "Summon [creatures/phenomena] near [faction]"
  * "Bless [faction] with [benefit]" 
  * "Test [faction] with [challenge]"
- Use actual region names from the world (${world.regions.map((r: any) => r.name).join(', ')})
- Use actual faction names (${world.factions.map((f: any) => f.name).join(', ')})
- Show both positive and negative consequences in parentheses
- Make actions dramatic but appropriate for early civilization
- Examples: "${eventContext.discoveries}" or "${eventContext.conflicts}"

Make each choice appropriate for early civilization. No complex politics! RESPOND WITH ONLY THE JSON OBJECT.`;

    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [{ role: "user", content: contextPrompt }],
          temperature: 0.9,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`OpenAI API error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      
      if (!data.choices || !data.choices[0] || !data.choices[0].message) {
        throw new Error("Invalid response from OpenAI API");
      }

      let eventData;
      try {
        let content = data.choices[0].message.content;
        
        // Extract JSON from markdown code blocks if present
        const jsonMatch = content.match(/```(?:json)?\s*(\{[\s\S]*\})\s*```/);
        if (jsonMatch) {
          content = jsonMatch[1];
        }
        
        // Clean up control characters that might cause parsing issues
        content = content.replace(/[\x00-\x1F\x7F-\x9F]/g, "");
        
        // Try to find JSON object in the content
        const jsonStart = content.indexOf('{');
        const jsonEnd = content.lastIndexOf('}');
        
        if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
          content = content.substring(jsonStart, jsonEnd + 1);
        }
        
        eventData = JSON.parse(content);
        
      } catch (parseError) {
        console.error("Raw AI response:", data.choices[0].message.content);
        const errorMessage = parseError instanceof Error ? parseError.message : String(parseError);
        
        // Fallback event data
        console.log("Using fallback event generation due to parsing error");
        eventData = {
          narrative: `The heavens stir with divine energy as ${world.setupAnswers.supremeBeing.name} contemplates the realm below. 

Your people go about their daily lives, unaware that their creator watches from above. In the ${world.regions[0]?.name || "central lands"}, merchants travel the dusty roads while farmers tend their fields. Children play in village squares as their elders speak in hushed tones about strange omens in the sky.

${world.factions[0]?.name || "Your followers"} have been especially devout lately, offering prayers and sacrifices at dawn. Meanwhile, tensions simmer between different groups as resources grow scarce and old rivalries resurface. The world awaits your divine guidance.`,
          choices: [
            {
              id: "choice1",
              text: `🔥 Send Divine Lightning to ${world.regions[0]?.name || "the lands"} (may ignite sacred fires for warmth, or burn their shelters to ash)`,
              icon: "🔥"
            },
            {
              id: "choice2", 
              text: `🌊 Command the Waters to Rise for ${world.factions[0]?.name || "your people"} (could provide life-giving water, or flood their camps)`,
              icon: "🌊"
            },
            {
              id: "choice3",
              text: `⚡ Bestow Divine Visions upon their Leaders (might grant crucial knowledge, or drive them mad with cosmic truth)`,
              icon: "⚡"
            },
            {
              id: "choice4",
              text: "👁️ Remain Silent and observe how your people adapt to their current challenges",
              icon: "👁️"
            }
          ],
          worldStateChanges: {
            factionChanges: [
              {
                factionName: world.factions[0]?.name || "The Faithful",
                changes: "Growing more devout and seeking divine guidance"
              }
            ],
            environmentChanges: "The seasons change as usual, but there's tension in the air",
            newEvents: ["Divine presence felt by mortals", "Increasing religious devotion"]
          }
        };
      }

      // Save the event
      const newTurn = world.currentTurn + 1;
      await ctx.runMutation(api.gameEngine.saveGameEvent, {
        worldId: args.worldId,
        turnNumber: newTurn,
        eventData,
        playerAction: args.playerAction,
      });

      return eventData;
    } catch (error) {
      console.error("Error generating turn event:", error instanceof Error ? error.message : String(error));
      throw error;
    }
  },
});

export const getWorldForEvent = query({
  args: { worldId: v.id("worlds") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    const world = await ctx.db.get(args.worldId);
    if (!world || world.userId !== userId) return null;

    return world;
  },
});

export const getRecentEvents = query({
  args: { 
    worldId: v.id("worlds"),
    limit: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("gameEvents")
      .withIndex("by_world_and_turn", (q) => q.eq("worldId", args.worldId))
      .order("desc")
      .take(args.limit);
  },
});

export const saveGameEvent = mutation({
  args: {
    worldId: v.id("worlds"),
    turnNumber: v.number(),
    eventData: v.object({
      narrative: v.string(),
      choices: v.array(v.object({
        id: v.string(),
        text: v.string(),
        icon: v.string(),
      })),
      worldStateChanges: v.object({
        factionChanges: v.optional(v.array(v.object({
          factionName: v.string(),
          changes: v.string(),
        }))),
        environmentChanges: v.optional(v.string()),
        newEvents: v.optional(v.array(v.string())),
      }),
    }),
    playerAction: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Save the event
    await ctx.db.insert("gameEvents", {
      worldId: args.worldId,
      turnNumber: args.turnNumber,
      eventType: "divine_action",
      narrative: args.eventData.narrative,
      playerAction: args.playerAction,
      choices: args.eventData.choices,
      worldStateChanges: args.eventData.worldStateChanges,
    });

    // Update world state
    const world = await ctx.db.get(args.worldId);
    if (!world) return;

    const updatedFactions = world.factions.map(faction => {
      const change = args.eventData.worldStateChanges.factionChanges?.find(
        c => c.factionName === faction.name
      );
      if (change) {
        // Simple strength adjustment based on change description
        const strengthDelta = change.changes.includes("weakened") ? -10 :
                            change.changes.includes("strengthened") ? 10 : 0;
        return {
          ...faction,
          strength: Math.max(0, Math.min(100, faction.strength + strengthDelta)),
        };
      }
      return faction;
    });

    const newMajorEvents = args.eventData.worldStateChanges.newEvents || [];
    const updatedMajorEvents = [...world.currentState.majorEvents, ...newMajorEvents].slice(-5);

    await ctx.db.patch(args.worldId, {
      currentTurn: args.turnNumber,
      factions: updatedFactions,
      currentState: {
        ...world.currentState,
        year: world.currentState.year + (args.turnNumber % 4 === 0 ? 1 : 0),
        majorEvents: updatedMajorEvents,
      },
    });
  },
});

export const getCurrentEvent = query({
  args: { worldId: v.id("worlds") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    const world = await ctx.db.get(args.worldId);
    if (!world || world.userId !== userId) return null;

    const currentEvent = await ctx.db
      .query("gameEvents")
      .withIndex("by_world_and_turn", (q) => 
        q.eq("worldId", args.worldId).eq("turnNumber", world.currentTurn)
      )
      .first();

    return currentEvent;
  },
});

export const hasPlayerDecisionForCurrentTurn = query({
  args: { worldId: v.id("worlds") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return false;

    const world = await ctx.db.get(args.worldId);
    if (!world || world.userId !== userId) return false;

    const decision = await ctx.db
      .query("playerDecisions")
      .withIndex("by_world", (q) => q.eq("worldId", args.worldId))
      .filter((q) => q.eq(q.field("turnNumber"), world.currentTurn))
      .first();

    return !!decision;
  },
});

export const makePlayerDecision = mutation({
  args: {
    worldId: v.id("worlds"),
    decision: v.string(),
    isCustomAction: v.boolean(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Must be authenticated");
    }

    const world = await ctx.db.get(args.worldId);
    if (!world || world.userId !== userId) {
      throw new Error("World not found or access denied");
    }

    await ctx.db.insert("playerDecisions", {
      worldId: args.worldId,
      turnNumber: world.currentTurn,
      decision: args.decision,
      isCustomAction: args.isCustomAction,
      consequences: "", // Will be filled by next event generation
    });

    return true;
  },
});

// Debug functions
export const debugWorldState = query({
  args: { worldId: v.id("worlds") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    const world = await ctx.db.get(args.worldId);
    if (!world || world.userId !== userId) return null;

    return {
      worldExists: !!world,
      isSetupComplete: world.isSetupComplete,
      hasRegions: world.regions?.length > 0,
      hasFactions: world.factions?.length > 0,
      currentTurn: world.currentTurn,
      worldName: world.name,
      setupAnswers: world.setupAnswers,
    };
  },
});

export const checkEnvironmentVariables = action({
  args: {},
  handler: async (ctx, args) => {
    return {
      hasOpenAIKey: !!process.env.OPENAI_API_KEY,
      hasConvexOpenAIKey: !!process.env.CONVEX_OPENAI_API_KEY,
      nodeEnv: process.env.NODE_ENV,
    };
  },
});

export const testOpenAIConnection = action({
  args: {},
  handler: async (ctx, args) => {
    if (!process.env.OPENAI_API_KEY) {
      return { error: "OPENAI_API_KEY not found" };
    }

    try {
      const response = await fetch("https://api.openai.com/v1/models", {
        headers: {
          "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        return { error: `OpenAI API error: ${response.status} - ${errorText}` };
      }

      return { success: "OpenAI API connection successful" };
    } catch (error) {
      return { error: `Network error: ${error instanceof Error ? error.message : String(error)}` };
    }
  },
});

export const forceCompleteWorldSetup = mutation({
  args: { worldId: v.id("worlds") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Must be authenticated");
    }

    const world = await ctx.db.get(args.worldId);
    if (!world || world.userId !== userId) {
      throw new Error("World not found or access denied");
    }

    // Force complete with minimal data if it's stuck
    await ctx.db.patch(args.worldId, {
      name: world.name || `Realm of ${world.setupAnswers.supremeBeing.name}`,
      regions: world.regions.length > 0 ? world.regions : [
        {
          name: "The Starting Lands",
          geography: "A simple realm where life begins",
          resources: ["water", "food", "shelter materials"]
        }
      ],
      factions: world.factions.length > 0 ? world.factions : [
        {
          name: "The First People",
          type: "tribal group",
          alignment: "neutral",
          beliefs: `Simple folk who worship ${world.setupAnswers.supremeBeing.name}`,
          leadership: "tribal elder",
          strength: 50,
          population: 100
        }
      ],
      beliefSystems: world.beliefSystems.length > 0 ? world.beliefSystems : [
        `${world.setupAnswers.supremeBeing.name} created this world`,
        "Life is sacred and must be protected",
        "The divine watches over all"
      ],
      isSetupComplete: true,
    });

    return true;
  },
});