import { action, mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";
import { api, internal } from "./_generated/api";

// Advanced game engine types and interfaces
interface AdvancedFaction extends Record<string, any> {
  id: string;
  name: string;
  type: string;
  alignment: string;
  beliefs: string;
  leadership: string;
  strength: number;
  population: number;
  economy: {
    wealth: number;
    tradeRoutes: string[];
    resources: Record<string, number>;
    productivity: number;
  };
  technology: {
    level: number;
    knownTechnologies: string[];
    researchFocus: string;
    innovationRate: number;
  };
  culture: {
    values: string[];
    traditions: string[];
    adaptability: number;
    influenceRadius: number;
  };
  military: {
    armySize: number;
    weaponTech: number;
    defensiveStructures: number;
    warExperience: number;
  };
  diplomacy: {
    relations: Record<string, number>; // faction name -> relationship score (-100 to 100)
    treaties: string[];
    tradeAgreements: string[];
    conflicts: string[];
  };
  stability: {
    happiness: number;
    loyalty: number;
    internal_conflicts: string[];
    succession_stability: number;
  };
}

interface EnvironmentalSystem {
  climate: {
    temperature: number;
    rainfall: number;
    seasonality: number;
    extremeEvents: string[];
  };
  resources: {
    renewable: Record<string, number>;
    nonRenewable: Record<string, number>;
    discovery_rate: number;
    depletion_rate: number;
  };
  ecology: {
    biodiversity: number;
    ecosystem_health: number;
    carrying_capacity: number;
    migration_patterns: string[];
  };
}

interface TechnologyTree {
  [category: string]: {
    [tech: string]: {
      prerequisites: string[];
      effects: Record<string, number>;
      description: string;
      difficulty: number;
    };
  };
}

interface EventChain {
  id: string;
  name: string;
  triggers: string[];
  stages: {
    description: string;
    choices: Array<{
      text: string;
      consequences: Record<string, any>;
      nextStage?: string;
    }>;
  }[];
  currentStage: number;
  participants: string[];
}

// Technology trees for different world types
const TECHNOLOGY_TREES: Record<string, TechnologyTree> = {
  organic: {
    survival: {
      "fire_mastery": {
        prerequisites: [],
        effects: { population_growth: 0.1, food_production: 0.15 },
        description: "Mastering fire for cooking, warmth, and protection",
        difficulty: 1
      },
      "tool_crafting": {
        prerequisites: [],
        effects: { productivity: 0.2, military_strength: 0.1 },
        description: "Creating basic tools from stone and wood",
        difficulty: 1
      },
      "hunting_techniques": {
        prerequisites: ["tool_crafting"],
        effects: { food_production: 0.25, military_strength: 0.15 },
        description: "Advanced hunting strategies and techniques",
        difficulty: 2
      }
    },
    social: {
      "tribal_organization": {
        prerequisites: ["fire_mastery"],
        effects: { stability: 0.2, population_growth: 0.1 },
        description: "Organizing into stable tribal structures",
        difficulty: 2
      },
      "oral_tradition": {
        prerequisites: ["tribal_organization"],
        effects: { culture_influence: 0.3, innovation_rate: 0.1 },
        description: "Developing storytelling and knowledge preservation",
        difficulty: 2
      }
    }
  },
  medieval: {
    agriculture: {
      "crop_rotation": {
        prerequisites: [],
        effects: { food_production: 0.3, population_growth: 0.2 },
        description: "Systematic crop rotation for better yields",
        difficulty: 2
      },
      "animal_husbandry": {
        prerequisites: [],
        effects: { food_production: 0.2, wealth: 0.1 },
        description: "Domestication and breeding of livestock",
        difficulty: 2
      }
    },
    crafting: {
      "metalworking": {
        prerequisites: [],
        effects: { military_strength: 0.3, productivity: 0.2 },
        description: "Working with iron and other metals",
        difficulty: 3
      },
      "construction": {
        prerequisites: ["metalworking"],
        effects: { defensive_strength: 0.4, stability: 0.2 },
        description: "Building permanent stone structures",
        difficulty: 3
      }
    }
  },
  fantasy: {
    magic: {
      "basic_spellcasting": {
        prerequisites: [],
        effects: { innovation_rate: 0.3, culture_influence: 0.2 },
        description: "Learning to channel and control magical energy",
        difficulty: 2
      },
      "enchantment": {
        prerequisites: ["basic_spellcasting"],
        effects: { productivity: 0.25, military_strength: 0.2 },
        description: "Imbuing objects with magical properties",
        difficulty: 3
      },
      "divination": {
        prerequisites: ["basic_spellcasting"],
        effects: { stability: 0.3, diplomacy_bonus: 0.2 },
        description: "Seeing glimpses of future events",
        difficulty: 3
      }
    }
  },
  "sci-fi": {
    technology: {
      "energy_systems": {
        prerequisites: [],
        effects: { productivity: 0.4, innovation_rate: 0.2 },
        description: "Harnessing and storing energy efficiently",
        difficulty: 3
      },
      "communication": {
        prerequisites: [],
        effects: { diplomacy_bonus: 0.3, culture_influence: 0.2 },
        description: "Long-range communication systems",
        difficulty: 2
      },
      "materials_science": {
        prerequisites: ["energy_systems"],
        effects: { defensive_strength: 0.3, productivity: 0.2 },
        description: "Advanced materials and manufacturing",
        difficulty: 4
      }
    }
  }
};

// Advanced AI prompt generation system
class AdvancedPromptEngine {
  static generateWorldCreationPrompt(setupAnswers: any, stageContext: any): string {
    return `You are an advanced AI world generator for a sophisticated god simulation game. Create a detailed, living world with complex systems and emergent behaviors.

WORLD PARAMETERS:
- Type: ${setupAnswers.worldType}
- Divine Being: ${setupAnswers.supremeBeing.name} (${setupAnswers.supremeBeing.type})
- Divine Purpose: ${setupAnswers.supremeBeing.purpose}
- World Rules: Time flows ${setupAnswers.creationRules.time}, Death is ${setupAnswers.creationRules.death}, Nature is ${setupAnswers.creationRules.nature}, Morality is ${setupAnswers.creationRules.morality}
- Inhabitants: ${setupAnswers.inhabitants}
- Development Stage: ${stageContext.stage}

ADVANCED REQUIREMENTS:
1. Create factions with complex internal politics, economic systems, and cultural depth
2. Establish trade networks, resource dependencies, and economic relationships
3. Design technology progression paths appropriate to the world type
4. Include environmental factors that affect civilization development
5. Create potential for emergent diplomatic relationships and conflicts
6. Establish cultural values and belief systems that drive faction behavior

Generate a rich, interconnected world where every element affects every other element. Focus on systems that will create interesting emergent gameplay as the simulation progresses.

CRITICAL: Return ONLY valid JSON with the exact structure specified below:

{
  "worldName": "Evocative name reflecting the world's essence and divine influence",
  "environment": {
    "climate": {
      "baseTemperature": number (-20 to 40),
      "seasonalVariation": number (0 to 30),
      "rainfall": number (0 to 100),
      "extremeWeatherFrequency": number (0 to 1)
    },
    "resources": {
      "renewable": {"food": number, "timber": number, "stone": number},
      "nonRenewable": {"metals": number, "gems": number, "fuel": number},
      "magical": {"mana_crystals": number, "ley_lines": number} 
    },
    "ecology": {
      "biodiversity": number (0 to 100),
      "carrying_capacity": number (1000 to 50000),
      "natural_hazards": ["disaster1", "disaster2"]
    }
  },
  "regions": [
    {
      "id": "unique_region_id",
      "name": "Region name",
      "geography": "Detailed geographical description",
      "climate_modifier": number (-0.5 to 0.5),
      "resources": {"resource_type": abundance_number},
      "strategic_value": number (1 to 10),
      "natural_defenses": number (1 to 10),
      "trade_accessibility": number (1 to 10)
    }
  ],
  "factions": [
    {
      "id": "unique_faction_id",
      "name": "Faction name",
      "type": "government/organization type",
      "alignment": "detailed_alignment_description",
      "beliefs": "Core beliefs and motivations",
      "leadership": "Leadership structure and key figures",
      "home_region": "region_id",
      "population": {
        "total": number (${stageContext.populationRange[0]} to ${stageContext.populationRange[1]}),
        "demographics": {"workers": 0.6, "warriors": 0.2, "nobles": 0.1, "clergy": 0.1}
      },
      "economy": {
        "wealth": number (1 to 100),
        "primary_industries": ["industry1", "industry2"],
        "trade_routes": ["region_id1", "region_id2"],
        "economic_focus": "trade/military/agriculture/technology/magic"
      },
      "military": {
        "army_size": number (10 to 500),
        "weapon_tech": number (1 to 10),
        "fortifications": number (1 to 10),
        "military_doctrine": "offensive/defensive/balanced"
      },
      "technology": {
        "level": number (1 to 5),
        "research_focus": "category from tech tree",
        "known_technologies": ["tech1", "tech2"],
        "innovation_rate": number (0.1 to 1.0)
      },
      "culture": {
        "core_values": ["value1", "value2", "value3"],
        "traditions": ["tradition1", "tradition2"],
        "adaptability": number (0.1 to 1.0),
        "cultural_influence": number (1 to 100)
      },
      "diplomacy": {
        "default_stance": "aggressive/defensive/neutral/trading",
        "key_relationships": {"faction_id": relationship_score},
        "diplomatic_goals": ["goal1", "goal2"]
      },
      "stability": {
        "internal_happiness": number (0 to 100),
        "loyalty_to_leadership": number (0 to 100),
        "succession_stability": number (0 to 100),
        "potential_issues": ["issue1", "issue2"]
      }
    }
  ],
  "global_systems": {
    "trade_networks": [
      {
        "name": "Trade route name",
        "participants": ["faction_id1", "faction_id2"],
        "goods": ["good1", "good2"],
        "profitability": number (0.1 to 2.0),
        "risks": ["risk1", "risk2"]
      }
    ],
    "belief_systems": [
      {
        "name": "Belief system name",
        "followers": ["faction_id1", "faction_id2"],
        "core_tenets": ["tenet1", "tenet2"],
        "influence_on_politics": number (0 to 1),
        "potential_for_conflict": number (0 to 1)
      }
    ],
    "power_dynamics": {
      "dominant_faction": "faction_id or null",
      "rising_powers": ["faction_id1"],
      "declining_powers": ["faction_id2"],
      "potential_alliances": [["faction_id1", "faction_id2"]]
    }
  }
}

Create 3-5 regions and 3-4 factions with intricate relationships and dependencies. Make it feel like a living, breathing world.`;
  }

  static generateEventPrompt(world: any, recentEvents: any[], playerAction?: string): string {
    const factions = world.factions || [];
    const regions = world.regions || [];
    
    return `You are the advanced AI narrator for a sophisticated god simulation. Generate complex, interconnected events that drive meaningful gameplay and create emergent storytelling.

WORLD STATE ANALYSIS:
World: ${world.name} (Year ${world.currentState?.year || 1}, ${world.currentState?.season || 'Spring'})
Divine Being: ${world.setupAnswers?.supremeBeing?.name} (${world.setupAnswers?.supremeBeing?.type})
Current Weather: ${world.currentState?.weather || 'Fair'}
Power Balance: ${world.currentState?.balanceOfPower || 'Stable'}

FACTION ANALYSIS:
${factions.map((f: any) => `
- ${f.name} (${f.type}): Pop ${f.population}, Strength ${f.strength}
  Economy: ${f.economy ? `Wealth ${f.economy.wealth}, Focus: ${f.economy.economic_focus}` : 'Basic'}
  Military: ${f.military ? `Army ${f.military.army_size}, Tech ${f.military.weapon_tech}` : 'Militia'}
  Stability: ${f.stability ? `Happiness ${f.stability.internal_happiness}, Loyalty ${f.stability.loyalty_to_leadership}` : 'Stable'}
  Current Issues: ${f.stability?.potential_issues?.join(', ') || 'None'}
`).join('')}

REGIONAL SITUATION:
${regions.map((r: any) => `
- ${r.name}: ${r.geography}
  Strategic Value: ${r.strategic_value || 'Unknown'}, Defenses: ${r.natural_defenses || 'Unknown'}
  Resources: ${Object.entries(r.resources || {}).map(([k, v]) => `${k}:${v}`).join(', ')}
`).join('')}

RECENT EVENTS CONTEXT:
${recentEvents.map((e: any) => `Turn ${e.turnNumber}: ${e.narrative}`).join('\n')}

${playerAction ? `\nDIVINE INTERVENTION: ${playerAction}` : '\nNo recent divine intervention - natural events are unfolding'}

ADVANCED EVENT GENERATION REQUIREMENTS:
1. Create multi-layered events with political, economic, social, and environmental implications
2. Show realistic cause-and-effect relationships between faction actions
3. Include subtle long-term consequences that may not be immediately apparent
4. Generate events that create opportunities for interesting player choices
5. Balance conflict with cooperation - not every event should be negative
6. Consider technological progression, cultural evolution, and economic dynamics
7. Make events feel consequential to the world's development

DIVINE CHOICE DESIGN PRINCIPLES:
- Choices should be morally complex with no clear "right" answer
- Each choice should have both intended and unintended consequences
- Include options for direct intervention, subtle influence, and non-interference
- Consider how the divine being's personality and purpose would affect available options
- Show trade-offs between short-term solutions and long-term stability

Return ONLY valid JSON in this exact format:
{
  "event_analysis": {
    "primary_drivers": ["factor1", "factor2"],
    "affected_systems": ["economy", "military", "culture", "environment"],
    "urgency_level": number (1-10),
    "complexity_rating": number (1-10)
  },
  "narrative": {
    "opening": "2-3 paragraphs setting the scene with rich, immersive detail",
    "current_situation": "1-2 paragraphs describing the immediate crisis or opportunity", 
    "stakes": "1 paragraph explaining what hangs in the balance",
    "divine_perspective": "Brief reflection on how this appears to the divine observer"
  },
  "choices": [
    {
      "id": "choice1",
      "text": "🔥 [Divine Action Type]: Specific intervention description (intended benefit, potential risk)",
      "icon": "🔥",
      "divine_cost": number (1-10),
      "immediate_effects": ["effect1", "effect2"],
      "long_term_consequences": ["consequence1", "consequence2"],
      "affected_factions": ["faction_id1", "faction_id2"]
    }
  ],
  "world_state_changes": {
    "environmental_shifts": {
      "climate_effects": {"temperature": change, "rainfall": change},
      "resource_changes": {"resource_type": change_amount},
      "ecological_impact": number (-1 to 1)
    },
    "faction_developments": [
      {
        "faction_id": "faction_id",
        "population_change": number,
        "wealth_change": number,
        "stability_change": number,
        "military_change": number,
        "technology_progress": {"category": "tech_name"},
        "cultural_evolution": ["new_trait1", "new_trait2"],
        "new_relationships": {"other_faction_id": relationship_change},
        "strategic_changes": "description of new goals or priorities"
      }
    ],
    "regional_changes": [
      {
        "region_id": "region_id", 
        "infrastructure_development": number (-10 to 10),
        "resource_discovery": {"resource": amount},
        "strategic_importance_change": number (-5 to 5)
      }
    ],
    "global_events": [
      {
        "event_type": "technological/cultural/economic/political/environmental",
        "description": "Brief description of world-spanning change",
        "timeline": "immediate/short_term/long_term"
      }
    ],
    "emerging_trends": [
      {
        "trend_name": "Name of emerging pattern",
        "description": "What is changing across the world",
        "potential_outcomes": ["outcome1", "outcome2"],
        "time_to_impact": number (1-20 turns)
      }
    ]
  }
}

Create an event that feels like it belongs in an advanced civilization simulation with deep, interconnected systems.`;
  }
}

export const generateAdvancedWorld = action({
  args: {
    worldId: v.id("worlds"),
  },
  handler: async (ctx, args): Promise<any> => {
    const world = await ctx.runQuery(api.worldSetup.getUserWorld);
    if (!world || world._id !== args.worldId) {
      throw new Error("World not found");
    }

    const { setupAnswers } = world;
    
    // Define advanced civilization stage based on world type
    const getAdvancedStageContext = (worldType: string) => {
      const contexts: Record<string, any> = {
        'organic': {
          stage: 'early tribal confederations',
          description: 'multiple tribes forming alliances and trade relationships',
          populationRange: [100, 1000],
          complexityLevel: 'medium',
          keyTechnologies: ['fire_mastery', 'tool_crafting', 'tribal_organization'],
          emergingChallenges: ['resource competition', 'territorial expansion', 'leadership succession']
        },
        'sci-fi': {
          stage: 'colonial settlements with advanced tech',
          description: 'established colonies leveraging salvaged and adapted technology',
          populationRange: [200, 2000],
          complexityLevel: 'high',
          keyTechnologies: ['energy_systems', 'communication', 'materials_science'],
          emergingChallenges: ['resource depletion', 'technological breakdown', 'isolation syndrome']
        },
        'fantasy': {
          stage: 'magical awakening societies',
          description: 'civilizations integrating magic into daily life and governance',
          populationRange: [300, 1500],
          complexityLevel: 'high',
          keyTechnologies: ['basic_spellcasting', 'enchantment', 'divination'],
          emergingChallenges: ['magical instability', 'power imbalances', 'arcane conflicts']
        },
        'medieval': {
          stage: 'feudal kingdoms emerging',
          description: 'consolidated territories with complex hierarchies and trade networks',
          populationRange: [500, 3000],
          complexityLevel: 'medium',
          keyTechnologies: ['metalworking', 'construction', 'crop_rotation'],
          emergingChallenges: ['succession crises', 'peasant unrest', 'noble conflicts']
        }
      };
      
      return contexts[worldType] || contexts['organic'];
    };

    const stageContext = getAdvancedStageContext(setupAnswers.worldType);
    const prompt = AdvancedPromptEngine.generateWorldCreationPrompt(setupAnswers, stageContext);

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.CONVEX_OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
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
      if (!worldData.worldName || !worldData.regions || !worldData.factions || !worldData.environment) {
        throw new Error("Missing required fields in generated world data");
      }
      
    } catch (parseError) {
      console.error("Raw AI response:", data.choices[0].message.content);
      console.log("Using enhanced fallback world generation");
      
      // Enhanced fallback world with complex systems
      worldData = {
        worldName: `${world.setupAnswers.supremeBeing.name}'s Realm`,
        environment: {
          climate: {
            baseTemperature: 15,
            seasonalVariation: 20,
            rainfall: 60,
            extremeWeatherFrequency: 0.2
          },
          resources: {
            renewable: { food: 80, timber: 70, stone: 60 },
            nonRenewable: { metals: 40, gems: 20, fuel: 30 },
            magical: { mana_crystals: 25, ley_lines: 5 }
          },
          ecology: {
            biodiversity: 75,
            carrying_capacity: 15000,
            natural_hazards: ["storms", "droughts", "earthquakes"]
          }
        },
        regions: [
          {
            id: "central_heartlands",
            name: "The Central Heartlands",
            geography: "Fertile plains crossed by rivers, ideal for agriculture and trade",
            climate_modifier: 0.1,
            resources: { food: 90, stone: 50, metals: 30 },
            strategic_value: 8,
            natural_defenses: 4,
            trade_accessibility: 9
          },
          {
            id: "northern_highlands",
            name: "Northern Highlands",
            geography: "Mountainous terrain rich in minerals but harsh climate",
            climate_modifier: -0.3,
            resources: { metals: 80, gems: 60, stone: 90 },
            strategic_value: 6,
            natural_defenses: 9,
            trade_accessibility: 4
          },
          {
            id: "eastern_forests",
            name: "Eastern Woodlands",
            geography: "Dense forests teeming with wildlife and mystical energy",
            climate_modifier: 0.0,
            resources: { timber: 95, food: 60, mana_crystals: 40 },
            strategic_value: 5,
            natural_defenses: 7,
            trade_accessibility: 6
          }
        ],
        factions: [
          {
            id: "heartland_republic",
            name: "Heartland Republic",
            type: "elected_council",
            alignment: "pragmatic_traders",
            beliefs: `Followers of ${world.setupAnswers.supremeBeing.name} who believe in prosperity through trade`,
            leadership: "Council of Elected Representatives",
            home_region: "central_heartlands",
            population: {
              total: 2500,
              demographics: { workers: 0.5, warriors: 0.2, nobles: 0.2, clergy: 0.1 }
            },
            economy: {
              wealth: 75,
              primary_industries: ["agriculture", "trade", "crafting"],
              trade_routes: ["northern_highlands", "eastern_forests"],
              economic_focus: "trade"
            },
            military: {
              army_size: 300,
              weapon_tech: 6,
              fortifications: 5,
              military_doctrine: "defensive"
            },
            technology: {
              level: 3,
              research_focus: "agriculture",
              known_technologies: ["crop_rotation", "metalworking"],
              innovation_rate: 0.6
            },
            culture: {
              core_values: ["prosperity", "cooperation", "innovation"],
              traditions: ["harvest_festivals", "trade_fairs"],
              adaptability: 0.8,
              cultural_influence: 60
            },
            diplomacy: {
              default_stance: "trading",
              key_relationships: {},
              diplomatic_goals: ["expand_trade", "maintain_peace"]
            },
            stability: {
              internal_happiness: 70,
              loyalty_to_leadership: 65,
              succession_stability: 80,
              potential_issues: ["wealth_inequality", "trade_disputes"]
            }
          },
          {
            id: "mountain_clans",
            name: "Highland Clans",
            type: "tribal_confederation",
            alignment: "proud_isolationists",
            beliefs: `Honor the old ways while respecting ${world.setupAnswers.supremeBeing.name}'s strength`,
            leadership: "Clan Chieftains in Council",
            home_region: "northern_highlands",
            population: {
              total: 1200,
              demographics: { workers: 0.4, warriors: 0.4, nobles: 0.1, clergy: 0.1 }
            },
            economy: {
              wealth: 45,
              primary_industries: ["mining", "metalworking", "herding"],
              trade_routes: ["central_heartlands"],
              economic_focus: "military"
            },
            military: {
              army_size: 400,
              weapon_tech: 8,
              fortifications: 8,
              military_doctrine: "offensive"
            },
            technology: {
              level: 2,
              research_focus: "crafting",
              known_technologies: ["metalworking", "construction"],
              innovation_rate: 0.4
            },
            culture: {
              core_values: ["honor", "tradition", "strength"],
              traditions: ["warrior_trials", "ancestor_worship"],
              adaptability: 0.3,
              cultural_influence: 40
            },
            diplomacy: {
              default_stance: "defensive",
              key_relationships: {},
              diplomatic_goals: ["maintain_independence", "honor_ancestors"]
            },
            stability: {
              internal_happiness: 60,
              loyalty_to_leadership: 85,
              succession_stability: 40,
              potential_issues: ["clan_rivalries", "resource_scarcity"]
            }
          }
        ],
        global_systems: {
          trade_networks: [
            {
              name: "Central Trade Route",
              participants: ["heartland_republic", "mountain_clans"],
              goods: ["food", "metals", "crafted_goods"],
              profitability: 1.2,
              risks: ["bandits", "weather_delays"]
            }
          ],
          belief_systems: [
            {
              name: `Faith of ${world.setupAnswers.supremeBeing.name}`,
              followers: ["heartland_republic", "mountain_clans"],
              core_tenets: ["divine_guidance", "mortal_responsibility"],
              influence_on_politics: 0.6,
              potential_for_conflict: 0.3
            }
          ],
          power_dynamics: {
            dominant_faction: "heartland_republic",
            rising_powers: ["heartland_republic"],
            declining_powers: [],
            potential_alliances: [["heartland_republic", "mountain_clans"]]
          }
        }
      };
    }

    // Sanitize population fields to match schema
    function sanitizePopulation(pop: unknown): number | { total: number; demographics?: object } {
      if (typeof pop === "number") return pop;
      if (pop && typeof pop === "object" && typeof (pop as any).total === "number") {
        return {
          total: (pop as any).total,
          ...((pop as any).demographics ? { demographics: (pop as any).demographics } : {})
        };
      }
      return 0;
    }
    const sanitizedFactions = (worldData.factions || []).map((f: any) => ({
      ...f,
      population: sanitizePopulation(f.population)
    }));
    await ctx.runMutation(api.gameEngine_new.updateAdvancedWorldGeneration, {
      worldId: args.worldId,
      worldData: {
        name: worldData.worldName,
        environment: worldData.environment,
        regions: worldData.regions,
        factions: sanitizedFactions,
        globalSystems: worldData.global_systems,
        technologyTree: TECHNOLOGY_TREES[setupAnswers.worldType] || TECHNOLOGY_TREES.organic,
      },
    });

    return worldData;
  },
});

