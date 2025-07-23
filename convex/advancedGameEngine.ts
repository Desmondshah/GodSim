// convex/advancedGameEngine.ts
import { action, mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";
import { api } from "./_generated/api";

// Import our advanced simulation engine
import { UltraAdvancedSimulationEngine, AdvancedNPC } from "./ultraAdvancedEngine";

// Enhanced schema types for advanced NPCs
const AdvancedNPCSchema = v.object({
  // Core Identity
  id: v.string(),
  name: v.string(),
  age: v.number(),
  gender: v.string(),
  species: v.string(),
  birth_date: v.number(),
  birth_location: v.object({ x: v.number(), y: v.number(), z: v.number() }),
  
  // Physical Attributes
  position: v.object({ x: v.number(), y: v.number(), z: v.number() }),
  velocity: v.object({ x: v.number(), y: v.number(), z: v.number() }),
  height: v.number(),
  weight: v.number(),
  appearance: v.object({
    hair_color: v.string(),
    eye_color: v.string(),
    skin_tone: v.string(),
    distinctive_features: v.array(v.string()),
    clothing_style: v.string(),
    current_outfit: v.string(),
  }),
  
  // Personality (Big Five + additional traits)
  personality: v.object({
    openness: v.number(),
    conscientiousness: v.number(),
    extraversion: v.number(),
    agreeableness: v.number(),
    neuroticism: v.number(),
    dominance: v.number(),
    ambition: v.number(),
    empathy: v.number(),
    creativity: v.number(),
    risk_tolerance: v.number(),
  }),
  
  // Emotional State
  emotions: v.object({
    happiness: v.number(),
    anger: v.number(),
    fear: v.number(),
    sadness: v.number(),
    love: v.number(),
    excitement: v.number(),
    curiosity: v.number(),
    contentment: v.number(),
    stress: v.number(),
    pride: v.number(),
  }),
  
  // Physical Needs
  physical_needs: v.object({
    hunger: v.number(),
    thirst: v.number(),
    fatigue: v.number(),
    health: v.number(),
    comfort: v.number(),
    temperature: v.number(),
    hygiene: v.number(),
    pain: v.number(),
  }),
  
  // Social Needs
  social_needs: v.object({
    companionship: v.number(),
    respect: v.number(),
    love: v.number(),
    belonging: v.number(),
    achievement: v.number(),
    autonomy: v.number(),
    purpose: v.number(),
    security: v.number(),
  }),
  
  // Cognitive Systems
  intelligence: v.number(),
  wisdom: v.number(),
  memory_capacity: v.number(),
  attention_span: v.number(),
  processing_speed: v.number(),
  creativity_level: v.number(),
  
  // Memory System
  memories: v.array(v.object({
    id: v.string(),
    timestamp: v.number(),
    type: v.union(v.literal("interaction"), v.literal("event"), v.literal("observation"), v.literal("emotion"), v.literal("goal"), v.literal("relationship")),
    content: v.string(),
    participants: v.array(v.string()),
    emotionalImpact: v.number(),
    importance: v.number(),
    decayRate: v.number(),
  })),
  working_memory: v.array(v.string()),
  long_term_memory: v.array(v.string()),
  
  // Skills and Abilities
  skills: v.record(v.string(), v.object({
    level: v.number(),
    experience: v.number(),
    talent: v.number(),
    last_used: v.number(),
    decay_rate: v.number(),
  })),
  talents: v.array(v.string()),
  
  // Goals and Motivations
  current_goals: v.array(v.object({
    id: v.string(),
    type: v.union(
      v.literal("survival"), v.literal("social"), v.literal("achievement"), 
      v.literal("creative"), v.literal("spiritual"), v.literal("romantic"), 
      v.literal("family"), v.literal("career")
    ),
    description: v.string(),
    priority: v.number(),
    urgency: v.number(),
    progress: v.number(),
    target_npc: v.optional(v.string()),
    target_location: v.optional(v.object({ x: v.number(), y: v.number(), z: v.number() })),
    deadline: v.optional(v.number()),
    sub_goals: v.array(v.string()),
    emotional_investment: v.number(),
    created_at: v.number(),
    last_progress: v.number(),
  })),
  
  // Relationships
  relationships: v.record(v.string(), v.object({
    npc_id: v.string(),
    type: v.union(
      v.literal("family"), v.literal("friend"), v.literal("romantic"), 
      v.literal("enemy"), v.literal("acquaintance"), v.literal("mentor"), 
      v.literal("rival"), v.literal("colleague")
    ),
    strength: v.number(),
    trust: v.number(),
    respect: v.number(),
    attraction: v.number(),
    shared_experiences: v.array(v.string()),
    last_interaction: v.number(),
    interaction_frequency: v.number(),
    compatibility: v.number(),
    power_dynamic: v.number(),
  })),
  
  // Economic System
  possessions: v.record(v.string(), v.number()),
  wealth: v.number(),
  income_sources: v.array(v.string()),
  expenses: v.record(v.string(), v.number()),
  economic_status: v.union(
    v.literal("destitute"), v.literal("poor"), v.literal("working"), 
    v.literal("middle"), v.literal("upper"), v.literal("elite")
  ),
  
  // Cultural System
  culture: v.string(),
  languages: v.array(v.string()),
  beliefs: v.record(v.string(), v.number()),
  values: v.record(v.string(), v.number()),
  traditions: v.array(v.string()),
  
  // Health System
  diseases: v.array(v.string()),
  injuries: v.array(v.object({
    location: v.string(),
    severity: v.number(),
    healing_rate: v.number(),
  })),
  genetic_traits: v.array(v.string()),
  immune_system: v.number(),
  life_expectancy: v.number(),
  
  // Behavioral State
  current_activity: v.string(),
  activity_start_time: v.number(),
  activity_location: v.object({ x: v.number(), y: v.number(), z: v.number() }),
  current_emotion_state: v.string(),
  stress_level: v.number(),
  energy_level: v.number(),
  motivation_level: v.number(),
  
  // Learning System
  learning_rate: v.number(),
  curiosity_level: v.number(),
  teaching_ability: v.number(),
  knowledge_domains: v.record(v.string(), v.number()),
  
  // Environmental Adaptation
  climate_adaptation: v.record(v.string(), v.number()),
  environmental_preferences: v.object({
    temperature: v.number(),
    humidity: v.number(),
    light_level: v.number(),
    noise_level: v.number(),
    crowd_density: v.number(),
  }),
  
  // Meta-Systems
  last_update: v.number(),
  update_frequency: v.number(),
  simulation_priority: v.number(),
  ai_personality_model: v.string(),
});

// Enhanced Weather System Schema
const WeatherSystemSchema = v.object({
  current_conditions: v.object({
    temperature: v.number(),
    humidity: v.number(),
    pressure: v.number(),
    wind_speed: v.number(),
    wind_direction: v.number(),
    precipitation: v.number(),
    visibility: v.number(),
    cloud_cover: v.number(),
    uv_index: v.number(),
  }),
  weather_patterns: v.object({
    pressure_systems: v.array(v.object({
      type: v.union(v.literal("high"), v.literal("low")),
      position: v.object({ x: v.number(), y: v.number(), z: v.number() }),
      strength: v.number(),
      movement_vector: v.object({ x: v.number(), y: v.number(), z: v.number() }),
    })),
    fronts: v.array(v.object({
      type: v.union(v.literal("cold"), v.literal("warm"), v.literal("occluded")),
      position: v.array(v.object({ x: v.number(), y: v.number(), z: v.number() })),
      intensity: v.number(),
      speed: v.number(),
    })),
  }),
  seasonal_cycle: v.object({
    current_season: v.union(v.literal("spring"), v.literal("summer"), v.literal("autumn"), v.literal("winter")),
    season_progress: v.number(),
    day_length: v.number(),
    solar_intensity: v.number(),
  }),
});

// Enhanced ecosystem schema
const EcosystemSchema = v.object({
  grid_size: v.object({ width: v.number(), height: v.number(), depth: v.number() }),
  biome_distribution: v.record(v.string(), v.number()),
  species_count: v.object({
    flora: v.number(),
    fauna: v.number(),
  }),
  resource_abundance: v.record(v.string(), v.number()),
  pollution_levels: v.object({
    air: v.number(),
    water: v.number(),
    soil: v.number(),
    noise: v.number(),
  }),
  biodiversity_index: v.number(),
  carrying_capacity: v.record(v.string(), v.number()),
});

// Time system schema
const TimeSystemSchema = v.object({
  current_time: v.number(),
  time_scale: v.number(),
  calendar: v.object({
    year: v.number(),
    month: v.number(),
    day: v.number(),
    hour: v.number(),
    minute: v.number(),
    second: v.number(),
  }),
  celestial_bodies: v.array(v.object({
    name: v.string(),
    position: v.object({ x: v.number(), y: v.number(), z: v.number() }),
    orbital_period: v.number(),
    influence_on_tides: v.number(),
    influence_on_behavior: v.number(),
  })),
});

// ===== ADVANCED SIMULATION QUERIES =====

export const getAdvancedWorldState = query({
  args: { worldId: v.id("worlds") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    const world = await ctx.db.get(args.worldId);
    if (!world || world.userId !== userId) return null;

    // Get all NPCs for this world
    const npcs = await ctx.db
      .query("advancedNPCs")
      .withIndex("by_world", (q) => q.eq("worldId", args.worldId))
      .collect();

    // Get environmental data
    const environment = await ctx.db
      .query("environmentalSystems")
      .withIndex("by_world", (q) => q.eq("worldId", args.worldId))
      .first();

    // Get recent NPC interactions
    const interactions = await ctx.db
      .query("npcInteractions")
      .withIndex("by_world", (q) => q.eq("worldId", args.worldId))
      .order("desc")
      .take(50);

    // Calculate advanced analytics
    const analytics = calculateAdvancedAnalytics(npcs, environment);

    return {
      world,
      npcs: npcs.slice(0, 100), // Limit for performance
      environment,
      interactions,
      analytics,
      simulation_time: Date.now(),
    };
  },
});

export const getNPCConsciousnessState = query({
  args: { 
    worldId: v.id("worlds"),
    npcId: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    const world = await ctx.db.get(args.worldId);
    if (!world || world.userId !== userId) return null;

    const npc = await ctx.db
      .query("advancedNPCs")
      .withIndex("by_world", (q) => q.eq("worldId", args.worldId))
      .filter((q) => q.eq(q.field("npc_id"), args.npcId))
      .first();

    if (!npc) return null;

    // Get detailed consciousness data
    return {
      basic_info: {
        name: npc.name,
        age: npc.age,
        current_activity: npc.current_activity,
        location: npc.position,
      },
      mental_state: {
        current_thoughts: npc.working_memory,
        dominant_emotion: getDominantEmotion(npc.emotions),
        stress_level: npc.stress_level,
        energy_level: npc.energy_level,
        motivation_level: npc.motivation_level,
      },
      needs_analysis: {
        physical_needs: npc.physical_needs,
        social_needs: npc.social_needs,
        most_urgent_need: getMostUrgentNeed(npc),
      },
      goals_and_plans: {
        current_goals: npc.current_goals.slice(0, 5),
        goal_completion_rate: calculateGoalCompletionRate(npc.current_goals),
        next_planned_action: predictNextAction(npc),
      },
      relationships: {
        total_relationships: Object.keys(npc.relationships).length,
        closest_friends: getClosestRelationships(npc.relationships, "friend"),
        family_members: getClosestRelationships(npc.relationships, "family"),
        romantic_interests: getClosestRelationships(npc.relationships, "romantic"),
        enemies: getClosestRelationships(npc.relationships, "enemy"),
      },
      memory_system: {
        recent_memories: npc.memories.slice(-10),
        memory_capacity_usage: (npc.memories.length / npc.memory_capacity) * 100,
        most_important_memories: npc.long_term_memory.slice(-5),
      },
      personality_profile: {
        personality_summary: generatePersonalitySummary(npc.personality),
        decision_making_style: npc.decision_making_style,
        communication_style: npc.communication_style,
        learning_style: analyzeLearningSstyle(npc),
      },
    };
  },
});

export const getWorldEcosystemAnalysis = query({
  args: { worldId: v.id("worlds") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    const world = await ctx.db.get(args.worldId);
    if (!world || world.userId !== userId) return null;

    const environment = await ctx.db
      .query("environmentalSystems")
      .withIndex("by_world", (q) => q.eq("worldId", args.worldId))
      .first();

    if (!environment) return null;

    return {
      weather_analysis: {
        current_conditions: environment.weather_system.current_conditions,
        seasonal_trends: analyzeSeasonalTrends(environment.weather_system),
        extreme_weather_risk: calculateExtremeWeatherRisk(environment.weather_system),
        climate_stability: calculateClimateStability(environment.weather_system),
      },
      ecosystem_health: {
        biodiversity_status: environment.ecosystem.biodiversity_index,
        species_populations: environment.ecosystem.species_count,
        habitat_quality: calculateHabitatQuality(environment.ecosystem),
        pollution_impact: analyzePollutionImpact(environment.ecosystem),
        carrying_capacity_status: analyzeCarryingCapacity(environment.ecosystem),
      },
      resource_analysis: {
        renewable_resources: environment.ecosystem.resource_abundance,
        depletion_rates: calculateResourceDepletionRates(environment.ecosystem),
        regeneration_rates: calculateRegenerationRates(environment.ecosystem),
        scarcity_warnings: identifyResourceScarcity(environment.ecosystem),
      },
      environmental_trends: {
        temperature_trend: calculateTemperatureTrend(environment.weather_system),
        precipitation_trend: calculatePrecipitationTrend(environment.weather_system),
        ecosystem_evolution: predictEcosystemChanges(environment.ecosystem),
        human_impact: calculateHumanEnvironmentalImpact(environment),
      },
    };
  },
});

export const getSocialNetworkAnalysis = query({
  args: { worldId: v.id("worlds") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    const world = await ctx.db.get(args.worldId);
    if (!world || world.userId !== userId) return null;

    const npcs = await ctx.db
      .query("advancedNPCs")
      .withIndex("by_world", (q) => q.eq("worldId", args.worldId))
      .collect();

    const interactions = await ctx.db
      .query("npcInteractions")
      .withIndex("by_world", (q) => q.eq("worldId", args.worldId))
      .order("desc")
      .take(200);

    return {
      network_metrics: {
        total_npcs: npcs.length,
        total_relationships: calculateTotalRelationships(npcs),
        network_density: calculateNetworkDensity(npcs),
        average_connections: calculateAverageConnections(npcs),
        clustering_coefficient: calculateClusteringCoefficient(npcs),
      },
      social_groups: {
        family_clusters: identifyFamilyClusters(npcs),
        friend_networks: identifyFriendNetworks(npcs),
        professional_groups: identifyProfessionalGroups(npcs),
        romantic_pairs: identifyRomanticPairs(npcs),
      },
      relationship_patterns: {
        strong_relationships: countStrongRelationships(npcs),
        weak_relationships: countWeakRelationships(npcs),
        conflicting_relationships: countConflictingRelationships(npcs),
        relationship_stability: calculateRelationshipStability(npcs),
      },
      social_dynamics: {
        influence_leaders: identifyInfluenceLeaders(npcs),
        social_bridges: identifySocialBridges(npcs),
        isolated_individuals: identifyIsolatedIndividuals(npcs),
        emerging_alliances: identifyEmergingAlliances(interactions),
      },
      communication_patterns: {
        interaction_frequency: calculateInteractionFrequency(interactions),
        communication_styles: analyzeCommunicationStyles(npcs),
        information_flow: analyzeInformationFlow(interactions),
        social_influence_spread: analyzeSocialInfluenceSpread(interactions),
      },
    };
  },
});

// ===== ADVANCED SIMULATION MUTATIONS =====

export const updateNPCConsciousness = mutation({
  args: {
    worldId: v.id("worlds"),
    npcId: v.string(),
    consciousness_update: v.object({
      new_thoughts: v.optional(v.array(v.string())),
      emotional_changes: v.optional(v.record(v.string(), v.number())),
      new_memories: v.optional(v.array(v.object({
        type: v.string(),
        content: v.string(),
        importance: v.number(),
      }))),
      goal_updates: v.optional(v.array(v.object({
        goal_id: v.string(),
        progress_change: v.number(),
        priority_change: v.optional(v.number()),
      }))),
      relationship_changes: v.optional(v.record(v.string(), v.object({
        strength_change: v.optional(v.number()),
        trust_change: v.optional(v.number()),
        respect_change: v.optional(v.number()),
      }))),
    }),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Must be authenticated");

    const world = await ctx.db.get(args.worldId);
    if (!world || world.userId !== userId) {
      throw new Error("World not found or access denied");
    }

    const npc = await ctx.db
      .query("advancedNPCs")
      .withIndex("by_world", (q) => q.eq("worldId", args.worldId))
      .filter((q) => q.eq(q.field("npc_id"), args.npcId))
      .first();

    if (!npc) throw new Error("NPC not found");

    const updates: any = {
      last_update: Date.now(),
    };

    // Update thoughts
    if (args.consciousness_update.new_thoughts) {
      updates.working_memory = [
        ...args.consciousness_update.new_thoughts,
        ...npc.working_memory
      ].slice(0, 5); // Keep only recent thoughts
    }

    // Update emotions
    if (args.consciousness_update.emotional_changes) {
      updates.emotions = { ...npc.emotions };
      Object.entries(args.consciousness_update.emotional_changes).forEach(([emotion, change]) => {
        updates.emotions[emotion] = Math.max(-100, Math.min(100, 
          (updates.emotions[emotion] || 0) + change
        ));
      });
    }

    // Update memories
    if (args.consciousness_update.new_memories) {
      const newMemories = args.consciousness_update.new_memories.map(memory => ({
        id: generateId(),
        timestamp: Date.now(),
        type: memory.type,
        content: memory.content,
        participants: [args.npcId],
        location: npc.position,
        emotionalImpact: 0,
        importance: memory.importance,
        decayRate: 0.95,
        associatedEmotions: [],
        contextualDetails: {},
      }));

      updates.memories = [...npc.memories, ...newMemories];
    }

    // Update goals
    if (args.consciousness_update.goal_updates) {
      updates.current_goals = npc.current_goals.map(goal => {
        const goalUpdate = args.consciousness_update.goal_updates?.find(u => u.goal_id === goal.id);
        if (goalUpdate) {
          return {
            ...goal,
            progress: Math.max(0, Math.min(100, goal.progress + goalUpdate.progress_change)),
            priority: goalUpdate.priority_change !== undefined 
              ? Math.max(0, Math.min(100, goal.priority + goalUpdate.priority_change))
              : goal.priority,
            last_progress: Date.now(),
          };
        }
        return goal;
      });
    }

    // Update relationships - Fixed type structure
    if (args.consciousness_update.relationship_changes) {
      updates.relationships = { ...npc.relationships };
      Object.entries(args.consciousness_update.relationship_changes).forEach(([npcId, changes]) => {
        if (updates.relationships[npcId]) {
          const rel = updates.relationships[npcId];
          if (changes.strength_change !== undefined) {
            rel.strength = Math.max(-100, Math.min(100, rel.strength + changes.strength_change));
          }
          if (changes.trust_change !== undefined) {
            rel.trust = Math.max(0, Math.min(100, rel.trust + changes.trust_change));
          }
          if (changes.respect_change !== undefined) {
            rel.respect = Math.max(0, Math.min(100, rel.respect + changes.respect_change));
          }
          rel.last_interaction = Date.now();
        }
      });
    }

    await ctx.db.patch(npc._id, updates);
    
    return { success: true, updated_fields: Object.keys(updates) };
  },
});

export const createNPCInteraction = mutation({
  args: {
    worldId: v.id("worlds"),
    interaction: v.object({
      participants: v.array(v.string()),
      type: v.string(),
      location: v.object({ x: v.number(), y: v.number(), z: v.number() }),
      description: v.string(),
      emotional_impact: v.record(v.string(), v.number()),
      relationship_changes: v.record(v.string(), v.record(v.string(), v.number())),
      memory_significance: v.number(),
      duration: v.number(),
    }),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Must be authenticated");

    const world = await ctx.db.get(args.worldId);
    if (!world || world.userId !== userId) {
      throw new Error("World not found or access denied");
    }

    // Create interaction record
    const interactionId = await ctx.db.insert("npcInteractions", {
      worldId: args.worldId,
      ...args.interaction,
      timestamp: Date.now(),
    });

    // Update each participant NPC
    for (const npcId of args.interaction.participants) {
      // Update emotional state
      if (args.interaction.emotional_impact[npcId]) {
        // Convert relationship changes to proper format
        const relationshipChanges: Record<string, { strength_change?: number; trust_change?: number; respect_change?: number }> = {};
        
        if (args.interaction.relationship_changes[npcId]) {
          Object.entries(args.interaction.relationship_changes[npcId]).forEach(([otherNpcId, value]) => {
            relationshipChanges[otherNpcId] = { strength_change: value };
          });
        }

        await ctx.runMutation(api.advancedGameEngine.updateNPCConsciousness, {
          worldId: args.worldId,
          npcId,
          consciousness_update: {
            emotional_changes: { 
              happiness: args.interaction.emotional_impact[npcId] 
            },
            new_memories: [{
              type: 'interaction',
              content: args.interaction.description,
              importance: args.interaction.memory_significance,
            }],
            relationship_changes: relationshipChanges,
          },
        });
      }
    }

    return { success: true, interaction_id: interactionId };
  },
});

export const simulateEnvironmentalEvent = mutation({
  args: {
    worldId: v.id("worlds"),
    event: v.object({
      type: v.union(
        v.literal("weather_change"), v.literal("natural_disaster"), 
        v.literal("seasonal_shift"), v.literal("ecosystem_event")
      ),
      severity: v.number(),
      affected_regions: v.array(v.string()),
      duration: v.number(),
      description: v.string(),
      environmental_changes: v.object({
        temperature_change: v.optional(v.number()),
        precipitation_change: v.optional(v.number()),
        pollution_change: v.optional(v.number()),
        resource_changes: v.optional(v.record(v.string(), v.number())),
      }),
    }),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Must be authenticated");

    const world = await ctx.db.get(args.worldId);
    if (!world || world.userId !== userId) {
      throw new Error("World not found or access denied");
    }

    // Update environmental systems
    const environment = await ctx.db
      .query("environmentalSystems")
      .withIndex("by_world", (q) => q.eq("worldId", args.worldId))
      .first();

    if (environment) {
      const updates: any = {};

      if (args.event.environmental_changes.temperature_change) {
        updates["weather_system.current_conditions.temperature"] = 
          environment.weather_system.current_conditions.temperature + 
          args.event.environmental_changes.temperature_change;
      }

      if (args.event.environmental_changes.precipitation_change) {
        updates["weather_system.current_conditions.precipitation"] = 
          Math.max(0, environment.weather_system.current_conditions.precipitation + 
          args.event.environmental_changes.precipitation_change);
      }

      if (Object.keys(updates).length > 0) {
        await ctx.db.patch(environment._id, updates);
      }
    }

    // Affect NPCs in the region
    const npcs = await ctx.db
      .query("advancedNPCs")
      .withIndex("by_world", (q) => q.eq("worldId", args.worldId))
      .collect();

    for (const npc of npcs) {
      // Check if NPC is in affected region
      const isAffected = args.event.affected_regions.some(region => 
        isNPCInRegion(npc, region)
      );

      if (isAffected) {
        const emotional_impact = calculateEnvironmentalEmotionalImpact(args.event, npc);

        await ctx.runMutation(api.advancedGameEngine.updateNPCConsciousness, {
          worldId: args.worldId,
          npcId: npc.npc_id,
          consciousness_update: {
            emotional_changes: emotional_impact,
            new_thoughts: [
              `The ${args.event.type} is affecting the area. ${args.event.description}`
            ],
            new_memories: [{
              type: 'event',
              content: `Experienced ${args.event.type}: ${args.event.description}`,
              importance: args.event.severity / 100,
            }],
          },
        });
      }
    }

    // Record the event in game events table instead of environmentalEvents
    await ctx.db.insert("gameEvents", {
      worldId: args.worldId,
      turnNumber: world.currentTurn || 0,
      eventType: "environmental",
      narrative: args.event.description,
      choices: [],
      worldStateChanges: {
        environmentChanges: `Environmental event: ${args.event.type}`,
        newEvents: [args.event.description],
      },
      timestamp: Date.now(),
    });

    return { success: true, affected_npcs: npcs.length };
  },
});

// ===== ADVANCED AI EVENT GENERATION =====

export const generateUltraAdvancedEvent = action({
  args: {
    worldId: v.id("worlds"),
    playerAction: v.optional(v.string()),
  },
  handler: async (ctx, args): Promise<any> => {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error("OPENAI_API_KEY environment variable is not set");
    }

    // Get comprehensive world state
    const worldState = await ctx.runQuery(api.advancedGameEngine.getAdvancedWorldState, {
      worldId: args.worldId,
    });

    if (!worldState) {
      throw new Error("World not found");
    }

    // Analyze NPC consciousness states
    const npcConsciousnessAnalysis = await Promise.all(
      worldState.npcs.slice(0, 5).map(async npc => 
        await ctx.runQuery(api.advancedGameEngine.getNPCConsciousnessState, {
          worldId: args.worldId,
          npcId: npc.npc_id,
        })
      )
    );

    // Get environmental analysis
    const ecosystemAnalysis = await ctx.runQuery(api.advancedGameEngine.getWorldEcosystemAnalysis, {
      worldId: args.worldId,
    });

    // Get social network analysis
    const socialAnalysis = await ctx.runQuery(api.advancedGameEngine.getSocialNetworkAnalysis, {
      worldId: args.worldId,
    });

    // Generate ultra-sophisticated prompt
    const prompt = `You are narrating an ultra-advanced god simulation where every NPC has individual consciousness, complex relationships, and emergent behaviors.

COMPREHENSIVE WORLD STATE:
${JSON.stringify({
      world_overview: {
        name: worldState.world.name,
        age: worldState.world.currentState?.year || 1,
        season: worldState.environment?.weather_system?.seasonal_cycle?.current_season,
        current_time: worldState.simulation_time,
      },
      individual_consciousness_analysis: npcConsciousnessAnalysis,
      environmental_systems: ecosystemAnalysis,
      social_network_dynamics: socialAnalysis,
      recent_interactions: worldState.interactions.slice(0, 10),
    }, null, 2)}

${args.playerAction ? `RECENT DIVINE INTERVENTION: ${args.playerAction}
Your divine action ripples through the consciousness of every NPC, their relationships, memories, and the fabric of reality itself.` : 'The world evolves through emergent consciousness and complex system interactions.'}

Create an event that showcases the ultra-sophisticated simulation of individual consciousness, emergent social dynamics, and environmental complexity.

Return ONLY valid JSON with this structure:
{
  "narrative": {
    "title": "Consciousness-Driven Event Title",
    "opening": "Rich description showing specific NPCs' thoughts and consciousness driving events",
    "consciousness_details": [
      {
        "npc_name": "Name",
        "internal_monologue": "Their exact thoughts about the situation",
        "emotional_reasoning": "How their emotions influence their decisions",
        "memory_influences": "How past memories shape their reaction",
        "relationship_considerations": "How they think about other NPCs",
        "goal_conflicts": "How their goals conflict or align with the situation"
      }
    ],
    "environmental_consciousness": "How NPCs perceive and react to environmental changes",
    "social_emergence": "Complex behaviors arising from NPC interactions",
    "systemic_complexity": "How multiple systems interact to create the event"
  },
  "choices": [
    {
      "id": "choice1",
      "text": "🧠 Divine Consciousness Intervention: [Specific mental influence] (may [consciousness effect] but risks [unintended consequence])",
      "icon": "🧠",
      "consciousness_mechanics": {
        "thought_insertion": ["specific thoughts to add to NPC minds"],
        "emotion_modulation": {"npc_id": {"emotion": change_value}},
        "memory_manipulation": ["memories to enhance/suppress/create"],
        "goal_influences": ["how to modify NPC goals and priorities"],
        "relationship_effects": ["how relationships will be affected"]
      },
      "emergence_potential": "What complex behaviors might emerge",
      "systemic_ripples": "How this affects interconnected systems"
    }
  ],
  "ultra_advanced_consequences": {
    "consciousness_evolution": [
      {
        "npc_id": "id",
        "cognitive_changes": ["specific changes to thinking patterns"],
        "emotional_development": {"emotion": "how it evolves"},
        "memory_restructuring": ["how memories are reorganized"],
        "personality_drift": {"trait": "how personality traits shift"},
        "learning_acceleration": ["new skills/knowledge acquired"],
        "relationship_recalibration": {"other_npc": "relationship evolution"}
      }
    ],
    "emergent_social_phenomena": [
      {
        "phenomenon": "name of emerging social behavior",
        "participants": ["involved NPCs"],
        "consciousness_drivers": ["what mental states drive this behavior"],
        "emergence_mechanism": "how individual consciousness creates group behavior",
        "evolution_trajectory": "how this phenomenon will develop over time",
        "stability_factors": ["what makes this behavior persistent or fragile"]
      }
    ],
    "environmental_consciousness_shifts": {
      "ecosystem_awareness": "how NPCs develop new environmental understanding",
      "resource_consciousness": "changes in how NPCs perceive and use resources",
      "weather_adaptation": "how NPC behavior adapts to environmental changes",
      "spatial_relationship_evolution": "how NPCs understand and use space differently"
    },
    "complex_feedback_loops": [
      {
        "loop_name": "descriptive name of the feedback mechanism",
        "consciousness_components": ["how individual minds participate"],
        "social_amplification": "how social networks amplify the effect",
        "environmental_integration": "how environment influences the loop",
        "temporal_dynamics": "how the loop evolves over time",
        "tipping_points": ["conditions that could dramatically change the loop"],
        "intervention_opportunities": ["ways divine action could influence this loop"]
      }
    ],
    "technological_consciousness_emergence": {
      "innovation_through_interaction": "how NPC conversations lead to new ideas",
      "collective_problem_solving": "how groups of NPCs solve complex problems",
      "knowledge_synthesis": "how individual NPC knowledge combines into new understanding",
      "skill_emergence": "new abilities arising from social interaction"
    },
    "cultural_consciousness_evolution": {
      "belief_system_emergence": "new beliefs arising from shared experiences",
      "ritual_spontaneous_generation": "new rituals emerging from group behavior",
      "language_evolution": "how NPC communication patterns evolve",
      "value_system_shifts": "how collective values change through individual evolution"
    }
  }
}

Focus on the depth of individual consciousness, the complexity of emergent behaviors, and the sophisticated interplay between mind, society, and environment.`;

    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-4o",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.8,
          max_tokens: 4000,
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
        
        // Try to find JSON object in the content
        const jsonStart = content.indexOf('{');
        const jsonEnd = content.lastIndexOf('}');
        
        if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
          content = content.substring(jsonStart, jsonEnd + 1);
        }
        
        eventData = JSON.parse(content);
        
      } catch (parseError) {
        console.error("Raw AI response:", data.choices[0].message.content);
        
        // Ultra-sophisticated fallback event
        eventData = {
          narrative: {
            title: "Consciousness Convergence Event",
            opening: `The minds of ${worldState.world.name} stir with unprecedented complexity. Individual NPCs experience simultaneous moments of clarity, their consciousness expanding beyond normal boundaries as they grapple with their existence, relationships, and place in the cosmos.`,
            consciousness_details: npcConsciousnessAnalysis.slice(0, 3).map(npc => ({
              npc_name: npc?.basic_info?.name || "Unknown",
              internal_monologue: `The weight of existence feels different today. My thoughts seem clearer, my emotions more profound.`,
              emotional_reasoning: "A deep sense of wonder mixed with existential curiosity drives their actions",
              memory_influences: "Childhood memories resurface, creating new connections with present experiences",
              relationship_considerations: "They see their connections to others in a new light, understanding the true depth of social bonds",
              goal_conflicts: "Personal ambitions clash with newfound empathy for others"
            })),
            environmental_consciousness: "NPCs develop an acute awareness of their environment, sensing subtle changes in weather, ecosystem health, and resource availability",
            social_emergence: "Complex group behaviors emerge as individual consciousness expansions create resonance effects throughout the social network",
            systemic_complexity: "The intersection of individual minds, social dynamics, and environmental awareness creates unprecedented complexity"
          },
          choices: [
            {
              id: "choice1",
              text: "🧠 Amplify Consciousness Expansion: Accelerate the mental evolution of all NPCs (may create enlightened society but risks overwhelming their minds)",
              icon: "🧠",
              consciousness_mechanics: {
                thought_insertion: ["profound philosophical insights", "expanded self-awareness", "cosmic perspective"],
                emotion_modulation: { "all": { "curiosity": 30, "empathy": 25, "wonder": 20 } },
                memory_manipulation: ["enhance memory of meaningful moments", "connect disparate memories"],
                goal_influences: ["shift from purely selfish to more altruistic goals", "add spiritual/philosophical goals"],
                relationship_effects: ["deeper emotional connections", "increased empathy and understanding"]
              },
              emergence_potential: "Collective wisdom, spontaneous cooperation, advanced problem-solving",
              systemic_ripples: "Accelerated cultural evolution, technological innovation, spiritual awakening"
            },
            {
              id: "choice2",
              text: "🌐 Foster Social Consciousness: Enhance NPCs' awareness of their interconnectedness (creates social harmony but may reduce individuality)",
              icon: "🌐",
              consciousness_mechanics: {
                thought_insertion: ["awareness of social bonds", "understanding of collective impact"],
                emotion_modulation: { "all": { "empathy": 40, "belonging": 30, "compassion": 25 } },
                memory_manipulation: ["strengthen memories of helping others", "recall moments of social connection"],
                goal_influences: ["prioritize community goals", "seek collaborative achievements"],
                relationship_effects: ["strengthen all positive relationships", "reduce conflicts"]
              },
              emergence_potential: "Collective decision-making, spontaneous mutual aid, conflict resolution",
              systemic_ripples: "Social harmony, reduced inequality, cooperative problem-solving"
            },
            {
              id: "choice3",
              text: "⚖️ Balance Individual and Collective Consciousness: Maintain healthy tension between self and society (creates complex dynamics but risks instability)",
              icon: "⚖️",
              consciousness_mechanics: {
                thought_insertion: ["balance of personal and social needs", "nuanced moral reasoning"],
                emotion_modulation: { "all": { "autonomy": 20, "belonging": 20, "wisdom": 15 } },
                memory_manipulation: ["strengthen memories that show value of both independence and cooperation"],
                goal_influences: ["balance personal and social goals", "seek win-win solutions"],
                relationship_effects: ["more nuanced, complex relationships"]
              },
              emergence_potential: "Sophisticated social structures, creative problem-solving, dynamic equilibrium",
              systemic_ripples: "Adaptive social systems, innovation through healthy conflict, resilient communities"
            },
            {
              id: "choice4",
              text: "👁️ Observe the Natural Evolution: Let consciousness evolve organically without divine intervention",
              icon: "👁️",
              consciousness_mechanics: {
                thought_insertion: [],
                emotion_modulation: {},
                memory_manipulation: [],
                goal_influences: [],
                relationship_effects: []
              },
              emergence_potential: "Unpredictable but authentic development, natural selection of consciousness patterns",
              systemic_ripples: "Organic cultural evolution, authentic social structures, natural complexity"
            }
          ],
          ultra_advanced_consequences: {
            consciousness_evolution: worldState.npcs.slice(0, 5).map(npc => ({
              npc_id: npc.npc_id,
              cognitive_changes: ["enhanced metacognition", "improved emotional regulation", "expanded perspective-taking"],
              emotional_development: { "empathy": "gradual increase through social interaction", "wisdom": "growth through experience integration" },
              memory_restructuring: ["reorganization of priorities", "integration of disparate experiences"],
              personality_drift: { "openness": "slight increase", "conscientiousness": "contextual development" },
              learning_acceleration: ["social skills", "emotional intelligence", "philosophical understanding"],
              relationship_recalibration: { "others": "deeper, more nuanced connections" }
            })),
            emergent_social_phenomena: [
              {
                phenomenon: "spontaneous collective problem-solving",
                participants: ["community leaders", "innovative thinkers", "empathetic connectors"],
                consciousness_drivers: ["enhanced empathy", "expanded perspective", "collaborative instincts"],
                emergence_mechanism: "individual consciousness expansion creates resonance effects in social networks",
                evolution_trajectory: "from small groups to community-wide cooperation",
                stability_factors: ["mutual benefit", "emotional satisfaction", "cultural reinforcement"]
              }
            ],
            environmental_consciousness_shifts: {
              ecosystem_awareness: "NPCs develop intuitive understanding of ecological balance",
              resource_consciousness: "shift from exploitation to stewardship mindset",
              weather_adaptation: "proactive behavioral changes based on environmental cues",
              spatial_relationship_evolution: "more harmonious use of shared spaces"
            },
            complex_feedback_loops: [
              {
                loop_name: "consciousness-empathy-cooperation spiral",
                consciousness_components: ["individual self-awareness", "emotional intelligence", "perspective-taking"],
                social_amplification: "empathetic individuals inspire others to develop empathy",
                environmental_integration: "cooperative behavior leads to better environmental outcomes",
                temporal_dynamics: "reinforcing cycle that accelerates over time",
                tipping_points: ["critical mass of empathetic individuals", "successful collective achievements"],
                intervention_opportunities: ["enhance empathy", "provide cooperation opportunities", "celebrate collective successes"]
              }
            ],
            technological_consciousness_emergence: {
              innovation_through_interaction: "cross-pollination of ideas through enhanced communication",
              collective_problem_solving: "groups naturally form to address complex challenges",
              knowledge_synthesis: "individual expertise combines into collective wisdom",
              skill_emergence: "new abilities arise from collaborative learning"
            },
            cultural_consciousness_evolution: {
              belief_system_emergence: "new spiritual/philosophical frameworks arise from consciousness expansion",
              ritual_spontaneous_generation: "meaningful ceremonies emerge from shared experiences",
              language_evolution: "more nuanced communication about inner experiences and relationships",
              value_system_shifts: "from competition to collaboration, from material to holistic success"
            }
          }
        };
      }

      // Save the ultra-advanced event
      const newTurn = worldState.world.currentTurn + 1;
      await ctx.runMutation(api.advancedGameEngine.saveUltraAdvancedGameEvent, {
        worldId: args.worldId,
        turnNumber: newTurn,
        eventData,
        playerAction: args.playerAction,
      });

      return eventData;

    } catch (error) {
      console.error("Error generating ultra-advanced event:", error);
      throw error;
    }
  },
});

