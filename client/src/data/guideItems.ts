// 36-item lookup for the "Can I bin this?" guide search.
// Verdict labels and reasons are grounded in CPCB India E-waste Rules 2022,
// Global E-waste Monitor 2024, and WHO 2023 guidelines.

export type GuideVerdict = 'E-waste' | 'Special handling' | 'Not e-waste' | 'Repair or reuse first';

export interface GuideItem {
  name: string;
  aliases: string[]; // extra search terms
  verdict: GuideVerdict;
  reason: string; // one line
  beforeYouHandIn: string[]; // checklist steps
  disposalTip?: string; // extra caution
  categorySlug: string | null; // null = not in e-waste bins
}

export const GUIDE_ITEMS: GuideItem[] = [
  {
    name: 'Smartphone / Mobile phone',
    aliases: ['phone', 'mobile', 'iphone', 'android', 'cell'],
    verdict: 'E-waste',
    reason: 'Contains lithium battery, lead solder, and cobalt — all hazardous in landfill.',
    beforeYouHandIn: [
      'Back up photos and contacts',
      'Sign out of Google / Apple / Samsung accounts',
      'Factory reset to wipe all data',
      'Remove SIM card and SD card',
    ],
    categorySlug: 'mobiles-accessories',
  },
  {
    name: 'Charger / Adapter',
    aliases: ['charger', 'adapter', 'adaptor', 'power brick', 'usb charger'],
    verdict: 'E-waste',
    reason: 'Contains circuit board with lead solder and PVC cable — not safe for regular bins.',
    beforeYouHandIn: [
      'Bundle cable neatly',
      'Tape or cable-tie loose ends to prevent tangles',
    ],
    categorySlug: 'cables-peripherals',
  },
  {
    name: 'Earphones / Wired headphones',
    aliases: ['earphones', 'earbuds', 'headphones', 'headset', 'in-ear'],
    verdict: 'E-waste',
    reason: 'Tiny circuit boards and PVC cables — belong in e-waste, not general bin.',
    beforeYouHandIn: [
      'Wind cable loosely and secure with a clip or twist-tie',
    ],
    categorySlug: 'cables-peripherals',
  },
  {
    name: 'Power bank',
    aliases: ['powerbank', 'portable charger', 'battery pack'],
    verdict: 'Special handling',
    reason: 'Lithium-ion battery — fire risk in compactor trucks and landfill.',
    beforeYouHandIn: [
      'Do not charge if swollen or hot',
      'Discharge to below 30% before handing in',
      'Transport upright in a non-flammable bag',
      'Tell the collector if it has ever swollen or leaked',
    ],
    disposalTip: 'If the power bank is swollen, do not use it. Store away from flammables and flag it clearly when handing over.',
    categorySlug: 'batteries',
  },
  {
    name: 'Laptop',
    aliases: ['laptop', 'notebook', 'macbook', 'chromebook'],
    verdict: 'E-waste',
    reason: 'Lead solder, mercury backlight (older models), and lithium battery — all regulated e-waste.',
    beforeYouHandIn: [
      'Back up all data',
      'Sign out of all accounts (Google, Microsoft, Apple)',
      'Factory reset / reinstall OS to wipe data',
      'Remove external storage (USB drives, SD cards)',
    ],
    categorySlug: 'it-equipment',
  },
  {
    name: 'Keyboard',
    aliases: ['keyboard', 'mechanical keyboard'],
    verdict: 'E-waste',
    reason: 'Circuit board and PVC cable contain lead and plastics with flame retardants.',
    beforeYouHandIn: [
      'No data wipe needed',
      'Bundle cable neatly',
    ],
    categorySlug: 'cables-peripherals',
  },
  {
    name: 'Computer mouse',
    aliases: ['mouse', 'mice', 'trackpad'],
    verdict: 'E-waste',
    reason: 'Small circuit board and plastics — not suitable for regular bin.',
    beforeYouHandIn: [
      'No special prep needed',
    ],
    categorySlug: 'cables-peripherals',
  },
  {
    name: 'Pen drive / USB stick',
    aliases: ['pendrive', 'usb stick', 'flash drive', 'usb drive', 'thumb drive'],
    verdict: 'E-waste',
    reason: 'Contains NAND flash memory chips with hazardous metals.',
    beforeYouHandIn: [
      'Delete or securely wipe all personal data before handing in',
    ],
    categorySlug: 'cables-peripherals',
  },
  {
    name: 'External hard drive',
    aliases: ['hard drive', 'hdd', 'ssd', 'external drive', 'hard disk'],
    verdict: 'E-waste',
    reason: 'Contains rare earth magnets, circuit boards, and (HDDs) platters with toxic coatings.',
    beforeYouHandIn: [
      'Back up data, then do a secure erase (or degauss for HDD)',
      'Factory reset / format drive',
    ],
    categorySlug: 'it-equipment',
  },
  {
    name: 'Router / Wi-Fi router',
    aliases: ['router', 'wifi router', 'modem', 'access point'],
    verdict: 'E-waste',
    reason: 'Circuit board, power adapter, and antenna assembly are all regulated e-waste.',
    beforeYouHandIn: [
      'Factory reset to clear personal Wi-Fi credentials and admin password',
    ],
    categorySlug: 'it-equipment',
  },
  {
    name: 'Smartwatch',
    aliases: ['smartwatch', 'smart watch', 'fitness band', 'fitness tracker', 'galaxy watch', 'apple watch'],
    verdict: 'E-waste',
    reason: 'Lithium battery, display, and circuit board — all hazardous in landfill.',
    beforeYouHandIn: [
      'Unpair from phone and do a factory reset',
      'Remove any SIM card',
    ],
    categorySlug: 'mobiles-accessories',
  },
  {
    name: 'Bluetooth speaker',
    aliases: ['bluetooth speaker', 'wireless speaker', 'portable speaker', 'jbl', 'boat speaker'],
    verdict: 'E-waste',
    reason: 'Contains lithium battery and circuit board — both regulated e-waste.',
    beforeYouHandIn: [
      'If it has a built-in rechargeable battery, discharge to below 30% before handing in',
    ],
    categorySlug: 'mobiles-accessories',
  },
  {
    name: 'Fluorescent tube (tubelight)',
    aliases: ['tubelight', 'tube light', 'fluorescent tube', 'neon tube', 't8', 't5'],
    verdict: 'Special handling',
    reason: 'Contains mercury vapour — broken tubes release toxic fumes in enclosed spaces.',
    beforeYouHandIn: [
      'Do not break — pack in original box or a cardboard tube',
      'Keep separate from other e-waste',
      'Tell the collector it contains mercury',
    ],
    disposalTip: 'If a tube breaks, ventilate the room immediately. Do not vacuum — use tape to pick up fragments and seal in a bag.',
    categorySlug: 'lighting',
  },
  {
    name: 'CFL bulb',
    aliases: ['cfl', 'cfl bulb', 'compact fluorescent', 'energy saver bulb'],
    verdict: 'Special handling',
    reason: 'Each CFL contains 3–5 mg mercury — illegal to landfill under Indian E-waste Rules 2022.',
    beforeYouHandIn: [
      'Do not break — carry in original packaging or a sealed plastic bag',
    ],
    categorySlug: 'lighting',
  },
  {
    name: 'LED bulb',
    aliases: ['led bulb', 'led light', 'led lamp'],
    verdict: 'E-waste',
    reason: 'No mercury, but contains lead solder and a circuit driver — must not go in regular bin.',
    beforeYouHandIn: [
      'Handle normally — no special fragile precautions needed',
    ],
    categorySlug: 'lighting',
  },
  {
    name: 'AA / AAA batteries',
    aliases: ['aa battery', 'aaa battery', 'alkaline battery', 'duracell', 'energizer', 'battery'],
    verdict: 'Special handling',
    reason: 'Alkaline batteries are banned from landfill in many states; rechargeable NiMH batteries contain cadmium.',
    beforeYouHandIn: [
      'Tape terminals with electrical tape to prevent short circuits',
      'Keep separate from other e-waste',
    ],
    categorySlug: 'batteries',
  },
  {
    name: 'Swollen lithium battery',
    aliases: ['swollen battery', 'puffed battery', 'bloated battery', 'damaged battery', 'swollen'],
    verdict: 'Special handling',
    reason: 'Swollen lithium cells contain pressurised flammable gas — fire and explosion risk.',
    beforeYouHandIn: [
      'Stop using immediately — do not charge',
      'Do not puncture, bend, or compress',
      'Store in a cool, dry place away from flammables',
      'Transport in a non-flammable container (sand or cat litter works)',
      'Tell the collector it is a damaged / swollen battery before handing over',
    ],
    disposalTip: 'Do not put a swollen battery in a bag with other items. Keep it isolated and clearly labelled.',
    categorySlug: 'batteries',
  },
  {
    name: 'TV / Monitor',
    aliases: ['tv', 'television', 'monitor', 'display', 'screen', 'led tv', 'lcd monitor', 'crt'],
    verdict: 'E-waste',
    reason: 'CRT TVs contain up to 4 kg of lead in the glass. All screens contain hazardous materials.',
    beforeYouHandIn: [
      'Do not crack the screen',
      'For smart TVs: factory reset and sign out of accounts',
      'For large items, contact the collection organiser — do not carry alone',
    ],
    categorySlug: 'large-appliances',
  },
  {
    name: 'Remote control',
    aliases: ['remote', 'remote control', 'tv remote'],
    verdict: 'Special handling',
    reason: 'Remove the batteries first — they need separate handling. The casing goes in e-waste.',
    beforeYouHandIn: [
      'Remove AA/AAA batteries and hand them in separately in the battery box',
    ],
    categorySlug: 'cables-peripherals',
  },
  {
    name: 'Extension cord / Power strip',
    aliases: ['extension cord', 'power strip', 'extension board', 'power bar', 'extension lead'],
    verdict: 'E-waste',
    reason: 'PVC cable and copper wiring — both hazardous if burned informally.',
    beforeYouHandIn: [
      'Bundle cable neatly and secure',
    ],
    categorySlug: 'cables-peripherals',
  },
  {
    name: 'Printer cartridge (ink / toner)',
    aliases: ['printer cartridge', 'ink cartridge', 'toner cartridge', 'toner', 'ink'],
    verdict: 'Special handling',
    reason: 'Ink and toner are classified as hazardous waste — do not bin with regular e-waste.',
    beforeYouHandIn: [
      'Keep the protective cap or tape on the nozzle to prevent spills',
      'Seal in a zip-lock bag',
      'Tell the collector it is a cartridge before handing over',
    ],
    categorySlug: 'cables-peripherals',
  },
  {
    name: 'Small electric fan',
    aliases: ['fan', 'desk fan', 'table fan', 'usb fan', 'small fan'],
    verdict: 'E-waste',
    reason: 'Motor, copper windings, and PCB all require proper e-waste processing.',
    beforeYouHandIn: [
      'Unplug and let cool completely',
      'Check if it can be repaired — a faulty capacitor is often a simple fix',
    ],
    categorySlug: 'small-appliances',
  },
  {
    name: 'Electric iron',
    aliases: ['iron', 'electric iron', 'clothes iron', 'steam iron'],
    verdict: 'E-waste',
    reason: 'Heating element, thermostat, and PCB are regulated e-waste.',
    beforeYouHandIn: [
      'Unplug and allow to cool fully',
      'Check if it can be repaired first',
    ],
    categorySlug: 'small-appliances',
  },
  {
    name: 'Electric kettle',
    aliases: ['kettle', 'electric kettle', 'water kettle'],
    verdict: 'E-waste',
    reason: 'Heating element and control board are regulated e-waste.',
    beforeYouHandIn: [
      'Empty all water and let dry',
    ],
    categorySlug: 'small-appliances',
  },
  {
    name: 'Microwave oven',
    aliases: ['microwave', 'microwave oven'],
    verdict: 'Special handling',
    reason: 'Contains a magnetron with traces of beryllium oxide — a toxic ceramic dust if broken.',
    beforeYouHandIn: [
      'Do not attempt to dismantle',
      'Request a hostel or department collection — do not carry alone',
      'Tell the collector it is a microwave (special magnetron handling needed)',
    ],
    categorySlug: 'large-appliances',
  },
  {
    name: 'Tablet / iPad',
    aliases: ['tablet', 'ipad', 'android tablet', 'kindle'],
    verdict: 'E-waste',
    reason: 'Lithium battery, glass screen, and circuit board — same rules as a smartphone.',
    beforeYouHandIn: [
      'Back up data',
      'Sign out of all accounts',
      'Factory reset',
      'Remove SIM/SD cards',
    ],
    categorySlug: 'mobiles-accessories',
  },
  {
    name: 'Webcam',
    aliases: ['webcam', 'web camera', 'usb camera', 'pc camera'],
    verdict: 'E-waste',
    reason: 'Small PCB, lens assembly, and USB cable — all regulated e-waste.',
    beforeYouHandIn: [
      'No personal data stored on webcam hardware — no wipe needed',
    ],
    categorySlug: 'cables-peripherals',
  },
  {
    name: 'Calculator',
    aliases: ['calculator', 'scientific calculator', 'casio'],
    verdict: 'E-waste',
    reason: 'PCB and (if rechargeable) lithium cell — belongs in e-waste, not regular bin.',
    beforeYouHandIn: [
      'Remove any AAA / coin cell batteries and hand them in separately',
    ],
    categorySlug: 'small-appliances',
  },
  {
    name: 'Smart plug',
    aliases: ['smart plug', 'wifi plug', 'smart socket'],
    verdict: 'E-waste',
    reason: 'Wi-Fi module and PCB are regulated e-waste.',
    beforeYouHandIn: [
      'Factory reset to clear your Wi-Fi credentials',
    ],
    categorySlug: 'small-appliances',
  },
  {
    name: 'CD / DVD disc',
    aliases: ['cd', 'dvd', 'disc', 'disk', 'optical disc', 'blu-ray'],
    verdict: 'Not e-waste',
    reason: 'Polycarbonate plastic — not classified as e-waste, but should not go in regular recycling either.',
    beforeYouHandIn: [
      'Scratch the data surface if the disc contains personal files',
    ],
    disposalTip: 'Most council plastic recycling rejects optical discs. Some NGOs collect them. If unsure, put in general waste — they are not hazardous.',
    categorySlug: null,
  },
  {
    name: 'Screen protector / Tempered glass',
    aliases: ['screen guard', 'screen protector', 'tempered glass'],
    verdict: 'Not e-waste',
    reason: 'Plain glass or plastic film — no electronic components or hazardous materials.',
    beforeYouHandIn: [],
    disposalTip: 'Tempered glass: wrap in paper and put in general waste (not recycling — mixing glass types causes issues at glass plants).',
    categorySlug: null,
  },
  {
    name: 'Phone case',
    aliases: ['phone case', 'phone cover', 'mobile cover', 'back cover'],
    verdict: 'Not e-waste',
    reason: 'Rubber or plastic case — no electronic components.',
    beforeYouHandIn: [],
    disposalTip: 'If it is TPU or silicone, it cannot be recycled in most household recycling. Put in general waste.',
    categorySlug: null,
  },
  {
    name: 'Cardboard packaging',
    aliases: ['cardboard', 'box', 'packaging', 'carton'],
    verdict: 'Not e-waste',
    reason: 'Paper and cardboard — recyclable in general paper bins, not e-waste.',
    beforeYouHandIn: [],
    disposalTip: 'Flatten boxes and put in paper/cardboard recycling. Remove any plastic inserts first.',
    categorySlug: null,
  },
  {
    name: 'Plastic toy',
    aliases: ['toy', 'plastic toy', 'action figure', 'doll'],
    verdict: 'Not e-waste',
    reason: 'Solid plastic without electronics — not regulated e-waste.',
    beforeYouHandIn: [],
    disposalTip: 'If the toy has batteries or electronic components (lights, sounds), remove them and hand the electronic parts to e-waste collection.',
    categorySlug: null,
  },
  {
    name: 'Slow or old laptop (still working)',
    aliases: ['slow laptop', 'old laptop', 'broken laptop', 'laptop not working'],
    verdict: 'Repair or reuse first',
    reason: 'A working laptop — even a slow one — has years of useful life left. Recycle only after repair options are exhausted.',
    beforeYouHandIn: [
      'Try a RAM upgrade or SSD replacement — often cheaper than a new device',
      'Install a lightweight OS (Linux works well on older hardware)',
      'Donate to LPU library resource pool or a school nearby',
      'Only hand in for recycling when the device truly cannot be used or repaired',
    ],
    categorySlug: 'it-equipment',
  },
  {
    name: 'Cable with minor damage',
    aliases: ['broken cable', 'frayed cable', 'cable repair', 'damaged cable'],
    verdict: 'Repair or reuse first',
    reason: 'Minor insulation damage can often be repaired safely with electrical tape — no need to discard.',
    beforeYouHandIn: [
      'Wrap exposed copper with good-quality electrical tape',
      'If the cable is completely severed or the plug is damaged, hand it in for e-waste',
    ],
    categorySlug: 'cables-peripherals',
  },
];
