import { CalendarDays, Ellipsis, GripVertical, Search, SlidersHorizontal } from 'lucide-react';
import type { Lead, LeadStatus } from '@/types/crm';
import { money, PersonAvatar, SectionTitle } from '@/components/shared';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

const columns: { status: LeadStatus; color: string }[] = [
  { status: 'Novo', color: '#5f8fc4' }, { status: 'Contato', color: '#a171bd' }, { status: 'Negociação', color: '#d79532' }, { status: 'Fechado', color: '#4d8b73' }, { status: 'Perdido', color: '#8e9997' },
];

export function LeadsPage({ leads, onMove, onOpen, initialQuery = '', loading = false }: { leads: Lead[]; onMove: (id: string, status: LeadStatus) => void; onOpen: (id: string) => void; initialQuery?: string; loading?: boolean }) {
  const [query, setQuery] = useState(initialQuery);
  const [status, setStatus] = useState<'Todos' | LeadStatus>('Todos');
  const visibleLeads = leads.filter((lead) => {
    const matchesQuery = `${lead.name} ${lead.company} ${lead.email}`.toLowerCase().includes(query.toLowerCase());
    return matchesQuery && (status === 'Todos' || lead.status === status);
  });
  return <>
    <SectionTitle title="Pipeline de leads" description={`${visibleLeads.length} de ${leads.length} oportunidades visíveis.`} action={<div className="flex flex-wrap gap-2"><div className="relative"><Search className="absolute left-3 top-2.5 text-[var(--text-faint)]" size={16}/><Input value={query} onChange={(event) => setQuery(event.target.value)} className="premium-input w-56 rounded-md pl-9" placeholder="Nome, empresa ou email" /></div><label className="control-button flex h-9 items-center gap-2 border px-3 text-sm"><SlidersHorizontal size={16}/><select value={status} onChange={(event) => setStatus(event.target.value as 'Todos' | LeadStatus)} className="bg-transparent outline-none"><option>Todos</option>{columns.map((column) => <option key={column.status}>{column.status}</option>)}</select></label></div>} />
    {loading ? <div className="card-surface p-12 text-center text-sm text-[var(--text-soft)]">Carregando seu pipeline...</div> : leads.length === 0 ? <div className="card-surface p-12 text-center"><p className="font-semibold text-[var(--text-strong)]">Seu pipeline está pronto.</p><p className="mt-2 text-sm text-[var(--text-soft)]">Use “Novo lead” para registrar sua primeira oportunidade.</p></div> : <div className="kanban-scroll -mx-5 overflow-x-auto px-5 pb-4 lg:-mx-8 lg:px-8"><div className="grid min-w-[1220px] grid-cols-5 gap-3">{columns.map(column => <KanbanColumn key={column.status} {...column} leads={visibleLeads.filter(l=>l.status===column.status)} onMove={onMove} onOpen={onOpen} />)}</div></div>}
  </>;
}

function KanbanColumn({ status, color, leads, onMove, onOpen }: { status: LeadStatus; color: string; leads: Lead[]; onMove: (id: string, status: LeadStatus) => void; onOpen: (id: string) => void }) {
  return <section onDragOver={e=>e.preventDefault()} onDrop={e=>onMove(e.dataTransfer.getData('text/lead'),status)} className="min-h-[610px] border-t-2 border-x border-b border-[var(--line)] bg-[var(--surface-soft)] p-2.5" style={{borderTopColor: color}}>
    <div className="flex items-center gap-2 px-1.5 py-2"><span className="size-2 rounded-[3px]" style={{backgroundColor:color}}/><h3 className="text-[13px] font-semibold text-[var(--text-strong)]">{status}</h3><span className="rounded-md border border-[var(--line-soft)] bg-[var(--surface-raised)] px-1.5 py-0.5 text-[10px] font-medium text-[var(--text-soft)]">{leads.length}</span><Ellipsis className="ml-auto text-[var(--text-faint)]" size={17}/></div>
    <div className="mt-1 space-y-2.5">{leads.map(lead=><LeadCard key={lead.id} lead={lead} onOpen={onOpen}/>)}</div>
    {leads.length===0 && <div className="mt-2 rounded-xl border border-dashed border-[var(--line)] p-5 text-center text-xs text-[var(--text-faint)]">Solte um lead aqui</div>}
  </section>;
}

function LeadCard({ lead, onOpen }: { lead: Lead; onOpen: (id: string) => void }) {
  return <button type="button" onClick={()=>onOpen(lead.id)} draggable onDragStart={e=>{e.dataTransfer.setData('text/lead',lead.id);e.dataTransfer.effectAllowed='move'}} className="group block w-full cursor-grab rounded-md border border-[var(--line)] bg-[var(--surface-raised)] p-3.5 text-left shadow-[var(--shadow-card)] transition hover:-translate-y-0.5 hover:border-[#9cb1ad] focus-visible:ring-2 focus-visible:ring-[var(--ring)] dark:hover:border-[#506561] active:cursor-grabbing">
    <div className="flex items-start gap-2"><GripVertical size={15} className="-ml-1 mt-0.5 text-[var(--text-faint)] opacity-0 transition group-hover:opacity-100"/><div className="min-w-0 flex-1"><h4 className="truncate text-[13px] font-semibold text-[var(--text-strong)]">{lead.name}</h4><p className="mt-0.5 truncate text-[11px] text-[var(--text-soft)]">{lead.company}</p></div></div>
    {lead.tags.length>0 && <div className="mt-3 flex gap-1">{lead.tags.map(t=><span key={t} className="rounded-[5px] border border-[var(--line-soft)] bg-[var(--surface-soft)] px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-[.04em] text-[var(--text-soft)]">{t}</span>)}</div>}
    <div className="mt-4 flex items-end justify-between"><p className="text-[15px] font-semibold tracking-[-.02em] text-[var(--text-strong)]">{money(lead.value)}</p><span className="text-[9px] uppercase tracking-[.08em] text-[var(--text-faint)]">estimado</span></div>
    <div className="mt-3 flex items-center border-t border-[var(--line-soft)] pt-3"><PersonAvatar user={lead.owner} small/><span className="ml-2 flex items-center gap-1 text-[10px] text-[var(--text-faint)]"><CalendarDays size={11}/>{lead.lastContact}</span><span className="ml-auto rounded-md p-1 text-[var(--text-faint)]"><Ellipsis size={15}/></span></div>
  </button>;
}