export const saveUltraAdvancedGameEvent = mutation({
  args: {
    worldId: v.id("worlds"),
    turnNumber: v.number(),
    eventData: v.any(),
    playerAction: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Save the ultra-advanced event
    await ctx.db.insert("gameEvents", {
      worldId: args.worldId,
      turnNumber: args.turnNumber,
      eventType: "ultra_advanced_consciousness",
      narrative: args.eventData.narrative || "Ultra-advanced consciousness event occurred",
      playerAction: args.playerAction,
      choices: args.eventData.choices,
      worldStateChanges: args.eventData.ultra_advanced_consequences || {},
      eventAnalysis: {
        consciousness_depth: "ultra_advanced",
        emergence_complexity: "maximum",
        systemic_integration: "complete",
      },
    });

      // Apply ultra-sophisticated consequences
      if (args.eventData.ultra_advanced_consequences?.consciousness_evolution) {
        for (const evolution of args.eventData.ultra_advanced_consequences.consciousness_evolution) {
          await ctx.runMutation(api.advancedGameEngine.updateNPCConsciousness, {
            worldId: args.worldId,
            npcId: evolution.npc_id,
            consciousness_update: {
              new_thoughts: evolution.cognitive_changes || [],
              emotional_changes: evolution.emotional_development || {},
              new_memories: evolution.memory_restructuring?.map((memory: string) => ({
                type: 'consciousness_evolution',
                content: memory,
                importance: 0.9,
              })) || [],
            },
          });
        }
      }    // Update world turn and state
    const world = await ctx.db.get(args.worldId);
    if (!world) return;

    await ctx.db.patch(args.worldId, {
      currentTurn: args.turnNumber,
      currentState: {
        ...world.currentState,
        year: (world.currentState?.year || 1) + (args.turnNumber % 4 === 0 ? 1 : 0),
        consciousness_level: "ultra_advanced",
        emergence_complexity: "maximum",
        systemic_integration: "complete",
      },
    });
  },
});

