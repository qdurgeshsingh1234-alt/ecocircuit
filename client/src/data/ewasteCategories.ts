export interface EwasteCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
  itemCount: number;
  examples: string[];
  hazards: string[];
  hazardDetails: string;
  disposalMethod: string;
  landfillRisk: 'critical' | 'high' | 'medium';
  riskLabel: string;
}

export const ewasteCategories: EwasteCategory[] = [
  {
    id: 'it-equipment',
    name: 'IT Equipment',
    icon: 'Monitor',
    color: 'var(--copper)',
    itemCount: 120,
    examples: ['Laptops', 'Desktop computers', 'Monitors', 'Tablets', 'Smartphones', 'Printers', 'Scanners', 'Keyboards & mice', 'Hard drives', 'RAM & circuit boards'],
    hazards: ['Lead (solder)', 'Mercury (LCDs)', 'Cadmium (batteries)', 'Brominated flame retardants', 'Beryllium (motherboards)'],
    hazardDetails: 'A typical laptop contains up to 1kg of lead in its solder and CRT glass. LCD monitors may contain mercury vapor lamps. In landfills, these leach into groundwater over 3-7 years.',
    disposalMethod: 'Hand to a certified e-waste center or schedule a pickup. Data on drives should be securely wiped before handover. Certified processors recover gold, silver, copper, and palladium.',
    landfillRisk: 'critical',
    riskLabel: 'Critical — contains lead, mercury & cadmium',
  },
  {
    id: 'batteries',
    name: 'Batteries',
    icon: 'Battery',
    color: 'var(--rust)',
    itemCount: 200,
    examples: ['Lithium-ion (phone/laptop)', 'Lead-acid (UPS, car)', 'Alkaline (AA/AAA)', 'Button cells', 'NiMH rechargeable', 'Lithium polymer'],
    hazards: ['Lithium (fire risk)', 'Lead (acid batteries)', 'Cadmium (NiCd cells)', 'Sulfuric acid', 'Cobalt (Li-ion)'],
    hazardDetails: 'Lithium batteries pose heavy fire risks if punctured or crushed. Compaction equipment regularly triggers battery fires in landfills. Lead-acid batteries contain up to 60% toxic lead.',
    disposalMethod: 'Tape over terminals before disposal to prevent short-circuits. Drop at any participating electronics store or EcoCircuit center.',
    landfillRisk: 'critical',
    riskLabel: 'Critical — fire risk + heavy metals',
  },
  {
    id: 'large-appliances',
    name: 'Large Appliances',
    icon: 'Refrigerator',
    color: 'var(--moss)',
    itemCount: 40,
    examples: ['Refrigerators & freezers', 'Washing machines', 'Air conditioners', 'Dishwashers', 'Televisions (>32")', 'Microwaves'],
    hazards: ['CFC/HCFC refrigerants (ozone depletion)', 'Compressor oils (toxic)', 'Lead (CRT TVs)', 'Mercury switches'],
    hazardDetails: 'Refrigerators and ACs contain CFC/HCFC refrigerants that are thousands of times more potent greenhouse gases than CO2 when leaked directly.',
    disposalMethod: 'Refrigerants must be professionally recovered before dismantling. Schedule a large-item pickup for safe handling.',
    landfillRisk: 'critical',
    riskLabel: 'Critical — refrigerants + toxic oils',
  },
  {
    id: 'small-appliances',
    name: 'Small Appliances',
    icon: 'Cpu',
    color: 'var(--signal)',
    itemCount: 300,
    examples: ['Hair dryers', 'Shavers', 'Toasters & kettles', 'Blenders', 'Fans', 'Vacuum cleaners', 'Electric irons', 'Power tools'],
    hazards: ['Heating elements (nichrome)', 'Small motors (rare earth magnets)', 'Capacitors', 'Brominated flame retardants in plastics'],
    hazardDetails: 'Small appliances collectively account for over 7.3 Mt of global e-waste annually. Flame retardants in plastic housings release dioxins and furans when incinerated.',
    disposalMethod: 'Drop at any EcoCircuit center. Small appliances are shredded and magnetically separated into ferrous and non-ferrous metals.',
    landfillRisk: 'high',
    riskLabel: 'High — flame retardants in plastics',
  },
  {
    id: 'lighting',
    name: 'Lighting Equipment',
    icon: 'Lightbulb',
    color: 'var(--copper)',
    itemCount: 500,
    examples: ['Fluorescent tubes (T8, T5)', 'CFL bulbs', 'LED bulbs & panels', 'Neon signs', 'High-pressure sodium lamps'],
    hazards: ['Mercury (CFLs & fluorescents)', 'Phosphor powder', 'Lead in ballasts', 'Argon gas'],
    hazardDetails: 'A single CFL bulb contains enough mercury to contaminate up to 30,000 liters of water if landfilled. Fluorescent tubes volatilize mercury when broken.',
    disposalMethod: 'Handle unbroken CFLs and fluorescents carefully. Drop at collection points in protective packaging.',
    landfillRisk: 'high',
    riskLabel: 'High — mercury vapor contamination',
  },
  {
    id: 'cables-peripherals',
    name: 'Cables & Peripherals',
    icon: 'Cable',
    color: 'var(--signal)',
    itemCount: 1000,
    examples: ['USB & charging cables', 'HDMI, VGA, ethernet', 'Power strips', 'Headphones', 'Webcams & mics', 'External hard drives'],
    hazards: ['PVC insulation', 'Lead in connectors', 'Copper loss', 'Phthalates'],
    hazardDetails: 'Cable waste is fast-growing. PVC insulation contains chlorine-based plasticizers which form toxic dioxins when burned. Copper recovery is highly efficient if recycled.',
    disposalMethod: 'Bundle cables together before dropping off. They are granulated and copper is cleanly separated at 95% efficiency.',
    landfillRisk: 'medium',
    riskLabel: 'Medium — PVC + copper loss',
  },
];