export const generateAdvancedTurnEvent = action({
  args: {
    worldId: v.id("worlds"),
    playerAction: v.optional(v.string()),
  },
  handler: async (ctx, args): Promise<any> => {
    const world = await ctx.runQuery(api.gameEngine_new.getWorldForEvent, {
      worldId: args.worldId,
    });

    if (!world) {
      throw new Error("World not found");
    }

    const recentEvents = await ctx.runQuery(api.gameEngine_new.getRecentEvents, {
      worldId: args.worldId,
      limit: 5,
    });

    const prompt = AdvancedPromptEngine.generateEventPrompt(world, recentEvents, args.playerAction);

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.CONVEX_OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.8,
        max_tokens: 3000,
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
      console.log("Using advanced fallback event generation");
      
      // Enhanced fallback event
      eventData = {
        event_analysis: {
          primary_drivers: ["economic_pressure", "political_tension"],
          affected_systems: ["economy", "diplomacy", "culture"],
          urgency_level: 6,
          complexity_rating: 7
        },
        narrative: {
          opening: `The realm stirs with new tensions as ${world.setupAnswers?.supremeBeing?.name} observes from the divine plane. Economic pressures mount across the territories as trade routes face new challenges and factional disputes simmer beneath the surface.`,
          current_situation: `Recent diplomatic tensions between major factions have begun to affect trade and cultural exchange. What started as minor disagreements over resource allocation has grown into a more significant political crisis.`,
          stakes: `The stability of the entire realm hangs in the balance. How this crisis resolves will shape the future of civilization for generations to come.`,
          divine_perspective: `From your divine vantage point, you can see the delicate threads of fate pulling in different directions. A single intervention could tip the scales dramatically.`
        },
        choices: [
          {
            id: "choice1",
            text: "🔥 Divine Intervention: Send prophetic visions to faction leaders (may unite them in common purpose, or cause religious schism)",
            icon: "🔥",
            divine_cost: 6,
            immediate_effects: ["faction_unity_boost", "religious_fervor"],
            long_term_consequences: ["potential_theocracy", "divine_dependency"],
            affected_factions: Object.keys(world.factions || {})
          },
          {
            id: "choice2",
            text: "🌊 Economic Blessing: Cause abundant harvests and resource discoveries (brings prosperity, but may create complacency)",
            icon: "🌊",
            divine_cost: 4,
            immediate_effects: ["economic_boom", "population_growth"],
            long_term_consequences: ["resource_competition", "class_stratification"],
            affected_factions: Object.keys(world.factions || {})
          },
          {
            id: "choice3",
            text: "⚡ Natural Challenge: Send environmental tests to forge unity (may strengthen resolve, or cause societal collapse)",
            icon: "⚡",
            divine_cost: 8,
            immediate_effects: ["forced_cooperation", "technological_innovation"],
            long_term_consequences: ["stronger_civilization", "potential_exodus"],
            affected_factions: Object.keys(world.factions || {})
          },
          {
            id: "choice4",
            text: "👁️ Observe Silently: Let mortals solve their own problems without divine interference",
            icon: "👁️",
            divine_cost: 0,
            immediate_effects: ["natural_resolution"],
            long_term_consequences: ["independence", "potential_chaos"],
            affected_factions: []
          }
        ],
        world_state_changes: {
          environmental_shifts: {
            climate_effects: { temperature: 0, rainfall: 0 },
            resource_changes: {},
            ecological_impact: 0
          },
          faction_developments: [],
          regional_changes: [],
          global_events: [{
            event_type: "political",
            description: "Rising tensions between factions challenge the stability of the realm",
            timeline: "immediate"
          }],
          emerging_trends: [{
            trend_name: "Political Centralization",
            description: "Factions are being forced to choose between independence and cooperation",
            potential_outcomes: ["federation_formation", "civil_war"],
            time_to_impact: 5
          }]
        }
      };
    }

    // Save the advanced event
    const newTurn = world.currentTurn + 1;
    await ctx.runMutation(api.gameEngine_new.saveAdvancedGameEvent, {
      worldId: args.worldId,
      turnNumber: newTurn,
      eventData,
      playerAction: args.playerAction,
    });

    return eventData;
  },
});

