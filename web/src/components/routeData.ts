export const routeStops = [
  {
    title: 'The open coast',
    time: 'FIRST LIGHT',
    detail:
      'Start where the water meets the rocks. A long horizon, salt in the air, and nothing asking you to hurry.',
    x: 138,
    y: 324,
  },
  {
    title: 'Under the canopy',
    time: 'LATE MORNING',
    detail:
      'Turn inland. Let the path become smaller, the trees become taller, and the quiet become something you can hear.',
    x: 398,
    y: 245,
  },
  {
    title: 'A place to pause',
    time: 'THE SLOW AFTERNOON',
    detail:
      'Find a sheltered corner. Unpack a little lunch, open a notebook, and leave the next hour unplanned.',
    x: 650,
    y: 105,
  },
] as const;

export const routePath =
  'M138 324 C175 275 180 365 245 318 S285 200 338 230 S375 285 398 245 S435 165 478 193 S520 258 555 193 S595 95 650 105';
