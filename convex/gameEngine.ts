import { action, mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";
import { api, internal } from "./_generated/api";

export const generateWorld = action({
  args: {
    worldId: v.id("worlds"),
  },
  handler: async (ctx, args): Promise<any> => {
    const world = await ctx.runQuery(api.worldSetup.getUserWorld);
    if (!world || world._id !== args.worldId) {
      throw new Error("World not found");
    }

    const { setupAnswers } = world;
    
    const prompt = `You are creating an exciting fantasy world! Make it feel alive and interesting based on these choices:

World Type: ${setupAnswers.worldType}
Your God: ${setupAnswers.supremeBeing.name} (${setupAnswers.supremeBeing.type}) - Purpose: ${setupAnswers.supremeBeing.purpose}
World Rules: Time flows ${setupAnswers.creationRules.time}, Death is ${setupAnswers.creationRules.death}, Nature is ${setupAnswers.creationRules.nature}, Morality is ${setupAnswers.creationRules.morality}
Who Lives Here: ${setupAnswers.inhabitants}
How Fast Things Change: ${setupAnswers.simulationSpeed}

Create a world that's easy to understand but full of interesting conflicts and opportunities! Make the factions have clear goals and personalities that will clash or cooperate in interesting ways.

IMPORTANT: Return ONLY valid JSON, no extra text. Use this exact format:
{
  "worldName": "An exciting, memorable world name",
  "regions": [
    {
      "name": "Region name that hints at what makes it special",
      "geography": "Vivid description of what this place looks and feels like",
      "resources": ["resource1", "resource2", "resource3"]
    }
  ],
  "factions": [
    {
      "name": "Faction name that shows their character",
      "type": "what kind of group they are",
      "alignment": "peaceful/aggressive/neutral/mysterious",
      "beliefs": "What drives them and what they think about your god",
      "leadership": "How they make decisions",
      "strength": 75,
      "population": 5000
    }
  ],
  "beliefSystems": [
    "Clear belief about the god and world",
    "An interesting myth or legend",
    "A prophecy or expectation that could lead to conflict"
  ]
}

Create 3-5 diverse regions and 2-4 factions with different goals. Make sure the factions have reasons to interact, compete, or cooperate. RESPOND WITH ONLY THE JSON OBJECT.`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.CONVEX_OPENAI_API_KEY}`,
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
      throw new Error(`OpenAI API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error("Invalid response from OpenAI API");
    }

    let worldData;
    try {
      let content = data.choices[0].message.content;
      
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
      
      // Validate required fields
      if (!worldData.worldName || !worldData.regions || !worldData.factions) {
        throw new Error("Missing required fields in generated world data");
      }
      
    } catch (parseError) {
      console.error("Raw AI response:", data.choices[0].message.content);
      const errorMessage = parseError instanceof Error ? parseError.message : String(parseError);
      
      // Fallback to a basic generated world
      console.log("Using fallback world generation due to parsing error");
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

    await ctx.runMutation(api.worldSetup.updateWorldGeneration, {
      worldId: args.worldId,
      worldData: {
        name: worldData.worldName,
        regions: worldData.regions,
        factions: worldData.factions,
        beliefSystems: worldData.beliefSystems,
      },
    });

    return worldData;
  },
});

export const generateTurnEvent = action({
  args: {
    worldId: v.id("worlds"),
    playerAction: v.optional(v.string()),
  },
  handler: async (ctx, args): Promise<any> => {
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

    const contextPrompt = `You are the divine narrator of ${world.name}, a ${world.setupAnswers.worldType} world. Write like you're telling an exciting story to someone who loves fantasy adventures.

CURRENT SITUATION:
- It's Year ${world.currentState.year} during ${world.currentState.season}
- Weather: ${world.currentState.weather}
- The balance of power: ${world.currentState.balanceOfPower}
- Recent major events: ${world.currentState.majorEvents.join(", ")}

THE PEOPLE OF YOUR WORLD:
${world.factions.map((f: any) => `- The ${f.name}: ${f.beliefs} (${f.population.toLocaleString()} people, ${f.strength > 70 ? 'very strong' : f.strength > 40 ? 'moderately strong' : 'struggling'})`).join("\n")}

WHAT HAPPENED RECENTLY:
${recentEvents.map((e: any) => `Turn ${e.turnNumber}: ${e.narrative}`).join("\n")}

${args.playerAction ? `YOUR LAST DIVINE ACTION: ${args.playerAction}` : "You have been watching silently from the heavens..."}

Now write what happens next! Make it:
- Easy to understand and exciting
- Show clear cause and effect from actions
- Include vivid details about what people see and feel
- Have interesting conflicts or discoveries
- Give the player meaningful choices that matter

IMPORTANT: Return ONLY valid JSON, no markdown. Use this exact format:
{
  "narrative": "Write 2-3 paragraphs that are engaging and easy to follow. Show what your people are doing, feeling, and discovering. Use simple, vivid language like you're telling a friend an exciting story. Include specific details about places, characters, and events that make the world feel alive.",
  "choices": [
    {
      "id": "choice1",
      "text": "A clear, specific divine action the player can take",
      "icon": "⚡"
    },
    {
      "id": "choice2", 
      "text": "A different approach that leads to different outcomes",
      "icon": "🌊"
    },
    {
      "id": "choice3",
      "text": "A third option that shows your divine power differently",
      "icon": "🔥"
    },
    {
      "id": "choice4",
      "text": "Watch and wait to see what happens naturally",
      "icon": "👁️"
    }
  ],
  "worldStateChanges": {
    "factionChanges": [
      {
        "factionName": "Name of affected faction",
        "changes": "Simple description of how they changed"
      }
    ],
    "environmentChanges": "What changed in the world itself",
    "newEvents": ["One or two new major events to remember"]
  }
}

Make each choice lead to clearly different outcomes. Show how the world reacts to divine actions. RESPOND WITH ONLY THE JSON OBJECT.`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.CONVEX_OPENAI_API_KEY}`,
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
            text: "Send a sign of your presence to reassure your followers",
            icon: "⚡"
          },
          {
            id: "choice2", 
            text: "Bless the land with abundant harvests",
            icon: "🌾"
          },
          {
            id: "choice3",
            text: "Inspire a great leader to unite the people",
            icon: "👑"
          },
          {
            id: "choice4",
            text: "Watch and observe how events unfold naturally",
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
