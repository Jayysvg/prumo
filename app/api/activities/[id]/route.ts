import { requireSession } from '@/lib/server/auth';
import { deleteActivity, findActivity, updateActivity } from '@/lib/server/activities';
import { errorResponse, parseActivityInput } from '@/lib/server/validation';

type RouteContext={params:Promise<{id:string}>};
export async function GET(request:Request,context:RouteContext){try{const session=await requireSession(request);const {id}=await context.params;const activity=await findActivity(session,id);if(!activity)return Response.json({error:'Atividade não encontrada.'},{status:404});return Response.json({activity});}catch(error){return errorResponse(error);}}
export async function PATCH(request:Request,context:RouteContext){try{const session=await requireSession(request);const {id}=await context.params;const input=parseActivityInput(await request.json(),true);if(!Object.keys(input).length)return Response.json({error:'Nenhuma alteração informada.'},{status:400});const activity=await updateActivity(session,id,input);if(!activity)return Response.json({error:'Atividade ou lead não encontrado.'},{status:404});return Response.json({activity});}catch(error){return errorResponse(error);}}
export async function DELETE(request:Request,context:RouteContext){try{const session=await requireSession(request);const {id}=await context.params;if(!await deleteActivity(session,id))return Response.json({error:'Atividade não encontrada.'},{status:404});return Response.json({ok:true});}catch(error){return errorResponse(error);}}
