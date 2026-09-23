/** Initial trades, each grounded in the way the call actually comes in. */

export const verticals = [
  {
    id: 'hvac',
    name: 'HVAC',
    quote: 'AC stopped cooling upstairs.',
    context: 'Peak-season call volume, after-hours demand, and estimates that sit through a heat wave.',
    window: 'Sat 9:00–11:00 AM',
  },
  {
    id: 'plumbing',
    name: 'Plumbing',
    quote: 'Water heater is leaking.',
    context: 'Urgent work that goes to whoever answers first, plus replacement quotes that need a second conversation.',
    window: 'Today 2:00–4:00 PM',
  },
  {
    id: 'electrical',
    name: 'Electrical',
    quote: 'Breaker keeps tripping.',
    context: 'Diagnostics that turn into panel work, and proposals that stall waiting on a decision.',
    window: 'Thu 11:00 AM–1:00 PM',
  },
] as const
