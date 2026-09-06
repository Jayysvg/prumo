'use client';

import { useState } from 'react';
import { ArrowRight, CalendarClock, Check, CircleAlert, Clock3, TrendingUp } from 'lucide-react';
import { activities } from '@/data/activities';
import { PersonAvatar } from '@/components/shared';

const periods = ['30 dias', 'Trimestre', 'Ano'] as const;
const periodData = {
  '30 dias': { revenue: 'R$ 38.750', progress: 74, leads: 42, negotiation: 9, won: 14 },
  Trimestre: { revenue: 'R$ 104.300', progress: 67, leads: 118, negotiation: 23, won: 37 },
  Ano: { revenue: 'R$ 387.900', progress: 81, leads: 436, negotiation: 64, won: 129 },
};

const priorities = [
  { eyebrow: 'Decisão hoje', title: 'Enviar proposta revisada para Grupo Lumina', detail: 'R$ 12.400 · Paula Castro', time: 'até 14h', tone: 'lime' },
  { eyebrow: 'Sem retorno', title: 'Retomar contato com Mobi Parts', detail: 'R$ 9.600 · Eduardo Ramos', time: 'há 2 dias', tone: 'amber' },
  { eyebrow: 'Agenda', title: 'Preparar reunião com Atlas Tech', detail: 'R$ 8.700 · Thiago Rocha', time: '15h', tone: 'blue' },
];

export function DashboardPage() {
  const [period, setPeriod] = useState<(typeof periods)[number]>('30 dias');
  const [done, setDone] = useState<number[]>([]);
  const data = periodData[period];

  return <>
    <header className="mb-7 flex flex-wrap items-end justify-between gap-5">
      <div className="prumo-guide pl-4"><p className="mb-1 text-sm text-[var(--text-faint)]">Sábado, 6 de setembro</p><h2 className="max-w-2xl text-[30px] font-semibold leading-[1.08] tracking-[-.045em] text-[var(--text-strong)] sm:text-[38px]">Três negociações pedem sua atenção hoje.</h2></div>
      <div className="flex border border-[var(--line)] bg-[var(--surface-raised)] p-1">{periods.map((item) => <button key={item} onClick={() => setPeriod(item)} className={`px-3 py-1.5 text-sm transition ${period === item ? 'bg-[var(--brand-ink)] font-medium text-white dark:bg-[var(--brand-lime)] dark:text-[#13231f]' : 'text-[var(--text-soft)] hover:text-[var(--text-strong)]'}`}>{item}</button>)}</div>
    </header>

    <div className="grid gap-4 xl:grid-cols-[1.45fr_.72fr]">
      <section className="card-surface overflow-hidden">
        <div className="flex items-center justify-between border-b border-[var(--line-soft)] px-5 py-4 sm:px-6"><div><h3 className="text-base font-semibold text-[var(--text-strong)]">Próximos movimentos</h3><p className="mt-0.5 text-sm text-[var(--text-soft)]">Ordenados por impacto e prazo</p></div><span className="text-sm font-medium text-[var(--success)]">{priorities.length - done.length} pendentes</span></div>
        <div className="divide-y divide-[var(--line-soft)]">{priorities.map((item, index) => { const complete = done.includes(index); return <div key={item.title} className={`grid gap-4 px-5 py-4 transition sm:grid-cols-[28px_1fr_auto] sm:items-center sm:px-6 ${complete ? 'opacity-45' : 'hover:bg-[var(--surface-soft)]'}`}><button onClick={() => setDone((current) => complete ? current.filter((value) => value !== index) : [...current, index])} aria-label={complete ? `Reabrir ${item.title}` : `Concluir ${item.title}`} className={`grid size-7 place-items-center border ${complete ? 'border-[var(--success)] bg-[var(--success)] text-white' : 'border-[var(--line)] text-transparent hover:border-[var(--success)]'}`}><Check size={15}/></button><div className="min-w-0"><div className="mb-1 flex items-center gap-2"><span className={`size-1.5 rounded-full ${item.tone === 'lime' ? 'bg-[var(--brand-lime)]' : item.tone === 'amber' ? 'bg-[#d89738]' : 'bg-[#6091bd]'}`}/><span className="text-xs font-medium text-[var(--text-faint)]">{item.eyebrow}</span></div><p className={`text-[15px] font-semibold text-[var(--text-strong)] ${complete ? 'line-through' : ''}`}>{item.title}</p><p className="mt-1 text-sm text-[var(--text-soft)]">{item.detail}</p></div><span className="flex items-center gap-1.5 text-sm text-[var(--text-faint)]"><Clock3 size={14}/>{item.time}</span></div>; })}</div>
      </section>

      <section className="relative overflow-hidden bg-[#123b38] p-6 text-white shadow-[0_14px_34px_rgba(12,41,39,.15)] dark:bg-[#0e2b28]">
        <div className="absolute inset-y-0 left-0 w-1 bg-[var(--brand-lime)]"/><p className="text-sm text-white/55">Receita no período</p><p className="mt-3 text-[36px] font-semibold leading-none tracking-[-.05em]">{data.revenue}</p>
        <div className="mt-8 flex items-end justify-between"><div><p className="text-sm text-white/55">Meta de setembro</p><p className="mt-1 font-medium">R$ 52.000</p></div><p className="text-2xl font-semibold text-[var(--brand-lime)]">{data.progress}%</p></div><div className="mt-3 h-1.5 bg-white/10"><div className="h-full bg-[var(--brand-lime)] transition-all" style={{ width: `${data.progress}%` }}/></div><p className="mt-7 border-t border-white/10 pt-5 text-sm leading-relaxed text-white/60">No ritmo atual, a meta será alcançada em <strong className="font-semibold text-white">11 dias</strong>.</p>
      </section>
    </div>

    <section className="mt-4 grid border border-[var(--line)] bg-[var(--surface-raised)] md:grid-cols-3"><Metric label="Leads ativos" value={data.leads} note="5 precisam de resposta" icon={<CircleAlert size={16}/>}/><Metric label="Em negociação" value={data.negotiation} note="R$ 31.600 em aberto" icon={<TrendingUp size={16}/>}/><Metric label="Fechados" value={data.won} note="32% de conversão" icon={<Check size={16}/>}/></section>
    <div className="mt-4 grid gap-4 xl:grid-cols-[1.25fr_.75fr]"><LeadChart/><RecentActivities/></div>
  </>;
}

