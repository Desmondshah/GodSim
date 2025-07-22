import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

const applicationTables = {
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
    regions: v.array(v.object({
      id: v.optional(v.string()),
      name: v.string(),
      geography: v.string(),
      resources: v.union(
        v.array(v.string()), // legacy format
        v.object({}) // new format: flexible resource mapping
      ),
      climate_modifier: v.optional(v.number()),
      strategic_value: v.optional(v.number()),
      natural_defenses: v.optional(v.number()),
      trade_accessibility: v.optional(v.number()),
    })),
    factions: v.array(v.object({
      id: v.optional(v.string()),
      name: v.string(),
      type: v.string(),
      alignment: v.string(),
      beliefs: v.string(),
      leadership: v.string(),
      strength: v.number(),
      population: v.union(
        v.number(), // legacy format
        v.object({   // new format
          total: v.number(),
          demographics: v.optional(v.object({})),
        })
      ),
      home_region: v.optional(v.string()),
      economy: v.optional(v.object({
        wealth: v.number(),
        primary_industries: v.optional(v.array(v.string())),
        trade_routes: v.optional(v.array(v.string())),
        economic_focus: v.optional(v.string()),
      })),
      military: v.optional(v.object({
        army_size: v.number(),
        weapon_tech: v.number(),
        fortifications: v.number(),
        military_doctrine: v.optional(v.string()),
      })),
      technology: v.optional(v.object({
        level: v.number(),
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
        key_relationships: v.optional(v.record(v.string(), v.float64())),
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
    environment: v.optional(v.object({
      climate: v.object({
        baseTemperature: v.optional(v.number()),
        seasonalVariation: v.optional(v.number()),
        rainfall: v.optional(v.number()),
        extremeWeatherFrequency: v.optional(v.number()),
      }),
      resources: v.optional(v.object({
        renewable: v.optional(v.record(v.string(), v.float64())),
        nonRenewable: v.optional(v.record(v.string(), v.float64())),
        magical: v.optional(v.record(v.string(), v.float64())),
      })),
      ecology: v.optional(v.object({
        biodiversity: v.optional(v.number()),
        carrying_capacity: v.optional(v.number()),
        natural_hazards: v.optional(v.array(v.string())),
      })),
    })),
    globalSystems: v.optional(v.object({
      trade_networks: v.optional(v.array(v.object({
        name: v.string(),
        participants: v.array(v.string()),
        goods: v.array(v.string()),
        profitability: v.optional(v.number()),
        risks: v.optional(v.array(v.string())),
      }))),
      belief_systems: v.optional(v.array(v.object({
        name: v.string(),
        followers: v.array(v.string()),
        core_tenets: v.array(v.string()),
        influence_on_politics: v.optional(v.number()),
        potential_for_conflict: v.optional(v.number()),
      }))),
      power_dynamics: v.optional(v.object({
        dominant_faction: v.optional(v.string()),
        rising_powers: v.optional(v.array(v.string())),
        declining_powers: v.optional(v.array(v.string())),
        potential_alliances: v.optional(v.array(v.array(v.string()))),
      })),
    })),
    technologyTree: v.optional(v.object({})),
    currentState: v.object({
      year: v.number(),
      season: v.string(),
      weather: v.string(),
      balanceOfPower: v.string(),
      majorEvents: v.array(v.string()),
      emergingTrends: v.optional(v.array(v.object({
        trend_name: v.string(),
        description: v.string(),
        potential_outcomes: v.array(v.string()),
        time_to_impact: v.number(),
      }))),
    }),
    isSetupComplete: v.boolean(),
    currentTurn: v.number(),
  }).index("by_user", ["userId"]),

  gameEvents: defineTable({
    worldId: v.id("worlds"),
    turnNumber: v.number(),
    eventType: v.string(), // "divine_action", "world_event", "consequence", "advanced_simulation"
    narrative: v.union(
      v.string(), // legacy format
      v.object({
        title: v.optional(v.string()),
        opening: v.string(),
        current_situation: v.optional(v.string()),
        stakes: v.optional(v.string()),
        divine_perspective: v.optional(v.string()),
        consequences: v.optional(v.string()),
        simulationStatus: v.optional(v.string()),
      })
    ),
    playerAction: v.optional(v.string()),
    choices: v.optional(v.array(v.object({
      id: v.string(),
      text: v.string(),
      icon: v.string(),
      divine_cost: v.optional(v.number()),
      immediate_effects: v.optional(v.array(v.string())),
      long_term_consequences: v.optional(v.array(v.string())),
      affected_factions: v.optional(v.array(v.string())),
    }))),
    worldStateChanges: v.object({
      factionChanges: v.optional(v.array(v.object({
        factionName: v.string(),
        changes: v.string(),
      }))),
      environmentChanges: v.optional(v.string()),
      newEvents: v.optional(v.array(v.string())),
      // Advanced world state changes
      environmental_shifts: v.optional(v.object({
        climate_effects: v.optional(v.object({
          temperature: v.optional(v.number()),
          rainfall: v.optional(v.number()),
        })),
        resource_changes: v.optional(v.record(v.string(), v.float64())),
        ecological_impact: v.optional(v.number()),
      })),
      faction_developments: v.optional(v.array(v.object({
        faction_id: v.string(),
        population_change: v.optional(v.number()),
        wealth_change: v.optional(v.number()),
        stability_change: v.optional(v.number()),
        military_change: v.optional(v.number()),
        technology_progress: v.optional(v.record(v.string(), v.string())),
        cultural_evolution: v.optional(v.array(v.string())),
        new_relationships: v.optional(v.record(v.string(), v.union(v.string(), v.float64()))),
        strategic_changes: v.optional(v.string()),
      }))),
      regional_changes: v.optional(v.array(v.object({
        region_id: v.string(),
        infrastructure_development: v.optional(v.number()),
        resource_discovery: v.optional(v.record(v.string(), v.float64())),
        strategic_importance_change: v.optional(v.number()),
      }))),
      global_events: v.optional(v.array(v.object({
        event_type: v.string(),
        description: v.string(),
        timeline: v.string(),
      }))),
      emerging_trends: v.optional(v.array(v.object({
        trend_name: v.string(),
        description: v.string(),
        potential_outcomes: v.array(v.string()),
        time_to_impact: v.number(),
      }))),
    }),
    eventAnalysis: v.optional(v.object({
      primary_drivers: v.optional(v.array(v.string())),
      affected_systems: v.optional(v.array(v.string())),
      urgency_level: v.optional(v.number()),
      complexity_rating: v.optional(v.number()),
    })),
  }).index("by_world_and_turn", ["worldId", "turnNumber"]),

  playerDecisions: defineTable({
    worldId: v.id("worlds"),
    turnNumber: v.number(),
    decision: v.string(),
    isCustomAction: v.boolean(),
    consequences: v.string(),
  }).index("by_world", ["worldId"]),
};

export default defineSchema({
  ...authTables,
  ...applicationTables,
});
