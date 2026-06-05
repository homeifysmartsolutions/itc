import { TrainSchedule, TrainClass } from '../types';

export const STATIONS = [
  { code: 'NDLS', name: 'New Delhi (NDLS)', state: 'Delhi' },
  { code: 'HWH', name: 'Howrah Junction (HWH)', state: 'West Bengal' },
  { code: 'CSTM', name: 'Mumbai CSMT (CSTM)', state: 'Maharashtra' },
  { code: 'MAS', name: 'Chennai Central (MAS)', state: 'Tamil Nadu' },
  { code: 'SBC', name: 'KSR Bengaluru (SBC)', state: 'Karnataka' },
  { code: 'PNBE', name: 'Patna Junction (PNBE)', state: 'Bihar' },
  { code: 'ADI', name: 'Ahmedabad Junction (ADI)', state: 'Gujarat' },
  { code: 'JAT', name: 'Jammu Tawi (JAT)', state: 'Jammu & Kashmir' },
  { code: 'NZM', name: 'Hazrat Nizamuddin (NZM)', state: 'Delhi' },
  { code: 'BDTS', name: 'Bandra Terminus (BDTS)', state: 'Maharashtra' },
];

export const TRAINS: TrainSchedule[] = [
  {
    trainNumber: '12301',
    trainName: 'Howrah Rajdhani Express (Via Patna)',
    fromCode: 'HWH',
    toCode: 'NDLS',
    fromName: 'Howrah Junction',
    toName: 'New Delhi',
    departureTime: '16:50',
    arrivalTime: '10:00',
    duration: '17h 10m',
    classes: ['1A', '2A', '3A'],
    baseTatkalSeats: {
      '1A': 4,
      '2A': 18,
      '3A': 48,
      'SL': 0,
      'CC': 0,
      'EC': 0,
      '2S': 0
    },
    runningDays: ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'],
  },
  {
    trainNumber: '12302',
    trainName: 'New Delhi Rajdhani Express (Via Gaya)',
    fromCode: 'NDLS',
    toCode: 'HWH',
    fromName: 'New Delhi',
    toName: 'Howrah Junction',
    departureTime: '16:55',
    arrivalTime: '09:55',
    duration: '17h 00m',
    classes: ['1A', '2A', '3A'],
    baseTatkalSeats: {
      '1A': 6,
      '2A': 22,
      '3A': 64,
      'SL': 0,
      'CC': 0,
      'EC': 0,
      '2S': 0
    },
    runningDays: ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SUN'],
  },
  {
    trainNumber: '12951',
    trainName: 'Mumbai Rajdhani Express',
    fromCode: 'CSTM',
    toCode: 'NDLS',
    fromName: 'Mumbai CSMT',
    toName: 'New Delhi',
    departureTime: '17:00',
    arrivalTime: '08:35',
    duration: '15h 35m',
    classes: ['1A', '2A', '3A'],
    baseTatkalSeats: {
      '1A': 8,
      '2A': 24,
      '3A': 72,
      'SL': 0,
      'CC': 0,
      'EC': 0,
      '2S': 0
    },
    runningDays: ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'],
  },
  {
    trainNumber: '12952',
    trainName: 'New Delhi Mumbai Rajdhani',
    fromCode: 'NDLS',
    toCode: 'CSTM',
    fromName: 'New Delhi',
    toName: 'Mumbai CSMT',
    departureTime: '16:55',
    arrivalTime: '08:40',
    duration: '15h 45m',
    classes: ['1A', '2A', '3A'],
    baseTatkalSeats: {
      '1A': 4,
      '2A': 20,
      '3A': 60,
      'SL': 0,
      'CC': 0,
      'EC': 0,
      '2S': 0
    },
    runningDays: ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'],
  },
  {
    trainNumber: '12269',
    trainName: 'Chennai Duronto Express',
    fromCode: 'MAS',
    toCode: 'NZM',
    fromName: 'Chennai Central',
    toName: 'Hazrat Nizamuddin',
    departureTime: '06:40',
    arrivalTime: '10:30',
    duration: '27h 50m',
    classes: ['1A', '2A', '3A', 'SL'],
    baseTatkalSeats: {
      '1A': 2,
      '2A': 12,
      '3A': 36,
      'SL': 120,
      'CC': 0,
      'EC': 0,
      '2S': 0
    },
    runningDays: ['MON', 'FRI'],
  },
  {
    trainNumber: '12627',
    trainName: 'Karnataka Express',
    fromCode: 'SBC',
    toCode: 'NDLS',
    fromName: 'KSR Bengaluru',
    toName: 'New Delhi',
    departureTime: '19:20',
    arrivalTime: '09:00',
    duration: '37h 40m',
    classes: ['2A', '3A', 'SL'],
    baseTatkalSeats: {
      '1A': 0,
      '2A': 10,
      '3A': 30,
      'SL': 90,
      'CC': 0,
      'EC': 0,
      '2S': 0
    },
    runningDays: ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'],
  },
  {
    trainNumber: '12008',
    trainName: 'Shatabdi Express',
    fromCode: 'MYS',
    toCode: 'MAS',
    fromName: 'Mysuru Junction',
    toName: 'Chennai Central',
    departureTime: '14:15',
    arrivalTime: '21:30',
    duration: '7h 15m',
    classes: ['CC', 'EC'],
    baseTatkalSeats: {
      '1A': 0,
      '2A': 0,
      '3A': 0,
      'SL': 0,
      'CC': 40,
      'EC': 10,
      '2S': 0
    },
    runningDays: ['MON', 'TUE', 'THU', 'FRI', 'SAT', 'SUN'],
  },
  {
    trainNumber: '12381',
    trainName: 'Poorva Express (Via Patna)',
    fromCode: 'HWH',
    toCode: 'NDLS',
    fromName: 'Howrah Junction',
    toName: 'New Delhi',
    departureTime: '08:15',
    arrivalTime: '06:00',
    duration: '21h 45m',
    classes: ['2A', '3A', 'SL'],
    baseTatkalSeats: {
      '1A': 0,
      '2A': 12,
      '3A': 36,
      'SL': 180,
      'CC': 0,
      'EC': 0,
      '2S': 0
    },
    runningDays: ['WED', 'THU', 'SUN'],
  },
  {
    trainNumber: '12471',
    trainName: 'Swaraj Express',
    fromCode: 'BDTS',
    toCode: 'JAT',
    fromName: 'Bandra Terminus',
    toName: 'Jammu Tawi',
    departureTime: '11:00',
    arrivalTime: '17:40',
    duration: '30h 40m',
    classes: ['2A', '3A', 'SL'],
    baseTatkalSeats: {
      '1A': 0,
      '2A': 8,
      '3A': 24,
      'SL': 110,
      'CC': 0,
      'EC': 0,
      '2S': 0
    },
    runningDays: ['SUN', 'MON', 'THU', 'FRI'],
  }
];

