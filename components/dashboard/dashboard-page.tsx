'use client';

import { useState } from 'react';
import { ArrowRight, Check, CircleAlert, Clock3, TrendingUp } from 'lucide-react';
import type { Lead, LeadStatus } from '@/types/crm';
import { money, PersonAvatar } from '@/components/shared';

const periods = ['30 dias', 'Trimestre', 'Ano'] as const;
const stages: LeadStatus[] = ['Novo', 'Contato', 'Negociação', 'Fechado', 'Perdido'];

export function DashboardPage({ leads, loading }: { leads: Lead[]; loading: boolean }) {
  const [period, setPeriod] = useState<(typeof periods)[number]>('30 dias');
  const [now] = useState(() => Date.now());
  const days = period === '30 dias' ? 30 : period === 'Trimestre' ? 90 : 365;
  const cutoff = now - days * 86400000;
  const visible = leads.filter((lead) => !lead.createdAt || new Date(lead.createdAt).getTime() >= cutoff);
  const open = visible.filter((lead) => !['Fechado', 'Perdido'].includes(lead.status));
  const negotiation = visible.filter((lead) => lead.status === 'Negociação');
  const won = visible.filter((lead) => lead.status === 'Fechado');
  const pipelineValue = open.reduce((total, lead) => total + lead.value, 0);
  const wonValue = won.reduce((total, lead) => total + lead.value, 0);
  const priorities = open.slice().sort((a,b) => (b.value-a.value)).slice(0,3);
  const conversion = visible.length ? Math.round((won.length / visible.length) * 100) : 0;
  const today = new Intl.DateTimeFormat('pt-BR', { weekday:'long', day:'numeric', month:'long' }).format(new Date(now));

  if (loading) return <div className="card-surface p-12 text-center text-sm text-[var(--text-soft)]">Carregando sua visão comercial...</div>;

  return <>
    <header className="mb-7 flex flex-wrap items-end justify-between gap-5">
      <div className="prumo-guide pl-4"><p className="mb-1 capitalize text-sm text-[var(--text-faint)]">{today}</p><h2 className="max-w-2xl text-[30px] font-semibold leading-[1.08] tracking-[-.045em] text-[var(--text-strong)] sm:text-[38px]">{leads.length ? `${open.length} oportunidades seguem em movimento.` : 'Seu espaço comercial está pronto.'}</h2></div>
      <div className="flex border border-[var(--line)] bg-[var(--surface-raised)] p-1">{periods.map((item)=><button key={item} onClick={()=>setPeriod(item)} className={`px-3 py-1.5 text-sm transition ${period===item?'bg-[var(--brand-ink)] font-medium text-white dark:bg-[var(--brand-lime)] dark:text-[#13231f]':'text-[var(--text-soft)]'}`}>{item}</button>)}</div>
    </header>

    {leads.length === 0 ? <section className="card-surface p-10 sm:p-14"><p className="text-lg font-semibold text-[var(--text-strong)]">Cadastre sua primeira oportunidade</p><p className="mt-2 max-w-lg text-sm leading-relaxed text-[var(--text-soft)]">Assim que você adicionar leads, o Prumo mostrará aqui o valor em negociação, a conversão e os próximos movimentos com base nos seus dados reais.</p></section> : <>
      <div className="grid gap-4 xl:grid-cols-[1.45fr_.72fr]">
        <section className="card-surface overflow-hidden"><div className="flex items-center justify-between border-b border-[var(--line-soft)] px-5 py-4 sm:px-6"><div><h3 className="text-base font-semibold text-[var(--text-strong)]">Oportunidades prioritárias</h3><p className="mt-0.5 text-sm text-[var(--text-soft)]">Ordenadas pelo maior valor estimado</p></div><span className="text-sm font-medium text-[var(--success)]">{priorities.length} em foco</span></div><div className="divide-y divide-[var(--line-soft)]">{priorities.map((lead)=><div key={lead.id} className="grid gap-3 px-5 py-4 sm:grid-cols-[1fr_auto] sm:items-center sm:px-6"><div className="min-w-0"><p className="text-[15px] font-semibold text-[var(--text-strong)]">{lead.company}</p><p className="mt-1 text-sm text-[var(--text-soft)]">{lead.name} · {lead.status}</p></div><div className="text-left sm:text-right"><p className="font-semibold text-[var(--text-strong)]">{money(lead.value)}</p><p className="mt-1 flex items-center gap-1 text-xs text-[var(--text-faint)] sm:justify-end"><Clock3 size={12}/>{lead.nextActionAt ? new Date(lead.nextActionAt).toLocaleString('pt-BR',{day:'2-digit',month:'short',hour:'2-digit',minute:'2-digit'}) : 'Próxima ação não definida'}</p></div></div>)}</div></section>
        <section className="relative overflow-hidden bg-[#123b38] p-6 text-white shadow-[0_14px_34px_rgba(12,41,39,.15)] dark:bg-[#0e2b28]"><div className="absolute inset-y-0 left-0 w-1 bg-[var(--brand-lime)]"/><p className="text-sm text-white/55">Valor em pipeline</p><p className="mt-3 text-[36px] font-semibold leading-none tracking-[-.05em]">{money(pipelineValue)}</p><div className="mt-8 border-t border-white/10 pt-5"><p className="text-sm text-white/55">Receita conquistada no período</p><p className="mt-2 text-2xl font-semibold text-[var(--brand-lime)]">{money(wonValue)}</p></div><p className="mt-7 text-sm leading-relaxed text-white/60">Indicadores calculados a partir dos leads cadastrados no seu espaço.</p></section>
      </div>
      <section className="mt-4 grid border border-[var(--line)] bg-[var(--surface-raised)] md:grid-cols-3"><Metric label="Leads ativos" value={open.length} note={`${visible.length} cadastrados no período`} icon={<CircleAlert size={16}/>}/><Metric label="Em negociação" value={negotiation.length} note={money(negotiation.reduce((sum,lead)=>sum+lead.value,0))} icon={<TrendingUp size={16}/>}/><Metric label="Conversão" value={`${conversion}%`} note={`${won.length} negócios fechados`} icon={<Check size={16}/>}/></section>
      <div className="mt-4 grid gap-4 xl:grid-cols-[1.1fr_.9fr]"><StageBreakdown leads={visible}/><RecentLeads leads={visible}/></div>
    </>}
  </>;
}

