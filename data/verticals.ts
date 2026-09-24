/**
 * Each trade as a small operational scene rather than an icon card: the moment
 * it comes in, what stalls, what CloseAgain does, and the window it ends on.
 * Illustrative.
 */

export const verticals = [
  {
    id: 'hvac',
    name: 'HVAC',
    time: '6:42 PM',
    quote: 'AC stopped cooling upstairs.',
    channel: 'Missed call · Google LSA',
    stall: 'After hours · no voicemail',
    action: 'Answered in 40 seconds',
    window: 'Tomorrow · 9:00–11:00 AM',
    context:
      'Peak-season call volume, after-hours demand, and estimates that sit through a heat wave.',
  },
  {
    id: 'plumbing',
    name: 'Plumbing',
    time: '7:18 AM',
    quote: 'Water heater is leaking.',
    channel: 'Web request · site form',
    stall: 'Office not open for 40 minutes',
    action: 'Answered before the office opened',
    window: 'Today · 2:00–4:00 PM',
    context:
      'Urgent work that goes to whoever answers first, plus replacement quotes that need a second conversation.',
  },
  {
    id: 'electrical',
    name: 'Electrical',
    time: '4:31 PM',
    quote: 'Breaker keeps tripping.',
    channel: 'Estimate · sent 6 days ago',
    stall: 'Quiet since the quote went out',
    action: 'Followed up with a real question',
    window: 'Thu · 11:00 AM–1:00 PM',
    context:
      'Diagnostics that turn into panel work, and proposals that stall waiting on a decision.',
  },
] as const
