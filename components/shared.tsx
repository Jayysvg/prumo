import type { User } from '@/types/crm';

export const money = (value: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(value);

export function PersonAvatar({ user, small = false }: { user: User; small?: boolean }) {
  return <span title={user.name} className={`${small ? 'size-7 text-[10px]' : 'size-9 text-xs'} grid shrink-0 place-items-center rounded-full font-semibold text-[#20302f]`} style={{ backgroundColor: user.color }}>{user.initials}</span>;
}

export function SectionTitle({ title, description, action }: { title: string; description: string; action?: React.ReactNode }) {
  return <div className="mb-6 flex flex-wrap items-end justify-between gap-3"><div><h2 className="text-[25px] font-semibold tracking-[-.035em] text-[#172525]">{title}</h2><p className="mt-1 text-sm text-[#71807d]">{description}</p></div>{action}</div>;
}

