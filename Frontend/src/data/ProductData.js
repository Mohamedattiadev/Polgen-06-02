export const primerData = {
  synthesisScales: {
    "50 nmol": { DSLT: 0.30, OPC: 0.75, HPLC: 0.80 },
    "100 nmol": { DSLT: 0.40, OPC: 0.80, HPLC: 0.85 },
    "200 nmol": { DSLT: 0.50, OPC: 0.90, HPLC: 0.95 },
  },
  fivePrimeModifications: {
    "/5FAM/": { name: "FAM", category: "Fluorophores", price: 59 },
    "/5HEX/": { name: "HEX", category: "Fluorophores", price: 79 },
    "/5TET/": { name: "TET", category: "Fluorophores", price: 79 },
    "/5HEG/": { name: "HEG", category: "Spacer", price: 69 },
    "/5TAMRA/": { name: "TAMRA", category: "Fluorophores", price: 119 },
    "/5CY3/": { name: "CY3", category: "Fluorophores", price: 99 },
    "/5CY5/": { name: "CY5", category: "Fluorophores", price: 99 },
    "/5YakYel/": { name: "Yakima Yellow", category: "Fluorophores", price: 119 },
    "/5Am/": { name: "Amino C6", category: "Attachment/linker", price: 69 },
    "/5Phos/": { name: "Phosphate", category: "Phosphorylation", price: 49 },
    "/5Bio/": { name: "Biotin", category: "Attachment/linker", price: 69 },
    "/5THIOLC6/": { name: "THIOL C6", category: "Attachment/linker", price: 59 },
    "/5ATTO550/": { name: "ATTO550", category: "Fluorophores", price: 0 },
    "/5ATTO565/": { name: "ATTO565", category: "Fluorophores", price: 0 },
    "/5JOE/": { name: "JOE", category: "Fluorophores", price: 119 },
  },
  threePrimeModifications: {
    "/3Phos/": { name: "Phosphate", category: "Phosphorylation", price: 119 },
    "/3Bio/": { name: "3' Biotin", category: "Attachment/linker", price: 59 },
    "/3TAMRA/": { name: "3' TAMRA", category: "Fluorophores", price: 69 },
    "/3THIOLC6/": { name: "THIOL C6", category: "Attachment/linker", price: 69 },
    "/3Am/": { name: "Amino", category: "Attachment/linker", price: 119 },
  },
  saflaştırma: ["DSLT", "OPC", "HPLC"],
};

export const propData = {
  synthesisScales: {
    "50 nmol": { DSLT: 159, OPC: 159, HPLC: 159 },
    "100 nmol": { DSLT: 179, OPC: 179, HPLC: 179 },
    "200 nmol": { DSLT: 199, OPC: 199, HPLC: 199 },
  },
  fivePrimeModifications: {
    "/5FAM/": { name: "FAM", price: 159 },
    "/5HEX/": { name: "HEX", price: 179 },
    "/5TET/": { name: "TET", price: 259 },
    "/5JOE/": { name: "JOE", price: 189 },
    "/5TAMRA/": { name: "TAMRA", price: 259 },
    "/5CY3/": { name: "CY3", price: 259 },
    "/5CY5/": { name: "CY5", price: 259 },
    "/5YakYel/": { name: "Yakima Yellow", price: 259 },
    "/5Phos/": { name: "Phosphate", price: 0 },
  },
  threePrimeModifications: {
    "/BHQ-1/": { name: "Black Hole Quencher 1", price: 259 },
    "/BHQ-2/": { name: "Black Hole Quencher 2", price: 259 },
    "/BHQ-3/": { name: "Black Hole Quencher 3", price: 259 },
    "/Dab/": { name: "3'DABCYL", price: 249 },
    "/3TAMRA/": { name: "3' TAMRA", price: 159 },
    "/3ATTO550/": { name: "3 ATTO550", price: 159 },
  },
  saflaştırma: ["DSLT", "OPC", "HPLC"],
};

