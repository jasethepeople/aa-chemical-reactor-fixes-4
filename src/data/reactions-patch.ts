// apps/web/src/data/reactions-patch.ts
//
// Replace the corresponding entries in REACTION_RULES (reactions.ts) with
// these. Changes made and why:
//
// 1. neutralization-carbonate: 'calcium-chloride' now exists (see
//    compounds-additions.ts) instead of pointing at nothing.
// 2. precipitation-silver-chloride: 'silver-chloride' and 'sodium-nitrate'
//    now exist.
// 3. redox-iron-rust: was reacting a nonexistent 'iron-oxide-precursor'.
//    Fixed to react real 'iron' + oxygen + water -> iron-oxide.
// 4. esterification: catalyst id changed from the never-defined
//    'sulfuric-acid-catalyst' to the real compound id 'sulfuric-acid',
//    which is already in COMPOUNDS and addable by the user, so the
//    catalyst check can actually pass.
// 5. haber-bosch: catalyst id changed from 'iron-catalyst' to the real
//    compound id 'iron' (now defined). Same reasoning as #4 — as written,
//    no addable substance could ever satisfy requiresCatalyst, so this
//    reaction always ran at the 0.01x kinetic penalty.
// 6. sulfur-combustion: 'sulfur' is now a real compound (elemental S),
//    so it's addable in the substance library and this reaction is
//    actually reachable.

import { ReactionRule } from '../types';

export const REACTION_RULES_PATCHED: ReactionRule[] = [
  {
    id: 'neutralization-carbonate',
    name: 'Acid + Carbonate',
    description: 'Acid reacts with carbonate to produce salt, water, and carbon dioxide gas.',
    reactantPattern: {
      compoundIds: ['hydrogen-chloride', 'calcium-carbonate'],
      stoichiometry: [2, 1],
    },
    products: [
      { compoundId: 'calcium-chloride', stoichiometry: 1 },
      { compoundId: 'water', stoichiometry: 1 },
      { compoundId: 'carbon-dioxide', stoichiometry: 1 },
    ],
    enthalpyChange: -65.0,
    activationEnergy: 15.0,
    preExponential: 5e9,
    visualEffects: [
      { type: 'gas-evolution', intensity: 'medium', duration: 5000 },
      { type: 'bubbles', intensity: 'high', duration: 5000 },
    ],
    learningNote: 'Carbonates effervesce (fizz) in acid due to CO₂ gas evolution. This is a classic chemical test.',
  },

  {
    id: 'precipitation-silver-chloride',
    name: 'Silver Chloride Precipitation',
    description: 'Mixing silver nitrate with sodium chloride produces an insoluble white precipitate.',
    reactantPattern: {
      compoundIds: ['silver-nitrate', 'sodium-chloride'],
      stoichiometry: [1, 1],
    },
    products: [
      { compoundId: 'silver-chloride', stoichiometry: 1 },
      { compoundId: 'sodium-nitrate', stoichiometry: 1 },
    ],
    enthalpyChange: -5.0,
    activationEnergy: 2.0,
    preExponential: 1e11,
    visualEffects: [
      { type: 'precipitate', color: '#FFFFFF', intensity: 'medium', duration: 3000 },
      { type: 'color-change', color: '#FFFFFF', intensity: 'low', duration: 2000 },
    ],
    learningNote: 'Precipitation occurs when the ionic product exceeds the solubility product (Ksp). AgCl is extremely insoluble.',
  },

  {
    id: 'redox-iron-rust',
    name: 'Iron Oxidation (Rust)',
    description: 'Iron reacts with oxygen and water to form hydrated iron(III) oxide.',
    reactantPattern: {
      compoundIds: ['iron', 'oxygen', 'water'],
      stoichiometry: [4, 3, 6],
    },
    products: [
      { compoundId: 'iron-oxide', stoichiometry: 4 },
    ],
    enthalpyChange: -1648.0,
    activationEnergy: 30.0,
    preExponential: 5e8,
    visualEffects: [
      { type: 'color-change', color: '#8B4513', intensity: 'medium', duration: 8000 },
      { type: 'crystals', intensity: 'low', duration: 10000 },
    ],
    learningNote: 'Rust is electrochemical corrosion. It requires both O₂ and H₂O. The reaction is spontaneous but kinetically slow without electrolytes.',
  },

  {
    id: 'haber-bosch',
    name: 'Haber-Bosch Process',
    description: 'Catalytic synthesis of ammonia from nitrogen and hydrogen.',
    reactantPattern: {
      compoundIds: ['nitrogen', 'hydrogen'],
      stoichiometry: [1, 3],
      minTemp: 673,
      requiresCatalyst: 'iron',
    },
    products: [
      { compoundId: 'ammonia', stoichiometry: 2 },
    ],
    enthalpyChange: -92.4,
    activationEnergy: 80.0,
    preExponential: 1e9,
    visualEffects: [
      { type: 'color-change', color: '#CCFFCC', intensity: 'low', duration: 5000 },
      { type: 'bubbles', intensity: 'low', duration: 5000 },
    ],
    learningNote: 'The Haber-Bosch process feeds half the world. High pressure and moderate temperature with an iron catalyst maximize ammonia yield.',
  },

  {
    id: 'esterification',
    name: 'Esterification',
    description: 'Acid + Alcohol → Ester + Water (condensation reaction).',
    reactantPattern: {
      compoundIds: ['acetic-acid', 'ethanol'],
      stoichiometry: [1, 1],
      minTemp: 350,
      requiresCatalyst: 'sulfuric-acid',
    },
    products: [
      { compoundId: 'ethyl-acetate', stoichiometry: 1 },
      { compoundId: 'water', stoichiometry: 1 },
    ],
    enthalpyChange: -3.0,
    activationEnergy: 60.0,
    preExponential: 5e7,
    visualEffects: [
      { type: 'color-change', color: '#DDEEFF', intensity: 'low', duration: 4000 },
      { type: 'bubbles', intensity: 'low', duration: 3000 },
    ],
    learningNote: 'Esterification is reversible. Removing water or ester shifts equilibrium right (Le Chatelier). Sulfuric acid acts as both catalyst and dehydrating agent.',
  },

  {
    id: 'sulfur-combustion',
    name: 'Sulfur Combustion',
    description: 'Sulfur burns in oxygen to form sulfur dioxide.',
    reactantPattern: {
      compoundIds: ['sulfur', 'oxygen'],
      stoichiometry: [1, 1],
      minTemp: 500,
    },
    products: [
      { compoundId: 'sulfur-dioxide', stoichiometry: 1 },
    ],
    enthalpyChange: -296.8,
    activationEnergy: 35.0,
    preExponential: 8e10,
    visualEffects: [
      { type: 'glow', color: '#FFFF00', intensity: 'high', duration: 3000 },
      { type: 'smoke', color: '#FFFFFF', intensity: 'medium', duration: 4000 },
    ],
    learningNote: 'Sulfur burns with a blue flame producing SO₂, the precursor to acid rain and sulfuric acid manufacture.',
  },
];
