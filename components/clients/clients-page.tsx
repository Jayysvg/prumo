import { UsersRound } from 'lucide-react';
import { SectionTitle } from '@/components/shared';

export function ClientsPage(){return <><SectionTitle title="Clientes" description="Sua carteira será formada a partir dos negócios fechados."/><section className="card-surface p-10 text-center sm:p-14"><UsersRound className="mx-auto text-[var(--success)]" size={28}/><p className="mt-4 font-semibold text-[var(--text-strong)]">Nenhum cliente formado ainda</p><p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-[var(--text-soft)]">Nesta primeira etapa, os leads e seu histórico já são persistentes. A conversão automática em clientes será o próximo módulo do Prumo.</p></section></>}
