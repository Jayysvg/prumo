import type { Activity } from '@/types/crm';
import { users } from './leads';

export const activities: Activity[] = [
  { id: 'a1', type: 'Fechamento', title: 'Negócio fechado', description: 'Contrato anual confirmado no valor de R$ 7.900.', lead: 'Felipe Moura · Dot Finance', time: 'Hoje, 10:42', owner: users[0] },
  { id: 'a2', type: 'Reunião', title: 'Reunião de proposta', description: 'Apresentação marcada com a diretoria comercial.', lead: 'Paula Castro · Grupo Lumina', time: 'Hoje, 09:15', owner: users[1] },
  { id: 'a3', type: 'WhatsApp', title: 'WhatsApp enviado', description: 'Follow-up sobre as condições da proposta.', lead: 'Thiago Rocha · Atlas Tech', time: 'Ontem, 16:28', owner: users[2] },
  { id: 'a4', type: 'Atualização', title: 'Movido para negociação', description: 'Lead demonstrou interesse e solicitou proposta.', lead: 'Camila Dias · Aflora Bio', time: 'Ontem, 14:02', owner: users[0] },
  { id: 'a5', type: 'Email', title: 'Email enviado', description: 'Material institucional e casos de sucesso enviados.', lead: 'Eduardo Ramos · Mobi Parts', time: 'Ontem, 11:40', owner: users[1] },
  { id: 'a6', type: 'Ligação', title: 'Ligação realizada', description: 'Conversa inicial de qualificação, duração de 18 min.', lead: 'Mariana Costa · Clínica Horizon', time: '02 set, 15:35', owner: users[2] },
  { id: 'a7', type: 'Reunião', title: 'Reunião agendada', description: 'Diagnóstico comercial confirmado para sexta-feira.', lead: 'André Moreira · Forte Solar', time: '02 set, 10:20', owner: users[0] },
  { id: 'a8', type: 'Email', title: 'Proposta enviada', description: 'Plano Pro com onboarding dedicado.', lead: 'Beatriz Nunes · Studio Norte', time: '01 set, 17:05', owner: users[1] },
];