function Metric({ label, value, note, icon }: { label: string; value: number; note: string; icon: React.ReactNode }) {
  return <div className="flex items-start gap-4 border-b border-[var(--line-soft)] p-5 last:border-b-0 md:border-b-0 md:border-r md:last:border-r-0 sm:p-6"><span className="mt-1 text-[var(--success)]">{icon}</span><div><p className="text-sm text-[var(--text-soft)]">{label}</p><p className="mt-1 text-[28px] font-semibold leading-none tracking-[-.04em] text-[var(--text-strong)]">{value}</p><p className="mt-2 text-xs text-[var(--text-faint)]">{note}</p></div></div>;
}

function LeadChart() {
  return <article className="card-surface overflow-hidden"><div className="flex items-start justify-between border-b border-[var(--line-soft)] p-5 sm:p-6"><div><h3 className="font-semibold text-[var(--text-strong)]">Entrada de oportunidades</h3><p className="mt-1 text-sm text-[var(--text-soft)]">Abril a setembro · 186 leads</p></div><span className="flex items-center gap-1 text-sm font-medium text-[var(--success)]"><TrendingUp size={14}/>24%</span></div><div className="px-5 pb-4 pt-6 sm:px-6"><div className="h-48"><svg viewBox="0 0 700 190" className="h-full w-full" preserveAspectRatio="none" aria-label="Gráfico crescente de novos leads"><defs><linearGradient id="areaPrumo" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#3f756f" stopOpacity=".2"/><stop offset="1" stopColor="#3f756f" stopOpacity="0"/></linearGradient></defs>{[25,75,125,175].map((y)=><line key={y} x1="0" y1={y} x2="700" y2={y} stroke="var(--line-soft)" strokeWidth="1"/>)}<path d="M0 153 C70 143 105 119 174 129 S278 68 350 99 S454 44 525 63 S630 20 700 31 L700 190 L0 190Z" fill="url(#areaPrumo)"/><path d="M0 153 C70 143 105 119 174 129 S278 68 350 99 S454 44 525 63 S630 20 700 31" fill="none" stroke="#4c837d" strokeWidth="2.5"/></svg></div><div className="flex justify-between text-xs text-[var(--text-faint)]">{['Abr','Mai','Jun','Jul','Ago','Set'].map((month)=><span key={month}>{month}</span>)}</div></div></article>;
}

function RecentActivities() {
  return <article className="card-surface overflow-hidden"><div className="flex items-center justify-between border-b border-[var(--line-soft)] p-5 sm:px-6"><div><h3 className="font-semibold text-[var(--text-strong)]">Últimas movimentações</h3><p className="mt-1 text-sm text-[var(--text-soft)]">Equipe comercial</p></div><CalendarClock size={18} className="text-[var(--text-faint)]"/></div><div className="divide-y divide-[var(--line-soft)] px-5 sm:px-6">{activities.slice(0,4).map((activity)=><div key={activity.id} className="flex items-center gap-3 py-4"><PersonAvatar user={activity.owner} small/><div className="min-w-0 flex-1"><p className="truncate text-sm font-medium text-[var(--text-strong)]">{activity.title}</p><p className="mt-0.5 truncate text-xs text-[var(--text-soft)]">{activity.lead.split(' · ')[0]}</p></div><time className="whitespace-nowrap text-xs text-[var(--text-faint)]">{activity.time}</time></div>)}</div><button className="flex w-full items-center justify-between border-t border-[var(--line-soft)] px-6 py-3.5 text-sm font-medium text-[var(--success)] hover:bg-[var(--surface-soft)]">Ver histórico completo <ArrowRight size={15}/></button></article>;
}
