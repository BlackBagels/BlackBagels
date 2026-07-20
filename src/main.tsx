import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { AlertTriangle, Check, ChevronRight, MessageSquare, PackageCheck, Plus, Send, Truck, X } from 'lucide-react';
import { initialCampaigns, initialCreators } from './data';
import { canApproveSample, deadlineEscalation, nextFunnelStatus } from './rules';
import type { Campaign, Creator, CreatorTier, FunnelStatus } from './types';
import './styles.css';

const funnel: FunnelStatus[] = ['Approved','Shipped','Delivered','Content Due','Posted','Sold','Reorder Eligible'];
const nowIso = () => new Date().toISOString();

function App() {
  const [campaigns, setCampaigns] = useState(initialCampaigns);
  const [creators, setCreators] = useState(initialCreators);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showCampaignForm, setShowCampaignForm] = useState(false);
  const campaign = campaigns[0];
  const selected = creators.find(c => c.id === selectedId) ?? null;
  const queue = creators.filter(c => !c.activeSampleCampaignId && ['Applied','Interested'].includes(c.outreachStatus));

  const stats = useMemo(() => ({
    active: creators.filter(c => c.activeSampleCampaignId).length,
    late: creators.filter(c => deadlineEscalation(c.contentDueAt) > 0 && !c.hasPosted).length,
    sold: creators.filter(c => c.hasSold).length,
    inventory: campaign.sampleInventory - campaign.reservedSamples
  }), [creators, campaign]);

  const approve = (creator: Creator) => {
    const decision = canApproveSample(creator, campaign);
    if (!decision.allowed) return;
    setCreators(prev => prev.map(c => c.id === creator.id ? {
      ...c,
      activeSampleCampaignId: campaign.id,
      funnelStatus: 'Approved',
      timeline: [...c.timeline, { id: crypto.randomUUID(), type: 'approved', label: 'Sample approved', at: nowIso() }]
    } : c));
    setCampaigns(prev => prev.map(c => c.id === campaign.id ? { ...c, reservedSamples: c.reservedSamples + 1 } : c));
  };

  const advance = (creator: Creator) => {
    const next = nextFunnelStatus(creator.funnelStatus, creator.hasSold);
    setCreators(prev => prev.map(c => c.id === creator.id ? {
      ...c,
      funnelStatus: next,
      hasPosted: c.hasPosted || ['Posted','Sold','Reorder Eligible'].includes(next),
      hasSold: c.hasSold || ['Sold','Reorder Eligible'].includes(next),
      reimbursementEligible: c.sampleMethod === 'reimbursement' && ['Posted','Sold','Reorder Eligible'].includes(next),
      deadlineEscalationLevel: ['Posted','Sold','Reorder Eligible'].includes(next) ? 0 : c.deadlineEscalationLevel,
      timeline: [...c.timeline, { id: crypto.randomUUID(), type: next.toLowerCase().replace(' ', '_') as Creator['timeline'][number]['type'], label: `Status advanced to ${next}`, at: nowIso() }]
    } : c));
  };

  const createCampaign = (data: Omit<Campaign,'id'|'reservedSamples'>) => {
    setCampaigns(prev => [{ ...data, id: crypto.randomUUID(), reservedSamples: 0 }, ...prev]);
    setShowCampaignForm(false);
  };

  return <div className="app-shell">
    <aside className="sidebar">
      <div className="brand"><div className="brand-mark">CD</div><div><strong>Creator Distribution</strong><span>Operations OS</span></div></div>
      <nav>{['Command Center','Campaigns','Creator Network','Approval Queue','Shipments','Content','Performance'].map((item,i)=><button className={i===3?'active':''} key={item}>{item}</button>)}</nav>
      <div className="campaign-mini"><span>Active campaign</span><strong>{campaign.name}</strong><small>{campaign.productName}</small></div>
    </aside>

    <main>
      <header className="topbar"><div><p className="eyebrow">Sampling operations</p><h1>Creator sample control center</h1><p>Approve qualified creators, protect inventory, and track every sample to revenue.</p></div><button className="primary" onClick={()=>setShowCampaignForm(true)}><Plus size={17}/>New campaign</button></header>

      <section className="stats">
        <Stat label="Samples remaining" value={stats.inventory} note={`${campaign.reservedSamples} reserved`}/>
        <Stat label="Active samples" value={stats.active} note="Across this campaign"/>
        <Stat label="Deadline escalations" value={stats.late} note="Needs operator action" warning/>
        <Stat label="Creators with sales" value={stats.sold} note="Post-qualified winners"/>
      </section>

      <section className="panel campaign-summary"><div><p className="eyebrow">Campaign economics</p><h2>{campaign.name}</h2><p>{campaign.contentRequirements}</p></div><div className="economics"><Metric label="Commission" value={`${campaign.commissionPercent}%`}/><Metric label="Target CAC" value={`$${campaign.targetCAC}`}/><Metric label="Target ROAS" value={`${campaign.targetROAS}x`}/><Metric label="Posting window" value={`${campaign.postingTimelineDays} days`}/><Metric label="Minimum tier" value={campaign.minimumTier}/><Metric label="Minimum score" value={campaign.minimumScore}/></div></section>

      <section className="workspace">
        <div className="panel"><div className="section-title"><div><p className="eyebrow">Live sample funnel</p><h2>Creator fulfillment status</h2></div></div><div className="creator-list">{creators.map(c=><CreatorRow key={c.id} creator={c} onOpen={()=>setSelectedId(c.id)} onAdvance={()=>advance(c)}/>)}</div></div>
        <div className="panel queue"><div className="section-title"><div><p className="eyebrow">Sample approval queue</p><h2>{queue.length} creators waiting</h2></div></div>{queue.map(c=>{const d=canApproveSample(c,campaign);return <article className="queue-card" key={c.id}><div className="creator-head"><Avatar creator={c}/><div><strong>{c.name}</strong><span>{c.handle}</span></div><Tier tier={c.tier}/></div><div className="score-line"><span>Qualification score</span><strong>{c.score}</strong></div><div className="bar"><i style={{width:`${c.score}%`}}/></div>{!d.allowed&&<div className="reasons">{d.reasons.map(r=><span key={r}><X size={13}/>{r}</span>)}</div>}<div className="actions"><button className="secondary" onClick={()=>setSelectedId(c.id)}>Review</button><button className="primary small" disabled={!d.allowed} onClick={()=>approve(c)}><Check size={15}/>Approve</button></div></article>})}<div className="protection"><strong>Protection rules enabled</strong><span><Check size={13}/>One active sample per creator</span><span><Check size={13}/>Reimbursement after verified posting</span><span><Check size={13}/>Automatic deadline escalation</span></div></div>
      </section>
    </main>

    {selected&&<CreatorDrawer creator={selected} onClose={()=>setSelectedId(null)} onAdvance={()=>advance(selected)}/>} 
    {showCampaignForm&&<CampaignForm onClose={()=>setShowCampaignForm(false)} onCreate={createCampaign}/>} 
  </div>;
}