// ===== HELPER FUNCTIONS =====

function calculateAdvancedAnalytics(npcs: any[], environment: any): any {
  return {
    consciousness_metrics: {
      average_consciousness_level: npcs.reduce((sum, npc) => sum + (npc.intelligence || 50), 0) / npcs.length,
      emotional_stability: npcs.reduce((sum, npc) => sum + (100 - (npc.emotions?.stress || 0)), 0) / npcs.length,
      social_connectedness: npcs.reduce((sum, npc) => sum + Object.keys(npc.relationships || {}).length, 0) / npcs.length,
      goal_fulfillment: npcs.reduce((sum, npc) => {
        const goals = npc.current_goals || [];
        const avgProgress = goals.reduce((gSum: number, goal: any) => gSum + (goal.progress || 0), 0) / Math.max(goals.length, 1);
        return sum + avgProgress;
      }, 0) / npcs.length,
    },
    emergence_indicators: {
      innovation_events: 0, // Would count recent innovation events
      social_movements: 0,   // Would count emerging social phenomena
      cultural_shifts: 0,    // Would count cultural changes
      technological_breakthroughs: 0,
    },
    environmental_integration: {
      eco_awareness: 75, // Placeholder
      resource_efficiency: 60,
      pollution_concern: 80,
      sustainability_practices: 45,
    },
  };
}

