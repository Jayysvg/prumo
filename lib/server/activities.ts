import type { Activity, ActivityStatus, ActivityType } from '@/types/crm';
import type { SessionContext } from '@/lib/server/auth';
import { getDb } from '@/lib/server/db';

type ActivityRow = { id:string; lead_id:string; lead_name:string; lead_company:string; type:ActivityType; title:string; description:string|null; scheduled_at:string; status:ActivityStatus; completed_at:string|null; created_at:string; updated_at:string };
export type ActivityInput = { leadId:string; type:ActivityType; title:string; description:string; scheduledAt:string; status:ActivityStatus };

const selectActivity = `SELECT a.id, a.lead_id, l.name AS lead_name, l.company AS lead_company, a.type, a.title, a.description, a.scheduled_at, a.status, a.completed_at, a.created_at, a.updated_at FROM activities a INNER JOIN leads l ON l.id=a.lead_id`;
const mapActivity = (row:ActivityRow):Activity => ({ id:row.id, leadId:row.lead_id, leadName:row.lead_name, leadCompany:row.lead_company, type:row.type, title:row.title, description:row.description||'', scheduledAt:row.scheduled_at, status:row.status, completedAt:row.completed_at, createdAt:row.created_at, updatedAt:row.updated_at });

async function leadExists(session:SessionContext, leadId:string) {
  return Boolean(await getDb().prepare(`SELECT id FROM leads WHERE id=? AND workspace_id=? AND archived_at IS NULL LIMIT 1`).bind(leadId,session.workspaceId).first());
}
function syncLeadNextAction(db:D1Database, workspaceId:string, leadId:string, now:string) {
  return db.prepare(`UPDATE leads SET next_action_at=(SELECT MIN(scheduled_at) FROM activities WHERE workspace_id=? AND lead_id=? AND status='pending'), updated_at=? WHERE id=? AND workspace_id=?`).bind(workspaceId,leadId,now,leadId,workspaceId);
}

export async function listActivities(session:SessionContext) {
  const rows=await getDb().prepare(`${selectActivity} WHERE a.workspace_id=? ORDER BY CASE WHEN a.status='pending' THEN 0 ELSE 1 END, a.scheduled_at ASC`).bind(session.workspaceId).all<ActivityRow>();
  return rows.results.map(mapActivity);
}
export async function findActivity(session:SessionContext,id:string) {
  const row=await getDb().prepare(`${selectActivity} WHERE a.id=? AND a.workspace_id=? LIMIT 1`).bind(id,session.workspaceId).first<ActivityRow>();
  return row?mapActivity(row):null;
}
export async function createActivity(session:SessionContext,input:ActivityInput) {
  if(!await leadExists(session,input.leadId)) return null;
  const db=getDb(); const id=crypto.randomUUID(); const now=new Date().toISOString(); const completedAt=input.status==='completed'?now:null;
  await db.batch([
    db.prepare(`INSERT INTO activities (id,workspace_id,lead_id,created_by_member_id,type,title,description,scheduled_at,status,completed_at,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`).bind(id,session.workspaceId,input.leadId,session.memberId,input.type,input.title,input.description||null,input.scheduledAt,input.status,completedAt,now,now),
    syncLeadNextAction(db,session.workspaceId,input.leadId,now),
  ]);
  return findActivity(session,id);
}
export async function updateActivity(session:SessionContext,id:string,input:Partial<ActivityInput>) {
  const current=await findActivity(session,id); if(!current)return null;
  const next={leadId:input.leadId??current.leadId,type:input.type??current.type,title:input.title??current.title,description:input.description??current.description,scheduledAt:input.scheduledAt??current.scheduledAt,status:input.status??current.status};
  if(!await leadExists(session,next.leadId)) return null;
  const db=getDb(); const now=new Date().toISOString(); const completedAt=next.status==='completed'?(current.completedAt||now):null;
  const statements=[db.prepare(`UPDATE activities SET lead_id=?,type=?,title=?,description=?,scheduled_at=?,status=?,completed_at=?,updated_at=? WHERE id=? AND workspace_id=?`).bind(next.leadId,next.type,next.title,next.description||null,next.scheduledAt,next.status,completedAt,now,id,session.workspaceId),syncLeadNextAction(db,session.workspaceId,next.leadId,now)];
  if(current.leadId!==next.leadId) statements.push(syncLeadNextAction(db,session.workspaceId,current.leadId,now));
  await db.batch(statements); return findActivity(session,id);
}
export async function deleteActivity(session:SessionContext,id:string) {
  const current=await findActivity(session,id); if(!current)return false;
  const db=getDb(); const now=new Date().toISOString();
  await db.batch([db.prepare(`DELETE FROM activities WHERE id=? AND workspace_id=?`).bind(id,session.workspaceId),syncLeadNextAction(db,session.workspaceId,current.leadId,now)]); return true;
}