function Stat({label,value,note,warning}:{label:string;value:number;note:string;warning?:boolean}){return <div className={`stat ${warning?'warning':''}`}><span>{label}</span><strong>{value}</strong><small>{note}</small></div>}
function Metric({label,value}:{label:string;value:string|number}){return <div><span>{label}</span><strong>{value}</strong></div>}
function Avatar({creator}:{creator:Creator}){return <div className="avatar">{creator.avatar}</div>}
function Tier({tier}:{tier:CreatorTier}){return <span className={`tier tier-${tier.toLowerCase()}`}>Tier {tier}</span>}

function CreatorRow({creator,onOpen,onAdvance}:{creator:Creator;onOpen:()=>void;onAdvance:()=>void}){
  const current=funnel.indexOf(creator.funnelStatus); const escalation=deadlineEscalation(creator.contentDueAt);
  return <article className="creator-row"><button className="creator-summary" onClick={onOpen}><Avatar creator={creator}/><span><strong>{creator.name}</strong><small>{creator.handle}</small></span><Tier tier={creator.tier}/><b>{creator.score}</b></button><div className="funnel">{funnel.map((s,i)=><div className={i<=current?'done':''} key={s}><i>{i<current?<Check size={12}/>:i+1}</i><span>{s}</span></div>)}</div><div className="shipment"><span><Truck size={14}/>{creator.carrier??'Not shipped'}</span><span>{creator.trackingNumber??'Tracking pending'}</span>{escalation>0&&!creator.hasPosted&&<span className="late"><AlertTriangle size={13}/>Escalation {escalation}</span>}</div><button className="advance" onClick={onAdvance} disabled={creator.funnelStatus==='Reorder Eligible'}>Advance<ChevronRight size={15}/></button></article>
}

