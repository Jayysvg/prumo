import { getDb } from '@/lib/server/db';

export type SessionContext = {
  userId: string;
  email: string;
  name: string;
  workspaceId: string;
  memberId: string;
  role: 'admin' | 'member';
};

function displayName(request: Request, email: string) {
  const encoded = request.headers.get('oai-authenticated-user-full-name');
  const encoding = request.headers.get('oai-authenticated-user-full-name-encoding');
  if (encoded && encoding === 'percent-encoded-utf-8') {
    try { return decodeURIComponent(encoded); } catch { /* use email fallback */ }
  }
  return email.split('@')[0] || 'Usuário';
}

export async function requireSession(request: Request): Promise<SessionContext> {
  const productionUserId = request.headers.get('oai-authenticated-user-id');
  const productionEmail = request.headers.get('oai-authenticated-user-email');
  const isDevelopment = process.env.NODE_ENV === 'development';
  const userId = productionUserId || (isDevelopment ? 'local-development-user' : '');
  const email = productionEmail || (isDevelopment ? 'desenvolvimento@prumo.local' : '');
  if (!userId || !email) throw new Response('Não autenticado.', { status: 401 });

  const db = getDb();
  const current = await db.prepare(`SELECT id, workspace_id, name, email, role FROM workspace_members WHERE user_id = ? LIMIT 1`).bind(userId).first<{ id: string; workspace_id: string; name: string; email: string; role: 'admin' | 'member' }>();
  if (current) return { userId, email: current.email, name: current.name, workspaceId: current.workspace_id, memberId: current.id, role: current.role };

  const now = new Date().toISOString();
  const digest = Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(userId)))).map((byte) => byte.toString(16).padStart(2, '0')).join('');
  const workspaceId = `ws_${digest.slice(0, 32)}`;
  const memberId = `member_${digest.slice(32)}`;
  const name = displayName(request, email);
  await db.batch([
    db.prepare(`INSERT OR IGNORE INTO workspaces (id, name, created_at) VALUES (?, ?, ?)`).bind(workspaceId, `Espaço de ${name}`, now),
    db.prepare(`INSERT OR IGNORE INTO workspace_members (id, workspace_id, user_id, name, email, role, created_at) VALUES (?, ?, ?, ?, ?, 'admin', ?)`).bind(memberId, workspaceId, userId, name, email.toLowerCase(), now),
  ]);
  const provisioned = await db.prepare(`SELECT id, workspace_id, name, email, role FROM workspace_members WHERE user_id = ? LIMIT 1`).bind(userId).first<{ id: string; workspace_id: string; name: string; email: string; role: 'admin' | 'member' }>();
  if (!provisioned) throw new Error('Não foi possível preparar seu espaço de trabalho.');
  return { userId, email:provisioned.email, name:provisioned.name, workspaceId:provisioned.workspace_id, memberId:provisioned.id, role:provisioned.role };
}
