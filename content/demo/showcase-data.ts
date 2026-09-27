/**
 * Generated from the sample workspace by content/demo/showcase.ts — do not edit.
 * Regenerate: node content/demo/showcase.ts > content/demo/showcase-data.ts
 */

import type { ShowcaseData } from './types.ts'

export const showcase: ShowcaseData = {
  "workspace": {
    "name": "Juniper Row Realty",
    "mark": "JR",
    "meta": "Scale plan · Charleston, SC",
    "date": "Thu, Sep 24",
    "user": "Dana Whitfield",
    "role": "Owner · Broker"
  },
  "kpis": [
    {
      "id": "new",
      "label": "New leads",
      "value": 123,
      "format": "number",
      "delta": "+24%",
      "up": true,
      "note": "vs prior 30 days"
    },
    {
      "id": "recovered",
      "label": "Recovered leads",
      "value": 40,
      "format": "number",
      "delta": "+60%",
      "up": true,
      "note": "vs prior 30 days"
    },
    {
      "id": "active",
      "label": "Active conversations",
      "value": 20,
      "format": "number",
      "delta": "",
      "up": true,
      "note": "7 waiting on a reply"
    },
    {
      "id": "appointments",
      "label": "Appointments",
      "value": 64,
      "format": "number",
      "delta": "+12%",
      "up": true,
      "note": "vs prior 30 days"
    },
    {
      "id": "pipeline",
      "label": "Pipeline influenced",
      "value": 1135600,
      "format": "currency",
      "delta": "+56%",
      "up": true,
      "note": "Est. commission"
    }
  ],
  "unread": 7,
  "conversations": [
    {
      "id": "jr-a04",
      "name": "Derek Nguyen",
      "initials": "DN",
      "stage": "New",
      "tone": "ink",
      "prefix": "CloseAgain: ",
      "text": "Hi Derek, it’s Priya with Juniper Row. Thanks for requesting a home value estimate. Is the West Ashley home where you live now?",
      "time": "10:55 AM",
      "unread": false,
      "recovered": false
    },
    {
      "id": "jr-a02",
      "name": "Luis Ortega",
      "initials": "LO",
      "stage": "Active",
      "tone": "default",
      "prefix": "",
      "text": "Friday after 3 could work. Is there an HOA?",
      "time": "10:48 AM",
      "unread": true,
      "recovered": false
    },
    {
      "id": "jr-a12",
      "name": "Samuel Ortiz",
      "initials": "SO",
      "stage": "Active",
      "tone": "default",
      "prefix": "",
      "text": "Yes, budget is around 700k. Sorry for the slow reply — send the duplex!",
      "time": "10:37 AM",
      "unread": true,
      "recovered": true
    },
    {
      "id": "jr-a01",
      "name": "Maya Thompson",
      "initials": "MT",
      "stage": "Appointment",
      "tone": "positive",
      "prefix": "",
      "text": "That would be great, thank you! Is it OK if my mom comes along?",
      "time": "10:25 AM",
      "unread": true,
      "recovered": false
    }
  ],
  "leads": [
    {
      "id": "jr-a04",
      "name": "Derek Nguyen",
      "initials": "DN",
      "interest": "a home value estimate",
      "source": "Landing page",
      "status": "New",
      "tone": "ink",
      "score": 62,
      "next": "Follow-up text"
    },
    {
      "id": "jr-a02",
      "name": "Luis Ortega",
      "initials": "LO",
      "interest": "the listing on Folly Rd",
      "source": "Phone & text",
      "status": "Active",
      "tone": "default",
      "score": 74,
      "next": "Answer HOA question"
    },
    {
      "id": "jr-a12",
      "name": "Samuel Ortiz",
      "initials": "SO",
      "interest": "a duplex or small multifamily",
      "source": "Website form",
      "status": "Active",
      "tone": "default",
      "score": 72,
      "next": "Send the duplex listing"
    },
    {
      "id": "jr-a01",
      "name": "Maya Thompson",
      "initials": "MT",
      "interest": "the 3-bed on Rutledge Ave",
      "source": "Website form",
      "status": "Appointment",
      "tone": "positive",
      "score": 91,
      "next": "Reply to Maya"
    },
    {
      "id": "jr-a10",
      "name": "Andre Wallace",
      "initials": "AW",
      "interest": "the cottage on Tradd St",
      "source": "Landing page",
      "status": "Appointment",
      "tone": "positive",
      "score": 84,
      "next": "Showing"
    }
  ],
  "automations": [
    {
      "id": "juniper-row.new-lead",
      "name": "New Lead Follow-Up",
      "type": "Sequence",
      "enabled": true,
      "replyRate": "67% replied",
      "next": "Next in 53m"
    },
    {
      "id": "juniper-row.missed-inquiry",
      "name": "Missed Call Text-Back",
      "type": "Sequence",
      "enabled": true,
      "replyRate": "67% replied",
      "next": "Next in 2h"
    },
    {
      "id": "juniper-row.reactivation",
      "name": "Old Lead Reactivation",
      "type": "Campaign",
      "enabled": true,
      "replyRate": "29% replied",
      "next": "Next in 2h"
    },
    {
      "id": "juniper-row.reminder",
      "name": "Showing Reminders",
      "type": "Sequence",
      "enabled": true,
      "replyRate": "82% confirmed",
      "next": "Next in 3h"
    }
  ],
  "running": {
    "on": 6,
    "of": 7
  },
  "appointments": [
    {
      "id": "jr-0312.a1",
      "name": "Reggie Ibarra",
      "type": "Listing appointment",
      "weekday": "Thu",
      "date": "24",
      "time": "2:00 PM",
      "when": "Today",
      "status": "Confirmed",
      "tone": "ink"
    },
    {
      "id": "jr-a10.a",
      "name": "Andre Wallace",
      "type": "Showing",
      "weekday": "Fri",
      "date": "25",
      "time": "9:30 AM",
      "when": "Tomorrow",
      "status": "Confirmed",
      "tone": "ink"
    },
    {
      "id": "jr-0436.a1",
      "name": "Daniel Young",
      "type": "Buyer consultation",
      "weekday": "Fri",
      "date": "25",
      "time": "2:00 PM",
      "when": "Tomorrow",
      "status": "Confirmed",
      "tone": "ink"
    },
    {
      "id": "jr-a01.a",
      "name": "Maya Thompson",
      "type": "Showing",
      "weekday": "Sat",
      "date": "26",
      "time": "10:00 AM",
      "when": "Sat, Sep 26",
      "status": "Confirmed",
      "tone": "ink"
    }
  ],
  "trend": {
    "labels": [
      "Aug 26",
      "Aug 27",
      "Aug 28",
      "Aug 29",
      "Aug 30",
      "Aug 31",
      "Sep 1",
      "Sep 2",
      "Sep 3",
      "Sep 4",
      "Sep 5",
      "Sep 6",
      "Sep 7",
      "Sep 8",
      "Sep 9",
      "Sep 10",
      "Sep 11",
      "Sep 12",
      "Sep 13",
      "Sep 14",
      "Sep 15",
      "Sep 16",
      "Sep 17",
      "Sep 18",
      "Sep 19",
      "Sep 20",
      "Sep 21",
      "Sep 22",
      "Sep 23",
      "Sep 24"
    ],
    "newLeads": [
      8,
      5,
      2,
      5,
      2,
      5,
      6,
      2,
      8,
      6,
      4,
      3,
      0,
      6,
      3,
      2,
      1,
      5,
      3,
      5,
      4,
      5,
      5,
      3,
      5,
      3,
      2,
      7,
      6,
      2
    ],
    "recovered": [
      0,
      1,
      0,
      1,
      0,
      0,
      1,
      1,
      0,
      0,
      0,
      0,
      1,
      0,
      0,
      1,
      4,
      0,
      4,
      1,
      2,
      2,
      2,
      1,
      5,
      2,
      3,
      2,
      5,
      1
    ],
    "newTotal": 123,
    "recoveredTotal": 40,
    "top": 15
  }
}