function predictNextAction(npc: any): string {
  // Simple prediction based on highest priority goal
  if (!npc.current_goals || npc.current_goals.length === 0) return 'idle';
  
  const highestPriorityGoal = npc.current_goals.reduce((max: any, goal: any) => 
    (goal.priority || 0) > (max.priority || 0) ? goal : max
  );
  
  return `Work on: ${highestPriorityGoal.description}`;
}

function getClosestRelationships(relationships: any, type: string): any[] {
  if (!relationships) return [];
  
  return Object.values(relationships)
    .filter((rel: any) => rel.type === type)
    .sort((a: any, b: any) => (b.strength || 0) - (a.strength || 0))
    .slice(0, 3);
}

function generatePersonalitySummary(personality: any): string {
  if (!personality) return 'Balanced personality';
  
  const traits = [];
  if (personality.extraversion > 70) traits.push('very social');
  else if (personality.extraversion < 30) traits.push('introverted');
  
  if (personality.openness > 70) traits.push('highly creative');
  if (personality.conscientiousness > 70) traits.push('very organized');
  if (personality.agreeableness > 70) traits.push('very cooperative');
  if (personality.neuroticism > 70) traits.push('emotionally sensitive');
  
  return traits.length > 0 ? traits.join(', ') : 'balanced personality';
}

