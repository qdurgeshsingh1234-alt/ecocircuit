// Canonical e-waste category definitions.
// All slugs must match the server categories.ts mirror.
// Source: CPCB India E-waste Management Rules 2022; Global E-waste Monitor 2024

export interface CategoryInfo {
  id: string; // slug
  slug: string;
  name: string;
  shortName: string;
  icon: string; // key in iconMap
  color: string; // CSS var
  itemCount: number; // approximate
  examples: string[];
  hazards: string[];
  hazardDetails: string;
  whatToDo: string;
  disposalMethod: string;
  landfillRisk: 'critical' | 'high' | 'medium';
  riskLabel: string;
}

export const CATEGORIES: CategoryInfo[] = [
  {
    id: 'it-equipment',
    slug: 'it-equipment',
    name: 'IT Equipment',
    shortName: 'IT',
    icon: 'Monitor',
    color: 'var(--signal)',
    itemCount: 80,
    examples: ['Laptop', 'Desktop computer', 'Monitor', 'Printer', 'Router', 'External hard drive', 'Webcam', 'UPS', 'Projector', 'Server'],
    hazards: ['Lead', 'Mercury', 'Cadmium', 'Chromium VI', 'Beryllium'],
    hazardDetails:
      'Circuit boards and display panels in IT equipment contain lead solder and cadmium compounds. When landfilled, leachate carries these metals into groundwater at concentrations thousands of times above safe limits (WHO, 2023). Mercury in older LCD backlights evaporates and bioaccumulates in fish.',
    whatToDo: 'Back up data, factory-reset or securely wipe storage, remove SIM/SD cards, remove any removable batteries, and pack items so screens cannot crack.',
    disposalMethod: 'Hand to a campus drop-off point or request a department collection. Certified processors dismantle boards and recover metals without open burning.',
    landfillRisk: 'critical',
    riskLabel: 'Critical risk',
  },
  {
    id: 'mobiles-accessories',
    slug: 'mobiles-accessories',
    name: 'Mobiles & Accessories',
    shortName: 'Mobiles',
    icon: 'Cpu',
    color: 'var(--copper)',
    itemCount: 50,
    examples: ['Smartphone', 'Feature phone', 'Tablet', 'Smartwatch', 'Earphones', 'Wired headphones', 'Wireless earbuds', 'Bluetooth speaker', 'Power bank', 'Charging cable', 'Phone case (hard plastic)'],
    hazards: ['Lithium', 'Cobalt', 'Lead', 'Nickel'],
    hazardDetails:
      'Lithium-ion batteries can ignite or explode if punctured or crushed. Cobalt mining is linked to severe environmental contamination. A single lithium cell in landfill can leach nickel and cobalt into soil for decades (Basel Action Network).',
    whatToDo: 'Sign out of Google/Apple accounts, factory reset, remove SIM/SD cards. If battery is swollen, do NOT charge it — store it away from flammables and tell the collector it is damaged.',
    disposalMethod: 'Use a campus drop-off point. Do not put in normal bins — lithium fires in compactor trucks are a serious hazard.',
    landfillRisk: 'critical',
    riskLabel: 'Critical risk',
  },
  {
    id: 'batteries',
    slug: 'batteries',
    name: 'Batteries',
    shortName: 'Batteries',
    icon: 'Battery',
    color: 'var(--rust)',
    itemCount: 20,
    examples: ['AA / AAA alkaline batteries', 'Rechargeable NiMH batteries', 'Lithium coin cells (CR2032)', 'Laptop battery pack', 'UPS lead-acid battery', 'Power tool battery', 'Camera battery'],
    hazards: ['Lead (lead-acid)', 'Cadmium (NiCd)', 'Lithium', 'Mercury (button cells)'],
    hazardDetails:
      'Lead-acid batteries contain ~18 kg of lead on average. A single cracked battery can contaminate 25,000 litres of groundwater (UNITAR, 2024). Mercury button cells were phased out in most countries but still circulate in older devices.',
    whatToDo: 'Keep terminals apart — tape loose terminals before handing in. Never crush, puncture, or expose batteries to heat. Swollen lithium cells must be reported to the collector as damaged.',
    disposalMethod: 'Separate batteries from devices where possible. Hand to a campus battery collection bin or request collection. Do not put in regular bins.',
    landfillRisk: 'critical',
    riskLabel: 'Critical risk',
  },
  {
    id: 'large-appliances',
    slug: 'large-appliances',
    name: 'Large Appliances',
    shortName: 'Large',
    icon: 'Refrigerator',
    color: 'var(--moss)',
    itemCount: 15,
    examples: ['Refrigerator', 'Washing machine', 'Air conditioner', 'Microwave oven', 'Television (LED/LCD/CRT)', 'Electric oven', 'Water heater', 'Dishwasher'],
    hazards: ['Refrigerants (CFCs/HFCs)', 'Lead (CRT glass)', 'Mercury', 'Compressor oils'],
    hazardDetails:
      'CRT televisions contain 2–4 kg of lead in the glass cone. Refrigerant gases in AC and fridges are potent greenhouse gases (up to 1,800× CO₂ warming potential). Uncontrolled release during informal dismantling is a major climate and health issue (GEM 2024).',
    whatToDo: 'Do not remove refrigerant yourself — it is illegal and dangerous. For TVs and monitors, do not crack the screen. Contact the drop-off organiser for large items.',
    disposalMethod: 'Hostel common rooms and departments can request a collection for large items. These are picked up on scheduled collection drives.',
    landfillRisk: 'critical',
    riskLabel: 'Critical risk',
  },
  {
    id: 'small-appliances',
    slug: 'small-appliances',
    name: 'Small Appliances',
    shortName: 'Small',
    icon: 'Cpu',
    color: 'var(--signal)',
    itemCount: 40,
    examples: ['Electric fan (table/desk)', 'Electric iron', 'Hair dryer', 'Electric kettle', 'Toaster', 'Coffee maker', 'Calculator', 'Smart plug', 'Electric shaver', 'Trimmer', 'Desk lamp (LED)'],
    hazards: ['Lead', 'Copper', 'Plastics with flame retardants'],
    hazardDetails:
      'Small appliances contain mixed materials — copper wiring, PCBs, and plastics with brominated flame retardants. These are recoverable but require formal dismantling to prevent toxic fume release during informal burning.',
    whatToDo: 'Unplug and let cool. Remove any detachable batteries. Check whether the item can be repaired first — campus canteens often have repair services.',
    disposalMethod: 'Bring to a campus drop-off point or request a hostel collection. Repairable items should go to a repair shop first.',
    landfillRisk: 'high',
    riskLabel: 'High risk',
  },
  {
    id: 'lighting',
    slug: 'lighting',
    name: 'Lighting',
    shortName: 'Lighting',
    icon: 'Lightbulb',
    color: 'var(--copper)',
    itemCount: 10,
    examples: ['CFL bulb', 'Fluorescent tube (T5/T8)', 'LED bulb', 'LED tube', 'Mercury vapour lamp', 'Halogen bulb'],
    hazards: ['Mercury (CFL/fluorescent)', 'Lead (older lamps)'],
    hazardDetails:
      'Each CFL contains 3–5 mg of mercury. While small, mercury vapour released from broken bulbs in enclosed spaces can reach concentrations exceeding safe indoor air guidelines within minutes (WHO, 2023). LED bulbs do not contain mercury but have lead solder on circuit boards.',
    whatToDo: 'Do not break. Pack CFLs and fluorescent tubes in their original packaging or in a cardboard tube. Handle LEDs normally but keep them out of regular bins.',
    disposalMethod: 'Separate lighting from other e-waste — hand to a drop-off point or request hostel collection. CFLs and tubes go in dedicated fluorescent lamp recycling.',
    landfillRisk: 'high',
    riskLabel: 'High risk',
  },
  {
    id: 'cables-peripherals',
    slug: 'cables-peripherals',
    name: 'Cables & Peripherals',
    shortName: 'Cables',
    icon: 'Cable',
    color: 'var(--signal)',
    itemCount: 30,
    examples: ['USB cable', 'HDMI cable', 'Ethernet cable', 'Power cord', 'Keyboard', 'Mouse', 'Pen drive / USB stick', 'Memory card', 'Webcam (basic)', 'CD / DVD', 'Printer cartridge (ink/toner)', 'Extension cord'],
    hazards: ['PVC insulation (chlorine + dioxins when burned)', 'Lead solder', 'Copper'],
    hazardDetails:
      'Cables are often burned informally to recover copper. Burning PVC insulation releases dioxins and furans — among the most toxic persistent pollutants known (WHO, 2023). Formal processing shreds and separates materials without burning.',
    whatToDo: 'Bundle cables together. Printer cartridges should still have plastic caps on to prevent ink/toner spills. Pen drives and memory cards: delete or securely wipe data first.',
    disposalMethod: 'Bring to a campus drop-off or add to your hostel collection request. Cables and peripherals are accepted at all EcoCircuit campus points.',
    landfillRisk: 'medium',
    riskLabel: 'Medium risk',
  },
];

export type EwasteCategory = CategoryInfo;
export const ewasteCategories = CATEGORIES;
