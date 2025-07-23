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
    marketFluctuations: Record<string, number>;
    tradeBalance: number;
  };
  technology: {
    level: number;
    knownTechnologies: string[];
    researchFocus: string;
    innovationRate: number;
    researchPoints: number;
    techMomentum: number;
  };
  culture: {
    values: string[];
    traditions: string[];
    adaptability: number;
    influenceRadius: number;
    culturalDrift: Record<string, number>;
    identityStrength: number;
  };
  military: {
    armySize: number;
    weaponTech: number;
    defensiveStructures: number;
    warExperience: number;
    veteranUnits: number;
    logistics: number;
  };
  diplomacy: {
    relations: Record<string, number>; // faction name -> relationship score (-100 to 100)
    treaties: string[];
    tradeAgreements: string[];
    conflicts: string[];
    diplomaticMemory: Record<string, Array<{action: string, impact: number, turn: number}>>;
    reputation: number;
  };
  stability: {
    happiness: number;
    loyalty: number;
    internal_conflicts: string[];
    succession_stability: number;
    socialCohesion: number;
    crisisResistance: number;
  };
  health: {
    populationHealth: number;
    diseaseResistance: number;
    activeDiseases: string[];
    medicalKnowledge: number;
  };
  environment: {
    territorySize: number;
    landQuality: number;
    climateTolerance: number;
    naturalDisasterPreparedness: number;
  };
}

// Advanced simulation systems
class AdvancedSimulationEngine {
  static calculateClimateEffects(world: any, turn: number): any {
    const climate = world.environment?.climate;
    if (!climate) return {};

    // Seasonal climate variations
    const season = ['Spring', 'Summer', 'Autumn', 'Winter'][turn % 4];
    const baseTemp = climate.baseTemperature || 15;
    const seasonalMod = climate.seasonalVariation || 10;
    
    let currentTemp = baseTemp;
    switch (season) {
      case 'Summer': currentTemp += seasonalMod * 0.4; break;
      case 'Winter': currentTemp -= seasonalMod * 0.4; break;
      case 'Spring': currentTemp += seasonalMod * 0.1; break;
      case 'Autumn': currentTemp -= seasonalMod * 0.1; break;
    }

    // Random weather events
    const extremeEvent = Math.random() < (climate.extremeWeatherFrequency || 0.1);
    let weatherEvent = null;
    
    if (extremeEvent) {
      const events = ['drought', 'flood', 'storm', 'heatwave', 'coldsnap'];
      weatherEvent = events[Math.floor(Math.random() * events.length)];
    }

    return {
      season,
      temperature: currentTemp,
      weatherEvent,
      effectOnAgriculture: this.calculateAgricultureEffect(currentTemp, weatherEvent),
      effectOnHealth: this.calculateHealthEffect(currentTemp, weatherEvent),
      effectOnTrade: this.calculateTradeEffect(weatherEvent)
    };
  }

  static calculateAgricultureEffect(temperature: number, weatherEvent: string | null): number {
    let effect = 1.0;
    
    // Temperature effects
    if (temperature < 5 || temperature > 35) effect *= 0.7;
    else if (temperature >= 15 && temperature <= 25) effect *= 1.2;
    
    // Weather event effects
    if (weatherEvent === 'drought') effect *= 0.4;
    else if (weatherEvent === 'flood') effect *= 0.6;
    else if (weatherEvent === 'storm') effect *= 0.8;
    
    return effect;
  }

  static calculateHealthEffect(temperature: number, weatherEvent: string | null): number {
    let effect = 1.0;
    
    // Extreme temperatures affect health
    if (temperature < 0 || temperature > 40) effect *= 0.8;
    
    // Weather events affect health
    if (weatherEvent === 'flood') effect *= 0.7; // disease spread
    else if (weatherEvent === 'drought') effect *= 0.9; // water scarcity
    
    return effect;
  }

  static calculateTradeEffect(weatherEvent: string | null): number {
    if (weatherEvent === 'storm' || weatherEvent === 'flood') return 0.6;
    if (weatherEvent === 'drought') return 0.9;
    return 1.0;
  }

  static simulateDiplomaticInteractions(factions: any[]): any[] {
    const interactions = [];
    
    for (let i = 0; i < factions.length; i++) {
      for (let j = i + 1; j < factions.length; j++) {
        const faction1 = factions[i];
        const faction2 = factions[j];
        
        const currentRelation = faction1.diplomacy?.relations?.[faction2.id] || 0;
        const interaction = this.calculateDiplomaticChange(faction1, faction2, currentRelation);
        
        if (interaction.relationChange !== 0) {
          interactions.push({
            faction1: faction1.id,
            faction2: faction2.id,
            type: interaction.type,
            relationChange: interaction.relationChange,
            description: interaction.description
          });
        }
      }
    }
    
    return interactions;
  }

