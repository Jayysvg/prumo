import { ArrowUpRight, CircleDollarSign, Target, TrendingUp, Users } from 'lucide-react';
import { activities } from '@/data/activities';
import { PersonAvatar } from '@/components/shared';

const metrics = [
  { label: 'Total de leads', value: '42', change: '+12,4%', detail: '5 novos esta semana', icon: Users, trend: 'up' },
  { label: 'Em negociação', value: '9', change: '+8,1%', detail: 'R$ 31.600 em aberto', icon: Target, trend: 'up' },
  { label: 'Negócios fechados', value: '14', change: '+16,2%', detail: 'Taxa de ganho: 32%', icon: CircleDollarSign, trend: 'up' },
  { label: 'Receita estimada', value: 'R$ 38.750', change: '+21,0%', detail: '74% da meta mensal', icon: TrendingUp, trend: 'up' },
];
const stages = [
  { name: 'Novo', value: 12, amount: 'R$ 24,8 mil', color: '#6c9fd6' },
  { name: 'Contato', value: 8, amount: 'R$ 18,2 mil', color: '#ac7bc3' },
  { name: 'Negociação', value: 9, amount: 'R$ 31,6 mil', color: '#d89b3f' },
  { name: 'Fechado', value: 14, amount: 'R$ 38,7 mil', color: '#5a9a80' },
  { name: 'Perdido', value: 5, amount: 'R$ 12,4 mil', color: '#8d9996' },
];

export function DashboardPage() {
  return (
    <>
      <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <span className="size-1.5 rounded-full bg-[var(--brand-lime)] ring-4 ring-[var(--brand-lime-soft)]" />
            <span className="text-[11px] font-semibold uppercase tracking-[.16em] text-[var(--text-faint)]">Resumo comercial</span>
          </div>
          <h2 className="text-[28px] font-semibold leading-tight tracking-[-.045em] text-[var(--text-strong)] sm:text-[32px]">Bom dia, João.</h2>
          <p className="mt-1.5 text-sm text-[var(--text-soft)]">Seu pipeline ganhou ritmo. Há 3 oportunidades que pedem atenção hoje.</p>
        </div>
        <div className="flex items-center rounded-[10px] border border-[var(--line)] bg-[var(--surface-raised)] p-1 shadow-sm">
          <button className="rounded-[7px] bg-[var(--surface-soft)] px-3 py-1.5 text-xs font-medium text-[var(--text-strong)]">30 dias</button>
          <button className="px-3 py-1.5 text-xs text-[var(--text-faint)]">Trimestre</button>
          <button className="px-3 py-1.5 text-xs text-[var(--text-faint)]">Ano</button>
        </div>
      </div>

      <div className="grid overflow-hidden rounded-[15px] border border-[var(--line)] bg-[var(--surface-raised)] shadow-[var(--shadow-card)] sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map(({ label, value, change, detail, icon: Icon }, index) => (
          <article key={label} className={`relative p-5 xl:p-6 ${index < 3 ? 'border-b border-[var(--line-soft)] sm:border-r xl:border-b-0' : ''} ${index === 1 ? 'sm:border-r-0 xl:border-r' : ''}`}>
            <div className="flex items-center justify-between">
              <p className="text-[12px] font-medium uppercase tracking-[.075em] text-[var(--text-faint)]">{label}</p>
              <Icon size={16} strokeWidth={1.7} className="text-[var(--text-faint)]" />
            </div>
            <div className="mt-5 flex items-end justify-between gap-2">
              <p className="text-[27px] font-semibold leading-none tracking-[-.045em] text-[var(--text-strong)]">{value}</p>
              <span className="flex items-center gap-1 text-[11px] font-semibold text-[var(--success)]"><ArrowUpRight size={12} />{change}</span>
            </div>
            <p className="mt-3 text-xs text-[var(--text-soft)]">{detail}</p>
            <div className="absolute bottom-0 left-5 right-5 h-[2px] overflow-hidden rounded-full bg-[var(--surface-subtle)]"><div className="h-full bg-[var(--brand-lime)]" style={{ width: `${48 + index * 11}%` }} /></div>
          </article>
        ))}
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[1.6fr_.72fr]"><LeadChart /><GoalCard /></div>
      <div className="mt-4 grid gap-4 xl:grid-cols-[.9fr_1.35fr]"><Pipeline /><RecentActivities /></div>
    </>
  );
}

function LeadChart() {
  return (
    <article className="card-surface overflow-hidden">
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-[var(--line-soft)] p-5 sm:p-6">
        <div><p className="text-[11px] font-semibold uppercase tracking-[.14em] text-[var(--text-faint)]">Aquisição</p><h3 className="mt-1.5 font-semibold tracking-[-.02em] text-[var(--text-strong)]">Evolução de novos leads</h3></div>
        <div className="flex items-center gap-4 text-xs"><span className="flex items-center gap-1.5 text-[var(--text-soft)]"><span className="size-2 rounded-full bg-[#3b726d]" />Leads</span><span className="flex items-center gap-1 text-[var(--success)]"><ArrowUpRight size={13} />24%</span></div>
      </div>
      <div className="px-5 pb-4 pt-5 sm:px-6">
        <div className="mb-2 flex items-end gap-2"><strong className="text-2xl tracking-[-.04em] text-[var(--text-strong)]">186</strong><span className="pb-0.5 text-xs text-[var(--text-faint)]">leads no período</span></div>
        <div className="h-48">
          <svg viewBox="0 0 700 190" className="h-full w-full" preserveAspectRatio="none" aria-label="Gráfico crescente de novos leads">
            <defs><linearGradient id="areaPremium" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#3f756f" stopOpacity=".22" /><stop offset="1" stopColor="#3f756f" stopOpacity="0" /></linearGradient></defs>
            {[25,75,125,175].map((y)=><line key={y} x1="0" y1={y} x2="700" y2={y} stroke="var(--line-soft)" strokeWidth="1" strokeDasharray="3 5" />)}
            <path d="M0 153 C70 143 105 119 174 129 S278 68 350 99 S454 44 525 63 S630 20 700 31 L700 190 L0 190Z" fill="url(#areaPremium)" />
            <path d="M0 153 C70 143 105 119 174 129 S278 68 350 99 S454 44 525 63 S630 20 700 31" fill="none" stroke="#4c837d" strokeWidth="2.5" strokeLinecap="round" />
            {[['174','129'],['350','99'],['525','63'],['700','31']].map(([x,y])=><circle key={x} cx={x} cy={y} r="3.5" fill="var(--surface-raised)" stroke="#4c837d" strokeWidth="2" />)}
          </svg>
        </div>
        <div className="flex justify-between text-[11px] font-medium text-[var(--text-faint)]">{['Abr','Mai','Jun','Jul','Ago','Set'].map((month)=><span key={month}>{month}</span>)}</div>
      </div>
    </article>
  );
}