function analyzeLearningSstyle(npc: any): string {
  const curiosity = npc.curiosity_level || 50;
  const creativity = npc.personality?.creativity || 50;
  const social = npc.personality?.extraversion || 50;
  
  if (social > 70) return 'social learner';
  if (creativity > 70) return 'creative experimenter';
  if (curiosity > 70) return 'curious explorer';
  return 'balanced learner';
}

function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

// Fixed helper functions with proper types
function isNPCInRegion(npc: any, region: string): boolean {
  // Simple implementation - would need more sophisticated logic based on world geography
  return true;
}

function calculateEnvironmentalEmotionalImpact(event: any, npc: any): Record<string, number> {
  const impact: Record<string, number> = {};
  
  if (event.type === 'natural_disaster') {
    impact.stress = 20;
    impact.fear = 15;
  } else if (event.type === 'weather_change') {
    impact.stress = 5;
  }
  
  return impact;
}

// Fixed calculateGoalCompletionRate with proper typing
function calculateGoalCompletionRate(goals: any[]): number {
  if (!goals || goals.length === 0) return 0;
  const totalProgress = goals.reduce((sum: number, goal: any) => sum + (goal.progress || 0), 0);
  return totalProgress / goals.length;
}

// Fixed getMostUrgentNeed function
function getMostUrgentNeed(npc: any): string {
  const physicalNeeds = npc.physical_needs || {};
  const socialNeeds = npc.social_needs || {};
  
  const allNeeds = { ...physicalNeeds, ...socialNeeds };
  const needEntries = Object.entries(allNeeds);
  
  if (needEntries.length === 0) return 'none';
  
  return needEntries.reduce((max: any, current: any) => 
    (current[1] as number) > (max[1] as number) ? current : max
  )[0];
}

