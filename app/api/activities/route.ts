import { requireSession } from '@/lib/server/auth';
import { createActivity, listActivities, type ActivityInput } from '@/lib/server/activities';
import { errorResponse, parseActivityInput } from '@/lib/server/validation';

export async function GET(request:Request){try{const session=await requireSession(request);return Response.json({activities:await listActivities(session)});}catch(error){return errorResponse(error);}}
export async function POST(request:Request){try{const session=await requireSession(request);const input=parseActivityInput(await request.json()) as ActivityInput;const activity=await createActivity(session,input);if(!activity)return Response.json({error:'Lead não encontrado.'},{status:404});return Response.json({activity},{status:201});}catch(error){return errorResponse(error);}}