  static calculateDiplomaticChange(faction1: any, faction2: any, currentRelation: number): any {
    let relationChange = 0;
    let type = 'neutral';
    let description = '';
    
    // Economic factors
    const economicGap = Math.abs((faction1.economy?.wealth || 50) - (faction2.economy?.wealth || 50));
    if (economicGap > 30) {
      relationChange -= 5;
      type = 'economic_tension';
      description = 'Economic inequality creates tension';
    }
    
    // Cultural compatibility
    const culturalAlignment = this.calculateCulturalCompatibility(faction1, faction2);
    relationChange += culturalAlignment * 3;
    
    // Military threat assessment
    const militaryThreat = this.calculateMilitaryThreat(faction1, faction2);
    if (militaryThreat > 0.7) {
      relationChange -= 10;
      type = 'military_tension';
      description = 'Military buildup creates suspicion';
    }
    
    // Trade benefits
    if (this.hasTradeRoute(faction1, faction2)) {
      relationChange += 8;
      type = 'trade_cooperation';
      description = 'Trade relations improve understanding';
    }
    
    // Natural drift towards neutrality
    if (currentRelation > 0) relationChange -= 1;
    else if (currentRelation < 0) relationChange += 1;
    
    return { relationChange, type, description };
  }

  static calculateCulturalCompatibility(faction1: any, faction2: any): number {
    const values1 = faction1.culture?.core_values || [];
    const values2 = faction2.culture?.core_values || [];
    
    const commonValues = values1.filter((v: string) => values2.includes(v));
    const totalValues = new Set([...values1, ...values2]).size;
    
    return totalValues > 0 ? (commonValues.length / totalValues) * 2 - 1 : 0;
  }

  static calculateMilitaryThreat(faction1: any, faction2: any): number {
    const army1 = faction1.military?.army_size || 0;
    const army2 = faction2.military?.army_size || 0;
    const tech1 = faction1.military?.weapon_tech || 1;
    const tech2 = faction2.military?.weapon_tech || 1;
    
    const power1 = army1 * tech1;
    const power2 = army2 * tech2;
    
    return Math.max(power1, power2) > 0 ? Math.abs(power1 - power2) / Math.max(power1, power2) : 0;
  }

  static hasTradeRoute(faction1: any, faction2: any): boolean {
    const routes1 = faction1.economy?.trade_routes || [];
    const routes2 = faction2.economy?.trade_routes || [];
    
    return routes1.includes(faction2.home_region) || routes2.includes(faction1.home_region);
  }

  static simulateEconomicFluctuations(factions: any[], globalEvents: any[]): any {
    const marketConditions = {
      foodPrice: 1.0 + (Math.random() - 0.5) * 0.3,
      metalPrice: 1.0 + (Math.random() - 0.5) * 0.4,
      luxuryPrice: 1.0 + (Math.random() - 0.5) * 0.6,
      tradeVolume: 1.0 + (Math.random() - 0.5) * 0.2
    };
    
    // Global events affect markets
    for (const event of globalEvents) {
      if (event.event_type === 'environmental' && event.description.includes('drought')) {
        marketConditions.foodPrice *= 1.5;
      }
      if (event.event_type === 'political' && event.description.includes('war')) {
        marketConditions.metalPrice *= 1.3;
        marketConditions.tradeVolume *= 0.7;
      }
    }
    
    return marketConditions;
  }

  static simulateDiseaseSpreads(factions: any[], globalHealth: number): any[] {
    const diseaseEvents = [];
    
    // Base chance of disease outbreak
    let diseaseChance = 0.05;
    
    // Higher population density increases risk
    const totalPop = factions.reduce((sum, f) => sum + (f.population?.total || f.population || 0), 0);
    if (totalPop > 10000) diseaseChance += 0.03;
    
    // Trade increases spread risk
    const tradeConnections = factions.reduce((sum, f) => sum + (f.economy?.trade_routes?.length || 0), 0);
    diseaseChance += tradeConnections * 0.01;
    
    if (Math.random() < diseaseChance) {
      const diseases = ['plague', 'fever', 'pox', 'wasting_disease', 'lung_rot'];
      const disease = diseases[Math.floor(Math.random() * diseases.length)];
      
      // Pick a starting faction (higher pop = higher chance)
      const weights = factions.map(f => f.population?.total || f.population || 0);
      const totalWeight = weights.reduce((sum, w) => sum + w, 0);
      let random = Math.random() * totalWeight;
      let startingFaction = factions[0];
      
      for (let i = 0; i < factions.length; i++) {
        random -= weights[i];
        if (random <= 0) {
          startingFaction = factions[i];
          break;
        }
      }
      
      diseaseEvents.push({
        type: 'disease_outbreak',
        disease,
        startingFaction: startingFaction.id,
        severity: Math.random() * 0.3 + 0.1, // 10-40% severity
        description: `A ${disease} outbreak begins in ${startingFaction.name}`
      });
    }
    
    return diseaseEvents;
  }

