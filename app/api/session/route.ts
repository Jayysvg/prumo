import { requireSession } from '@/lib/server/auth';
import { getDb } from '@/lib/server/db';
import { errorResponse } from '@/lib/server/validation';

export async function GET(request: Request) {
  try {
    const session = await requireSession(request);
    const workspace = await getDb().prepare(`SELECT name FROM workspaces WHERE id=?`).bind(session.workspaceId).first<{name:string}>();
    return Response.json({ name:session.name, email:session.email, role:session.role, workspaceName:workspace?.name || 'Prumo' });
  } catch (error) { return errorResponse(error); }
}
