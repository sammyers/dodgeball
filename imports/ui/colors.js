export const colorNames = [
  'red',
  'orange',
  'yellow',
  'olive',
  'green',
  'teal',
  'blue',
  'violet',
  'purple',
  'pink',
  'brown',
  'black',
];

export const colorValues = [
  '#db2828',
  '#f2711c',
  '#fbbd08',
  '#b5cc18',
  '#21ba45',
  '#00b5ad',
  '#2185d0',
  '#6435c9',
  '#a333c8',
  '#e03997',
  '#a5673f',
  '#1b1c1d',
];

export const valueMap = colorValues.reduce(
  (all, value, idx) => ({ ...all, [value]: colorNames[idx] }),
  {}
);

export const nameMap = colorNames.reduce(
  (all, value, idx) => ({ ...all, [value]: colorValues[idx] }),
  {}
);
