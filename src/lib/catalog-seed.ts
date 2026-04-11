/**
 * Initial product catalog: 10 L1 main categories × ~42 L2 subcategories.
 * Each L2 ships with one stub product so the frontend renders meaningfully
 * out of the box. Admin users can edit / replace everything via the backend.
 *
 * Organized by product form & craft (not by industry) so a single product
 * can serve multiple industries.
 */

export type SeedL2 = {
  slug: string;
  nameEn: string;
  tagline: string;
  stubProduct: {
    slug: string;
    nameEn: string;
    summary: string;
    description: string;
    specs: Array<{ label: string; value: string }>;
    features: string[];
    applications: string[];
  };
};

export type SeedL1 = {
  slug: string;
  nameEn: string;
  tagline: string;
  description: string;
  icon: string; // lucide icon name
  subs: SeedL2[];
};

export const CATALOG_SEED: SeedL1[] = [
  // ============================================================
  // 1. Custom Cable Assemblies
  // ============================================================
  {
    slug: "custom-cable-assemblies",
    nameEn: "Custom Cable Assemblies",
    tagline: "Single-run cables, built to your exact electrical and mechanical spec.",
    description:
      "Custom cable assemblies are standalone cables — terminated at one or both ends — made to a unique electrical, mechanical, or environmental specification. We build everything from simple power leads to high-density instrument cables, with full traceability from raw wire to final test.",
    icon: "cable",
    subs: [
      {
        slug: "multi-conductor-signal",
        nameEn: "Multi-Conductor Signal Cables",
        tagline: "Low-voltage signal transmission with tight pair matching.",
        stubProduct: {
          slug: "multi-conductor-signal-24awg",
          nameEn: "24 AWG Multi-Conductor Signal Cable Assembly",
          summary: "Custom multi-core signal cable with twisted pairs and overall drain.",
          description:
            "A flexible 24 AWG multi-conductor signal cable assembly for low-voltage instrumentation, sensor aggregation, and panel wiring. Twisted pairs can be specified for differential signals, and the overall foil shield plus drain wire provides EMI protection for noisy environments.",
          specs: [
            { label: "Conductor", value: "24 AWG tinned copper, 7-strand or 19-strand" },
            { label: "Insulation", value: "PVC / PE / TPE — application dependent" },
            { label: "Pair count", value: "2 – 32 pairs on request" },
            { label: "Shielding", value: "Aluminum foil + tinned copper drain" },
            { label: "Jacket", value: "PVC, LSZH, or TPU" },
            { label: "Voltage", value: "300 V" },
          ],
          features: [
            "Twisted-pair construction for balanced signals",
            "Foil shield for EMI suppression",
            "Custom color code and pair identification",
            "100% electrical test: continuity, insulation, hi-pot",
          ],
          applications: [
            "Instrumentation & process control",
            "Data acquisition systems",
            "Machine vision & sensor arrays",
            "Building automation",
          ],
        },
      },
      {
        slug: "power-cables",
        nameEn: "Power Cables",
        tagline: "Current-carrying cables from 22 AWG control wires to 4/0 welding leads.",
        stubProduct: {
          slug: "dc-power-cable-10awg",
          nameEn: "10 AWG DC Power Cable Assembly",
          summary: "Flexible silicone-jacketed DC power cable for battery and equipment builds.",
          description:
            "A high-strand-count 10 AWG silicone power cable assembly designed for DC power distribution in equipment, battery packs, and portable power. Flexible construction, high temperature rating, and custom terminations on both ends.",
          specs: [
            { label: "Conductor", value: "10 AWG tinned copper, 1050-strand silicone wire" },
            { label: "Voltage", value: "600 V DC" },
            { label: "Temperature", value: "-60 °C to +200 °C" },
            { label: "Jacket", value: "Silicone rubber" },
            { label: "Termination", value: "Ring lug, bus bar, or battery connector" },
          ],
          features: [
            "Ultra-flexible silicone jacket",
            "High temperature resistance",
            "RoHS and REACH compliant materials",
            "Crimp terminations to UL-486 standard",
          ],
          applications: [
            "Battery pack interconnect",
            "Industrial power equipment",
            "Portable power stations",
            "Robotics and motion systems",
          ],
        },
      },
      {
        slug: "shielded-cables",
        nameEn: "Shielded Cables",
        tagline: "Foil, braid, and combination shielding for high-EMI environments.",
        stubProduct: {
          slug: "double-shielded-control-cable",
          nameEn: "Double-Shielded Control Cable Assembly",
          summary: "Foil + braid double-shielded cable for heavy EMI industrial sites.",
          description:
            "A control cable assembly with both overall aluminum foil and 85% tinned copper braid shielding, delivering superior EMI and RFI rejection for noisy industrial environments. Ideal for drive cables, PLC I/O, and instrumentation near variable-frequency drives.",
          specs: [
            { label: "Conductor", value: "18–22 AWG stranded tinned copper" },
            { label: "Shield", value: "Al-foil + 85% TC braid" },
            { label: "Jacket", value: "PVC or TPE" },
            { label: "Rated speed (drag-chain variants)", value: "up to 3 m/s" },
          ],
          features: [
            "Dual shielding for >90 dB attenuation",
            "Tinned braid for solderability",
            "Optional drag-chain rated construction",
            "Full electrical verification on every unit",
          ],
          applications: [
            "Servo and VFD installations",
            "Factory automation",
            "Measurement & lab instruments",
          ],
        },
      },
      {
        slug: "ribbon-flat-cables",
        nameEn: "Ribbon & Flat Cables",
        tagline: "IDC-ready ribbon cables and ultra-thin flat laminated cables.",
        stubProduct: {
          slug: "idc-ribbon-cable-40pos",
          nameEn: "40-Position IDC Ribbon Cable Assembly",
          summary: "Gray 28 AWG ribbon cable with dual IDC socket connectors.",
          description:
            "Classic flat ribbon cable assembly with insulation-displacement connectors on both ends, ideal for internal board-to-board interconnect within enclosures, test fixtures, and legacy equipment.",
          specs: [
            { label: "Pitch", value: "1.27 mm (0.050″)" },
            { label: "Conductor", value: "28 AWG stranded tinned copper" },
            { label: "Positions", value: "10 – 64, custom on request" },
            { label: "Connector", value: "2.54 mm IDC socket, polarized or not" },
          ],
          features: [
            "IDC termination for consistent pitch",
            "Optional folds or notches for routing",
            "Custom label and strain-relief",
          ],
          applications: [
            "Test and measurement fixtures",
            "Industrial control panels",
            "Internal PC / embedded system wiring",
          ],
        },
      },
      {
        slug: "coiled-retractable",
        nameEn: "Coiled & Retractable Cables",
        tagline: "Spring-retracting helical cables for handheld and moving-arm applications.",
        stubProduct: {
          slug: "coiled-cable-5m-stretched",
          nameEn: "5 m Coiled Retractable Cable Assembly",
          summary: "Polyurethane coiled cable retracting from 300 mm to 5 m reach.",
          description:
            "A helical coiled cable assembly that retracts neatly when at rest and extends to 5 m under load. Used for handheld barcode scanners, robot pendants, and service-arm applications where cable management matters.",
          specs: [
            { label: "Retracted length", value: "≈300 mm" },
            { label: "Stretched length", value: "5 m" },
            { label: "Jacket", value: "Thermoplastic polyurethane (TPU)" },
            { label: "Conductor count", value: "3 – 16 cores" },
          ],
          features: [
            "Memory-retentive coil",
            "Abrasion- and oil-resistant jacket",
            "Custom connector combinations",
          ],
          applications: [
            "Handheld scanners and terminals",
            "Robot teach pendants",
            "Medical carts and service arms",
          ],
        },
      },
    ],
  },

  // ============================================================
  // 2. Wire Harness Assemblies
  // ============================================================
  {
    slug: "wire-harness-assemblies",
    nameEn: "Wire Harness Assemblies",
    tagline: "Multi-branch harnesses tying together complete systems.",
    description:
      "Wire harness assemblies bundle and terminate dozens to hundreds of conductors with branching, shielding, and connectorization — delivering a single plug-and-play interconnect for a subsystem or an entire machine. We handle layout design, routing, and IPC/WHMA-A-620 compliant build.",
    icon: "git-branch",
    subs: [
      {
        slug: "control-harness",
        nameEn: "Control Harness",
        tagline: "Low-voltage control and I/O harnessing for machines.",
        stubProduct: {
          slug: "panel-io-control-harness",
          nameEn: "Panel I/O Control Harness",
          summary: "Pre-routed I/O harness for industrial control panels and PLCs.",
          description:
            "A multi-branch control harness linking PLC I/O modules, terminal blocks, indicators, and field devices. Built to IPC/WHMA-A-620 Class 2 or 3 with full wire markers and as-built documentation.",
          specs: [
            { label: "Build standard", value: "IPC/WHMA-A-620 Class 2 or 3" },
            { label: "Wire gauge range", value: "24 AWG – 14 AWG" },
            { label: "Identification", value: "Heat-shrink or laser-etched labels" },
          ],
          features: [
            "Pre-cut wire markers",
            "Cable ties and convoluted tubing",
            "Full electrical test with net-list verification",
          ],
          applications: ["Industrial control panels", "CNC and automation cells", "Packaging machinery"],
        },
      },
      {
        slug: "power-distribution-harness",
        nameEn: "Power Distribution Harness",
        tagline: "High-current branching for AC/DC power splits.",
        stubProduct: {
          slug: "ac-power-distribution-harness",
          nameEn: "AC Power Distribution Harness",
          summary: "Branched AC harness with IEC inlets and fused outlets.",
          description:
            "Power distribution harness with an AC inlet, inline fusing, and branching outputs to multiple loads. Built to UL recognized components and verified with hi-pot and ground bond testing.",
          specs: [
            { label: "Conductor", value: "14 AWG – 10 AWG" },
            { label: "Insulation class", value: "PVC 105 °C or silicone" },
            { label: "Inputs", value: "IEC C14, C20 or terminal block" },
          ],
          features: [
            "UL recognized components",
            "Hi-pot and ground bond tested",
            "Custom fuse holders and breakers",
          ],
          applications: ["Server and network cabinets", "Test equipment", "Medical carts"],
        },
      },
      {
        slug: "sensor-harness",
        nameEn: "Sensor Harness",
        tagline: "Bundled sensor runs with connector breakouts.",
        stubProduct: {
          slug: "multi-sensor-breakout-harness",
          nameEn: "Multi-Sensor Breakout Harness",
          summary: "Star-branched sensor harness with M8/M12 breakouts.",
          description:
            "A sensor harness that bundles multiple sensor drops to a single controller connector, reducing wiring labor in the field. Can combine M8, M12, and custom connectors on a single trunk.",
          specs: [
            { label: "Trunk", value: "Shielded multi-pair cable" },
            { label: "Breakouts", value: "M8 / M12 / JST" },
            { label: "Length", value: "Configurable per drop" },
          ],
          features: ["Star or daisy-chain layout", "IP67 overmolded breakouts", "Labeled legs for install"],
          applications: ["Packaging lines", "Material handling", "Process monitoring"],
        },
      },
      {
        slug: "panel-box-harness",
        nameEn: "Panel / Box Harness",
        tagline: "Enclosure-ready harnesses with door and through-wall routing.",
        stubProduct: {
          slug: "enclosure-door-harness",
          nameEn: "Enclosure Door Harness",
          summary: "Flexible door harness with strain-relief for repeated open/close.",
          description:
            "A harness engineered specifically for enclosure door pass-throughs: flex-rated conductors, braided sleeving, and strain-relief grommets for long service life in repeatedly opened doors.",
          specs: [
            { label: "Cycle life", value: ">1 million door cycles (tested class)" },
            { label: "Sleeving", value: "Expandable braid" },
          ],
          features: [
            "Flex-life rated wire",
            "Strain-relief grommets",
            "Pre-routed for specific panel layouts",
          ],
          applications: ["Industrial controls", "Kiosks and vending", "Medical equipment doors"],
        },
      },
    ],
  },

  // ============================================================
  // 3. Overmolded Cable Assemblies
  // ============================================================
  {
    slug: "overmolded-cable-assemblies",
    nameEn: "Overmolded Cable Assemblies",
    tagline: "Molded strain-relief and sealing — robust cables for demanding environments.",
    description:
      "Overmolding injects a thermoplastic or thermoset boot around a cable-connector junction, creating a fully sealed, strain-relieved, and branded finish. We offer in-house tooling, custom mold shapes, and material options from standard PVC to medical-grade silicone.",
    icon: "shield",
    subs: [
      {
        slug: "molded-connector",
        nameEn: "Molded Connector Cables",
        tagline: "Consumer-grade overmolded cables for USB, DIN, and audio.",
        stubProduct: {
          slug: "usb-overmold-cable",
          nameEn: "USB Overmold Cable Assembly",
          summary: "Custom USB cable with branded strain-relief overmold.",
          description:
            "A USB cable assembly with custom overmolded boots on both ends, providing strain relief, sealing, and brand presentation. Supports USB 2.0 and 3.2 speeds with shielded constructions.",
          specs: [
            { label: "Standards", value: "USB 2.0, 3.2 Gen 1/2" },
            { label: "Material", value: "PVC, TPE, or TPU" },
            { label: "Color", value: "Fully customizable" },
          ],
          features: ["Branded logo mold option", "Strain relief to IEC 60320", "Shielded for EMI"],
          applications: ["Consumer electronics", "Industrial peripherals", "POS systems"],
        },
      },
      {
        slug: "waterproof-ip67-ip68",
        nameEn: "Waterproof IP67 / IP68",
        tagline: "Sealed overmolds rated for water ingress and dust.",
        stubProduct: {
          slug: "ip68-sensor-cable",
          nameEn: "IP68 Sensor Cable Assembly",
          summary: "Sealed overmolded sensor cable for submerged use.",
          description:
            "An IP68-rated cable assembly with fully sealed overmolded connector transitions, validated for submersion and pressure-washing environments. Ideal for outdoor sensors, wash-down equipment, and marine use.",
          specs: [
            { label: "Protection", value: "IP68 up to 10 m, 30 min" },
            { label: "Material", value: "TPU or PUR" },
            { label: "Cable jacket", value: "UV and salt-water resistant" },
          ],
          features: ["Submersion tested", "UV-stable materials", "Custom connector compatibility"],
          applications: ["Outdoor sensors", "Wash-down food & beverage", "Marine and offshore"],
        },
      },
      {
        slug: "medical-grade-overmold",
        nameEn: "Medical-Grade Overmold",
        tagline: "USP Class VI / ISO 10993 materials for patient-contact cables.",
        stubProduct: {
          slug: "medical-silicone-overmold-cable",
          nameEn: "Medical Silicone Overmold Cable",
          summary: "Silicone-overmolded patient cable for autoclavable equipment.",
          description:
            "A medical cable assembly with platinum-cured silicone overmolds, suitable for patient-contact, autoclave, and wipe-down sterilization. Built in a controlled environment with material lot traceability.",
          specs: [
            { label: "Biocompatibility", value: "USP Class VI, ISO 10993-5/10" },
            { label: "Sterilization", value: "Autoclave, EtO, gamma, wipe-down" },
            { label: "Flex life", value: ">500k bend cycles" },
          ],
          features: [
            "Platinum-cured silicone",
            "Smooth seam-free finish",
            "Traceable material lots",
          ],
          applications: ["Patient monitors", "Surgical instruments", "Imaging probes"],
        },
      },
      {
        slug: "custom-strain-relief",
        nameEn: "Custom Strain-Relief Overmold",
        tagline: "Tooling for unique shapes, logos, and connector geometries.",
        stubProduct: {
          slug: "custom-strain-relief-boot",
          nameEn: "Custom Strain-Relief Boot",
          summary: "In-house tooled strain-relief boot in your shape and color.",
          description:
            "Need a boot the off-the-shelf world doesn't sell? We tool and mold custom strain-relief boots to match your connector, brand, and flex requirements — typically 2-4 weeks from CAD to first samples.",
          specs: [
            { label: "Lead time", value: "2 – 4 weeks tooling" },
            { label: "Materials", value: "PVC, TPE, TPU, silicone" },
            { label: "Logo", value: "Debossed or inked" },
          ],
          features: ["In-house mold shop", "3D printed prototype samples", "Pantone color matching"],
          applications: ["Any cable requiring branded finish", "Unique connector geometries"],
        },
      },
    ],
  },

  // ============================================================
  // 4. RF & Coaxial Assemblies
  // ============================================================
  {
    slug: "rf-coaxial-assemblies",
    nameEn: "RF & Coaxial Assemblies",
    tagline: "Precision coax assemblies from DC to 40 GHz.",
    description:
      "RF cable assemblies demand tight impedance control, phase matching, and connector torque precision. We build SMA, SMB, MMCX, BNC, N-type, and TNC assemblies on LMR, RG, and low-loss microwave cables, with VSWR and insertion-loss testing on every unit.",
    icon: "radio",
    subs: [
      {
        slug: "sma-smb-mmcx",
        nameEn: "SMA / SMB / MMCX Assemblies",
        tagline: "Compact RF interconnect for wireless and test equipment.",
        stubProduct: {
          slug: "sma-sma-rf-cable-rg316",
          nameEn: "SMA-to-SMA RF Cable (RG316)",
          summary: "50 Ω SMA male-to-male cable on flexible RG316 coax.",
          description:
            "A versatile 50 Ω SMA-to-SMA RF cable assembly on RG316 coax, suitable for wireless module interconnect, test fixtures, and antenna patching up to 6 GHz.",
          specs: [
            { label: "Impedance", value: "50 Ω" },
            { label: "Frequency", value: "DC – 6 GHz" },
            { label: "VSWR", value: "≤1.35" },
            { label: "Connector", value: "SMA male, gold plated" },
          ],
          features: ["100% VSWR tested", "Heat-shrink boot", "Custom length, precision cut"],
          applications: ["Wi-Fi and BLE modules", "GPS antenna", "RF test equipment"],
        },
      },
      {
        slug: "bnc-n-type-tnc",
        nameEn: "BNC / N-Type / TNC",
        tagline: "Robust RF connectors for broadcast and base station use.",
        stubProduct: {
          slug: "n-type-lmr400-jumper",
          nameEn: "N-Type LMR-400 Jumper",
          summary: "Low-loss N-type jumper cable for base stations and test.",
          description:
            "A low-loss N-type male-to-male jumper on LMR-400 cable, commonly used for base station, broadcast, and outdoor antenna feed lines.",
          specs: [
            { label: "Cable", value: "LMR-400 equivalent" },
            { label: "Frequency", value: "DC – 6 GHz" },
            { label: "Loss", value: "≤0.22 dB/m @ 2.4 GHz" },
          ],
          features: ["Weatherized connectors", "Hand-formable option", "VSWR tested"],
          applications: ["Cellular base stations", "Broadcast", "Public safety radio"],
        },
      },
      {
        slug: "low-loss-microwave",
        nameEn: "Low-Loss Microwave",
        tagline: "Phase-stable cables up to 40 GHz.",
        stubProduct: {
          slug: "microwave-assy-18ghz",
          nameEn: "18 GHz Phase-Stable Microwave Cable",
          summary: "Phase-matched SMA-SMA assembly for microwave test up to 18 GHz.",
          description:
            "A phase-stable microwave cable assembly with precision SMA connectors, certified to 18 GHz with low VSWR and minimal phase change over flex and temperature.",
          specs: [
            { label: "Frequency", value: "DC – 18 GHz" },
            { label: "Phase stability", value: "±5° at 18 GHz over flex" },
          ],
          features: ["Phase-match sets available", "Full sweep test report", "Protective armor option"],
          applications: ["Network analyzer fixtures", "Radar test", "5G mmWave prototypes"],
        },
      },
      {
        slug: "semi-rigid-flexible",
        nameEn: "Semi-Rigid / Flexible",
        tagline: "Formable semi-rigid coax and hand-formable flex alternatives.",
        stubProduct: {
          slug: "semi-rigid-086-cable",
          nameEn: ".086″ Semi-Rigid Coax Assembly",
          summary: "CNC-formed .086″ semi-rigid coax to your geometry.",
          description:
            "Semi-rigid .086″ copper-jacketed coax, CNC-formed to specific shapes for inter-board and shielded RF paths inside test and instrumentation assemblies.",
          specs: [
            { label: "Cable OD", value: "2.19 mm (.086″)" },
            { label: "Frequency", value: "DC – 26.5 GHz" },
          ],
          features: ["CNC forming", "Solder / press fit options", "Fully shielded"],
          applications: ["RF instrumentation", "PCB-to-PCB RF routing"],
        },
      },
    ],
  },

  // ============================================================
  // 5. Data & Network Cables
  // ============================================================
  {
    slug: "data-network-cables",
    nameEn: "Data & Network Cables",
    tagline: "Ethernet, USB, HDMI, DisplayPort, and fiber — certified to standard.",
    description:
      "Data and network cables carry the lifeblood of modern systems. We manufacture Ethernet assemblies from Cat5e through Cat8, USB 2.0 to 3.2, HDMI and DisplayPort up to 8K, and fiber optic patch cords — all tested to category standards.",
    icon: "network",
    subs: [
      {
        slug: "ethernet-cat5e-cat8",
        nameEn: "Ethernet Cat5e – Cat8",
        tagline: "RJ45 patch cables and bulk cable assemblies.",
        stubProduct: {
          slug: "cat6a-patch-cable",
          nameEn: "Cat6A Patch Cable",
          summary: "Shielded Cat6A patch cable tested to 500 MHz.",
          description:
            "A Cat6A S/FTP patch cable assembly with 50-micron gold RJ45 plugs, Fluke-tested to Category 6A standards for 10 Gb/s Ethernet up to 100 m.",
          specs: [
            { label: "Category", value: "6A (ISO/IEC 11801)" },
            { label: "Shield", value: "S/FTP" },
            { label: "Conductor", value: "24 AWG stranded or 23 AWG solid" },
          ],
          features: ["Fluke channel test report", "Boot colors on request", "Custom length"],
          applications: ["Data centers", "Structured cabling", "PoE++ cameras"],
        },
      },
      {
        slug: "usb-a-b-c",
        nameEn: "USB A/B/C 2.0 – 3.2",
        tagline: "USB cable assemblies for all speeds and form factors.",
        stubProduct: {
          slug: "usb-c-usb-c-32gen2",
          nameEn: "USB-C to USB-C 3.2 Gen 2 Cable",
          summary: "10 Gb/s USB-C cable with 100 W PD support.",
          description:
            "A full-feature USB-C to USB-C cable assembly supporting USB 3.2 Gen 2 data rates and 100 W USB-PD power delivery, with E-marker IC and custom overmold finish.",
          specs: [
            { label: "Standard", value: "USB 3.2 Gen 2, 10 Gb/s" },
            { label: "Power", value: "USB-PD up to 100 W (5 A @ 20 V)" },
            { label: "E-marker", value: "Included" },
          ],
          features: ["USB-IF compliant", "Thunderbolt alternative mode optional", "Overmolded finish"],
          applications: ["Laptops and peripherals", "Industrial docks", "Display hubs"],
        },
      },
      {
        slug: "hdmi-displayport",
        nameEn: "HDMI / DisplayPort",
        tagline: "Video cable assemblies up to 8K.",
        stubProduct: {
          slug: "hdmi-21-cable-48gbps",
          nameEn: "HDMI 2.1 48 Gb/s Cable",
          summary: "Ultra high speed HDMI 2.1 cable for 8K/60 and 4K/120 video.",
          description:
            "An Ultra-High-Speed HDMI 2.1 cable assembly certified for 48 Gb/s bandwidth, supporting 8K/60 Hz and 4K/120 Hz with dynamic HDR and eARC.",
          specs: [
            { label: "Standard", value: "HDMI 2.1 UHS" },
            { label: "Bandwidth", value: "48 Gb/s" },
            { label: "Length", value: "Up to 3 m passive, longer with active / AOC" },
          ],
          features: ["Eye-pattern tested", "Custom branding", "Braided or PVC jacket"],
          applications: ["Commercial AV", "Gaming", "Broadcast"],
        },
      },
      {
        slug: "fiber-optic-patch",
        nameEn: "Fiber Optic Patch Cords",
        tagline: "Single-mode and multi-mode patch cords with LC/SC/MPO.",
        stubProduct: {
          slug: "single-mode-lc-lc-patchcord",
          nameEn: "Single-Mode LC-LC Patch Cord",
          summary: "9/125 µm single-mode duplex patch cord with LC-UPC ends.",
          description:
            "A duplex single-mode fiber patch cord, 9/125 µm, terminated with LC-UPC ceramic ferrules. Individually tested for insertion loss and return loss.",
          specs: [
            { label: "Fiber", value: "OS2 single-mode, 9/125 µm" },
            { label: "Connector", value: "LC-UPC ceramic" },
            { label: "IL", value: "≤0.3 dB" },
            { label: "RL", value: "≥50 dB" },
          ],
          features: ["Individually tested", "3D interferometer polished", "LSZH jacket option"],
          applications: ["Data centers", "Telecom", "FTTH"],
        },
      },
    ],
  },

  // ============================================================
  // 6. Automotive Harness
  // ============================================================
  {
    slug: "automotive-harness",
    nameEn: "Automotive Harness",
    tagline: "ISO/TS 16949-minded harnesses for vehicles and mobility.",
    description:
      "Automotive wire harnesses live in harsh environments — heat, vibration, chemical exposure, millions of flex cycles. Our automotive line covers everything from engine-bay sensor harnesses through EV high-voltage battery pack interconnects, built with connectors from Molex, TE, Yazaki, JST, and more.",
    icon: "car",
    subs: [
      {
        slug: "ecu-engine-harness",
        nameEn: "ECU / Engine Harness",
        tagline: "Engine-compartment harnesses with high-temp insulation.",
        stubProduct: {
          slug: "ecu-engine-bay-harness",
          nameEn: "ECU Engine-Bay Harness",
          summary: "Engine-bay harness with 125 °C rated conductors and sealed connectors.",
          description:
            "A representative engine-compartment harness built with automotive-grade TXL wire, sealed connectors, and convoluted tubing to survive high-temperature, high-vibration engine bays.",
          specs: [
            { label: "Wire type", value: "TXL / GXL automotive" },
            { label: "Temp", value: "125 °C continuous" },
            { label: "Connectors", value: "Sealed OEM-grade" },
          ],
          features: ["Convoluted tubing", "Grommet-sealed pass-throughs", "Vibration tested"],
          applications: ["Engine management", "Powertrain control", "Exhaust aftertreatment"],
        },
      },
      {
        slug: "body-chassis-harness",
        nameEn: "Body / Chassis Harness",
        tagline: "Body control module and chassis interconnect harnesses.",
        stubProduct: {
          slug: "chassis-control-harness",
          nameEn: "Chassis Control Harness",
          summary: "Multi-branch chassis harness linking BCM to distributed loads.",
          description:
            "A multi-branch chassis harness connecting body control modules to distributed lighting, switches, and sensors throughout the vehicle.",
          specs: [
            { label: "Standards", value: "IPC/WHMA-A-620, IATF 16949-aware" },
            { label: "Branches", value: "Up to 40 breakouts" },
          ],
          features: ["Fuse block integration", "Weatherpack connectors", "Conformable to vehicle CAD"],
          applications: ["Passenger cars", "Commercial vehicles", "Specialty vehicles"],
        },
      },
      {
        slug: "adas-camera-harness",
        nameEn: "ADAS & Camera Harness",
        tagline: "Coax + power harnesses for 360° camera and ADAS sensor suites.",
        stubProduct: {
          slug: "360-panoramic-camera-harness",
          nameEn: "360° Panoramic Camera Harness",
          summary: "FAKRA-terminated camera harness for surround-view systems.",
          description:
            "A proven 360° panoramic camera harness: FAKRA coax branches, shielded power lines, and a central connector to the ADAS ECU, built for mass production since 2016.",
          specs: [
            { label: "Coax", value: "FAKRA Code Z or D" },
            { label: "Power", value: "Shielded 20 AWG twisted pair" },
          ],
          features: ["FAKRA-compliant coax", "Full VSWR and continuity test", "Production-proven"],
          applications: ["Surround-view camera systems", "ADAS sensor suites"],
        },
      },
      {
        slug: "ev-high-voltage",
        nameEn: "EV High-Voltage Harness",
        tagline: "Orange-jacketed HV harnesses for battery, inverter, and motor.",
        stubProduct: {
          slug: "ev-battery-interconnect",
          nameEn: "EV Battery Interconnect Harness",
          summary: "High-voltage orange harness for battery pack modules.",
          description:
            "A high-voltage interconnect harness using orange-jacketed HV cable, crimped ring and busbar terminals, and voltage-sense taps for battery management.",
          specs: [
            { label: "Voltage", value: "up to 1000 V DC" },
            { label: "Conductor", value: "50 mm² – 95 mm²" },
          ],
          features: ["HV orange jacket", "Shielded construction option", "HV continuity test"],
          applications: ["EV battery packs", "Inverters", "Motor interconnect"],
        },
      },
      {
        slug: "automotive-lighting",
        nameEn: "Lighting Harness",
        tagline: "Head-lamp, tail-lamp, and interior lighting harnesses.",
        stubProduct: {
          slug: "headlamp-harness",
          nameEn: "Headlamp Harness",
          summary: "Sealed headlamp harness for LED and HID modules.",
          description:
            "A sealed headlamp harness with weather-tight connectors for LED modules, providing reliable power and control to modern adaptive headlights.",
          specs: [
            { label: "Connector", value: "Weatherpack or OEM-equivalent" },
            { label: "Temperature", value: "-40 °C to +125 °C" },
          ],
          features: ["Weather-sealed", "OEM connector compatibility", "PWM signal support"],
          applications: ["LED headlamps", "Adaptive lighting", "Aftermarket upgrades"],
        },
      },
    ],
  },

  // ============================================================
  // 7. Medical Device Cables
  // ============================================================
  {
    slug: "medical-device-cables",
    nameEn: "Medical Device Cables",
    tagline: "Biocompatible cable assemblies for clinical and surgical environments.",
    description:
      "Medical cable assemblies require biocompatible materials, sterilization compatibility, and a zero-defect mentality. We build patient monitoring, surgical, and imaging cables in a controlled environment with full lot traceability — serving US and EU medical OEMs since 2012.",
    icon: "heart-pulse",
    subs: [
      {
        slug: "patient-monitoring",
        nameEn: "Patient Monitoring (ECG / SpO₂)",
        tagline: "Electrode and pulse-ox cables for bedside monitors.",
        stubProduct: {
          slug: "ecg-10-lead-cable",
          nameEn: "10-Lead ECG Cable",
          summary: "10-lead ECG patient cable with trunk and individual leads.",
          description:
            "A 10-lead ECG patient cable with a shielded trunk and individual color-coded electrode leads, compatible with common bedside monitor families.",
          specs: [
            { label: "Leads", value: "10 (AHA / IEC color)" },
            { label: "Jacket", value: "Medical TPU or silicone" },
            { label: "Defibrillation proof", value: "Yes" },
          ],
          features: ["Shielded trunk", "Snap or banana electrode ends", "Autoclave option"],
          applications: ["Bedside monitors", "Telemetry packs", "Stress testing systems"],
        },
      },
      {
        slug: "surgical-equipment",
        nameEn: "Surgical Equipment",
        tagline: "Reusable cable assemblies for OR instruments.",
        stubProduct: {
          slug: "surgical-instrument-cable",
          nameEn: "Surgical Instrument Cable",
          summary: "Autoclavable silicone cable for handheld surgical instruments.",
          description:
            "An autoclavable cable assembly designed for reusable surgical instruments, with platinum-cured silicone jacket and hermetic connector sealing.",
          specs: [
            { label: "Sterilization", value: "Autoclave ≥500 cycles" },
            { label: "Jacket", value: "Platinum-cured silicone" },
          ],
          features: ["Hermetic connector", "Smooth wipe-down surface", "ISO 10993 materials"],
          applications: ["Electrosurgical units", "Handheld drivers", "Imaging probes"],
        },
      },
      {
        slug: "imaging-device",
        nameEn: "Imaging Device",
        tagline: "High-density cables for ultrasound and endoscopy.",
        stubProduct: {
          slug: "ultrasound-probe-cable",
          nameEn: "Ultrasound Probe Cable",
          summary: "High-density coax bundle for ultrasound transducer probes.",
          description:
            "An ultrasound probe cable assembly with a high-density coax bundle (128+ micro-coax), flexible jacket, and custom connector for transducer-to-scanner interfaces.",
          specs: [
            { label: "Coax count", value: "64 – 256" },
            { label: "Coax OD", value: "0.35 – 0.55 mm" },
          ],
          features: ["Matched impedance per coax", "Flexible PU jacket", "Full electrical test"],
          applications: ["Ultrasound transducer probes", "Endoscope cables"],
        },
      },
      {
        slug: "silicone-autoclavable",
        nameEn: "Silicone / Autoclavable",
        tagline: "Heat-sterilizable cables for repeated reprocessing.",
        stubProduct: {
          slug: "autoclavable-silicone-cable",
          nameEn: "Autoclavable Silicone Cable",
          summary: "General-purpose silicone cable rated for steam sterilization.",
          description:
            "A general-purpose medical cable assembly in platinum-cured silicone, rated for repeated steam sterilization at 134 °C.",
          specs: [
            { label: "Autoclave", value: "134 °C, ≥500 cycles" },
            { label: "Flex life", value: ">500k bend cycles" },
          ],
          features: ["Platinum-cured silicone", "Medical-grade overmolds", "Traceable lots"],
          applications: ["Reusable medical instruments", "Sterile field cables"],
        },
      },
    ],
  },

  // ============================================================
  // 8. Industrial & Automation
  // ============================================================
  {
    slug: "industrial-automation",
    nameEn: "Industrial & Automation",
    tagline: "Robotic, sensor, and drive cables built for the factory floor.",
    description:
      "Industrial automation cables see continuous flexing, oil and coolant exposure, and electrical noise. Our industrial line is built for the factory floor — drag-chain cables, M8/M12 sensor-actuator connectors, PLC panel harnesses, and servo motor feedback cables.",
    icon: "factory",
    subs: [
      {
        slug: "robotic-drag-chain",
        nameEn: "Robotic / Drag-Chain",
        tagline: "Continuous-flex cables rated for millions of cycles.",
        stubProduct: {
          slug: "drag-chain-cable-10m-bend",
          nameEn: "Drag-Chain Cable 10× D Bend Radius",
          summary: "Continuous-flex drag-chain cable for motion and robotics.",
          description:
            "A continuous-flex cable rated for 5+ million cycles in drag-chain applications, with oil- and coolant-resistant PUR jacket and low-torsion stranded conductors.",
          specs: [
            { label: "Flex cycles", value: "5M+ at 10× D bend" },
            { label: "Jacket", value: "PUR, oil-resistant" },
            { label: "Speed", value: "up to 5 m/s" },
          ],
          features: ["UL/CSA listed", "Shielded variants", "Custom conductor counts"],
          applications: ["Robotic arms", "Gantry and linear motion", "Pick-and-place machines"],
        },
      },
      {
        slug: "m8-m12-sensor-actuator",
        nameEn: "M8 / M12 Sensor-Actuator",
        tagline: "Overmolded M8 and M12 cordsets with industrial coding.",
        stubProduct: {
          slug: "m12-a-coded-cordset",
          nameEn: "M12 A-Coded Sensor Cordset",
          summary: "IP67 M12 A-coded cordset for standard sensors.",
          description:
            "A standard M12 A-coded sensor cordset, IP67 rated, in straight and right-angle options, with PVC or PUR jackets and custom lengths.",
          specs: [
            { label: "Coding", value: "A-coded, 3/4/5/8 pin" },
            { label: "Protection", value: "IP67" },
          ],
          features: ["Overmolded connector", "Cable lengths from 0.5 m to 20 m", "LED indicator option"],
          applications: ["Photoelectric sensors", "Inductive sensors", "Field device wiring"],
        },
      },
      {
        slug: "plc-panel-harness",
        nameEn: "PLC / Panel Harness",
        tagline: "Pre-wired panel harnesses for faster installation.",
        stubProduct: {
          slug: "prewired-plc-io-harness",
          nameEn: "Pre-Wired PLC I/O Harness",
          summary: "Ready-to-install PLC I/O harness with wire markers.",
          description:
            "A pre-wired PLC I/O harness terminated to spring cage or screw terminals, ready to drop into your panel — cutting wiring labor by up to 50%.",
          specs: [{ label: "Terminations", value: "Spring cage or screw" }],
          features: ["Printed wire markers", "As-built schematic", "Fully tested at net level"],
          applications: ["Industrial control panels", "Skid-mounted equipment"],
        },
      },
      {
        slug: "servo-motor-cable",
        nameEn: "Servo Motor Cable",
        tagline: "Power and feedback cables for servo systems.",
        stubProduct: {
          slug: "servo-power-cable-4x15",
          nameEn: "Servo Power Cable 4 × 1.5 mm²",
          summary: "Shielded servo power cable for standard drive interfaces.",
          description:
            "A shielded servo power cable assembly for common drive-to-motor connections, with pre-terminated connectors matched to OEM motor standards.",
          specs: [
            { label: "Core config", value: "4 × 1.5 mm² + shield" },
            { label: "Speed", value: "up to 3 m/s in drag chain" },
          ],
          features: ["Drag-chain flex rated", "OEM connector compatibility", "Shielded construction"],
          applications: ["Servo drive installations", "CNC machines", "Robotics"],
        },
      },
    ],
  },

  // ============================================================
  // 9. Power & Appliance Cords
  // ============================================================
  {
    slug: "power-appliance-cords",
    nameEn: "Power & Appliance Cords",
    tagline: "AC and DC power cords with regional certifications.",
    description:
      "Power and appliance cords connect your product to the wall. We manufacture IEC-standard and region-specific AC cords, DC barrel-jack leads, and home-appliance harnesses, with UL, CSA, VDE, CCC, PSE, SAA, and BSI certifications.",
    icon: "plug-zap",
    subs: [
      {
        slug: "ac-plugs-iec",
        nameEn: "IEC / Regional AC Plugs",
        tagline: "Certified AC power cords for global markets.",
        stubProduct: {
          slug: "us-nema-5-15-c13-cord",
          nameEn: "NEMA 5-15P to IEC C13 Power Cord",
          summary: "Standard 18 AWG US power cord with C13 appliance inlet.",
          description:
            "A UL-listed NEMA 5-15P to IEC C13 appliance power cord, 18 AWG, for IT equipment, appliances, and instruments sold into North America.",
          specs: [
            { label: "Standard", value: "UL 817, CSA 22.2" },
            { label: "Conductor", value: "3 × 18 AWG" },
            { label: "Rating", value: "10 A / 125 V" },
          ],
          features: ["UL listed", "Custom length and color", "Molded plug"],
          applications: ["Computers", "IT equipment", "Small appliances"],
        },
      },
      {
        slug: "dc-power-cords",
        nameEn: "DC Power Cables",
        tagline: "Barrel jacks, lighter plugs, and Anderson-style DC cables.",
        stubProduct: {
          slug: "dc-barrel-jack-55mm",
          nameEn: "5.5 × 2.1 mm DC Barrel Jack Cable",
          summary: "DC barrel jack cable for router, modem, and small electronics.",
          description:
            "A standard 5.5 × 2.1 mm DC barrel jack cable with custom length, gauge, and far-end termination, serving small electronics and embedded products.",
          specs: [
            { label: "Barrel", value: "5.5 × 2.1 mm, center positive or negative" },
            { label: "Conductor", value: "22 AWG – 18 AWG" },
          ],
          features: ["Molded strain relief", "Custom color and length", "RoHS"],
          applications: ["Routers and modems", "Small appliances", "Embedded devices"],
        },
      },
      {
        slug: "appliance-harness",
        nameEn: "Home Appliance Harness",
        tagline: "Internal harnesses for appliances and white goods.",
        stubProduct: {
          slug: "appliance-internal-harness",
          nameEn: "Appliance Internal Harness",
          summary: "UL-component internal harness for home appliances.",
          description:
            "An internal power and control harness for home appliances, using UL-recognized components and VDE-compatible connectors for global market compliance.",
          specs: [{ label: "Standards", value: "UL, VDE, CQC" }],
          features: ["Multi-standard compliance", "High-temp wire options", "Custom branch structure"],
          applications: ["Small appliances", "White goods", "HVAC equipment"],
        },
      },
    ],
  },

  // ============================================================
  // 10. Specialty & Harsh-Environment
  // ============================================================
  {
    slug: "specialty-harsh-environment",
    nameEn: "Specialty & Harsh-Environment",
    tagline: "Cables engineered for extreme temperature, chemicals, and mechanical stress.",
    description:
      "When off-the-shelf cable won't survive, specialty cables step in. We build assemblies with high-temperature PTFE, cryogenic-grade materials, oil- and chemical-resistant jackets, armored trunks for mining, and marine-rated cables for offshore use.",
    icon: "flame",
    subs: [
      {
        slug: "high-temp-ptfe-silicone",
        nameEn: "High-Temp (PTFE / Silicone / Fiberglass)",
        tagline: "Cables rated up to 260 °C and beyond.",
        stubProduct: {
          slug: "ptfe-hookup-wire-cable",
          nameEn: "PTFE Hook-Up Wire Cable",
          summary: "260 °C rated PTFE-insulated hook-up wire assembly.",
          description:
            "A high-temperature cable assembly using PTFE-insulated conductors, rated to 260 °C for furnace, heater, and industrial oven wiring.",
          specs: [
            { label: "Temperature", value: "-65 °C to +260 °C" },
            { label: "Insulation", value: "PTFE" },
          ],
          features: ["High-temperature stable", "Chemical resistant", "Thin-wall insulation"],
          applications: ["Ovens and furnaces", "Industrial heaters", "Aerospace ground support"],
        },
      },
      {
        slug: "oil-chemical-resistant",
        nameEn: "Oil / Chemical Resistant",
        tagline: "Cables that survive oil, coolant, and aggressive chemicals.",
        stubProduct: {
          slug: "oil-resistant-pur-cable",
          nameEn: "Oil-Resistant PUR Cable",
          summary: "PUR-jacketed cable for cutting-fluid and hydraulic environments.",
          description:
            "A PUR-jacketed cable assembly engineered to resist cutting fluids, hydraulic oils, and common machine-shop chemicals.",
          specs: [
            { label: "Jacket", value: "Polyurethane (PUR)" },
            { label: "Resistance", value: "Cutting oils, coolants, mild acids" },
          ],
          features: ["Oil-resistant", "Drag-chain option", "Custom wire count"],
          applications: ["Machine tools", "Hydraulic systems", "Chemical processing"],
        },
      },
      {
        slug: "armored-mining",
        nameEn: "Armored / Mining Cable",
        tagline: "Steel-wire-armored trunk cables for tough environments.",
        stubProduct: {
          slug: "swa-armored-trunk-cable",
          nameEn: "SWA Armored Trunk Cable",
          summary: "Steel wire armored cable for mining and underground install.",
          description:
            "A steel-wire-armored trunk cable assembly for mining, quarry, and underground installations, delivering rodent-proof, crush-resistant operation.",
          specs: [
            { label: "Armor", value: "Galvanized steel wire (SWA)" },
            { label: "Jacket", value: "Outer PE / PVC sheath" },
          ],
          features: ["Crush resistant", "Rodent proof", "Full mechanical protection"],
          applications: ["Mining", "Underground install", "Heavy industry"],
        },
      },
      {
        slug: "marine-cables",
        nameEn: "Marine Cables",
        tagline: "Tinned copper and salt-water resistant cables for marine use.",
        stubProduct: {
          slug: "marine-tinned-copper-cable",
          nameEn: "Marine Tinned Copper Cable",
          summary: "Tinned copper marine cable with salt-water resistant jacket.",
          description:
            "A marine-grade cable assembly with tinned copper conductors and a salt-water resistant jacket, certified for boat, yacht, and offshore applications.",
          specs: [
            { label: "Conductor", value: "Tinned copper" },
            { label: "Certification", value: "UL 1426 Marine / BV / DNV (option)" },
          ],
          features: ["Salt-water resistant", "Tinned for corrosion", "Flame retardant"],
          applications: ["Boats and yachts", "Offshore platforms", "Marine electronics"],
        },
      },
    ],
  },
];
