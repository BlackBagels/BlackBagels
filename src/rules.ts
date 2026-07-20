import type { Campaign, Creator, CreatorTier, FunnelStatus } from './types';

const tierRank: Record<CreatorTier, number> = { A: 4, B: 3, C: 2, D: 1 };

export interface ApprovalDecision { allowed: boolean; reasons: string[] }

export function canApproveSample(creator: Creator, campaign: Campaign): ApprovalDecision {
  const reasons: string[] = [];
  if (tierRank[creator.tier] < tierRank[campaign.minimumTier]) reasons.push(`Tier ${creator.tier} is below campaign minimum ${campaign.minimumTier}.`);
  if (creator.score < campaign.minimumScore) reasons.push(`Qualification score ${creator.score} is below ${campaign.minimumScore}.`);
  if (creator.activeSampleCampaignId) reasons.push('Creator already has one active sample.');
  if (campaign.reservedSamples >= campaign.sampleInventory) reasons.push('No sample inventory remains.');
  if (creator.sampleMethod === 'reimbursement' && !creator.hasPosted) reasons.push('Reimbursement is released only after verified posting.');
  return { allowed: reasons.length === 0, reasons };
}

export function nextFunnelStatus(current: FunnelStatus, hasSold = false): FunnelStatus {
  const order: FunnelStatus[] = ['Approved', 'Shipped', 'Delivered', 'Content Due', 'Posted', 'Sold', 'Reorder Eligible'];
  if (current === 'Posted' && !hasSold) return 'Posted';
  return order[Math.min(order.indexOf(current) + 1, order.length - 1)];
}

export function deadlineEscalation(contentDueAt?: string, now = new Date()): 0 | 1 | 2 | 3 {
  if (!contentDueAt) return 0;
  const daysLate = Math.floor((now.getTime() - new Date(contentDueAt).getTime()) / 86400000);
  if (daysLate < 0) return 0;
  if (daysLate <= 2) return 1;
  if (daysLate <= 5) return 2;
  return 3;
}
