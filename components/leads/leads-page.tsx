import { CalendarDays, Ellipsis, GripVertical, Search, SlidersHorizontal } from 'lucide-react';
import type { Lead, LeadStatus } from '@/types/crm';
import { money, PersonAvatar, SectionTitle } from '@/components/shared';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const columns: { status: LeadStatus; color: string }[] = [
  { status: 'Novo', color: '#5f8fc4' }, { status: 'Contato', color: '#a171bd' }, { status: 'Negociação', color: '#d79532' }, { status: 'Fechado', color: '#4d8b73' }, { status: 'Perdido', color: '#8e9997' },
];

export function LeadsPage({ leads, onMove }: { leads: Lead[]; onMove: (id: string, status: LeadStatus) => void }) {
  return <>
    <SectionTitle title="Pipeline de leads" description={`${leads.length} oportunidades distribuídas pelo funil comercial.`} action={<div className="flex gap-2"><div className="relative hidden sm:block"><Search className="absolute left-3 top-2.5 text-[#87928f]" size={16}/><Input className="w-56 rounded-xl bg-white pl-9" placeholder="Buscar lead..." /></div><Button variant="outline" className="rounded-xl bg-white"><SlidersHorizontal size={16}/> Filtrar</Button></div>} />
    <div className="kanban-scroll -mx-5 overflow-x-auto px-5 pb-4 lg:-mx-8 lg:px-8"><div className="grid min-w-[1220px] grid-cols-5 gap-3">{columns.map(column => <KanbanColumn key={column.status} {...column} leads={leads.filter(l=>l.status===column.status)} onMove={onMove} />)}</div></div>
  </>;
}

function KanbanColumn({ status, color, leads, onMove }: { status: LeadStatus; color: string; leads: Lead[]; onMove: (id: string, status: LeadStatus) => void }) {
  return <section onDragOver={e=>e.preventDefault()} onDrop={e=>onMove(e.dataTransfer.getData('text/lead'),status)} className="min-h-[610px] rounded-2xl border border-[#dfe5e3] bg-[#eef2f1]/80 p-2.5">
    <div className="flex items-center gap-2 px-1.5 py-2"><span className="size-2 rounded-full" style={{backgroundColor:color}}/><h3 className="text-sm font-semibold">{status}</h3><span className="rounded-full bg-white px-2 py-0.5 text-[11px] font-medium text-[#667572]">{leads.length}</span><Ellipsis className="ml-auto text-[#8c9895]" size={17}/></div>
    <div className="mt-1 space-y-2.5">{leads.map(lead=><LeadCard key={lead.id} lead={lead}/>)}</div>
    {leads.length===0 && <div className="mt-2 rounded-xl border border-dashed border-[#cdd6d3] p-5 text-center text-xs text-[#899592]">Solte um lead aqui</div>}
  </section>;
}

function LeadCard({ lead }: { lead: Lead }) {
  return <article draggable onDragStart={e=>{e.dataTransfer.setData('text/lead',lead.id);e.dataTransfer.effectAllowed='move'}} className="group cursor-grab rounded-xl border border-[#dde4e2] bg-white p-3.5 shadow-[0_1px_2px_rgba(16,44,43,.04)] transition hover:-translate-y-0.5 hover:border-[#bdcbc8] hover:shadow-[0_7px_18px_rgba(16,44,43,.07)] active:cursor-grabbing">
    <div className="flex items-start gap-2"><GripVertical size={15} className="-ml-1 mt-0.5 text-[#c1c9c7] opacity-0 transition group-hover:opacity-100"/><div className="min-w-0 flex-1"><h4 className="truncate text-sm font-semibold">{lead.name}</h4><p className="mt-0.5 truncate text-xs text-[#7b8986]">{lead.company}</p></div></div>
    {lead.tags.length>0 && <div className="mt-3 flex gap-1">{lead.tags.map(t=><span key={t} className="rounded-md bg-[#edf3f1] px-1.5 py-1 text-[10px] font-medium text-[#53716d]">{t}</span>)}</div>}
    <p className="mt-4 text-[15px] font-semibold tracking-tight">{money(lead.value)}</p>
    <div className="mt-3 flex items-center border-t border-[#edf0ef] pt-3"><PersonAvatar user={lead.owner} small/><span className="ml-2 flex items-center gap-1 text-[11px] text-[#87928f]"><CalendarDays size={12}/>{lead.lastContact}</span><button className="ml-auto rounded-md p-1 text-[#99a3a1] hover:bg-[#f1f4f3]" aria-label={`Mais ações para ${lead.name}`}><Ellipsis size={15}/></button></div>
  </article>;
}