  static simulateNaturalDisasters(world: any, turn: number): any[] {
    const disasters = [];
    const regions = world.regions || [];
    
    for (const region of regions) {
      const hazards = world.environment?.ecology?.natural_hazards || [];
      const baseChance = 0.02; // 2% chance per region per turn
      
      for (const hazard of hazards) {
        if (Math.random() < baseChance) {
          disasters.push({
            type: 'natural_disaster',
            disaster: hazard,
            region: region.id || region.name,
            severity: Math.random() * 0.4 + 0.1, // 10-50% severity
            description: `A ${hazard} strikes ${region.name}`
          });
        }
      }
    }
    
    return disasters;
  }

  static simulatePopulationMigration(factions: any[], globalEvents: any[]): any[] {
    const migrations = [];
    
    for (const faction of factions) {
      const happiness = faction.stability?.internal_happiness || 50;
      const security = faction.military?.army_size || 0;
      const prosperity = faction.economy?.wealth || 50;
      
      // Migration pressure calculation
      let migrationPressure = 0;
      
      if (happiness < 30) migrationPressure += 0.3;
      if (prosperity < 20) migrationPressure += 0.2;
      if (security < 50) migrationPressure += 0.1;
      
      // Global events increase migration
      for (const event of globalEvents) {
        if (event.type === 'natural_disaster' && event.region === faction.home_region) {
          migrationPressure += 0.4;
        }
        if (event.type === 'disease_outbreak' && event.startingFaction === faction.id) {
          migrationPressure += 0.2;
        }
      }
      
      if (migrationPressure > 0.3 && Math.random() < migrationPressure) {
        const migrantCount = Math.floor((faction.population?.total || faction.population || 0) * (Math.random() * 0.15 + 0.05));
        
        migrations.push({
          from: faction.id,
          migrantCount,
          reason: migrationPressure > 0.5 ? 'crisis_flight' : 'economic_seeking',
          description: `${migrantCount} people leave ${faction.name} seeking better conditions`
        });
      }
    }
    
    return migrations;
  }
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
    
    // Calculate advanced simulation data
    const climateEffects = AdvancedSimulationEngine.calculateClimateEffects(world, world.currentTurn || 0);
    const diplomaticTensions = AdvancedSimulationEngine.simulateDiplomaticInteractions(factions);
    const economicConditions = AdvancedSimulationEngine.simulateEconomicFluctuations(factions, []);
    const healthCrises = AdvancedSimulationEngine.simulateDiseaseSpreads(factions, 75);
    const naturalDisasters = AdvancedSimulationEngine.simulateNaturalDisasters(world, world.currentTurn || 0);
    const migrations = AdvancedSimulationEngine.simulatePopulationMigration(factions, [...healthCrises, ...naturalDisasters]);
    
