import type { Activity, Lead, LeadHistory } from '@/types/crm';

export const DEMO_STORAGE_KEY = 'prumo-demo-state-v1';

const owner = { id: 'demo-user', name: 'Marina Costa', initials: 'MC', color: '#d8a3ff' };
const isoFromNow = (days: number, hour = 10) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  date.setHours(hour, 0, 0, 0);
  return date.toISOString();
};

export function createDemoData(): { leads: Lead[]; activities: Activity[]; history: Record<string, LeadHistory[]> } {
  const leads: Lead[] = [
    { id:'lead-aurora', name:'Ana Martins', company:'Aurora Sistemas', email:'ana@aurora.exemplo', phone:'(11) 98821-4450', value:48000, lastContact:'Hoje', owner, status:'Negociação', tags:['Enterprise','Indicação'], source:'Indicação', notes:'Proposta enviada. Decisão envolve operações e financeiro.', nextActionAt:isoFromNow(1,10), createdAt:isoFromNow(-8), updatedAt:isoFromNow(0) },
    { id:'lead-vertice', name:'Rafael Lima', company:'Vértice Solar', email:'rafael@vertice.exemplo', phone:'(21) 99710-3021', value:32500, lastContact:'Ontem', owner, status:'Contato', tags:['Inbound'], source:'Site', notes:'Busca organizar o funil do time comercial.', nextActionAt:isoFromNow(0,15), createdAt:isoFromNow(-5), updatedAt:isoFromNow(-1) },
    { id:'lead-norte', name:'Camila Souza', company:'Norte Studio', email:'camila@norte.exemplo', phone:'(31) 99114-7812', value:18600, lastContact:'3 dias', owner, status:'Novo', tags:['Evento'], source:'Evento', notes:'Conheceu o produto em um encontro de negócios.', nextActionAt:isoFromNow(2,11), createdAt:isoFromNow(-3), updatedAt:isoFromNow(-3) },
    { id:'lead-cais', name:'Lucas Azevedo', company:'Cais Logística', email:'lucas@cais.exemplo', phone:'(41) 98808-9020', value:72000, lastContact:'5 dias', owner, status:'Fechado', tags:['Enterprise'], source:'Prospecção', notes:'Contrato aprovado e onboarding agendado.', nextActionAt:null, createdAt:isoFromNow(-18), updatedAt:isoFromNow(-5) },
    { id:'lead-verde', name:'Bianca Rocha', company:'Verde Vivo', email:'bianca@verdevivo.exemplo', phone:'(51) 99218-1144', value:24800, lastContact:'1 semana', owner, status:'Perdido', tags:['Outbound'], source:'Prospecção', notes:'Prioridade adiada para o próximo semestre.', nextActionAt:null, createdAt:isoFromNow(-20), updatedAt:isoFromNow(-7) },
  ];
  const activities: Activity[] = [
    { id:'activity-1', leadId:'lead-vertice', leadName:'Rafael Lima', leadCompany:'Vértice Solar', type:'Ligação', title:'Entender processo comercial atual', description:'Mapear gargalos e número de usuários.', scheduledAt:isoFromNow(0,15), status:'pending', completedAt:null, createdAt:isoFromNow(-2), updatedAt:isoFromNow(-2) },
    { id:'activity-2', leadId:'lead-aurora', leadName:'Ana Martins', leadCompany:'Aurora Sistemas', type:'Reunião', title:'Revisar proposta com financeiro', description:'Validar escopo, prazo e condições.', scheduledAt:isoFromNow(1,10), status:'pending', completedAt:null, createdAt:isoFromNow(-3), updatedAt:isoFromNow(-1) },
    { id:'activity-3', leadId:'lead-norte', leadName:'Camila Souza', leadCompany:'Norte Studio', type:'Email', title:'Enviar material de apresentação', description:'Incluir visão do pipeline e atividades.', scheduledAt:isoFromNow(2,11), status:'pending', completedAt:null, createdAt:isoFromNow(-1), updatedAt:isoFromNow(-1) },
    { id:'activity-4', leadId:'lead-cais', leadName:'Lucas Azevedo', leadCompany:'Cais Logística', type:'Tarefa', title:'Registrar aceite da proposta', description:'Negócio concluído.', scheduledAt:isoFromNow(-4,14), status:'completed', completedAt:isoFromNow(-4,15), createdAt:isoFromNow(-8), updatedAt:isoFromNow(-4) },
  ];
  const history = Object.fromEntries(leads.map((lead) => [lead.id, [
    { id:`${lead.id}-history-1`, type:'created' as const, previousStage:null, newStage:'Novo', description:'Lead adicionado ao pipeline.', createdAt:lead.createdAt!, authorName:'Marina Costa' },
    ...(lead.status !== 'Novo' ? [{ id:`${lead.id}-history-2`, type:'stage_changed' as const, previousStage:'Novo', newStage:lead.status, description:`Etapa alterada para ${lead.status}.`, createdAt:lead.updatedAt!, authorName:'Marina Costa' }] : []),
  ]]));
  return { leads, activities, history };
}
