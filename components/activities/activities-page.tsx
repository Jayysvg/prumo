import { Clock3 } from 'lucide-react';
import { SectionTitle } from '@/components/shared';

export function ActivitiesPage(){return <><SectionTitle title="Atividades" description="Acompanhe o histórico diretamente dentro de cada oportunidade."/><section className="card-surface p-10 text-center sm:p-14"><Clock3 className="mx-auto text-[var(--success)]" size={28}/><p className="mt-4 font-semibold text-[var(--text-strong)]">O histórico já começou</p><p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-[var(--text-soft)]">Abra um lead no pipeline para consultar sua criação, edições e mudanças de etapa. A agenda comercial unificada será adicionada em uma próxima fase.</p></section></>}