    return `You are the advanced AI narrator for a sophisticated god simulation with deep, interconnected systems. Generate complex events that emerge from the detailed simulation of climate, economics, diplomacy, health, and population dynamics.

WORLD STATE ANALYSIS:
World: ${world.name} (Year ${world.currentState?.year || 1}, ${world.currentState?.season || 'Spring'})
Divine Being: ${world.setupAnswers?.supremeBeing?.name} (${world.setupAnswers?.supremeBeing?.type})
Current Weather: ${world.currentState?.weather || 'Fair'}
Power Balance: ${world.currentState?.balanceOfPower || 'Stable'}

ADVANCED SIMULATION DATA:
Climate Status: ${climateEffects.season} season, ${climateEffects.temperature}°C
${climateEffects.weatherEvent ? `Weather Event: ${climateEffects.weatherEvent}` : 'Weather: Normal conditions'}
Agriculture Impact: ${Math.round(climateEffects.effectOnAgriculture * 100)}% of normal
Health Impact: ${Math.round(climateEffects.effectOnHealth * 100)}% of normal
Trade Impact: ${Math.round(climateEffects.effectOnTrade * 100)}% of normal

Economic Conditions:
- Food prices: ${Math.round(economicConditions.foodPrice * 100)}% of baseline
- Metal prices: ${Math.round(economicConditions.metalPrice * 100)}% of baseline  
- Luxury prices: ${Math.round(economicConditions.luxuryPrice * 100)}% of baseline
- Trade volume: ${Math.round(economicConditions.tradeVolume * 100)}% of normal

Diplomatic Situation:
${diplomaticTensions.length > 0 ? diplomaticTensions.map(d => `- ${d.description} between ${d.faction1} and ${d.faction2}`).join('\n') : '- No major diplomatic incidents'}

Health & Crisis Status:
${healthCrises.length > 0 ? healthCrises.map(h => `- ${h.description}`).join('\n') : '- No disease outbreaks reported'}
${naturalDisasters.length > 0 ? naturalDisasters.map(d => `- ${d.description}`).join('\n') : '- No natural disasters'}

Population Movements:
${migrations.length > 0 ? migrations.map(m => `- ${m.description}`).join('\n') : '- No significant population movements'}

FACTION ANALYSIS:
${factions.map((f: any) => `
- ${f.name} (${f.type}): Pop ${f.population?.total || f.population}, Strength ${f.strength}
  Economy: Wealth ${f.economy?.wealth || 50}, Focus: ${f.economy?.economic_focus || 'mixed'}
  Military: Army ${f.military?.army_size || 0}, Tech Level ${f.military?.weapon_tech || 1}
  Health: Population Health ${f.health?.populationHealth || 75}%
  Stability: Happiness ${f.stability?.internal_happiness || 50}, Loyalty ${f.stability?.loyalty_to_leadership || 50}
  Current Issues: ${f.stability?.potential_issues?.join(', ') || 'None reported'}
  Diplomatic Relations: ${Object.entries(f.diplomacy?.relations || {}).map(([k, v]) => `${k}: ${v}`).join(', ') || 'None established'}
`).join('')}

REGIONAL SITUATION:
${regions.map((r: any) => `
- ${r.name}: ${r.geography}
  Strategic Value: ${r.strategic_value || 'Unknown'}/10, Natural Defenses: ${r.natural_defenses || 'Unknown'}/10
  Trade Access: ${r.trade_accessibility || 'Unknown'}/10
  Resources: ${Object.entries(r.resources || {}).map(([k, v]) => `${k}:${v}`).join(', ')}
`).join('')}

RECENT EVENTS CONTEXT:
${recentEvents.map((e: any) => `Turn ${e.turnNumber}: ${typeof e.narrative === 'string' ? e.narrative : e.narrative?.opening || 'Event occurred'}`).join('\n')}

${playerAction ? `\nRECENT DIVINE INTERVENTION: ${playerAction}\nThe consequences of your divine action ripple through the world...` : '\nNo recent divine intervention - the world evolves according to natural forces and mortal choices...'}

ADVANCED EVENT GENERATION REQUIREMENTS:
1. Integrate the simulation data above into a coherent, interconnected narrative
2. Show how climate affects agriculture, which affects economics, which affects politics
3. Demonstrate how diplomatic tensions arise from resource competition and cultural differences  
4. Include the ripple effects of health crises, natural disasters, and population movements
5. Create events that emerge from the intersection of multiple systems (e.g., drought + trade disruption + diplomatic tension)
6. Show both immediate consequences and long-term systemic changes
7. Make factions feel like living societies with complex internal dynamics
8. Include unexpected emergent behaviors that arise from system interactions

SOPHISTICATED CHOICE DESIGN:
- Create morally complex choices with no clear optimal solution
- Show trade-offs between different aspects of civilization (stability vs. growth, tradition vs. innovation)
- Include options for different divine intervention styles (direct power, subtle influence, natural guidance, non-interference)
- Consider how divine personality and purpose affect available options and their outcomes
- Make choices feel consequential to the world's long-term trajectory
- Include unexpected synergies and conflicts between different divine actions

Return ONLY valid JSON in this exact format:
{
  "event_analysis": {
    "primary_drivers": ["specific_factors_driving_this_event"],
    "affected_systems": ["climate", "economy", "diplomacy", "military", "culture", "health", "demographics"],
    "urgency_level": number (1-10),
    "complexity_rating": number (1-10),
    "systemic_interactions": ["how_different_systems_interact_in_this_event"]
  },
  "narrative": {
    "opening": "Rich, immersive 2-3 paragraph description of the current situation, integrating multiple simulation systems and their interactions",
    "current_situation": "1-2 paragraphs describing the immediate challenge/opportunity with specific details from the simulation data", 
    "stakes": "1 paragraph explaining the long-term consequences and systemic implications",
    "divine_perspective": "Reflection on how this appears to the divine observer, considering their nature and purpose"
  },
  "choices": [
    {
      "id": "choice1",
      "text": "🌟 [Divine Action]: Specific intervention with systemic implications (intended benefits, potential unintended consequences)",
      "icon": "🌟",
      "divine_cost": number (1-10),
      "immediate_effects": ["specific_short_term_outcomes"],
      "long_term_consequences": ["specific_long_term_systemic_changes"],
      "affected_factions": ["faction_ids"],
      "systemic_impacts": {"system_name": impact_description}
    }
  ],
  "world_state_changes": {
    "environmental_shifts": {
      "climate_effects": {"temperature": change, "rainfall": change, "extreme_weather_frequency": change},
      "resource_changes": {"resource_type": change_amount},
      "ecological_impact": number (-1 to 1),
      "carrying_capacity_change": number
    },
    "faction_developments": [
      {
        "faction_id": "faction_id",
        "population_change": number,
        "wealth_change": number,
        "stability_change": number,
        "military_change": number,
        "health_change": number,
        "technology_progress": {"category": "tech_advancement"},
        "cultural_evolution": ["new_cultural_traits"],
        "diplomatic_shifts": {"other_faction_id": relationship_change},
        "strategic_changes": "detailed_description_of_new_priorities_and_goals",
        "economic_adaptations": ["how_economy_adapts_to_changes"],
        "social_transformations": ["how_society_changes"]
      }
    ],
    "regional_changes": [
      {
        "region_id": "region_id", 
        "infrastructure_development": number (-10 to 10),
        "resource_discovery": {"resource": amount},
        "strategic_importance_change": number (-5 to 5),
        "population_density_change": number,
        "trade_route_changes": ["new_or_modified_trade_connections"]
      }
    ],
    "global_events": [
      {
        "event_type": "technological/cultural/economic/political/environmental/health/demographic",
        "description": "Detailed description of world-spanning change",
        "timeline": "immediate/short_term/medium_term/long_term",
        "probability_of_spread": number (0-1),
        "systemic_dependencies": ["which_systems_this_depends_on"]
      }
    ],
    "emerging_trends": [
      {
        "trend_name": "Descriptive name of emerging pattern",
        "description": "What is changing across multiple systems",
        "affected_systems": ["list_of_affected_systems"],
        "potential_outcomes": ["specific_possible_end_states"],
        "time_to_impact": number (1-20 turns),
        "intervention_opportunities": ["ways_divine_can_influence_this_trend"]
      }
    ],
    "systemic_feedback_loops": [
      {
        "loop_name": "Name of feedback mechanism",
        "description": "How this creates ongoing systemic changes",
        "reinforcing_or_balancing": "reinforcing/balancing",
        "time_scale": "immediate/short/medium/long"
      }
    ]
  }
}

Generate an event that showcases the sophisticated interactions between all these systems, creating an emergent story that feels organic and meaningful.`;
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
            strength: 65,
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
            strength: 70,
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

