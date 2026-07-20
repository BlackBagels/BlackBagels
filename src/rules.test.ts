import { describe, expect, it } from 'vitest';
import { canApproveSample, deadlineEscalation, nextFunnelStatus } from './rules';
import { initialCampaigns, initialCreators } from './data';

describe('sample protection rules', () => {
  it('blocks creators below tier and score gates', () => {
    const decision = canApproveSample(initialCreators[2], initialCampaigns[0]);
    expect(decision.allowed).toBe(false);
    expect(decision.reasons.length).toBeGreaterThan(0);
  });
  it('blocks a second active sample', () => {
    expect(canApproveSample(initialCreators[0], initialCampaigns[0]).reasons).toContain('Creator already has one active sample.');
  });
  it('holds reimbursement until posting', () => {
    const campaign = { ...initialCampaigns[0], minimumTier: 'C' as const, minimumScore: 60 };
    expect(canApproveSample(initialCreators[2], campaign).reasons).toContain('Reimbursement is released only after verified posting.');
  });
});

describe('funnel and escalation', () => {
  it('moves sequentially through the funnel', () => expect(nextFunnelStatus('Shipped')).toBe('Delivered'));
  it('returns level 3 after six late days', () => expect(deadlineEscalation('2026-07-10', new Date('2026-07-20'))).toBe(3));
});
