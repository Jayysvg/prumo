import type { LeadInput } from '@/lib/server/leads';
import type { LeadStatus } from '@/types/crm';

const stages: LeadStatus[] = ['Novo', 'Contato', 'Negociação', 'Fechado', 'Perdido'];
const text = (value: unknown, max: number) => typeof value === 'string' ? value.trim().slice(0, max) : '';

export function parseLeadInput(value: unknown, partial = false): Partial<LeadInput> {
  if (!value || typeof value !== 'object') throw new Error('Dados inválidos.');
  const body = value as Record<string, unknown>; const result: Partial<LeadInput> = {};
  if (!partial || 'name' in body) { const name=text(body.name,120); if(!name) throw new Error('Informe o nome do lead.'); result.name=name; }
  if (!partial || 'company' in body) { const company=text(body.company,120); if(!company) throw new Error('Informe a empresa.'); result.company=company; }
  if (!partial || 'email' in body) { const email=text(body.email,180).toLowerCase(); if(email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error('Informe um email válido.'); result.email=email; }
  if (!partial || 'phone' in body) result.phone=text(body.phone,40);
  if (!partial || 'value' in body) { const amount=Number(body.value ?? 0); if(!Number.isFinite(amount) || amount<0 || amount>999999999) throw new Error('Informe um valor válido.'); result.value=Math.round(amount); }
  if (!partial || 'status' in body) { if(!stages.includes(body.status as LeadStatus)) throw new Error('Etapa inválida.'); result.status=body.status as LeadStatus; }
  if (!partial || 'source' in body) result.source=text(body.source,80);
  if (!partial || 'notes' in body) result.notes=text(body.notes,4000);
  if (!partial || 'nextActionAt' in body) { const date=text(body.nextActionAt,40); if(date && Number.isNaN(Date.parse(date))) throw new Error('Data da próxima ação inválida.'); result.nextActionAt=date || null; }
  return result;
}

export function errorResponse(error: unknown) {
  if (error instanceof Response) return error;
  const message = error instanceof Error ? error.message : 'Não foi possível concluir a operação.';
  const expected = /Informe|inválid|Dados/.test(message);
  return Response.json({ error: expected ? message : 'Não foi possível concluir a operação.' }, { status: expected ? 400 : 500 });
}
