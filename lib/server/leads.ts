import type { Lead, LeadHistory, LeadStatus } from '@/types/crm';
import type { SessionContext } from '@/lib/server/auth';
import { getDb } from '@/lib/server/db';

type LeadRow = { id:string; name:string; company:string; email:string|null; phone:string|null; estimated_value:number; source:string|null; stage:LeadStatus; notes:string|null; last_contact_at:string|null; next_action_at:string|null; created_at:string; updated_at:string; owner_id:string|null; owner_name:string|null };

export type LeadInput = { name:string; company:string; email:string; phone:string; value:number; status:LeadStatus; source:string; notes:string; nextActionAt:string|null };

const selectLead = `SELECT l.*, m.id AS owner_id, m.name AS owner_name FROM leads l LEFT JOIN workspace_members m ON m.id = l.assignee_member_id`;

function initials(name: string) { return name.split(/\s+/).slice(0, 2).map((part) => part[0]).join('').toUpperCase(); }
function relativeDate(value: string | null) {
  if (!value) return 'Sem contato';
  const days = Math.floor((Date.now() - new Date(value).getTime()) / 86400000);
  if (days <= 0) return 'Hoje';
  if (days === 1) return 'Ontem';
  return `Há ${days} dias`;
}
function mapLead(row: LeadRow): Lead {
  const ownerName = row.owner_name || 'Sem responsável';
  return { id:row.id, name:row.name, company:row.company, email:row.email || '', phone:row.phone || '', value:row.estimated_value, lastContact:relativeDate(row.last_contact_at), owner:{ id:row.owner_id || 'none', name:ownerName, initials:initials(ownerName), color:'#b9d9cf' }, status:row.stage, tags:row.source ? [row.source] : [], source:row.source || '', notes:row.notes || '', nextActionAt:row.next_action_at, createdAt:row.created_at, updatedAt:row.updated_at };
}

export async function listLeads(session: SessionContext, query = '', stage = '') {
  const db = getDb();
  const term = `%${query.trim().toLowerCase()}%`;
  const rows = await db.prepare(`${selectLead} WHERE l.workspace_id = ? AND l.archived_at IS NULL AND (? = '' OR l.stage = ?) AND (? = '' OR lower(l.name) LIKE ? OR lower(l.company) LIKE ? OR lower(coalesce(l.email,'')) LIKE ? OR lower(coalesce(l.phone,'')) LIKE ?) ORDER BY l.updated_at DESC`).bind(session.workspaceId, stage, stage, query.trim(), term, term, term, term).all<LeadRow>();
  return rows.results.map(mapLead);
}

export async function findLead(session: SessionContext, id: string) {
  const row = await getDb().prepare(`${selectLead} WHERE l.id = ? AND l.workspace_id = ? AND l.archived_at IS NULL LIMIT 1`).bind(id, session.workspaceId).first<LeadRow>();
  return row ? mapLead(row) : null;
}

export async function createLead(session: SessionContext, input: LeadInput) {
  const db = getDb(); const id = crypto.randomUUID(); const now = new Date().toISOString();
  await db.batch([
    db.prepare(`INSERT INTO leads (id, workspace_id, name, company, email, phone, estimated_value, source, stage, assignee_member_id, notes, last_contact_at, next_action_at, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`).bind(id, session.workspaceId, input.name, input.company, input.email || null, input.phone || null, input.value, input.source || null, input.status, session.memberId, input.notes || null, now, input.nextActionAt, now, now),
    db.prepare(`INSERT INTO lead_history (id, workspace_id, lead_id, author_member_id, event_type, new_stage, description, created_at) VALUES (?, ?, ?, ?, 'created', ?, ?, ?)`).bind(crypto.randomUUID(), session.workspaceId, id, session.memberId, input.status, 'Lead criado', now),
  ]);
  return findLead(session, id);
}

export async function updateLead(session: SessionContext, id: string, input: Partial<LeadInput>) {
  const current = await findLead(session, id); if (!current) return null;
  const next = { name:input.name ?? current.name, company:input.company ?? current.company, email:input.email ?? current.email, phone:input.phone ?? current.phone, value:input.value ?? current.value, status:input.status ?? current.status, source:input.source ?? current.source, notes:input.notes ?? current.notes ?? '', nextActionAt:input.nextActionAt === undefined ? current.nextActionAt ?? null : input.nextActionAt };
  const now = new Date().toISOString(); const moved = next.status !== current.status; const db = getDb();
  const statements = [db.prepare(`UPDATE leads SET name=?, company=?, email=?, phone=?, estimated_value=?, source=?, stage=?, notes=?, next_action_at=?, updated_at=? WHERE id=? AND workspace_id=? AND archived_at IS NULL`).bind(next.name, next.company, next.email || null, next.phone || null, next.value, next.source || null, next.status, next.notes || null, next.nextActionAt, now, id, session.workspaceId)];
  statements.push(db.prepare(`INSERT INTO lead_history (id, workspace_id, lead_id, author_member_id, event_type, previous_stage, new_stage, description, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`).bind(crypto.randomUUID(), session.workspaceId, id, session.memberId, moved ? 'stage_changed' : 'updated', moved ? current.status : null, moved ? next.status : null, moved ? `Etapa alterada de ${current.status} para ${next.status}` : 'Dados do lead atualizados', now));
  await db.batch(statements); return findLead(session, id);
}

export async function archiveLead(session: SessionContext, id: string) {
  const current = await findLead(session, id); if (!current) return false;
  const db = getDb(); const now = new Date().toISOString();
  await db.batch([db.prepare(`UPDATE leads SET archived_at=?, updated_at=? WHERE id=? AND workspace_id=? AND archived_at IS NULL`).bind(now, now, id, session.workspaceId), db.prepare(`INSERT INTO lead_history (id, workspace_id, lead_id, author_member_id, event_type, description, created_at) VALUES (?, ?, ?, ?, 'archived', 'Lead arquivado', ?)`).bind(crypto.randomUUID(), session.workspaceId, id, session.memberId, now)]); return true;
}

export async function getHistory(session: SessionContext, id: string): Promise<LeadHistory[]> {
  const result = await getDb().prepare(`SELECT h.id, h.event_type, h.previous_stage, h.new_stage, h.description, h.created_at, coalesce(m.name, 'Sistema') AS author_name FROM lead_history h LEFT JOIN workspace_members m ON m.id=h.author_member_id WHERE h.lead_id=? AND h.workspace_id=? ORDER BY h.created_at DESC`).bind(id, session.workspaceId).all<{id:string;event_type:LeadHistory['type'];previous_stage:string|null;new_stage:string|null;description:string;created_at:string;author_name:string}>();
  return result.results.map((row) => ({ id:row.id, type:row.event_type, previousStage:row.previous_stage, newStage:row.new_stage, description:row.description, createdAt:row.created_at, authorName:row.author_name }));
}