function CreatorDrawer({creator,onClose,onAdvance}:{creator:Creator;onClose:()=>void;onAdvance:()=>void}){
  return <div className="overlay"><aside className="drawer"><div className="drawer-head"><div className="creator-head"><Avatar creator={creator}/><div><h2>{creator.name}</h2><span>{creator.handle}</span></div><Tier tier={creator.tier}/></div><button onClick={onClose}><X/></button></div><div className="drawer-actions"><button className="primary" onClick={onAdvance}>Advance status<ChevronRight size={16}/></button><button className="secondary"><MessageSquare size={16}/>Message</button></div><Section title="Qualification signals"><div className="signals"><Signal label="Commerce" value={creator.signals.commerce}/><Signal label="Audience fit" value={creator.signals.audienceFit}/><Signal label="Content quality" value={creator.signals.contentQuality}/><Signal label="Reliability" value={creator.signals.reliability}/><div className="signal"><span>Median views</span><strong>{creator.signals.medianViews.toLocaleString()}</strong></div></div></Section><Section title="Outreach and sample"><div className="details"><Detail label="Outreach" value={creator.outreachStatus}/><Detail label="Message" value={creator.messageStatus}/><Detail label="Method" value={creator.sampleMethod}/><Detail label="Reimbursement" value={creator.reimbursementEligible?'Eligible':'Locked'}/><Detail label="Tracking" value={creator.trackingNumber??'Pending'}/><Detail label="Content due" value={creator.contentDueAt??'Not set'}/></div></Section><Section title="Tier history">{creator.tierHistory.map((h,i)=><div className="history" key={i}><Tier tier={h.tier}/><div><strong>{h.reason}</strong><span>{new Date(h.at).toLocaleDateString()}</span></div></div>)}</Section><Section title="Asset timeline"><div className="timeline">{creator.timeline.map(e=><div className="event" key={e.id}><i/><div><strong>{e.label}</strong><span>{new Date(e.at).toLocaleString()}</span>{e.detail&&<small>{e.detail}</small>}</div></div>)}</div></Section></aside></div>
}
function Section({title,children}:{title:string;children:React.ReactNode}){return <section className="drawer-section"><p className="eyebrow">{title}</p>{children}</section>}
function Signal({label,value}:{label:string;value:number}){return <div className="signal"><span>{label}</span><strong>{value}</strong><div className="bar"><i style={{width:`${value}%`}}/></div></div>}
function Detail({label,value}:{label:string;value:string}){return <div><span>{label}</span><strong>{value}</strong></div>}

function CampaignForm({onClose,onCreate}:{onClose:()=>void;onCreate:(d:Omit<Campaign,'id'|'reservedSamples'>)=>void}){
  const [f,setF]=useState({name:'',productName:'',sampleInventory:100,commissionPercent:15,targetCAC:25,targetROAS:3,contentRequirements:'',postingTimelineDays:10,minimumTier:'B' as CreatorTier,minimumScore:70});
  return <div className="overlay center"><form className="modal" onSubmit={e=>{e.preventDefault();onCreate(f)}}><div className="drawer-head"><div><p className="eyebrow">New product campaign</p><h2>Economics and eligibility</h2></div><button type="button" onClick={onClose}><X/></button></div><div className="form-grid"><Field label="Campaign name"><input required value={f.name} onChange={e=>setF({...f,name:e.target.value})}/></Field><Field label="Product name"><input required value={f.productName} onChange={e=>setF({...f,productName:e.target.value})}/></Field><Field label="Sample inventory"><input type="number" min="1" value={f.sampleInventory} onChange={e=>setF({...f,sampleInventory:+e.target.value})}/></Field><Field label="Commission %"><input type="number" min="0" max="100" value={f.commissionPercent} onChange={e=>setF({...f,commissionPercent:+e.target.value})}/></Field><Field label="Target CAC"><input type="number" min="0" value={f.targetCAC} onChange={e=>setF({...f,targetCAC:+e.target.value})}/></Field><Field label="Target ROAS"><input type="number" step="0.1" min="0" value={f.targetROAS} onChange={e=>setF({...f,targetROAS:+e.target.value})}/></Field><Field label="Posting timeline"><input type="number" min="1" value={f.postingTimelineDays} onChange={e=>setF({...f,postingTimelineDays:+e.target.value})}/></Field><Field label="Minimum tier"><select value={f.minimumTier} onChange={e=>setF({...f,minimumTier:e.target.value as CreatorTier})}>{['A','B','C','D'].map(t=><option key={t}>{t}</option>)}</select></Field><Field label="Minimum score"><input type="number" min="0" max="100" value={f.minimumScore} onChange={e=>setF({...f,minimumScore:+e.target.value})}/></Field><Field label="Content requirements" wide><textarea required rows={4} value={f.contentRequirements} onChange={e=>setF({...f,contentRequirements:e.target.value})}/></Field></div><div className="modal-actions"><button type="button" className="secondary" onClick={onClose}>Cancel</button><button className="primary"><Send size={16}/>Create campaign</button></div></form></div>
}
function Field({label,children,wide}:{label:string;children:React.ReactNode;wide?:boolean}){return <label className={wide?'wide':''}><span>{label}</span>{children}</label>}

createRoot(document.getElementById('root')!).render(<React.StrictMode><App/></React.StrictMode>);
