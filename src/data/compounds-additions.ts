// apps/web/src/data/compounds-additions.ts
//
// Append these objects to the COMPOUNDS array in compounds.ts.
// Every one of these was referenced by a ReactionRule in reactions.ts
// but never actually defined, so those reactions were silently broken
// (COMPOUND_MAP.get() returned undefined for products/reactants).

import { Compound } from '../types';

export const COMPOUND_ADDITIONS: Compound[] = [
  {
    id: 'sulfur', name: 'Sulfur', formula: 'S', molecularMass: 32.06,
    atoms: [{ id: 'S1', element: 'S', x: 0, y: 0, z: 0, formalCharge: 0, lonePairs: 0 }],
    bonds: [],
    properties: {
      meltingPoint: 388.36, boilingPoint: 717.87, phaseAtSTP: 'solid', color: '#FFFF30',
      acidity: 'neutral', polarity: 'nonpolar', solubilityInWater: 'insoluble',
      enthalpyOfFormation: 0, entropy: 32.1, restricted: false,
      tags: ['element', 'nonmetal'],
    },
    geometryHints: {},
  },
  {
    id: 'calcium-chloride', name: 'Calcium Chloride', formula: 'CaCl₂', molecularMass: 110.98,
    atoms: [
      { id: 'Ca1', element: 'Ca', x: 0, y: 0, z: 0, formalCharge: 2, lonePairs: 0 },
      { id: 'Cl1', element: 'Cl', x: 2.5, y: 0.5, z: 0, formalCharge: -1, lonePairs: 3 },
      { id: 'Cl2', element: 'Cl', x: -2.5, y: 0.5, z: 0, formalCharge: -1, lonePairs: 3 },
    ],
    bonds: [
      { from: 'Ca1', to: 'Cl1', type: 'single' },
      { from: 'Ca1', to: 'Cl2', type: 'single' },
    ],
    properties: {
      meltingPoint: 1045, boilingPoint: 1935, phaseAtSTP: 'solid', color: '#FFFFFF',
      acidity: 'neutral', polarity: 'ionic', solubilityInWater: 'soluble',
      enthalpyOfFormation: -795.4, entropy: 108.4, restricted: false,
      tags: ['salt', 'de-icer', 'ionic-crystal'],
    },
    geometryHints: { Ca1: { shape: 'bent', bondAngle: 180 } },
  },
  {
    id: 'sodium-nitrate', name: 'Sodium Nitrate', formula: 'NaNO₃', molecularMass: 84.99,
    atoms: [
      { id: 'Na1', element: 'Na', x: 0, y: 0, z: 0, formalCharge: 1, lonePairs: 0 },
      { id: 'N1', element: 'N', x: 2.5, y: 0, z: 0, formalCharge: 1, lonePairs: 0 },
      { id: 'O1', element: 'O', x: 3.5, y: 0.8, z: 0, formalCharge: -1, lonePairs: 2 },
      { id: 'O2', element: 'O', x: 3.5, y: -0.8, z: 0, formalCharge: -1, lonePairs: 2 },
      { id: 'O3', element: 'O', x: 2.5, y: 0, z: 1.2, formalCharge: -1, lonePairs: 2 },
    ],
    bonds: [
      { from: 'N1', to: 'O1', type: 'single' },
      { from: 'N1', to: 'O2', type: 'single' },
      { from: 'N1', to: 'O3', type: 'double' },
    ],
    properties: {
      meltingPoint: 580, boilingPoint: 653, phaseAtSTP: 'solid', color: '#FFFFFF',
      acidity: 'neutral', polarity: 'ionic', solubilityInWater: 'soluble',
      enthalpyOfFormation: -467.9, entropy: 116.5, restricted: false,
      tags: ['salt', 'fertilizer', 'soluble'],
    },
    geometryHints: { N1: { shape: 'trigonal-planar', bondAngle: 120 } },
  },
  {
    id: 'silver-chloride', name: 'Silver Chloride', formula: 'AgCl', molecularMass: 143.32,
    atoms: [
      { id: 'Ag1', element: 'Ag', x: 0, y: 0, z: 0, formalCharge: 1, lonePairs: 0 },
      { id: 'Cl1', element: 'Cl', x: 2.28, y: 0, z: 0, formalCharge: -1, lonePairs: 3 },
    ],
    bonds: [{ from: 'Ag1', to: 'Cl1', type: 'single' }],
    properties: {
      meltingPoint: 728, boilingPoint: 1837, phaseAtSTP: 'solid', color: '#FFFFFF',
      acidity: 'neutral', polarity: 'ionic', solubilityInWater: 'insoluble',
      enthalpyOfFormation: -127.0, entropy: 96.3, restricted: false,
      tags: ['precipitate', 'photo-sensitive', 'insoluble'],
    },
    geometryHints: {},
  },
  {
    id: 'ethyl-acetate', name: 'Ethyl Acetate', formula: 'CH₃COOC₂H₅', molecularMass: 88.11,
    atoms: [
      { id: 'C1', element: 'C', x: 0, y: 0, z: 0, formalCharge: 0, lonePairs: 0 },
      { id: 'C2', element: 'C', x: 1.54, y: 0, z: 0, formalCharge: 0, lonePairs: 0 },
      { id: 'O1', element: 'O', x: 2.24, y: 1.0, z: 0, formalCharge: 0, lonePairs: 2 },
      { id: 'O2', element: 'O', x: 2.24, y: -1.0, z: 0, formalCharge: 0, lonePairs: 2 },
      { id: 'C3', element: 'C', x: 3.74, y: -1.0, z: 0, formalCharge: 0, lonePairs: 0 },
      { id: 'C4', element: 'C', x: 4.44, y: -2.0, z: 0, formalCharge: 0, lonePairs: 0 },
    ],
    bonds: [
      { from: 'C1', to: 'C2', type: 'single' },
      { from: 'C2', to: 'O1', type: 'double' },
      { from: 'C2', to: 'O2', type: 'single' },
      { from: 'O2', to: 'C3', type: 'single' },
      { from: 'C3', to: 'C4', type: 'single' },
    ],
    properties: {
      meltingPoint: 189.6, boilingPoint: 350.3, phaseAtSTP: 'liquid', color: '#EEFFEE',
      acidity: 'neutral', polarity: 'polar', solubilityInWater: 'slightly',
      enthalpyOfFormation: -463.2, entropy: 259.4, restricted: false,
      tags: ['ester', 'solvent', 'organic', 'fruity-odor'],
    },
    geometryHints: { C2: { shape: 'trigonal-planar', bondAngle: 120 } },
  },
  {
    id: 'iron', name: 'Iron', formula: 'Fe', molecularMass: 55.845,
    atoms: [{ id: 'Fe1', element: 'Fe', x: 0, y: 0, z: 0, formalCharge: 0, lonePairs: 0 }],
    bonds: [],
    properties: {
      meltingPoint: 1811, boilingPoint: 3134, phaseAtSTP: 'solid', color: '#E06633',
      acidity: 'neutral', polarity: 'nonpolar', solubilityInWater: 'insoluble',
      enthalpyOfFormation: 0, entropy: 27.3, restricted: false,
      tags: ['element', 'metal', 'transition-metal'],
    },
    geometryHints: {},
  },
];
