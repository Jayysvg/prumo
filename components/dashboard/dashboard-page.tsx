import { CircleDollarSign, Target, TrendingUp, Users } from 'lucide-react';
import { activities } from '@/data/activities';
import { initialLeads } from '@/data/leads';
import { PersonAvatar, SectionTitle } from '@/components/shared';

const metrics = [
  { label: 'Total de leads', value: '42', change: '+12%', icon: Users },
  { label: 'Em negociação', value: '9', change: '+8%', icon: Target },
  { label: 'Negócios fechados', value: '14', change: '+16%', icon: CircleDollarSign },
  { label: 'Receita estimada', value: 'R$ 38.750', change: '+21%', icon: TrendingUp },
];
const stages = [
  { name: 'Novo', value: 12, color: '#6c9fd6' }, { name: 'Contato', value: 8, color: '#c48ee2' }, { name: 'Negociação', value: 9, color: '#e5ae55' }, { name: 'Fechado', value: 14, color: '#5f9e86' }, { name: 'Perdido', value: 5, color: '#a5adab' },
];

export function DashboardPage() {
  return <>
    <SectionTitle title="Bom dia, João" description="Veja como seu pipeline está evoluindo esta semana." action={<span className="rounded-lg border border-[#dce3e1] bg-white px-3 py-2 text-sm text-[#53625f]">Últimos 30 dias</span>} />
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{metrics.map(({ label, value, change, icon: Icon }) => <article key={label} className="card-surface p-5"><div className="flex items-center justify-between"><span className="grid size-9 place-items-center rounded-xl bg-[#edf3f1] text-[#315c58]"><Icon size={18} /></span><span className="rounded-full bg-[#eef8d8] px-2 py-1 text-xs font-semibold text-[#4e6d16]">{change}</span></div><p className="mt-5 text-sm text-[#71807d]">{label}</p><p className="mt-1 text-2xl font-semibold tracking-[-.035em]">{value}</p><p className="mt-2 text-xs text-[#96a09e]">em relação ao mês anterior</p></article>)}</div>
    <div className="mt-4 grid gap-4 xl:grid-cols-[1.55fr_.75fr]"><LeadChart /><GoalCard /></div>
    <div className="mt-4 grid gap-4 xl:grid-cols-[1fr_1.25fr]"><Pipeline /><RecentActivities /></div>
  </>;
}

function LeadChart() { return <article className="card-surface p-5"><div className="flex items-center justify-between"><div><h3 className="font-semibold">Evolução de leads</h3><p className="mt-1 text-sm text-[#7c8987]">Novos leads por mês</p></div><span className="text-xs font-medium text-[#52736f]">+24% no período</span></div><div className="mt-6 h-52"><svg viewBox="0 0 700 210" className="h-full w-full" preserveAspectRatio="none" aria-label="Gráfico crescente de novos leads"><defs><linearGradient id="area" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#3f756f" stopOpacity=".24"/><stop offset="1" stopColor="#3f756f" stopOpacity="0"/></linearGradient></defs>{[45,95,145,195].map(y=><line key={y} x1="0" y1={y} x2="700" y2={y} stroke="#e8edeb" strokeWidth="1"/>)}<path d="M0 165 C75 155 105 130 175 140 S280 80 350 110 S455 55 525 74 S630 30 700 42 L700 210 L0 210Z" fill="url(#area)"/><path d="M0 165 C75 155 105 130 175 140 S280 80 350 110 S455 55 525 74 S630 30 700 42" fill="none" stroke="#315f5a" strokeWidth="3" strokeLinecap="round"/></svg></div><div className="flex justify-between px-1 text-xs text-[#8e9997]">{['Abr','Mai','Jun','Jul','Ago','Set'].map(m=><span key={m}>{m}</span>)}</div></article>; }
function GoalCard() { return <article className="rounded-2xl bg-[#173f3d] p-5 text-white shadow-[0_10px_24px_rgba(17,53,51,.12)]"><p className="text-sm text-white/60">Meta do mês</p><p className="mt-2 text-3xl font-semibold">R$ 52 mil</p><div className="mt-8 h-2 overflow-hidden rounded-full bg-white/10"><div className="h-full w-[74%] rounded-full bg-[#c7f14a]" /></div><div className="mt-3 flex justify-between text-xs"><span className="text-white/55">R$ 38.750 realizados</span><span>74%</span></div><div className="mt-8 rounded-xl border border-white/10 bg-white/[0.06] p-4"><p className="text-xs text-white/55">Melhor oportunidade</p><p className="mt-2 text-sm font-medium">Grupo Lumina</p><p className="mt-1 text-xs text-[#c7f14a]">R$ 12.400 · Negociação</p></div></article>; }
function Pipeline() { return <article className="card-surface p-5"><h3 className="font-semibold">Pipeline comercial</h3><p className="mt-1 text-sm text-[#7c8987]">Distribuição por etapa</p><div className="mt-5 space-y-4">{stages.map(s=><div key={s.name}><div className="mb-1.5 flex justify-between text-sm"><span>{s.name}</span><span className="font-medium">{s.value}</span></div><div className="h-1.5 overflow-hidden rounded-full bg-[#edf0ef]"><div className="h-full rounded-full" style={{width:`${s.value/14*100}%`,backgroundColor:s.color}} /></div></div>)}</div></article>; }
function RecentActivities() { return <article className="card-surface p-5"><div className="flex items-center justify-between"><div><h3 className="font-semibold">Atividades recentes</h3><p className="mt-1 text-sm text-[#7c8987]">Últimas movimentações da equipe</p></div><span className="rounded-full bg-[#edf3f1] px-2.5 py-1 text-xs text-[#41615e]">Hoje</span></div><div className="mt-3 divide-y divide-[#edf0ef]">{activities.slice(0,4).map(a=><div key={a.id} className="flex items-center gap-3 py-3.5"><PersonAvatar user={a.owner} small /><div className="min-w-0 flex-1"><p className="truncate text-sm font-medium">{a.title} <span className="font-normal text-[#7a8885]">· {a.lead.split(' · ')[0]}</span></p><p className="mt-0.5 text-xs text-[#929c9a]">{a.lead.split(' · ')[1]}</p></div><time className="text-xs text-[#929c9a]">{a.time.split(',')[1] || a.time}</time></div>)}</div></article>; }
