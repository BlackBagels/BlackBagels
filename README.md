# CreatorGrid — Creator Distribution OS

A functional front-end prototype for high-volume creator recruitment, qualification, sample distribution, shipment tracking, and commerce performance selection.

## Included in this build

- Live per-creator sample funnel: Approved → Shipped → Delivered → Content Due → Posted → Sold → Reorder Eligible
- Creator detail drawer with qualification signals, tier history, outreach state, shipment details, and event timeline
- Sample approval queue with campaign tier/score gates
- Sample protection rules:
  - one active sample per creator
  - reimbursement after valid posting
  - 48-hour and overdue deadline escalation
  - available-inventory enforcement
- Product campaign creation form covering inventory, sample cost, commission, target CAC, target ROAS, creator eligibility, content requirements, and posting timeline
- Interactive seeded demo state so approval decisions immediately update inventory and creator status
- Unit coverage for the sample approval rule engine

## Run locally

```bash
npm install
npm run dev
```

## Validate

```bash
npm test
npm run build
```

## Next integration layer

Replace seeded data with persistent campaign, creator, sample, shipment, and timeline tables. Carrier webhooks should append normalized shipment events; TikTok Shop and commerce attribution should update content and sales milestones idempotently.