// Keep the existing functions but add advanced versions
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

export const updateAdvancedWorldGeneration = mutation({
  args: {
    worldId: v.id("worlds"),
    worldData: v.object({
      name: v.string(),
      environment: v.any(),
      regions: v.any(),
      factions: v.any(),
      globalSystems: v.any(),
      technologyTree: v.any(),
    }),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.worldId, {
      name: args.worldData.name,
      regions: args.worldData.regions,
      factions: args.worldData.factions,
      environment: args.worldData.environment,
      globalSystems: args.worldData.globalSystems,
      technologyTree: args.worldData.technologyTree,
      isSetupComplete: true,
    });
  },
});

export const saveAdvancedGameEvent = mutation({
  args: {
    worldId: v.id("worlds"),
    turnNumber: v.number(),
    eventData: v.any(),
    playerAction: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Save the advanced event
    await ctx.db.insert("gameEvents", {
      worldId: args.worldId,
      turnNumber: args.turnNumber,
      eventType: "advanced_simulation",
      narrative: args.eventData.narrative || args.eventData.narrative?.opening || "Advanced event occurred",
      playerAction: args.playerAction,
      choices: args.eventData.choices,
      worldStateChanges: args.eventData.world_state_changes || {},
      eventAnalysis: args.eventData.event_analysis,
    });

    // Update world state with sophisticated changes
    const world = await ctx.db.get(args.worldId);
    if (!world) return;

    // Apply advanced faction changes
    const updatedFactions = world.factions?.map((faction: any) => {
      const factionChanges = args.eventData.world_state_changes?.faction_developments?.find(
        (change: any) => change.faction_id === faction.id
      );
      
      if (factionChanges) {
        return {
          ...faction,
          population: Math.max(0, (faction.population || faction.population?.total || 0) + (factionChanges.population_change || 0)),
          strength: Math.max(0, Math.min(100, faction.strength + (factionChanges.military_change || 0))),
          economy: {
            ...faction.economy,
            wealth: Math.max(0, Math.min(100, (faction.economy?.wealth || 50) + (factionChanges.wealth_change || 0)))
          },
          stability: {
            ...faction.stability,
            internal_happiness: Math.max(0, Math.min(100, (faction.stability?.internal_happiness || 50) + (factionChanges.stability_change || 0)))
          }
        };
      }
      return faction;
    }) || world.factions;

    // Apply environmental changes
    const environmentChanges = args.eventData.world_state_changes?.environmental_shifts;
    const updatedEnvironment = world.environment ? {
      ...world.environment,
      climate: {
        ...world.environment.climate,
        baseTemperature: (world.environment.climate?.baseTemperature || 15) + (environmentChanges?.climate_effects?.temperature || 0),
        rainfall: Math.max(0, Math.min(100, (world.environment.climate?.rainfall || 60) + (environmentChanges?.climate_effects?.rainfall || 0)))
      }
    } : world.environment;

    // Update emerging trends
    const emergingTrends = args.eventData.world_state_changes?.emerging_trends || [];
    
    const newMajorEvents = [
      ...(world.currentState?.majorEvents || []),
      ...emergingTrends.map((trend: any) => trend.trend_name)
    ].slice(-5);

    await ctx.db.patch(args.worldId, {
      currentTurn: args.turnNumber,
      factions: updatedFactions,
      environment: updatedEnvironment,
      currentState: {
        ...world.currentState,
        year: (world.currentState?.year || 1) + (args.turnNumber % 4 === 0 ? 1 : 0),
        majorEvents: newMajorEvents,
        emergingTrends: emergingTrends,
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

// Keep original functions for backward compatibility
export const generateWorld = action({
  args: {
    worldId: v.id("worlds"),
  },
  handler: async (ctx, args): Promise<any> => {
    // Use the advanced version for new worlds
    return await ctx.runAction(api.gameEngine_new.generateAdvancedWorld, args);
  },
});

export const generateTurnEvent = action({
  args: {
    worldId: v.id("worlds"),
    playerAction: v.optional(v.string()),
  },
  handler: async (ctx, args): Promise<any> => {
    // Use the advanced version for new events
    return await ctx.runAction(api.gameEngine_new.generateAdvancedTurnEvent, args);
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
  handler: async (ctx, args): Promise<any> => {
    // Convert to advanced format and use the new handler
    const advancedEventData = {
      narrative: {
        opening: args.eventData.narrative,
        current_situation: "",
        stakes: "",
        divine_perspective: ""
      },
      choices: args.eventData.choices,
      world_state_changes: {
        faction_developments: args.eventData.worldStateChanges.factionChanges?.map(change => ({
          faction_id: change.factionName,
          population_change: 0,
          wealth_change: 0,
          stability_change: 0,
          military_change: 0
        })) || [],
        environmental_shifts: {
          climate_effects: {},
          resource_changes: {},
          ecological_impact: 0
        },
        regional_changes: [],
        global_events: [],
        emerging_trends: []
      }
    };

    return await ctx.runMutation(api.gameEngine_new.saveAdvancedGameEvent, {
      worldId: args.worldId,
      turnNumber: args.turnNumber,
      eventData: advancedEventData,
      playerAction: args.playerAction,
    });
  },
});
