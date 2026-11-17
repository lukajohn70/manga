export const colors = {
  brand: {
    primary: '#B5532E',       // Terracotta
    primaryDeep: '#8F3B1F',   // Laterite
    iron: '#2A2320',          // Iron
    ochre: '#D9A441',         // Ochre Gold
  },
  surface: {
    base: '#F6EDE0',          // Clay Cream
    raised: '#FFFFFF',        // Paper
    sunken: '#E7D5BC',        // Dry Sand
    border: '#E7D5BC',
  },
  status: {
    success: '#4F6B3A',       // Savanna Green
    info: '#3E5C76',          // Slate Blue
    error: '#B3261E',         // Ember
    warning: '#D9A441',       // Ochre Gold
  },
  tracking: {
    labelCreated: '#8C8279',   // Ash
    pickedUp: '#3E5C76',       // Slate Blue
    inTransit: '#3E5C76',      // Slate Blue
    outForDelivery: '#D9A441', // Ochre
    delivered: '#4F6B3A',      // Savanna Green
    exception: '#B3261E',      // Ember
    returned: '#8F3B1F',       // Laterite
  },
  neutral: {
    ash: '#8C8279',           // Ash
    iron: '#2A2320',          // Iron
  },
  dark: {
    base: '#1E1815',
    raised: '#2A2320',
    text: '#F6EDE0',
    primary: '#D9764F',
    accent: '#D9A441',
    border: '#4A3F39',
  },
} as const;

export type Colors = typeof colors;
