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
      name: v.string(),
      geography: v.string(),
      resources: v.array(v.string()),
    })),
    factions: v.array(v.object({
      name: v.string(),
      type: v.string(),
      alignment: v.string(),
      beliefs: v.string(),
      leadership: v.string(),
      strength: v.number(),
      population: v.number(),
    })),
    beliefSystems: v.array(v.string()),
    currentState: v.object({
      year: v.number(),
      season: v.string(),
      weather: v.string(),
      balanceOfPower: v.string(),
      majorEvents: v.array(v.string()),
    }),
    isSetupComplete: v.boolean(),
    currentTurn: v.number(),
  }).index("by_user", ["userId"]),

  gameEvents: defineTable({
    worldId: v.id("worlds"),
    turnNumber: v.number(),
    eventType: v.string(), // "divine_action", "world_event", "consequence"
    narrative: v.union(
      v.string(), // legacy format
      v.object({
        title: v.string(),
        opening: v.string(),
        consequences: v.string(),
        simulationStatus: v.string(),
      })
    ),
    playerAction: v.optional(v.string()),
    choices: v.optional(v.array(v.object({
      id: v.string(),
      text: v.string(),
      icon: v.string(),
    }))),
    worldStateChanges: v.object({
      factionChanges: v.optional(v.array(v.object({
        factionName: v.string(),
        changes: v.string(),
      }))),
      environmentChanges: v.optional(v.string()),
      newEvents: v.optional(v.array(v.string())),
    }),
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