// Seed initial bookings / records
export const INITIAL_BOOKINGS = [
  {
    id: 'BKG-08972',
    trainNumber: '12301',
    trainName: 'Howrah Rajdhani Express',
    fromCode: 'HWH',
    toCode: 'NDLS',
    fromName: 'Howrah Junction',
    toName: 'New Delhi',
    pnr: '4234567890',
    journeyDate: '2026-06-12',
    trainClass: '3A' as TrainClass,
    quota: 'TQ' as const,
    passengers: ['Raman Kumar', 'Shashi Kumar'],
    status: 'CNF' as const,
    fare: 4620,
    bookingType: 'AUTOMATED' as const,
    createdAt: '2026-06-03 10:00:42',
  },
  {
    id: 'BKG-06123',
    trainNumber: '12952',
    trainName: 'New Delhi Mumbai Rajdhani',
    fromCode: 'NDLS',
    toCode: 'CSTM',
    fromName: 'New Delhi',
    toName: 'Mumbai CSMT',
    pnr: '8310928431',
    journeyDate: '2026-06-05',
    trainClass: '2A' as TrainClass,
    quota: 'TQ' as const,
    passengers: ['Kamala Sen'],
    status: 'CNF' as const,
    fare: 3105,
    bookingType: 'AUTOMATED' as const,
    createdAt: '2026-06-04 10:01:21',
  },
  {
    id: 'BKG-01124',
    trainNumber: '12269',
    trainName: 'Chennai Duronto Express',
    fromCode: 'MAS',
    toCode: 'NZM',
    fromName: 'Chennai Central',
    toName: 'Hazrat Nizamuddin',
    pnr: '1240982541',
    journeyDate: '2026-05-18',
    trainClass: 'SL' as TrainClass,
    quota: 'TQ' as const,
    passengers: ['Sandeep Rajan'],
    status: 'CAN' as const,
    fare: 890,
    bookingType: 'MANUAL' as const,
    createdAt: '2026-05-17 11:04:12',
  },
];

