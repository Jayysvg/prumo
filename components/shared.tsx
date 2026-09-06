import type { User } from '@/types/crm';

export const money = (value: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(value);

export function PersonAvatar({ user, small = false }: { user: User; small?: boolean }) {
  return <span title={user.name} className={`${small ? 'size-7 text-[10px]' : 'size-9 text-xs'} grid shrink-0 place-items-center rounded-[9px] border border-black/[.04] font-bold text-[#20302f] shadow-sm`} style={{ backgroundColor: user.color }}>{user.initials}</span>;
}

export function SectionTitle({ title, description, action }: { title: string; description: string; action?: React.ReactNode }) {
  return <div className="mb-7 flex flex-wrap items-end justify-between gap-4"><div className="prumo-guide pl-4"><h2 className="text-[28px] font-semibold leading-tight tracking-[-.04em] text-[var(--text-strong)] sm:text-[30px]">{title}</h2><p className="mt-1.5 text-[15px] text-[var(--text-soft)]">{description}</p></div>{action}</div>;
}
