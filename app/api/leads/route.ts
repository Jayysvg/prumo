import { requireSession } from '@/lib/server/auth';
import { createLead, listLeads, type LeadInput } from '@/lib/server/leads';
import { errorResponse, parseLeadInput } from '@/lib/server/validation';

export async function GET(request: Request) {
  try { const session=await requireSession(request); const url=new URL(request.url); const leads=await listLeads(session,url.searchParams.get('q')||'',url.searchParams.get('status')||''); return Response.json({leads}); }
  catch(error){ return errorResponse(error); }
}

export async function POST(request: Request) {
  try { const session=await requireSession(request); const input=parseLeadInput(await request.json()) as LeadInput; const lead=await createLead(session,input); return Response.json({lead},{status:201}); }
  catch(error){ return errorResponse(error); }
}