function GoalCard() {
  return (
    <article className="relative overflow-hidden rounded-[15px] border border-white/[.07] bg-[#123b38] p-5 text-white shadow-[0_16px_36px_rgba(12,41,39,.16)] dark:bg-[#0e2b28] sm:p-6">
      <div className="absolute -right-12 -top-12 size-40 rounded-full border border-white/[.045]" />
      <div className="absolute -right-5 -top-5 size-24 rounded-full border border-white/[.06]" />
      <div className="relative">
        <div className="flex items-center justify-between"><p className="text-[11px] font-semibold uppercase tracking-[.14em] text-white/45">Meta de setembro</p><span className="rounded-md border border-white/10 bg-white/[.06] px-2 py-1 text-[10px] text-white/60">Em curso</span></div>
        <p className="mt-5 text-[32px] font-semibold leading-none tracking-[-.045em]">R$ 52 mil</p>
        <p className="mt-2 text-xs text-white/45">R$ 13.250 restantes</p>
        <div className="mt-7 h-1.5 overflow-hidden rounded-full bg-white/10"><div className="h-full w-[74%] rounded-full bg-[var(--brand-lime)]" /></div>
        <div className="mt-2.5 flex justify-between text-[11px]"><span className="text-white/45">R$ 38.750 realizados</span><span className="font-semibold text-[var(--brand-lime)]">74%</span></div>
        <div className="mt-7 border-t border-white/10 pt-5"><p className="text-[10px] font-semibold uppercase tracking-[.12em] text-white/35">Oportunidade em destaque</p><div className="mt-3 flex items-end justify-between"><div><p className="text-sm font-medium">Grupo Lumina</p><p className="mt-1 text-xs text-white/45">Negociação · João Martins</p></div><p className="text-sm font-semibold text-[var(--brand-lime)]">R$ 12.400</p></div></div>
      </div>
    </article>
  );
}

function Pipeline() {
  return (
    <article className="card-surface p-5 sm:p-6">
      <div className="flex items-start justify-between"><div><p className="text-[11px] font-semibold uppercase tracking-[.14em] text-[var(--text-faint)]">Pipeline</p><h3 className="mt-1.5 font-semibold tracking-[-.02em] text-[var(--text-strong)]">Valor por etapa</h3></div><span className="text-xs text-[var(--text-faint)]">48 leads</span></div>
      <div className="mt-5 space-y-4">{stages.map((stage)=><div key={stage.name}><div className="mb-1.5 flex items-center text-sm"><span className="mr-2 size-1.5 rounded-full" style={{ backgroundColor: stage.color }} /><span className="text-[var(--text-soft)]">{stage.name}</span><span className="ml-auto mr-3 text-xs text-[var(--text-faint)]">{stage.value}</span><span className="w-20 text-right text-xs font-medium text-[var(--text-strong)]">{stage.amount}</span></div><div className="ml-3.5 h-1 overflow-hidden rounded-full bg-[var(--surface-subtle)]"><div className="h-full rounded-full" style={{ width: `${stage.value/14*100}%`, backgroundColor: stage.color }} /></div></div>)}</div>
    </article>
  );
}

function RecentActivities() {
  return (
    <article className="card-surface overflow-hidden">
      <div className="flex items-center justify-between border-b border-[var(--line-soft)] p-5 sm:px-6"><div><p className="text-[11px] font-semibold uppercase tracking-[.14em] text-[var(--text-faint)]">Operação</p><h3 className="mt-1.5 font-semibold tracking-[-.02em] text-[var(--text-strong)]">Atividades recentes</h3></div><button className="text-xs font-medium text-[var(--success)]">Ver histórico</button></div>
      <div className="divide-y divide-[var(--line-soft)] px-5 sm:px-6">{activities.slice(0,4).map((activity,index)=><div key={activity.id} className="flex items-center gap-3 py-3.5"><div className="relative"><PersonAvatar user={activity.owner} small />{index===0&&<span className="absolute -right-0.5 -top-0.5 size-2 rounded-full border-2 border-[var(--surface-raised)] bg-[var(--brand-lime)]" />}</div><div className="min-w-0 flex-1"><p className="truncate text-[13px] font-medium text-[var(--text-strong)]">{activity.title} <span className="font-normal text-[var(--text-soft)]">· {activity.lead.split(' · ')[0]}</span></p><p className="mt-0.5 truncate text-[11px] text-[var(--text-faint)]">{activity.description}</p></div><time className="whitespace-nowrap text-[11px] text-[var(--text-faint)]">{activity.time}</time></div>)}</div>
    </article>
  );
}
