export type TrainClass = '1A' | '2A' | '3A' | 'SL' | 'CC' | 'EC' | '2S';
export type Quota = 'GN' | 'TQ' | 'PT' | 'LD' | 'SS';

export interface Passenger {
  id: string;
  name: string;
  age: number;
  gender: 'M' | 'F' | 'T';
  berthPreference: 'NONE' | 'LB' | 'MB' | 'UB' | 'SL' | 'SU';
  foodChoice: 'V' | 'N' | 'D';
}

export interface AutofillProfile {
  id: string;
  profileName: string;
  irctcUsername: string;
  savedPass: string; // Stored securely
  preferredClass: TrainClass;
  preferredQuota: Quota;
  passengers: Passenger[];
  paymentMethod: 'UPI' | 'NET_BANKING' | 'CREDIT_CARD';
  upiAddress?: string;
  paymentUnlocked: boolean; // Managed by biometric challenge
}

export interface TrainSchedule {
  trainNumber: string;
  trainName: string;
  fromCode: string;
  toCode: string;
  fromName: string;
  toName: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  classes: TrainClass[];
  baseTatkalSeats: Record<TrainClass, number>;
  runningDays: string[]; // ['MON', 'TUE', ...]
}

export interface TrainAvailabilityAlert {
  id: string;
  trainNumber: string;
  trainName: string;
  fromCode: string;
  toCode: string;
  travelDate: string;
  trainClass: TrainClass;
  seatsThreshold: number;
  isActive: boolean;
  createdAt: string;
  lastChecked?: string;
  triggerSound: boolean;
  triggerPush: boolean;
}

export interface BookingHistory {
  id: string;
  trainNumber: string;
  trainName: string;
  fromCode: string;
  toCode: string;
  fromName: string;
  toName: string;
  pnr: string;
  journeyDate: string;
  trainClass: TrainClass;
  quota: Quota;
  passengers: string[];
  status: 'CNF' | 'WL' | 'RAC' | 'CAN';
  fare: number;
  bookingType: 'AUTOMATED' | 'MANUAL';
  createdAt: string;
}

export interface RefundTimelineStage {
  title: string;
  description: string;
  timestamp: string;
  status: 'completed' | 'current' | 'pending';
}

export interface RefundRecord {
  id: string;
  bookingId: string;
  pnr: string;
  trainNumber: string;
  trainName: string;
  cancelledDate: string;
  refundAmount: number;
  status: 'INITIATED' | 'PROCESSING_IRCTC' | 'BANK_ROUTING' | 'SETTLED' | 'FAILED';
  refundTxId: string;
  bankRef: string;
  settledDate?: string;
  timeline: RefundTimelineStage[];
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: string;
  groundingUrls?: { title: string; uri: string }[];
}