function Metric({label,value,note,icon}:{label:string;value:number|string;note:string;icon:React.ReactNode}){return <div className="flex items-start gap-4 border-b border-[var(--line-soft)] p-5 last:border-b-0 md:border-b-0 md:border-r md:last:border-r-0 sm:p-6"><span className="mt-1 text-[var(--success)]">{icon}</span><div><p className="text-sm text-[var(--text-soft)]">{label}</p><p className="mt-1 text-[28px] font-semibold leading-none tracking-[-.04em] text-[var(--text-strong)]">{value}</p><p className="mt-2 text-xs text-[var(--text-faint)]">{note}</p></div></div>}

function StageBreakdown({leads}:{leads:Lead[]}){const max=Math.max(1,...stages.map((stage)=>leads.filter((lead)=>lead.status===stage).length));return <article className="card-surface p-5 sm:p-6"><h3 className="font-semibold text-[var(--text-strong)]">Distribuição do pipeline</h3><p className="mt-1 text-sm text-[var(--text-soft)]">Leads por etapa no período</p><div className="mt-6 space-y-4">{stages.map((stage)=>{const count=leads.filter((lead)=>lead.status===stage).length;return <div key={stage}><div className="mb-1.5 flex justify-between text-sm"><span className="text-[var(--text-soft)]">{stage}</span><span className="font-medium text-[var(--text-strong)]">{count}</span></div><div className="h-1.5 bg-[var(--surface-subtle)]"><div className="h-full bg-[var(--success)]" style={{width:`${count/max*100}%`}}/></div></div>})}</div></article>}

function RecentLeads({leads}:{leads:Lead[]}){return <article className="card-surface overflow-hidden"><div className="border-b border-[var(--line-soft)] p-5 sm:px-6"><h3 className="font-semibold text-[var(--text-strong)]">Atualizados recentemente</h3><p className="mt-1 text-sm text-[var(--text-soft)]">Últimas oportunidades movimentadas</p></div><div className="divide-y divide-[var(--line-soft)] px-5 sm:px-6">{leads.slice(0,4).map((lead)=><div key={lead.id} className="flex items-center gap-3 py-4"><PersonAvatar user={lead.owner} small/><div className="min-w-0 flex-1"><p className="truncate text-sm font-medium text-[var(--text-strong)]">{lead.name}</p><p className="mt-0.5 truncate text-xs text-[var(--text-soft)]">{lead.company}</p></div><span className="text-xs text-[var(--text-faint)]">{lead.status}</span></div>)}</div><button className="flex w-full items-center justify-between border-t border-[var(--line-soft)] px-6 py-3.5 text-sm font-medium text-[var(--success)]">Ver pipeline <ArrowRight size={15}/></button></article>}
