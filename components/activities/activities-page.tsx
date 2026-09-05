'use client';
import { CalendarCheck, CheckCircle2, Mail, MessageCircle, Phone, RefreshCcw, SlidersHorizontal } from 'lucide-react';
import { useState } from 'react';
import { activities } from '@/data/activities';
import type { ActivityType } from '@/types/crm';
import { PersonAvatar, SectionTitle } from '@/components/shared';
import { Button } from '@/components/ui/button';

const icons = { Ligação: Phone, Reunião: CalendarCheck, Email: Mail, WhatsApp: MessageCircle, Atualização: RefreshCcw, Fechamento: CheckCircle2 };
const filters: ('Todas'|ActivityType)[]=['Todas','Ligação','Reunião','Email','WhatsApp','Atualização','Fechamento'];

export function ActivitiesPage(){ const [filter,setFilter]=useState<(typeof filters)[number]>('Todas'); const list=filter==='Todas'?activities:activities.filter(a=>a.type===filter); return <><SectionTitle title="Atividades" description="Histórico de interações e movimentações comerciais." action={<Button variant="outline" className="rounded-xl bg-white"><SlidersHorizontal size={16}/> Mais filtros</Button>}/><div className="mb-4 flex gap-2 overflow-x-auto pb-1">{filters.map(f=><button onClick={()=>setFilter(f)} key={f} className={`whitespace-nowrap rounded-xl border px-3 py-2 text-sm transition ${filter===f?'border-[#173f3d] bg-[#173f3d] text-white':'border-[#dce3e1] bg-white text-[#63716f] hover:border-[#b9c8c5]'}`}>{f}</button>)}</div><section className="card-surface p-4 sm:p-6"><div className="relative space-y-1 before:absolute before:bottom-8 before:left-[19px] before:top-8 before:w-px before:bg-[#e1e7e5]">{list.map(a=>{const Icon=icons[a.type];return <article key={a.id} className="relative flex gap-4 rounded-xl p-3 transition hover:bg-[#f7f9f8]"><span className="z-10 grid size-10 shrink-0 place-items-center rounded-xl border border-[#dfe6e4] bg-white text-[#446a66]"><Icon size={17}/></span><div className="min-w-0 flex-1 border-b border-[#edf0ef] pb-5"><div className="flex flex-wrap items-center justify-between gap-2"><div className="flex items-center gap-2"><h3 className="text-sm font-semibold">{a.title}</h3><span className="rounded-md bg-[#edf3f1] px-1.5 py-0.5 text-[10px] font-medium text-[#53716d]">{a.type}</span></div><time className="text-xs text-[#8a9693]">{a.time}</time></div><p className="mt-1 text-sm text-[#6f7d7a]">{a.description}</p><div className="mt-3 flex items-center gap-2"><PersonAvatar user={a.owner} small/><span className="text-xs font-medium">{a.lead}</span><span className="text-xs text-[#919b99]">· {a.owner.name}</span></div></div></article>})}</div></section></>; }

