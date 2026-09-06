import { requireSession } from '@/lib/server/auth';
import { archiveLead, findLead, getHistory, updateLead } from '@/lib/server/leads';
import { errorResponse, parseLeadInput } from '@/lib/server/validation';

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(request: Request, context: RouteContext) {
  try { const session=await requireSession(request); const {id}=await context.params; const lead=await findLead(session,id); if(!lead) return Response.json({error:'Lead não encontrado.'},{status:404}); const history=await getHistory(session,id); return Response.json({lead,history}); }
  catch(error){ return errorResponse(error); }
}

export async function PATCH(request: Request, context: RouteContext) {
  try { const session=await requireSession(request); const {id}=await context.params; const input=parseLeadInput(await request.json(),true); if(Object.keys(input).length===0) return Response.json({error:'Nenhuma alteração informada.'},{status:400}); const lead=await updateLead(session,id,input); if(!lead) return Response.json({error:'Lead não encontrado.'},{status:404}); return Response.json({lead}); }
  catch(error){ return errorResponse(error); }
}

export async function DELETE(request: Request, context: RouteContext) {
  try { const session=await requireSession(request); const {id}=await context.params; const archived=await archiveLead(session,id); if(!archived) return Response.json({error:'Lead não encontrado.'},{status:404}); return Response.json({ok:true}); }
  catch(error){ return errorResponse(error); }
}
