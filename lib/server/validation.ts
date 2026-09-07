import type { LeadInput } from '@/lib/server/leads';
import type { LeadStatus } from '@/types/crm';
import type { ActivityInput } from '@/lib/server/activities';
import type { ActivityStatus, ActivityType } from '@/types/crm';

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

const activityTypes: ActivityType[] = ['Ligação', 'Reunião', 'Email', 'Tarefa'];
const activityStatuses: ActivityStatus[] = ['pending', 'completed'];

export function parseActivityInput(value: unknown, partial = false): Partial<ActivityInput> {
  if (!value || typeof value !== 'object') throw new Error('Dados inválidos.');
  const body = value as Record<string, unknown>; const result: Partial<ActivityInput> = {};
  if (!partial || 'leadId' in body) { const leadId=text(body.leadId,80); if(!leadId) throw new Error('Selecione um lead.'); result.leadId=leadId; }
  if (!partial || 'type' in body) { if(!activityTypes.includes(body.type as ActivityType)) throw new Error('Tipo de atividade inválido.'); result.type=body.type as ActivityType; }
  if (!partial || 'title' in body) { const title=text(body.title,160); if(!title) throw new Error('Informe o título da atividade.'); result.title=title; }
  if (!partial || 'description' in body) result.description=text(body.description,4000);
  if (!partial || 'scheduledAt' in body) { const date=text(body.scheduledAt,40); if(!date || Number.isNaN(Date.parse(date))) throw new Error('Informe uma data e um horário válidos.'); result.scheduledAt=new Date(date).toISOString(); }
  if (!partial || 'status' in body) { if(!activityStatuses.includes(body.status as ActivityStatus)) throw new Error('Status da atividade inválido.'); result.status=body.status as ActivityStatus; }
  return result;
}

export function errorResponse(error: unknown) {
  if (error instanceof Response) return error;
  const message = error instanceof Error ? error.message : 'Não foi possível concluir a operação.';
  const expected = /Informe|inválid|Dados/.test(message);
  return Response.json({ error: expected ? message : 'Não foi possível concluir a operação.' }, { status: expected ? 400 : 500 });
}
