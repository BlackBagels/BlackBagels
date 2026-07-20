export type CreatorTier = 'A' | 'B' | 'C' | 'D';
export type FunnelStatus = 'Approved' | 'Shipped' | 'Delivered' | 'Content Due' | 'Posted' | 'Sold' | 'Reorder Eligible';
export type SampleMethod = 'physical' | 'reimbursement';

export interface Campaign {
  id: string;
  name: string;
  productName: string;
  sampleInventory: number;
  reservedSamples: number;
  commissionPercent: number;
  targetCAC: number;
  targetROAS: number;
  contentRequirements: string;
  postingTimelineDays: number;
  minimumTier: CreatorTier;
  minimumScore: number;
}

export interface TimelineEvent {
  id: string;
  type: 'invite' | 'message' | 'approved' | 'shipped' | 'delivered' | 'content_due' | 'posted' | 'sold' | 'reorder';
  label: string;
  at: string;
  detail?: string;
}

export interface Creator {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  tier: CreatorTier;
  score: number;
  signals: { commerce: number; audienceFit: number; medianViews: number; contentQuality: number; reliability: number };
  outreachStatus: 'Invited' | 'Viewed' | 'Replied' | 'Interested' | 'Applied';
  messageStatus: string;
  activeSampleCampaignId?: string;
  sampleMethod: SampleMethod;
  funnelStatus: FunnelStatus;
  trackingNumber?: string;
  carrier?: string;
  expectedDelivery?: string;
  contentDueAt?: string;
  reimbursementEligible: boolean;
  hasPosted: boolean;
  hasSold: boolean;
  deadlineEscalationLevel: 0 | 1 | 2 | 3;
  tierHistory: { tier: CreatorTier; at: string; reason: string }[];
  timeline: TimelineEvent[];
}