    // Save the enhanced world data using a mutation call
    await ctx.runMutation(api.worldSetup.updateWorldGeneration, {
      worldId: args.worldId,
      worldData: {
        name: worldData.worldName,
        regions: worldData.regions,
        factions: worldData.factions,
        beliefSystems: worldData.global_systems?.belief_systems?.map((bs: any) => bs.name) || [],
      },
    });

    // Update additional fields that aren't in the original mutation
    // We'll need to extend the worldSetup mutation to handle these later

    return worldData;
  },
});

export const generateAdvancedTurnEvent = action({
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

    // Save the advanced event using the mutation
    const newTurn = world.currentTurn + 1;
    
    // For now, let's use the existing saveGameEvent structure 
    const legacyEventData = {
      narrative: typeof eventData.narrative === 'string' ? eventData.narrative : eventData.narrative?.opening || "Advanced event occurred",
      choices: eventData.choices || [],
      worldStateChanges: {
        factionChanges: eventData.world_state_changes?.faction_developments?.map((change: any) => ({
          factionName: change.faction_id,
          changes: change.strategic_changes || "faction updated"
        })) || [],
        environmentChanges: "Environmental changes occurred",
        newEvents: eventData.world_state_changes?.emerging_trends?.map((trend: any) => trend.trend_name) || []
      }
    };

    // Use the existing saveGameEvent mutation for now
    await ctx.runMutation(api.gameEngine.saveGameEvent, {
      worldId: args.worldId,
      turnNumber: newTurn,
      eventData: legacyEventData,
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

// Advanced analytics and metrics tracking
export const getCivilizationAnalytics = query({
  args: { worldId: v.id("worlds") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    const world = await ctx.db.get(args.worldId);
    if (!world || world.userId !== userId) return null;

    const events = await ctx.db
      .query("gameEvents")
      .withIndex("by_world_and_turn", (q) => q.eq("worldId", args.worldId))
      .order("desc")
      .take(20);

    const analytics = {
      worldOverview: {
        age: world.currentState?.year || 1,
        totalPopulation: world.factions?.reduce((sum: number, f: any) => 
          sum + (f.population?.total || f.population || 0), 0) || 0,
        averageWealth: world.factions?.reduce((sum: number, f: any) => 
          sum + (f.economy?.wealth || 50), 0) / Math.max(1, world.factions?.length || 1) || 50,
        averageStability: world.factions?.reduce((sum: number, f: any) => 
          sum + (f.stability?.internal_happiness || 50), 0) / Math.max(1, world.factions?.length || 1) || 50,
        militarization: world.factions?.reduce((sum: number, f: any) => 
          sum + (f.military?.army_size || 0), 0) || 0,
        technologicalLevel: world.factions?.reduce((sum: number, f: any) => 
          sum + (f.technology?.level || 1), 0) / Math.max(1, world.factions?.length || 1) || 1,
      },
      
      factionPowerRankings: world.factions?.map((f: any) => ({
        name: f.name,
        powerScore: calculateFactionPower(f),
        population: f.population?.total || f.population || 0,
        wealth: f.economy?.wealth || 50,
        military: f.military?.army_size || 0,
        stability: f.stability?.internal_happiness || 50,
        technology: f.technology?.level || 1,
        culturalInfluence: f.culture?.cultural_influence || 0,
        diplomaticStanding: calculateDiplomaticStanding(f, world.factions || []),
      })).sort((a: any, b: any) => b.powerScore - a.powerScore) || [],
      
      systemicHealth: {
        economic: calculateEconomicHealth(world),
        environmental: calculateEnvironmentalHealth(world),
        social: calculateSocialHealth(world),
        political: calculatePoliticalHealth(world),
        technological: calculateTechnologicalHealth(world),
      },
      
      eventAnalysis: {
        recentTrends: analyzeEventTrends(events),
        crisisFrequency: calculateCrisisFrequency(events),
        divineInterventionImpact: analyzeDivineImpact(events),
        emergingThreats: identifyEmergingThreats(world, events),
      },
      
      predictions: {
        shortTerm: generateShortTermPredictions(world, events),
        longTerm: generateLongTermPredictions(world, events),
        riskFactors: identifyRiskFactors(world),
        opportunities: identifyOpportunities(world),
      }
    };

    return analytics;
  },
});

// Helper methods for analytics (these would be static methods in a real implementation)
const calculateFactionPower = (faction: any): number => {
  const population = faction.population?.total || faction.population || 0;
  const wealth = faction.economy?.wealth || 50;
  const military = faction.military?.army_size || 0;
  const technology = faction.technology?.level || 1;
  const stability = faction.stability?.internal_happiness || 50;
  
  return (population * 0.3) + (wealth * 0.2) + (military * 0.25) + (technology * 10) + (stability * 0.15);
};

const calculateDiplomaticStanding = (faction: any, allFactions: any[]): number => {
  const relations = faction.diplomacy?.relations || {};
  const scores = Object.values(relations) as number[];
  return scores.length > 0 ? scores.reduce((sum, score) => sum + score, 0) / scores.length : 0;
};

const calculateEconomicHealth = (world: any): number => {
  const factions = world.factions || [];
  const avgWealth = factions.reduce((sum: number, f: any) => sum + (f.economy?.wealth || 50), 0) / Math.max(1, factions.length);
  const tradeConnectivity = factions.reduce((sum: number, f: any) => sum + (f.economy?.trade_routes?.length || 0), 0);
  return Math.min(100, (avgWealth + tradeConnectivity * 2));
};

const calculateEnvironmentalHealth = (world: any): number => {
  const ecology = world.environment?.ecology;
  if (!ecology) return 75;
  
  const biodiversity = ecology.biodiversity || 75;
  const hazardCount = ecology.natural_hazards?.length || 0;
  return Math.max(0, biodiversity - (hazardCount * 5));
};

const calculateSocialHealth = (world: any): number => {
  const factions = world.factions || [];
  const avgHappiness = factions.reduce((sum: number, f: any) => sum + (f.stability?.internal_happiness || 50), 0) / Math.max(1, factions.length);
  const avgLoyalty = factions.reduce((sum: number, f: any) => sum + (f.stability?.loyalty_to_leadership || 50), 0) / Math.max(1, factions.length);
  return (avgHappiness + avgLoyalty) / 2;
};

const calculatePoliticalHealth = (world: any): number => {
  const factions = world.factions || [];
  let stabilityScore = 0;
  let conflictPenalty = 0;
  
  for (const faction of factions) {
    stabilityScore += faction.stability?.succession_stability || 50;
    if (faction.stability?.potential_issues?.length > 0) {
      conflictPenalty += faction.stability.potential_issues.length * 5;
    }
  }
  
  const avgStability = stabilityScore / Math.max(1, factions.length);
  return Math.max(0, avgStability - conflictPenalty);
};

const calculateTechnologicalHealth = (world: any): number => {
  const factions = world.factions || [];
  const avgTechLevel = factions.reduce((sum: number, f: any) => sum + (f.technology?.level || 1), 0) / Math.max(1, factions.length);
  const avgInnovation = factions.reduce((sum: number, f: any) => sum + (f.technology?.innovation_rate || 0.5), 0) / Math.max(1, factions.length);
  return Math.min(100, (avgTechLevel * 15) + (avgInnovation * 30));
};

const analyzeEventTrends = (events: any[]): string[] => {
  const trends = [];
  let conflictCount = 0;
  let cooperationCount = 0;
  let crisisCount = 0;
  
  for (const event of events) {
    const narrative = typeof event.narrative === 'string' ? event.narrative : event.narrative?.opening || '';
    if (narrative.toLowerCase().includes('conflict') || narrative.toLowerCase().includes('war')) conflictCount++;
    if (narrative.toLowerCase().includes('cooperation') || narrative.toLowerCase().includes('alliance')) cooperationCount++;
    if (narrative.toLowerCase().includes('crisis') || narrative.toLowerCase().includes('disaster')) crisisCount++;
  }
  
  if (conflictCount > cooperationCount) trends.push('Rising tensions and conflicts');
  if (cooperationCount > conflictCount) trends.push('Increasing cooperation and diplomacy');
  if (crisisCount > events.length * 0.3) trends.push('High frequency of crises and disasters');
  if (conflictCount === 0 && cooperationCount === 0) trends.push('Political stagnation');
  
  return trends;
};

const calculateCrisisFrequency = (events: any[]): number => {
  const crisisEvents = events.filter(e => {
    const narrative = typeof e.narrative === 'string' ? e.narrative : e.narrative?.opening || '';
    return narrative.toLowerCase().includes('crisis') || 
           narrative.toLowerCase().includes('disaster') ||
           narrative.toLowerCase().includes('plague') ||
           narrative.toLowerCase().includes('war');
  });
  
  return events.length > 0 ? (crisisEvents.length / events.length) * 100 : 0;
};

const analyzeDivineImpact = (events: any[]): string => {
  const divineEvents = events.filter(e => e.playerAction);
  if (divineEvents.length === 0) return 'Minimal divine intervention';
  
  const impactLevel = divineEvents.length / events.length;
  if (impactLevel > 0.7) return 'Highly active divine presence';
  if (impactLevel > 0.4) return 'Moderate divine intervention';
  return 'Occasional divine guidance';
};

const identifyEmergingThreats = (world: any, events: any[]): string[] => {
  const threats = [];
  const factions = world.factions || [];
  
  // Check for military buildups
  const militarizedFactions = factions.filter((f: any) => (f.military?.army_size || 0) > 200);
  if (militarizedFactions.length > 1) threats.push('Military arms race detected');
  
  // Check for economic instability
  const poorFactions = factions.filter((f: any) => (f.economy?.wealth || 50) < 25);
  if (poorFactions.length > factions.length * 0.4) threats.push('Economic inequality crisis');
  
  // Check for social unrest
  const unstableFactions = factions.filter((f: any) => (f.stability?.internal_happiness || 50) < 30);
  if (unstableFactions.length > 0) threats.push('Social unrest and instability');
  
  // Check recent crisis events
  const recentCrises = events.slice(0, 5).filter(e => {
    const narrative = typeof e.narrative === 'string' ? e.narrative : e.narrative?.opening || '';
    return narrative.toLowerCase().includes('crisis') || narrative.toLowerCase().includes('disaster');
  });
  if (recentCrises.length > 2) threats.push('Cascading crisis pattern');
  
  return threats;
};

const generateShortTermPredictions = (world: any, events: any[]): string[] => {
  const predictions = [];
  const factions = world.factions || [];
  
  // Population trends
  const totalPop = factions.reduce((sum: number, f: any) => sum + (f.population?.total || f.population || 0), 0);
  if (totalPop > 5000) predictions.push('Population growth may strain resources');
  
  // Military tensions
  const highMilitary = factions.filter((f: any) => (f.military?.army_size || 0) > 150);
  if (highMilitary.length > 1) predictions.push('Military conflicts likely in coming seasons');
  
  // Economic opportunities
  const richFactions = factions.filter((f: any) => (f.economy?.wealth || 50) > 70);
  if (richFactions.length > 0) predictions.push('Economic expansion and trade growth expected');
  
  return predictions;
};

const generateLongTermPredictions = (world: any, events: any[]): string[] => {
  const predictions = [];
  const factions = world.factions || [];
  
  // Technological advancement
  const avgTech = factions.reduce((sum: number, f: any) => sum + (f.technology?.level || 1), 0) / Math.max(1, factions.length);
  if (avgTech > 2.5) predictions.push('Technological revolution may reshape civilization');
  
  // Political evolution
  const avgStability = factions.reduce((sum: number, f: any) => sum + (f.stability?.succession_stability || 50), 0) / Math.max(1, factions.length);
  if (avgStability < 40) predictions.push('Political systems may undergo major reorganization');
  
  // Cultural development
  const culturalDiversity = new Set(factions.flatMap((f: any) => f.culture?.core_values || [])).size;
  if (culturalDiversity > 10) predictions.push('Cultural synthesis may create new belief systems');
  
  return predictions;
};

const identifyRiskFactors = (world: any): string[] => {
  const risks = [];
  const factions = world.factions || [];
  
  // Environmental risks
  const hazards = world.environment?.ecology?.natural_hazards || [];
  if (hazards.length > 3) risks.push('High environmental disaster risk');
  
  // Social risks
  const unhappyFactions = factions.filter((f: any) => (f.stability?.internal_happiness || 50) < 40);
  if (unhappyFactions.length > factions.length * 0.3) risks.push('Social unrest risk');
  
  // Economic risks
  const economicGap = Math.max(...factions.map((f: any) => f.economy?.wealth || 50)) - 
                     Math.min(...factions.map((f: any) => f.economy?.wealth || 50));
  if (economicGap > 50) risks.push('Economic inequality destabilization risk');
  
  return risks;
};

const identifyOpportunities = (world: any): string[] => {
  const opportunities = [];
  const factions = world.factions || [];
  
  // Diplomatic opportunities
  const neutralRelations = factions.filter((f: any) => {
    const relations = Object.values(f.diplomacy?.relations || {}) as number[];
    return relations.every(r => Math.abs(r) < 20);
  });
  if (neutralRelations.length > 1) opportunities.push('Diplomatic alliance formation opportunity');
  
  // Economic opportunities
  const developingFactions = factions.filter((f: any) => 
    (f.economy?.wealth || 50) > 40 && (f.technology?.innovation_rate || 0.5) > 0.6
  );
  if (developingFactions.length > 0) opportunities.push('Economic boom and trade expansion opportunity');
  
  // Cultural opportunities
  const adaptableFactions = factions.filter((f: any) => (f.culture?.adaptability || 0.5) > 0.7);
  if (adaptableFactions.length > 1) opportunities.push('Cultural exchange and innovation opportunity');
  
  return opportunities;
};

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

// Original functions maintained for backward compatibility
export const generateWorld = generateAdvancedWorld;
export const generateTurnEvent = generateAdvancedTurnEvent;

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
    // Use the legacy format for backward compatibility
    return await ctx.db.insert("gameEvents", {
      worldId: args.worldId,
      turnNumber: args.turnNumber,
      eventType: "divine_action",
      narrative: args.eventData.narrative,
      playerAction: args.playerAction,
      choices: args.eventData.choices,
      worldStateChanges: args.eventData.worldStateChanges,
    });
  },
});