export const INITIAL_REFUNDS = [
  {
    id: 'REF-90284',
    bookingId: 'BKG-01124',
    pnr: '1240982541',
    trainNumber: '12269',
    trainName: 'Chennai Duronto Express',
    cancelledDate: '2026-05-18',
    refundAmount: 770, // 890 minus 120 clerkage rules
    status: 'SETTLED' as const,
    refundTxId: 'TXN-IRCTC98184918239',
    bankRef: 'BKN-HDFC09284712497',
    settledDate: '2026-05-20',
    timeline: [
      {
        title: 'Cancellation Confirmed',
        description: 'Ticket cancelled. PNR deactivated. Refund query registered by IRCTC Server.',
        timestamp: '2026-05-18 14:15:22',
        status: 'completed' as const
      },
      {
        title: 'Refund Approved by IRCTC',
        description: 'Refund order processed. Deducted ₹120 (clerkage). Net refund of ₹770 acknowledged.',
        timestamp: '2026-05-18 18:30:10',
        status: 'completed' as const
      },
      {
        title: 'Disbursed to CONCOR Gateway',
        description: 'Electronic Settlement Instruction routed to RBI gateway platform.',
        timestamp: '2026-05-19 11:05:00',
        status: 'completed' as const
      },
      {
        title: 'Acquiring Bank Settled',
        description: 'Amount successfully credited to source HDFC Net-Banking/Card payment channel.',
        timestamp: '2026-05-20 10:45:00',
        status: 'completed' as const
      }
    ],
  },
  {
    id: 'REF-78921',
    bookingId: 'BKG-02941',
    pnr: '2345109284',
    trainNumber: '12008',
    trainName: 'Shatabdi Express',
    cancelledDate: '2026-06-04',
    refundAmount: 1140,
    status: 'BANK_ROUTING' as const,
    refundTxId: 'TXN-IRCTC92419481230',
    bankRef: 'BKN-ICICI0928412841',
    timeline: [
      {
        title: 'Cancellation Confirmed',
        description: 'Ticket cancelled online. Passenger details released back to general pool.',
        timestamp: '2026-06-04 11:30:00',
        status: 'completed' as const
      },
      {
        title: 'Refund Approved by IRCTC',
        description: 'Refund sum validated and passed to banking partner system for distribution.',
        timestamp: '2026-06-04 16:45:12',
        status: 'completed' as const
      },
      {
        title: 'Disbursed to CONCOR Gateway',
        description: 'Sent to terminal gate for credit back to source ICICI account.',
        timestamp: '2026-06-05 09:12:00',
        status: 'current' as const
      },
      {
        title: 'Settled to Destination Bank',
        description: 'Awaiting Bank confirmation settlement code.',
        timestamp: 'Awaiting confirmation',
        status: 'pending' as const
      }
    ]
  }
];

// Simulate dynamic seat availability
// High availability at (say) 9:55 AM, drops instantly on 10:00 AM (Tatkal Class start)
export function getLiveSeatsAvailability(
  trainNumber: string,
  trainClass: TrainClass,
  isTatkalTime: boolean, // if we want to simulate tatkal time
  elapsedSeconds: number // simulation timeline
): { seats: number; status: 'AVAILABLE' | 'REGRET' | 'WL'; waitlist?: number; probability: number } {
  const train = TRAINS.find(t => t.trainNumber === trainNumber);
  if (!train) return { seats: 0, status: 'REGRET', probability: 0 };
  
  const baseSeats = train.baseTatkalSeats[trainClass] || 0;
  if (baseSeats === 0) return { seats: 0, status: 'REGRET', probability: 0 };

  if (!isTatkalTime) {
    // Normal query shows steady availability
    return { seats: Math.floor(baseSeats * 0.8), status: 'AVAILABLE', probability: 95 };
  }

  // During Tatkal speedrun simulation or live alerts, seats drop rapidly
  const halfLife = 15; // 15 seconds to drain half seats
  const remaining = Math.max(0, Math.floor(baseSeats * Math.pow(0.5, elapsedSeconds / halfLife)));

  if (remaining > 5) {
    return { seats: remaining, status: 'AVAILABLE', probability: 85 };
  } else if (remaining > 0) {
    return { seats: remaining, status: 'AVAILABLE', probability: 40 };
  } else {
    // Seats are sold out, now in waitlist
    const wlNumber = Math.floor((elapsedSeconds - 45) / 5) + 1;
    const currentWlNumber = Math.max(1, wlNumber);
    const prob = Math.max(5, 75 - (currentWlNumber * 5));
    return { seats: 0, status: 'WL', waitlist: currentWlNumber, probability: prob };
  }
}
