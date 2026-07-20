import type { Campaign, Creator } from './types';

export const initialCampaigns: Campaign[] = [{
  id: 'camp-1', name: 'HydraGlow Launch', productName: 'HydraGlow Serum', sampleInventory: 250, reservedSamples: 84,
  commissionPercent: 18, targetCAC: 24, targetROAS: 3.2,
  contentRequirements: '1 TikTok Shop video, product demo, before/after hook, FTC disclosure.',
  postingTimelineDays: 10, minimumTier: 'B', minimumScore: 72
}];

export const initialCreators: Creator[] = [
  {
    id: 'cr-1', name: 'Maya Chen', handle: '@mayamakesit', avatar: 'MC', tier: 'A', score: 91,
    signals: { commerce: 94, audienceFit: 88, medianViews: 128000, contentQuality: 92, reliability: 97 },
    outreachStatus: 'Applied', messageStatus: 'Replied 2h ago', sampleMethod: 'physical', funnelStatus: 'Delivered',
    activeSampleCampaignId: 'camp-1', trackingNumber: '1Z92X41A039222', carrier: 'UPS', expectedDelivery: '2026-07-18', contentDueAt: '2026-07-24',
    reimbursementEligible: false, hasPosted: false, hasSold: false, deadlineEscalationLevel: 0,
    tierHistory: [{ tier: 'B', at: '2026-07-02', reason: 'Imported from commerce search' }, { tier: 'A', at: '2026-07-05', reason: 'High historical GMV and 97% posting reliability' }],
    timeline: [
      { id: 't1', type: 'invite', label: 'Campaign invite sent', at: '2026-07-02T14:20:00Z' },
      { id: 't2', type: 'message', label: 'Creator replied', at: '2026-07-03T11:15:00Z' },
      { id: 't3', type: 'approved', label: 'Sample approved', at: '2026-07-05T16:00:00Z' },
      { id: 't4', type: 'shipped', label: 'Package shipped', at: '2026-07-07T09:30:00Z', detail: 'UPS · 1Z92X41A039222' },
      { id: 't5', type: 'delivered', label: 'Package delivered', at: '2026-07-18T18:10:00Z' }
    ]
  },
  {
    id: 'cr-2', name: 'Jordan Wells', handle: '@jordansfinds', avatar: 'JW', tier: 'B', score: 79,
    signals: { commerce: 74, audienceFit: 86, medianViews: 54000, contentQuality: 81, reliability: 78 },
    outreachStatus: 'Interested', messageStatus: 'Viewed 35m ago', sampleMethod: 'physical', funnelStatus: 'Approved',
    reimbursementEligible: false, hasPosted: false, hasSold: false, deadlineEscalationLevel: 0,
    tierHistory: [{ tier: 'B', at: '2026-07-16', reason: 'Strong audience fit and consistent beauty content' }],
    timeline: [{ id: 't6', type: 'invite', label: 'Campaign invite sent', at: '2026-07-15T13:00:00Z' }, { id: 't7', type: 'approved', label: 'Application awaiting sample approval', at: '2026-07-19T10:45:00Z' }]
  },
  {
    id: 'cr-3', name: 'Alex Rivera', handle: '@alexreviews', avatar: 'AR', tier: 'C', score: 66,
    signals: { commerce: 48, audienceFit: 82, medianViews: 22000, contentQuality: 76, reliability: 68 },
    outreachStatus: 'Applied', messageStatus: 'Replied yesterday', sampleMethod: 'reimbursement', funnelStatus: 'Content Due', contentDueAt: '2026-07-14',
    reimbursementEligible: false, hasPosted: false, hasSold: false, deadlineEscalationLevel: 2,
    tierHistory: [{ tier: 'C', at: '2026-07-08', reason: 'Promising content, insufficient commerce history' }],
    timeline: [{ id: 't8', type: 'invite', label: 'Campaign invite sent', at: '2026-07-08T12:00:00Z' }, { id: 't9', type: 'message', label: 'Reimbursement terms accepted', at: '2026-07-09T15:20:00Z' }]
  },
  {
    id: 'cr-4', name: 'Nia Brooks', handle: '@niatriesit', avatar: 'NB', tier: 'A', score: 94,
    signals: { commerce: 97, audienceFit: 91, medianViews: 310000, contentQuality: 95, reliability: 93 },
    outreachStatus: 'Applied', messageStatus: 'Active conversation', sampleMethod: 'physical', funnelStatus: 'Sold', activeSampleCampaignId: 'camp-1',
    trackingNumber: '940011129837', carrier: 'USPS', expectedDelivery: '2026-07-09', contentDueAt: '2026-07-15', reimbursementEligible: false, hasPosted: true, hasSold: true, deadlineEscalationLevel: 0,
    tierHistory: [{ tier: 'A', at: '2026-06-28', reason: 'Top 2% category seller' }],
    timeline: [
      { id: 't10', type: 'invite', label: 'Campaign invite sent', at: '2026-06-28T10:00:00Z' },
      { id: 't11', type: 'shipped', label: 'Package shipped', at: '2026-07-01T09:00:00Z' },
      { id: 't12', type: 'posted', label: 'Video posted', at: '2026-07-12T20:00:00Z', detail: '184K views · 6.4% CTR' },
      { id: 't13', type: 'sold', label: 'First sale attributed', at: '2026-07-12T21:14:00Z', detail: '$8,420 GMV to date' }
    ]
  }
];