// Fixed getDominantEmotion function
function getDominantEmotion(emotions: any): string {
  if (!emotions) return 'neutral';
  const emotionEntries = Object.entries(emotions);
  if (emotionEntries.length === 0) return 'neutral';
  
  return emotionEntries.reduce((max: any, current: any) => 
    (current[1] as number) > (max[1] as number) ? current : max
  )[0];
}

// Additional placeholder helper functions
function analyzeSeasonalTrends(weatherSystem: any): any { return {}; }
function calculateExtremeWeatherRisk(weatherSystem: any): number { return 0.1; }
function calculateClimateStability(weatherSystem: any): number { return 85; }
function calculateHabitatQuality(ecosystem: any): number { return 75; }
function analyzePollutionImpact(ecosystem: any): any { return {}; }
function analyzeCarryingCapacity(ecosystem: any): any { return {}; }
function calculateResourceDepletionRates(ecosystem: any): any { return {}; }
function calculateRegenerationRates(ecosystem: any): any { return {}; }
function identifyResourceScarcity(ecosystem: any): any[] { return []; }
function calculateTemperatureTrend(weatherSystem: any): string { return 'stable'; }
function calculatePrecipitationTrend(weatherSystem: any): string { return 'normal'; }
function predictEcosystemChanges(ecosystem: any): any { return {}; }
function calculateHumanEnvironmentalImpact(environment: any): number { return 0.3; }
function calculateTotalRelationships(npcs: any[]): number { return npcs.length * 3; }
function calculateNetworkDensity(npcs: any[]): number { return 0.15; }
function calculateAverageConnections(npcs: any[]): number { return 4.2; }
function calculateClusteringCoefficient(npcs: any[]): number { return 0.31; }
function identifyFamilyClusters(npcs: any[]): any[] { return []; }
function identifyFriendNetworks(npcs: any[]): any[] { return []; }
function identifyProfessionalGroups(npcs: any[]): any[] { return []; }
function identifyRomanticPairs(npcs: any[]): any[] { return []; }
function countStrongRelationships(npcs: any[]): number { return 25; }
function countWeakRelationships(npcs: any[]): number { return 150; }
function countConflictingRelationships(npcs: any[]): number { return 8; }
function calculateRelationshipStability(npcs: any[]): number { return 0.78; }
function identifyInfluenceLeaders(npcs: any[]): any[] { return []; }
function identifySocialBridges(npcs: any[]): any[] { return []; }
function identifyIsolatedIndividuals(npcs: any[]): any[] { return []; }
function identifyEmergingAlliances(interactions: any[]): any[] { return []; }
function calculateInteractionFrequency(interactions: any[]): number { return 0.34; }
function analyzeCommunicationStyles(npcs: any[]): any { return {}; }
function analyzeInformationFlow(interactions: any[]): any { return {}; }
function analyzeSocialInfluenceSpread(interactions: any[]): any { return {}; }

// Export the functions for use elsewhere
export {
  generateId,
  isNPCInRegion,
  calculateEnvironmentalEmotionalImpact,
  calculateGoalCompletionRate,
  getMostUrgentNeed,
  getDominantEmotion,
  predictNextAction
};