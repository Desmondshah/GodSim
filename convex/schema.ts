// convex/schema.ts - Complete Ultra-Advanced Simulation Schema (FIXED)
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

const applicationTables = {
  // Enhanced worlds table with ultra-advanced simulation data
  worlds: defineTable({
    userId: v.id("users"),
    name: v.string(),
    setupAnswers: v.object({
      worldType: v.string(),
      supremeBeing: v.object({
        name: v.string(),
        type: v.string(),
        purpose: v.string(),
      }),
      creationRules: v.object({
        time: v.string(),
        death: v.string(),
        nature: v.string(),
        morality: v.string(),
      }),
      inhabitants: v.string(),
      simulationSpeed: v.string(),
    }),
    
    // Legacy region system (maintained for backward compatibility)
    regions: v.array(v.object({
      id: v.optional(v.string()),
      name: v.string(),
      geography: v.string(),
      resources: v.union(
        v.array(v.string()), 
        v.object({}),
        v.record(v.string(), v.number())
      ),
      climate_modifier: v.optional(v.number()),
      strategic_value: v.optional(v.number()),
      natural_defenses: v.optional(v.number()),
      trade_accessibility: v.optional(v.number()),
    })),
    
    // Legacy faction system (maintained for backward compatibility)
    factions: v.array(v.object({
      id: v.optional(v.string()),
      name: v.string(),
      type: v.string(),
      alignment: v.string(),
      beliefs: v.string(),
      leadership: v.string(),
      strength: v.number(),
      population: v.union(v.number(), v.object({
        total: v.number(),
        demographics: v.optional(v.record(v.string(), v.number())),
      })),
      home_region: v.optional(v.string()),
      economy: v.optional(v.object({
        wealth: v.optional(v.number()),
        primary_industries: v.optional(v.array(v.string())),
        trade_routes: v.optional(v.array(v.string())),
        economic_focus: v.optional(v.string()),
      })),
      military: v.optional(v.object({
        army_size: v.optional(v.number()),
        weapon_tech: v.optional(v.number()),
        fortifications: v.optional(v.number()),
        military_doctrine: v.optional(v.string()),
      })),
      technology: v.optional(v.object({
        level: v.optional(v.number()),
        research_focus: v.optional(v.string()),
        known_technologies: v.optional(v.array(v.string())),
        innovation_rate: v.optional(v.number()),
      })),
      culture: v.optional(v.object({
        core_values: v.optional(v.array(v.string())),
        traditions: v.optional(v.array(v.string())),
        adaptability: v.optional(v.number()),
        cultural_influence: v.optional(v.number()),
      })),
      diplomacy: v.optional(v.object({
        default_stance: v.optional(v.string()),
        key_relationships: v.optional(v.record(v.string(), v.number())),
        diplomatic_goals: v.optional(v.array(v.string())),
      })),
      stability: v.optional(v.object({
        internal_happiness: v.optional(v.number()),
        loyalty_to_leadership: v.optional(v.number()),
        succession_stability: v.optional(v.number()),
        potential_issues: v.optional(v.array(v.string())),
      })),
    })),
    
    beliefSystems: v.array(v.string()),
    
    // Add environment field to fix TypeScript errors
    environment: v.optional(v.object({
      climate: v.optional(v.object({
        baseTemperature: v.optional(v.number()),
        seasonalVariation: v.optional(v.number()),
        rainfall: v.optional(v.number()),
        extremeWeatherFrequency: v.optional(v.number()),
      })),
      resources: v.optional(v.object({
        renewable: v.optional(v.record(v.string(), v.number())),
        nonRenewable: v.optional(v.record(v.string(), v.number())),
        magical: v.optional(v.record(v.string(), v.number())),
      })),
      ecology: v.optional(v.object({
        biodiversity: v.optional(v.number()),
        carrying_capacity: v.optional(v.number()),
        natural_hazards: v.optional(v.array(v.string())),
      })),
    })),
    
    // Add other missing fields
    globalSystems: v.optional(v.any()),
    technologyTree: v.optional(v.any()),
    
    // Advanced simulation state
    currentState: v.object({
      year: v.number(),
      season: v.string(),
      weather: v.string(),
      balanceOfPower: v.string(),
      majorEvents: v.array(v.string()),
      consciousness_level: v.optional(v.string()),
      emergence_complexity: v.optional(v.string()),
      systemic_integration: v.optional(v.string()),
      globalMood: v.optional(v.string()),
      technologicalEra: v.optional(v.string()),
      culturalAge: v.optional(v.string()),
      emergingTrends: v.optional(v.array(v.object({
        trend_name: v.string(),
        description: v.string(),
        potential_outcomes: v.array(v.string()),
        time_to_impact: v.number(),
        confidence_level: v.optional(v.number()),
      }))),
    }),
    
    // Simulation configuration
    simulation_config: v.optional(v.object({
      npc_consciousness_enabled: v.boolean(),
      environmental_simulation_depth: v.union(v.literal("basic"), v.literal("advanced"), v.literal("ultra")),
      ai_personality_models: v.array(v.string()),
      emergence_tracking: v.boolean(),
      real_time_updates: v.boolean(),
      simulation_speed_multiplier: v.number(),
      memory_depth: v.union(v.literal("shallow"), v.literal("normal"), v.literal("deep")),
      relationship_complexity: v.union(v.literal("simple"), v.literal("complex"), v.literal("ultra")),
      genetic_simulation: v.boolean(),
      cultural_evolution_enabled: v.boolean(),
      economic_modeling_depth: v.union(v.literal("basic"), v.literal("advanced"), v.literal("comprehensive")),
    })),
    
    isSetupComplete: v.boolean(),
    currentTurn: v.number(),
  }).index("by_user", ["userId"]),

  // Advanced NPCs with full consciousness simulation
  advancedNPCs: defineTable({
    worldId: v.id("worlds"),
    npc_id: v.string(),
    
    // Core Identity
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
      attractiveness: v.number(),
      fitness_level: v.number(),
    }),
    
    // Personality (Big Five + extended traits)
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
      humor: v.number(),
      loyalty: v.number(),
      stubbornness: v.number(),
      optimism: v.number(),
      honesty: v.number(),
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
      jealousy: v.number(),
      guilt: v.number(),
      shame: v.number(),
      disgust: v.number(),
      surprise: v.number(),
      anxiety: v.number(), // Add missing anxiety property
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
      shelter: v.number(),
      safety: v.number(),
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
      recognition: v.number(),
      intimacy: v.number(),
    }),
    
    // Cognitive Systems
    intelligence: v.number(),
    wisdom: v.number(),
    memory_capacity: v.number(),
    attention_span: v.number(),
    processing_speed: v.number(),
    creativity_level: v.number(),
    emotional_intelligence: v.number(),
    spatial_intelligence: v.number(),
    logical_reasoning: v.number(),
    pattern_recognition: v.number(),
    
    // Advanced Memory System
    memories: v.array(v.object({
      id: v.string(),
      timestamp: v.number(),
      type: v.union(
        v.literal("interaction"), v.literal("event"), v.literal("observation"), 
        v.literal("emotion"), v.literal("goal"), v.literal("relationship"),
        v.literal("learning"), v.literal("trauma"), v.literal("achievement"),
        v.literal("failure"), v.literal("discovery")
      ),
      content: v.string(),
      participants: v.array(v.string()),
      location: v.object({ x: v.number(), y: v.number(), z: v.number() }),
      emotionalImpact: v.number(),
      importance: v.number(),
      decayRate: v.number(),
      associatedEmotions: v.array(v.string()),
      contextualDetails: v.record(v.string(), v.any()),
      sensoryData: v.optional(v.object({
        visual: v.optional(v.string()),
        auditory: v.optional(v.string()),
        olfactory: v.optional(v.string()),
        tactile: v.optional(v.string()),
      })),
    })),
    working_memory: v.array(v.string()),
    long_term_memory: v.array(v.string()),
    episodic_memory: v.array(v.string()),
    semantic_memory: v.array(v.string()),
    procedural_memory: v.record(v.string(), v.any()),
    
    // Skills and Abilities
    skills: v.record(v.string(), v.object({
      level: v.number(),
      experience: v.number(),
      talent: v.number(),
      last_used: v.number(),
      decay_rate: v.number(),
      learning_efficiency: v.number(),
      teaching_ability: v.number(),
    })),
    talents: v.array(v.string()),
    specializations: v.array(v.string()),
    
    // Goals and Motivations
    current_goals: v.array(v.object({
      id: v.string(),
      type: v.union(
        v.literal("survival"), v.literal("social"), v.literal("achievement"), 
        v.literal("creative"), v.literal("spiritual"), v.literal("romantic"), 
        v.literal("family"), v.literal("career"), v.literal("knowledge"),
        v.literal("power"), v.literal("wealth"), v.literal("legacy")
      ),
      description: v.string(),
      priority: v.number(),
      urgency: v.number(),
      progress: v.number(),
      target_npc: v.optional(v.string()),
      target_location: v.optional(v.object({ x: v.number(), y: v.number(), z: v.number() })),
      target_object: v.optional(v.string()),
      deadline: v.optional(v.number()),
      sub_goals: v.array(v.string()),
      emotional_investment: v.number(),
      created_at: v.number(),
      last_progress: v.number(),
      obstacles: v.array(v.string()),
      resources_needed: v.array(v.string()),
    })),
    life_goals: v.array(v.string()),
    npc_values: v.record(v.string(), v.number()), // Renamed from 'values' to avoid duplicate
    
    // Relationships
    relationships: v.record(v.string(), v.object({
      npc_id: v.string(),
      type: v.union(
        v.literal("family"), v.literal("friend"), v.literal("romantic"), 
        v.literal("enemy"), v.literal("acquaintance"), v.literal("mentor"), 
        v.literal("rival"), v.literal("colleague"), v.literal("subordinate"),
        v.literal("superior"), v.literal("neighbor")
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
      emotional_history: v.array(v.object({
        emotion: v.string(),
        intensity: v.number(),
        timestamp: v.number(),
        context: v.string(),
      })),
      secrets_shared: v.array(v.string()),
      conflicts: v.array(v.string()),
      positive_memories: v.array(v.string()),
      negative_memories: v.array(v.string()),
    })),
    
    // Family and Lineage
    family: v.object({
      parents: v.array(v.string()),
      siblings: v.array(v.string()),
      children: v.array(v.string()),
      spouse: v.optional(v.string()),
      extended_family: v.array(v.string()),
      family_history: v.array(v.string()),
      inheritance: v.record(v.string(), v.any()),
    }),
    
    // Economic System
    possessions: v.record(v.string(), v.number()),
    wealth: v.number(),
    income_sources: v.array(v.string()),
    expenses: v.record(v.string(), v.number()),
    economic_status: v.union(
      v.literal("destitute"), v.literal("poor"), v.literal("working"), 
      v.literal("middle"), v.literal("upper"), v.literal("elite")
    ),
    occupation: v.optional(v.string()),
    work_satisfaction: v.number(),
    career_aspirations: v.array(v.string()),
    
    // Cultural System
    culture: v.string(),
    languages: v.array(v.string()),
    beliefs: v.record(v.string(), v.number()),
    cultural_values: v.record(v.string(), v.number()), // Renamed to avoid duplicate
    traditions: v.array(v.string()),
    customs: v.array(v.string()),
    cultural_identity_strength: v.number(),
    acculturation_level: v.number(),
    
    // Health System
    diseases: v.array(v.string()),
    injuries: v.array(v.object({
      location: v.string(),
      severity: v.number(),
      healing_rate: v.number(),
      timestamp: v.number(),
      cause: v.string(),
    })),
    genetic_traits: v.array(v.string()),
    immune_system: v.number(),
    life_expectancy: v.number(),
    fertility: v.number(),
    mental_health: v.object({
      stability: v.number(),
      resilience: v.number(),
      trauma_level: v.number(),
      coping_mechanisms: v.array(v.string()),
    }),
    
    // Behavioral State
    current_activity: v.string(),
    activity_start_time: v.number(),
    activity_location: v.object({ x: v.number(), y: v.number(), z: v.number() }),
    current_emotion_state: v.string(),
    stress_level: v.number(),
    energy_level: v.number(),
    motivation_level: v.number(),
    daily_routine: v.array(v.object({
      activity: v.string(),
      start_time: v.number(),
      duration: v.number(),
      priority: v.number(),
    })),
    
    // Decision Making
    decision_making_style: v.union(
      v.literal("analytical"), v.literal("intuitive"), v.literal("emotional"), 
      v.literal("social"), v.literal("random"), v.literal("authoritarian"),
      v.literal("democratic"), v.literal("impulsive")
    ),
    risk_assessment_bias: v.number(),
    time_preference: v.number(),
    decision_history: v.array(v.object({
      decision: v.string(),
      timestamp: v.number(),
      outcome: v.string(),
      satisfaction: v.number(),
    })),
    
    // Communication
    communication_style: v.union(
      v.literal("direct"), v.literal("diplomatic"), v.literal("aggressive"), 
      v.literal("passive"), v.literal("manipulative"), v.literal("charismatic"),
      v.literal("analytical"), v.literal("storytelling")
    ),
    language_skills: v.record(v.string(), v.number()),
    vocabulary_size: v.number(),
    storytelling_ability: v.number(),
    persuasion_skill: v.number(),
    deception_ability: v.number(),
    
    // Learning System
    learning_rate: v.number(),
    curiosity_level: v.number(),
    teaching_ability: v.number(),
    knowledge_domains: v.record(v.string(), v.number()),
    learning_preferences: v.array(v.string()),
    knowledge_sharing: v.number(),
    
    // Life History and Experience
    major_life_events: v.array(v.object({
      event: v.string(),
      timestamp: v.number(),
      impact: v.number(),
      emotional_response: v.string(),
      lasting_effects: v.array(v.string()),
    })),
    formative_experiences: v.array(v.string()),
    achievements: v.array(v.string()),
    failures: v.array(v.string()),
    regrets: v.array(v.string()),
    
    // Environmental Adaptation
    climate_adaptation: v.record(v.string(), v.number()),
    terrain_familiarity: v.record(v.string(), v.number()),
    environmental_preferences: v.object({
      temperature: v.number(),
      humidity: v.number(),
      light_level: v.number(),
      noise_level: v.number(),
      crowd_density: v.number(),
      natural_vs_urban: v.number(),
    }),
    
    // Circadian Rhythms and Biology
    sleep_schedule: v.object({
      preferred_sleep_time: v.number(),
      preferred_wake_time: v.number(),
      sleep_duration_need: v.number(),
      chronotype: v.union(v.literal("early"), v.literal("normal"), v.literal("late")),
      sleep_quality: v.number(),
    }),
    
    // Reproduction and Relationships
    reproductive_drive: v.number(),
    parental_instinct: v.number(),
    mate_preferences: v.record(v.string(), v.number()),
    offspring: v.array(v.string()),
    parents: v.array(v.string()),
    romantic_history: v.array(v.string()),
    
    // Aging System
    aging_rate: v.number(),
    maturity_level: v.number(),
    life_stage: v.union(
      v.literal("infant"), v.literal("child"), v.literal("adolescent"), 
      v.literal("young_adult"), v.literal("adult"), v.literal("middle_aged"), v.literal("elder")
    ),
    wisdom_accumulation: v.number(),
    
    // Spiritual and Philosophical System
    spirituality_level: v.number(),
    religious_beliefs: v.array(v.string()),
    spiritual_practices: v.array(v.string()),
    divine_connection: v.number(),
    philosophical_outlook: v.string(),
    meaning_of_life: v.string(),
    
    // Advanced AI Consciousness Modeling
    consciousness_level: v.number(),
    self_awareness: v.number(),
    theory_of_mind: v.number(),
    metacognition: v.number(),
    abstract_thinking: v.number(),
    moral_reasoning: v.number(),
    
    // Social and Political Engagement
    political_views: v.record(v.string(), v.number()),
    leadership_potential: v.number(),
    social_influence: v.number(),
    group_memberships: v.array(v.string()),
    reputation: v.record(v.string(), v.number()),
    
    // Meta-Systems
    last_update: v.number(),
    update_frequency: v.number(),
    simulation_priority: v.number(),
    ai_personality_model: v.string(),
    complexity_level: v.union(v.literal("basic"), v.literal("intermediate"), v.literal("advanced"), v.literal("ultra")),
  }).index("by_world", ["worldId"]).index("by_npc_id", ["npc_id"]),

  // Enhanced Environmental Systems
  environmentalSystems: defineTable({
    worldId: v.id("worlds"),
    
    // Advanced Weather System
    weather_system: v.object({
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
        air_quality: v.number(),
        pollen_count: v.number(),
      }),
      weather_patterns: v.object({
        pressure_systems: v.array(v.object({
          type: v.union(v.literal("high"), v.literal("low")),
          position: v.object({ x: v.number(), y: v.number(), z: v.number() }),
          strength: v.number(),
          movement_vector: v.object({ x: v.number(), y: v.number(), z: v.number() }),
          formation_time: v.number(),
          predicted_dissolution: v.number(),
        })),
        fronts: v.array(v.object({
          type: v.union(v.literal("cold"), v.literal("warm"), v.literal("occluded")),
          position: v.array(v.object({ x: v.number(), y: v.number(), z: v.number() })),
          intensity: v.number(),
          speed: v.number(),
          expected_duration: v.number(),
        })),
        storm_systems: v.array(v.object({
          type: v.union(v.literal("thunderstorm"), v.literal("hurricane"), v.literal("tornado"), v.literal("blizzard")),
          intensity: v.number(),
          path: v.array(v.object({ x: v.number(), y: v.number(), z: v.number() })),
          formation_time: v.number(),
          predicted_landfall: v.optional(v.number()),
        })),
      }),
      climate_zones: v.array(v.object({
        region: v.string(),
        base_temperature: v.number(),
        temperature_variation: v.number(),
        rainfall_pattern: v.array(v.number()),
        seasonal_multipliers: v.array(v.number()),
        climate_type: v.string(),
        extreme_weather_frequency: v.number(),
      })),
      seasonal_cycle: v.object({
        current_season: v.union(v.literal("spring"), v.literal("summer"), v.literal("autumn"), v.literal("winter")),
        season_progress: v.number(),
        day_length: v.number(),
        solar_intensity: v.number(),
        seasonal_effects: v.record(v.string(), v.number()),
      }),
      climate_change: v.object({
        warming_trend: v.number(),
        precipitation_change: v.number(),
        extreme_weather_increase: v.number(),
        sea_level_change: v.number(),
      }),
    }),
    
    // Advanced Ecosystem
    ecosystem: v.object({
      grid_size: v.object({ width: v.number(), height: v.number(), depth: v.number() }),
      biome_distribution: v.record(v.string(), v.number()),
      species_count: v.object({
        flora: v.number(),
        fauna: v.number(),
        microorganisms: v.number(),
      }),
      resource_abundance: v.record(v.string(), v.number()),
      pollution_levels: v.object({
        air: v.number(),
        water: v.number(),
        soil: v.number(),
        noise: v.number(),
        light: v.number(),
        chemical: v.number(),
      }),
      biodiversity_index: v.number(),
      carrying_capacity: v.record(v.string(), v.number()),
      ecological_interactions: v.array(v.object({
        type: v.union(
          v.literal("predation"), v.literal("competition"), v.literal("symbiosis"), 
          v.literal("parasitism"), v.literal("mutualism"), v.literal("commensalism")
        ),
        species_a: v.string(),
        species_b: v.string(),
        strength: v.number(),
        stability: v.number(),
      })),
      food_webs: v.array(v.object({
        ecosystem_name: v.string(),
        trophic_levels: v.array(v.array(v.string())),
        energy_flow: v.record(v.string(), v.number()),
      })),
      migration_patterns: v.array(v.object({
        species: v.string(),
        route: v.array(v.object({ x: v.number(), y: v.number(), z: v.number() })),
        seasonal_timing: v.string(),
        population_involved: v.number(),
      })),
    }),
    
    // Enhanced Time System
    time_system: v.object({
      current_time: v.number(),
      time_scale: v.number(),
      calendar: v.object({
        year: v.number(),
        month: v.number(),
        day: v.number(),
        hour: v.number(),
        minute: v.number(),
        second: v.number(),
        day_of_week: v.number(),
        day_of_year: v.number(),
      }),
      celestial_bodies: v.array(v.object({
        name: v.string(),
        position: v.object({ x: v.number(), y: v.number(), z: v.number() }),
        orbital_period: v.number(),
        influence_on_tides: v.number(),
        influence_on_behavior: v.number(),
        visibility: v.number(),
        phase: v.optional(v.string()),
      })),
      temporal_anomalies: v.array(v.object({
        type: v.string(),
        location: v.object({ x: v.number(), y: v.number(), z: v.number() }),
        intensity: v.number(),
        duration: v.number(),
        effects: v.array(v.string()),
      })),
    }),
    
    last_update: v.number(),
  }).index("by_world", ["worldId"]),

  // Enhanced NPC Interactions
  npcInteractions: defineTable({
    worldId: v.id("worlds"),
    participants: v.array(v.string()),
    type: v.string(),
    location: v.object({ x: v.number(), y: v.number(), z: v.number() }),
    description: v.string(),
    emotional_impact: v.record(v.string(), v.number()),
    relationship_changes: v.record(v.string(), v.record(v.string(), v.number())),
    memory_significance: v.number(),
    duration: v.number(),
    timestamp: v.number(),
    
    // Advanced interaction data
    conversation_content: v.optional(v.array(v.object({
      speaker: v.string(),
      content: v.string(),
      emotional_tone: v.string(),
      timestamp: v.number(),
      intent: v.optional(v.string()),
      subtext: v.optional(v.string()),
    }))),
    interaction_outcome: v.optional(v.string()),
    skills_used: v.optional(v.array(v.string())),
    knowledge_exchanged: v.optional(v.array(v.string())),
    trust_changes: v.optional(v.record(v.string(), v.number())),
    influence_network_effects: v.optional(v.array(v.string())),
    secrets_revealed: v.optional(v.array(v.string())),
    conflicts_resolved: v.optional(v.array(v.string())),
    new_goals_formed: v.optional(v.array(v.string())),
    
    // Social dynamics
    group_dynamics: v.optional(v.object({
      power_shifts: v.record(v.string(), v.number()),
      alliance_changes: v.array(v.string()),
      status_changes: v.record(v.string(), v.number()),
    })),
    
    // Economic effects
    economic_impact: v.optional(v.object({
      resource_exchange: v.record(v.string(), v.number()),
      wealth_transfer: v.record(v.string(), v.number()),
      trade_agreements: v.array(v.string()),
    })),
  }).index("by_world", ["worldId"]).index("by_timestamp", ["timestamp"]),

  // Genetic and Heredity System
  geneticProfiles: defineTable({
    worldId: v.id("worlds"),
    npc_id: v.string(),
    
    // Genetic makeup
    chromosomes: v.array(v.object({
      chromosome_id: v.string(),
      genes: v.array(v.object({
        gene_id: v.string(),
        alleles: v.array(v.string()),
        expression_level: v.number(),
        dominance: v.union(v.literal("dominant"), v.literal("recessive"), v.literal("codominant")),
        effects: v.record(v.string(), v.number()),
      })),
    })),
    
    // Inherited traits
    physical_traits: v.record(v.string(), v.object({
      value: v.any(),
      inheritance_pattern: v.string(),
      parent_source: v.array(v.string()),
    })),
    
    mental_traits: v.record(v.string(), v.object({
      value: v.number(),
      genetic_component: v.number(),
      environmental_component: v.number(),
    })),
    
    // Health predispositions
    disease_susceptibility: v.record(v.string(), v.number()),
    resistance_factors: v.record(v.string(), v.number()),
    
    // Mutation tracking
    mutations: v.array(v.object({
      mutation_id: v.string(),
      gene_affected: v.string(),
      mutation_type: v.string(),
      effect_magnitude: v.number(),
      generation_occurred: v.number(),
    })),
    
    // Family lineage
    lineage: v.object({
      generation: v.number(),
      ancestors: v.array(v.string()),
      genetic_diversity_score: v.number(),
    }),
  }).index("by_world", ["worldId"]).index("by_npc", ["npc_id"]),

  // Cultural Evolution System
  culturalSystems: defineTable({
    worldId: v.id("worlds"),
    culture_name: v.string(),
    
    // Cultural Attributes
    core_values: v.record(v.string(), v.number()),
    traditions: v.array(v.object({
      name: v.string(),
      description: v.string(),
      importance: v.number(),
      participants: v.array(v.string()),
      frequency: v.string(),
      origin_story: v.string(),
      evolution_timeline: v.array(v.object({
        change: v.string(),
        timestamp: v.number(),
        catalyst: v.string(),
      })),
    })),
    
    language_evolution: v.object({
      vocabulary_size: v.number(),
      grammar_complexity: v.number(),
      new_words: v.array(v.object({
        word: v.string(),
        meaning: v.string(),
        origin: v.string(),
        usage_frequency: v.number(),
        cultural_significance: v.number(),
      })),
      dialects: v.array(v.string()),
      linguistic_diversity: v.number(),
    }),
    
    // Social Structures
    social_hierarchies: v.array(v.object({
      name: v.string(),
      levels: v.array(v.string()),
      mobility: v.number(),
      determining_factors: v.array(v.string()),
      stability: v.number(),
    })),
    
    institutions: v.array(v.object({
      name: v.string(),
      type: v.string(),
      influence: v.number(),
      members: v.array(v.string()),
      purpose: v.string(),
      effectiveness: v.number(),
      public_trust: v.number(),
    })),
    
    // Knowledge Systems
    collective_knowledge: v.record(v.string(), v.object({
      domain: v.string(),
      level: v.number(),
      keepers: v.array(v.string()),
      transmission_method: v.string(),
      preservation_status: v.number(),
    })),
    
    innovations: v.array(v.object({
      name: v.string(),
      description: v.string(),
      inventor: v.string(),
      adoption_rate: v.number(),
      impact_areas: v.array(v.string()),
      timestamp: v.number(),
      prerequisites: v.array(v.string()),
    })),
    
    // Art and Expression
    artistic_traditions: v.array(v.object({
      art_form: v.string(),
      style_characteristics: v.array(v.string()),
      cultural_significance: v.number(),
      practitioners: v.array(v.string()),
      evolution_stage: v.string(),
    })),
    
    // Cultural Evolution Metrics
    cultural_cohesion: v.number(),
    adaptation_rate: v.number(),
    innovation_frequency: v.number(),
    tradition_preservation: v.number(),
    external_influence_resistance: v.number(),
    internal_conflict_level: v.number(),
    
    last_update: v.number(),
  }).index("by_world", ["worldId"]),

  // Advanced Economic Systems
  economicSystems: defineTable({
    worldId: v.id("worlds"),
    
    // Economic Structure
    economy_type: v.union(
      v.literal("barter"), v.literal("currency"), v.literal("mixed"), 
      v.literal("gift"), v.literal("command"), v.literal("market"), v.literal("planned")
    ),
    
    currency_system: v.optional(v.object({
      name: v.string(),
      stability: v.number(),
      inflation_rate: v.number(),
      backed_by: v.string(),
      exchange_rates: v.record(v.string(), v.number()),
      monetary_policy: v.string(),
    })),
    
    // Markets and Trade
    markets: v.array(v.object({
      name: v.string(),
      location: v.object({ x: v.number(), y: v.number(), z: v.number() }),
      goods_traded: v.array(v.string()),
      trading_volume: v.number(),
      price_volatility: v.number(),
      participants: v.array(v.string()),
      market_efficiency: v.number(),
      regulation_level: v.number(),
    })),
    
    trade_routes: v.array(v.object({
      name: v.string(),
      start_location: v.object({ x: v.number(), y: v.number(), z: v.number() }),
      end_location: v.object({ x: v.number(), y: v.number(), z: v.number() }),
      goods: v.array(v.string()),
      risk_level: v.number(),
      profitability: v.number(),
      usage_frequency: v.number(),
      security_level: v.number(),
      infrastructure_quality: v.number(),
    })),
    
    // Resource Economics
    resource_markets: v.record(v.string(), v.object({
      current_price: v.number(),
      supply: v.number(),
      demand: v.number(),
      price_history: v.array(v.object({
        timestamp: v.number(),
        price: v.number(),
        volume: v.number(),
      })),
      major_suppliers: v.array(v.string()),
      major_consumers: v.array(v.string()),
      market_share: v.record(v.string(), v.number()),
      seasonal_variations: v.array(v.number()),
    })),
    
    // Economic Indicators
    economic_health: v.object({
      gdp_equivalent: v.number(),
      unemployment_rate: v.number(),
      wealth_inequality: v.number(),
      economic_growth_rate: v.number(),
      trade_balance: v.number(),
      productivity_index: v.number(),
      innovation_index: v.number(),
    }),
    
    // Labor and Production
    industries: v.array(v.object({
      name: v.string(),
      type: v.string(),
      productivity: v.number(),
      workers: v.array(v.string()),
      output: v.record(v.string(), v.number()),
      technology_level: v.number(),
      safety_standards: v.number(),
      environmental_impact: v.number(),
      growth_potential: v.number(),
    })),
    
    // Economic Policies
    economic_policies: v.array(v.object({
      policy_name: v.string(),
      type: v.string(),
      implementation_date: v.number(),
      effectiveness: v.number(),
      public_support: v.number(),
      economic_impact: v.record(v.string(), v.number()),
    })),
    
    last_update: v.number(),
  }).index("by_world", ["worldId"]),

  // Advanced Political Systems
  politicalSystems: defineTable({
    worldId: v.id("worlds"),
    
    // Government Structure
    government_type: v.union(
      v.literal("democracy"), v.literal("autocracy"), v.literal("oligarchy"),
      v.literal("theocracy"), v.literal("technocracy"), v.literal("anarchy"),
      v.literal("confederation"), v.literal("federal"), v.literal("tribal")
    ),
    
    political_parties: v.array(v.object({
      name: v.string(),
      ideology: v.string(),
      leader: v.string(),
      members: v.array(v.string()),
      support_base: v.record(v.string(), v.number()),
      policy_positions: v.record(v.string(), v.number()),
      electoral_success: v.number(),
      corruption_level: v.number(),
    })),
    
    government_officials: v.array(v.object({
      npc_id: v.string(),
      position: v.string(),
      authority_level: v.number(),
      popularity: v.number(),
      competence: v.number(),
      corruption_level: v.number(),
      term_start: v.number(),
      term_length: v.optional(v.number()),
    })),
    
    // Laws and Regulations
    legal_system: v.object({
      law_enforcement_effectiveness: v.number(),
      judicial_independence: v.number(),
      legal_equality: v.number(),
      punishment_severity: v.number(),
      rehabilitation_focus: v.number(),
    }),
    
    laws: v.array(v.object({
      law_name: v.string(),
      description: v.string(),
      enacted_date: v.number(),
      enforcement_level: v.number(),
      public_support: v.number(),
      violations: v.number(),
      penalties: v.array(v.string()),
    })),
    
    // Political Events
    political_events: v.array(v.object({
      event_type: v.string(),
      description: v.string(),
      timestamp: v.number(),
      participants: v.array(v.string()),
      outcome: v.string(),
      public_reaction: v.number(),
      lasting_impact: v.array(v.string()),
    })),
    
    // Diplomatic Relations
    diplomatic_relations: v.record(v.string(), v.object({
      relationship_status: v.string(),
      trust_level: v.number(),
      trade_agreements: v.array(v.string()),
      military_alliances: v.array(v.string()),
      border_disputes: v.array(v.string()),
      diplomatic_incidents: v.array(v.string()),
    })),
    
    last_update: v.number(),
  }).index("by_world", ["worldId"]),

  // Enhanced Game Events with Ultra-Advanced Features
  gameEvents: defineTable({
    worldId: v.id("worlds"),
    turnNumber: v.number(),
    eventType: v.string(),
    
    // Multi-format narrative support
    narrative: v.union(
      v.string(), // legacy format
      v.object({
        title: v.optional(v.string()),
        opening: v.string(),
        current_situation: v.optional(v.string()),
        stakes: v.optional(v.string()),
        divine_perspective: v.optional(v.string()),
        consciousness_details: v.optional(v.array(v.object({
          npc_name: v.string(),
          internal_monologue: v.string(),
          emotional_reasoning: v.string(),
          memory_influences: v.string(),
          relationship_considerations: v.string(),
          goal_conflicts: v.string(),
          decision_process: v.string(),
        }))),
        environmental_consciousness: v.optional(v.string()),
        social_emergence: v.optional(v.string()),
        systemic_complexity: v.optional(v.string()),
        cultural_implications: v.optional(v.string()),
        economic_ramifications: v.optional(v.string()),
      })
    ),
    
    playerAction: v.optional(v.string()),
    
    // Enhanced choices with consciousness mechanics
    choices: v.optional(v.array(v.object({
      id: v.string(),
      text: v.string(),
      icon: v.string(),
      divine_cost: v.optional(v.number()),
      immediate_effects: v.optional(v.array(v.string())),
      long_term_consequences: v.optional(v.array(v.string())),
      affected_factions: v.optional(v.array(v.string())),
      affected_npcs: v.optional(v.array(v.string())),
      consciousness_mechanics: v.optional(v.object({
        thought_insertion: v.optional(v.array(v.string())),
        emotion_modulation: v.optional(v.record(v.string(), v.record(v.string(), v.number()))),
        memory_manipulation: v.optional(v.array(v.string())),
        goal_influences: v.optional(v.array(v.string())),
        relationship_effects: v.optional(v.array(v.string())),
        personality_shifts: v.optional(v.record(v.string(), v.record(v.string(), v.number()))),
      })),
      emergence_potential: v.optional(v.string()),
      systemic_ripples: v.optional(v.string()),
      moral_complexity: v.optional(v.number()),
      unintended_consequences: v.optional(v.array(v.string())),
    }))),
    
    // Enhanced world state changes
    worldStateChanges: v.object({
      // Legacy format (maintained for backward compatibility)
      factionChanges: v.optional(v.array(v.object({
        factionName: v.string(),
        changes: v.string(),
      }))),
      environmentChanges: v.optional(v.string()),
      newEvents: v.optional(v.array(v.string())),
      
      // Advanced consciousness evolution
      consciousness_evolution: v.optional(v.array(v.object({
        npc_id: v.string(),
        cognitive_changes: v.optional(v.array(v.string())),
        emotional_development: v.optional(v.record(v.string(), v.string())),
        memory_restructuring: v.optional(v.array(v.string())),
        personality_drift: v.optional(v.record(v.string(), v.string())),
        learning_acceleration: v.optional(v.array(v.string())),
        relationship_recalibration: v.optional(v.record(v.string(), v.string())),
        value_system_changes: v.optional(v.record(v.string(), v.number())),
        consciousness_level_change: v.optional(v.number()),
      }))),
      
      // Emergent social phenomena
      emergent_social_phenomena: v.optional(v.array(v.object({
        phenomenon: v.string(),
        participants: v.array(v.string()),
        consciousness_drivers: v.array(v.string()),
        emergence_mechanism: v.string(),
        evolution_trajectory: v.string(),
        stability_factors: v.array(v.string()),
        cultural_impact: v.number(),
        spread_potential: v.number(),
      }))),
      
      // Environmental consciousness shifts
      environmental_consciousness_shifts: v.optional(v.object({
        ecosystem_awareness: v.optional(v.string()),
        resource_consciousness: v.optional(v.string()),
        weather_adaptation: v.optional(v.string()),
        spatial_relationship_evolution: v.optional(v.string()),
        sustainability_practices: v.optional(v.string()),
      })),
      
      // Complex feedback loops
      complex_feedback_loops: v.optional(v.array(v.object({
        loop_name: v.string(),
        consciousness_components: v.array(v.string()),
        social_amplification: v.string(),
        environmental_integration: v.string(),
        temporal_dynamics: v.string(),
        tipping_points: v.array(v.string()),
        intervention_opportunities: v.array(v.string()),
        stability_analysis: v.string(),
      }))),
      
      // Technology and culture emergence
      technological_consciousness_emergence: v.optional(v.object({
        innovation_through_interaction: v.optional(v.string()),
        collective_problem_solving: v.optional(v.string()),
        knowledge_synthesis: v.optional(v.string()),
        skill_emergence: v.optional(v.string()),
        technological_leaps: v.optional(v.array(v.string())),
      })),
      
      cultural_consciousness_evolution: v.optional(v.object({
        belief_system_emergence: v.optional(v.string()),
        ritual_spontaneous_generation: v.optional(v.string()),
        language_evolution: v.optional(v.string()),
        value_system_shifts: v.optional(v.string()),
        artistic_breakthroughs: v.optional(v.array(v.string())),
      })),
      
      // Economic and political changes
      economic_consciousness_shifts: v.optional(v.object({
        market_behavior_evolution: v.optional(v.string()),
        trade_relationship_changes: v.optional(v.string()),
        resource_valuation_shifts: v.optional(v.string()),
        economic_innovation: v.optional(v.array(v.string())),
      })),
      
      political_consciousness_evolution: v.optional(v.object({
        governance_model_changes: v.optional(v.string()),
        leadership_emergence: v.optional(v.string()),
        civic_engagement_shifts: v.optional(v.string()),
        law_evolution: v.optional(v.array(v.string())),
      })),

      // Additional comprehensive simulation fields
      emerging_trends: v.optional(v.array(v.object({
        trend_name: v.string(),
        description: v.string(),
        potential_outcomes: v.array(v.string()),
        time_to_impact: v.number(),
        affected_regions: v.optional(v.array(v.string())),
        affected_factions: v.optional(v.array(v.string())),
        likelihood: v.optional(v.number()),
      }))),

      environmental_shifts: v.optional(v.object({
        climate_effects: v.optional(v.object({
          temperature: v.number(),
          rainfall: v.number(),
          humidity: v.optional(v.number()),
          wind_patterns: v.optional(v.string()),
        })),
        ecological_impact: v.optional(v.number()),
        resource_changes: v.optional(v.record(v.string(), v.number())),
        biodiversity_effects: v.optional(v.object({
          species_affected: v.optional(v.array(v.string())),
          habitat_changes: v.optional(v.string()),
          migration_patterns: v.optional(v.string()),
        })),
        natural_disasters: v.optional(v.array(v.object({
          type: v.string(),
          severity: v.number(),
          affected_areas: v.array(v.string()),
          duration: v.optional(v.number()),
        }))),
      })),

      faction_developments: v.optional(v.array(v.object({
        faction_id: v.string(),
        population_change: v.optional(v.number()),
        wealth_change: v.optional(v.number()),
        military_change: v.optional(v.number()),
        stability_change: v.optional(v.number()),
        technology_progress: v.optional(v.object({
          category: v.string(),
          level_change: v.optional(v.number()),
          discoveries: v.optional(v.array(v.string())),
        })),
        cultural_evolution: v.optional(v.array(v.string())),
        strategic_changes: v.optional(v.string()),
        new_relationships: v.optional(v.record(v.string(), v.union(v.number(), v.string()))),
        territory_changes: v.optional(v.object({
          gained: v.optional(v.array(v.string())),
          lost: v.optional(v.array(v.string())),
          contested: v.optional(v.array(v.string())),
        })),
        leadership_changes: v.optional(v.object({
          new_leaders: v.optional(v.array(v.string())),
          power_shifts: v.optional(v.string()),
          succession_events: v.optional(v.array(v.string())),
        })),
      }))),

      global_events: v.optional(v.array(v.object({
        event_type: v.string(),
        description: v.string(),
        timeline: v.string(),
        global_impact: v.optional(v.number()),
        affected_systems: v.optional(v.array(v.string())),
        cascading_effects: v.optional(v.array(v.string())),
      }))),

      regional_changes: v.optional(v.array(v.object({
        region_id: v.string(),
        infrastructure_development: v.optional(v.number()),
        resource_discovery: v.optional(v.record(v.string(), v.number())),
        strategic_importance_change: v.optional(v.number()),
        population_movement: v.optional(v.object({
          immigration: v.optional(v.number()),
          emigration: v.optional(v.number()),
          displacement: v.optional(v.number()),
        })),
        environmental_changes: v.optional(v.object({
          terrain_modification: v.optional(v.string()),
          climate_shift: v.optional(v.string()),
          natural_features: v.optional(v.array(v.string())),
        })),
        trade_route_changes: v.optional(v.object({
          new_routes: v.optional(v.array(v.string())),
          disrupted_routes: v.optional(v.array(v.string())),
          trade_volume_change: v.optional(v.number()),
        })),
      }))),

      // Military and conflict developments
      military_developments: v.optional(v.array(v.object({
        conflict_id: v.optional(v.string()),
        participants: v.array(v.string()),
        conflict_type: v.string(),
        intensity: v.number(),
        territorial_changes: v.optional(v.record(v.string(), v.string())),
        casualties: v.optional(v.record(v.string(), v.number())),
        strategic_outcomes: v.optional(v.array(v.string())),
        peace_negotiations: v.optional(v.object({
          status: v.string(),
          terms: v.optional(v.array(v.string())),
          mediators: v.optional(v.array(v.string())),
        })),
      }))),

      // Diplomatic developments
      diplomatic_developments: v.optional(v.array(v.object({
        participants: v.array(v.string()),
        development_type: v.string(),
        agreement_details: v.optional(v.string()),
        trade_agreements: v.optional(v.array(v.object({
          goods: v.array(v.string()),
          terms: v.string(),
          duration: v.optional(v.number()),
        }))),
        alliance_changes: v.optional(v.object({
          new_alliances: v.optional(v.array(v.string())),
          broken_alliances: v.optional(v.array(v.string())),
          modified_treaties: v.optional(v.array(v.string())),
        })),
      }))),

      // Technological and cultural breakthroughs
      technological_breakthroughs: v.optional(v.array(v.object({
        technology_name: v.string(),
        discoverer: v.string(),
        category: v.string(),
        impact_level: v.number(),
        applications: v.array(v.string()),
        prerequisites: v.optional(v.array(v.string())),
        diffusion_rate: v.optional(v.number()),
        military_applications: v.optional(v.array(v.string())),
        civilian_applications: v.optional(v.array(v.string())),
      }))),

      cultural_developments: v.optional(v.array(v.object({
        culture_name: v.string(),
        development_type: v.string(),
        description: v.string(),
        originators: v.array(v.string()),
        spread_potential: v.number(),
        cultural_impact: v.object({
          arts: v.optional(v.number()),
          religion: v.optional(v.number()),
          philosophy: v.optional(v.number()),
          social_norms: v.optional(v.number()),
        }),
      }))),

      // Economic developments
      economic_developments: v.optional(v.object({
        market_shifts: v.optional(v.array(v.object({
          commodity: v.string(),
          price_change: v.number(),
          cause: v.string(),
          affected_regions: v.array(v.string()),
        }))),
        trade_disruptions: v.optional(v.array(v.object({
          route: v.string(),
          cause: v.string(),
          severity: v.number(),
          alternatives: v.optional(v.array(v.string())),
        }))),
        economic_innovations: v.optional(v.array(v.object({
          innovation_name: v.string(),
          description: v.string(),
          originator: v.string(),
          economic_impact: v.number(),
        }))),
        resource_discoveries: v.optional(v.array(v.object({
          resource_type: v.string(),
          location: v.string(),
          quantity: v.number(),
          quality: v.optional(v.number()),
          extraction_difficulty: v.optional(v.number()),
        }))),
      })),

      // Social and demographic changes
      demographic_shifts: v.optional(v.array(v.object({
        region: v.string(),
        population_change: v.object({
          total: v.number(),
          births: v.optional(v.number()),
          deaths: v.optional(v.number()),
          migration_in: v.optional(v.number()),
          migration_out: v.optional(v.number()),
        }),
        age_structure_changes: v.optional(v.object({
          youth_percentage: v.optional(v.number()),
          adult_percentage: v.optional(v.number()),
          elder_percentage: v.optional(v.number()),
        })),
        social_mobility: v.optional(v.object({
          upward_mobility: v.number(),
          downward_mobility: v.number(),
          factors: v.array(v.string()),
        })),
      }))),

      // Flexible additional data field for future extensions
      additional_data: v.optional(v.record(v.string(), v.any())),
    }),
    
    // Advanced event analysis
    eventAnalysis: v.optional(v.object({
      primary_drivers: v.optional(v.array(v.string())),
      affected_systems: v.optional(v.array(v.string())),
      urgency_level: v.optional(v.number()),
      complexity_rating: v.optional(v.number()),
      consciousness_depth: v.optional(v.string()),
      emergence_complexity: v.optional(v.string()),
      systemic_integration: v.optional(v.string()),
      systemic_interactions: v.optional(v.array(v.string())),
      cascading_effects: v.optional(v.array(v.string())),
      historical_precedents: v.optional(v.array(v.string())),
      prediction_confidence: v.optional(v.number()),
    })),
    
    timestamp: v.optional(v.number()),
  }).index("by_world_and_turn", ["worldId", "turnNumber"]),

  // Player Decisions (enhanced)
  playerDecisions: defineTable({
    worldId: v.id("worlds"),
    turnNumber: v.number(),
    decision: v.string(),
    isCustomAction: v.boolean(),
    consequences: v.string(),
    
    // Enhanced decision tracking
    decision_type: v.optional(v.string()),
    affected_npcs: v.optional(v.array(v.string())),
    consciousness_changes: v.optional(v.record(v.string(), v.any())),
    long_term_impact_score: v.optional(v.number()),
    emergence_trigger_potential: v.optional(v.number()),
    moral_weight: v.optional(v.number()),
    divine_energy_cost: v.optional(v.number()),
    
    // Decision outcomes tracking
    intended_outcomes: v.optional(v.array(v.string())),
    actual_outcomes: v.optional(v.array(v.string())),
    unintended_consequences: v.optional(v.array(v.string())),
    satisfaction_rating: v.optional(v.number()),
    
    timestamp: v.optional(v.number()),
  }).index("by_world", ["worldId"]),

  // Advanced Simulation Analytics
  simulationAnalytics: defineTable({
    worldId: v.id("worlds"),
    
    // Consciousness Metrics
    consciousness_metrics: v.object({
      average_consciousness_level: v.number(),
      emotional_stability: v.number(),
      social_connectedness: v.number(),
      goal_fulfillment: v.number(),
      cognitive_complexity: v.number(),
      empathy_index: v.number(),
      self_awareness_level: v.number(),
      collective_intelligence: v.number(),
    }),
    
    // Emergence Indicators
    emergence_indicators: v.object({
      innovation_events: v.number(),
      social_movements: v.number(),
      cultural_shifts: v.number(),
      technological_breakthroughs: v.number(),
      spontaneous_cooperation: v.number(),
      collective_problem_solving: v.number(),
      emergent_leadership: v.number(),
      system_synchronization: v.number(),
    }),
    
    // Environmental Integration
    environmental_integration: v.object({
      eco_awareness: v.number(),
      resource_efficiency: v.number(),
      pollution_concern: v.number(),
      sustainability_practices: v.number(),
      climate_adaptation: v.number(),
      biodiversity_protection: v.number(),
    }),
    
    // Social Network Analysis
    social_network_analysis: v.object({
      network_density: v.number(),
      clustering_coefficient: v.number(),
      average_path_length: v.number(),
      centrality_distribution: v.array(v.number()),
      community_detection: v.array(v.string()),
      influence_propagation: v.number(),
      social_cohesion: v.number(),
    }),
    
    // Economic Complexity
    economic_complexity: v.object({
      trade_network_complexity: v.number(),
      economic_diversity: v.number(),
      innovation_rate: v.number(),
      wealth_distribution: v.array(v.number()),
      market_efficiency: v.number(),
      economic_stability: v.number(),
      resource_optimization: v.number(),
    }),
    
    // Cultural Evolution Metrics
    cultural_metrics: v.object({
      cultural_diversity: v.number(),
      tradition_preservation: v.number(),
      innovation_acceptance: v.number(),
      language_evolution_rate: v.number(),
      artistic_development: v.number(),
      knowledge_transmission: v.number(),
    }),
    
    // Political Development
    political_metrics: v.object({
      governance_effectiveness: v.number(),
      democratic_participation: v.number(),
      law_adherence: v.number(),
      political_stability: v.number(),
      corruption_level: v.number(),
      civic_engagement: v.number(),
    }),
    
    // Health and Wellbeing
    population_health: v.object({
      physical_health: v.number(),
      mental_health: v.number(),
      life_satisfaction: v.number(),
      stress_levels: v.number(),
      social_support: v.number(),
      healthcare_access: v.number(),
    }),
    
    // Prediction Models
    prediction_models: v.object({
      short_term_trends: v.array(v.string()),
      long_term_projections: v.array(v.string()),
      risk_factors: v.array(v.string()),
      opportunity_identification: v.array(v.string()),
      tipping_point_analysis: v.array(v.string()),
      scenario_probabilities: v.record(v.string(), v.number()),
    }),
    
    // System Performance
    simulation_performance: v.object({
      processing_efficiency: v.number(),
      memory_usage: v.number(),
      update_frequency: v.number(),
      synchronization_quality: v.number(),
      data_integrity: v.number(),
    }),
    
    timestamp: v.number(),
  }).index("by_world", ["worldId"]).index("by_timestamp", ["timestamp"]),

  // Global Events and Phenomena
  globalEvents: defineTable({
    worldId: v.id("worlds"),
    
    event_id: v.string(),
    event_type: v.union(
      v.literal("natural_disaster"), v.literal("epidemic"), v.literal("technological_breakthrough"),
      v.literal("cultural_revolution"), v.literal("economic_crisis"), v.literal("political_upheaval"),
      v.literal("consciousness_emergence"), v.literal("divine_intervention"), v.literal("environmental_change")
    ),
    
    name: v.string(),
    description: v.string(),
    start_time: v.number(),
    duration: v.optional(v.number()),
    intensity: v.number(),
    
    // Geographic and demographic impact
    affected_regions: v.array(v.string()),
    affected_populations: v.array(v.string()),
    impact_radius: v.number(),
    
    // System-wide effects
    consciousness_effects: v.optional(v.record(v.string(), v.number())),
    social_effects: v.optional(v.record(v.string(), v.number())),
    economic_effects: v.optional(v.record(v.string(), v.number())),
    environmental_effects: v.optional(v.record(v.string(), v.number())),
    cultural_effects: v.optional(v.record(v.string(), v.number())),
    
    // Response and adaptation
    response_measures: v.array(v.string()),
    adaptation_strategies: v.array(v.string()),
    recovery_timeline: v.optional(v.number()),
    
    // Long-term implications
    historical_significance: v.number(),
    precedent_setting: v.boolean(),
    system_changes: v.array(v.string()),
    
    timestamp: v.number(),
  }).index("by_world", ["worldId"]).index("by_type", ["event_type"]),

  // Memory and Learning Archive
  memoryArchive: defineTable({
    worldId: v.id("worlds"),
    npc_id: v.string(),
    
    // Archived memories (for performance optimization)
    archived_memories: v.array(v.object({
      memory_id: v.string(),
      content: v.string(),
      timestamp: v.number(),
      importance: v.number(),
      emotional_impact: v.number(),
      archive_reason: v.string(),
    })),
    
    // Learning history
    learning_records: v.array(v.object({
      skill: v.string(),
      learning_event: v.string(),
      progress_made: v.number(),
      timestamp: v.number(),
      teacher: v.optional(v.string()),
      method: v.string(),
    })),
    
    // Relationship history
    relationship_history: v.record(v.string(), v.array(v.object({
      event_type: v.string(),
      description: v.string(),
      impact: v.number(),
      timestamp: v.number(),
    }))),
    
    archive_timestamp: v.number(),
  }).index("by_world", ["worldId"]).index("by_npc", ["npc_id"]),
};

export default defineSchema({
  ...authTables,
  ...applicationTables,
});