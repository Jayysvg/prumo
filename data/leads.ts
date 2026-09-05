import type { Lead, User } from '@/types/crm';

export const users: User[] = [
  { id: 'u1', name: 'João Martins', initials: 'JM', color: '#d8a3ff' },
  { id: 'u2', name: 'Ana Lima', initials: 'AL', color: '#9fd7ff' },
  { id: 'u3', name: 'Caio Reis', initials: 'CR', color: '#ffd09f' },
];

export const initialLeads: Lead[] = [
  { id: 'l1', name: 'Mariana Costa', company: 'Clínica Horizon', email: 'mariana@horizon.com', phone: '(11) 98841-2203', value: 4500, lastContact: 'Hoje', owner: users[0], status: 'Novo', tags: ['Inbound'] },
  { id: 'l2', name: 'Ricardo Alves', company: 'Nuvem Log', email: 'ricardo@nuvemlog.com', phone: '(21) 99822-1010', value: 7200, lastContact: 'Hoje', owner: users[1], status: 'Novo', tags: ['Indicação'] },
  { id: 'l3', name: 'Larissa Souza', company: 'Viva Arquitetura', email: 'larissa@vivaarq.com', phone: '(31) 99113-4222', value: 3800, lastContact: 'Ontem', owner: users[2], status: 'Novo', tags: ['Site'] },
  { id: 'l4', name: 'Eduardo Ramos', company: 'Mobi Parts', email: 'eduardo@mobiparts.com', phone: '(11) 98714-8812', value: 9600, lastContact: 'Há 2 dias', owner: users[0], status: 'Contato', tags: ['Prioridade'] },
  { id: 'l5', name: 'Beatriz Nunes', company: 'Studio Norte', email: 'bia@studionorte.com', phone: '(51) 99612-7440', value: 5200, lastContact: 'Hoje', owner: users[1], status: 'Contato', tags: [] },
  { id: 'l6', name: 'André Moreira', company: 'Forte Solar', email: 'andre@fortesolar.com', phone: '(85) 99201-3833', value: 11000, lastContact: 'Há 3 dias', owner: users[2], status: 'Contato', tags: ['Outbound'] },
  { id: 'l7', name: 'Paula Castro', company: 'Grupo Lumina', email: 'paula@lumina.com', phone: '(11) 98447-1260', value: 12400, lastContact: 'Hoje', owner: users[0], status: 'Negociação', tags: ['Hot lead'] },
  { id: 'l8', name: 'Thiago Rocha', company: 'Atlas Tech', email: 'thiago@atlas.tech', phone: '(41) 99542-1002', value: 8700, lastContact: 'Ontem', owner: users[1], status: 'Negociação', tags: ['Proposta'] },
  { id: 'l9', name: 'Camila Dias', company: 'Aflora Bio', email: 'camila@aflora.bio', phone: '(19) 99831-3408', value: 6100, lastContact: 'Há 2 dias', owner: users[2], status: 'Negociação', tags: [] },
  { id: 'l10', name: 'Felipe Moura', company: 'Dot Finance', email: 'felipe@dotfinance.com', phone: '(11) 98551-8300', value: 7900, lastContact: 'Hoje', owner: users[0], status: 'Fechado', tags: ['Enterprise'] },
  { id: 'l11', name: 'Sofia Mendes', company: 'Caju Digital', email: 'sofia@caju.digital', phone: '(62) 99127-0051', value: 4300, lastContact: 'Ontem', owner: users[1], status: 'Fechado', tags: [] },
  { id: 'l12', name: 'Gustavo Freitas', company: 'Vértice RH', email: 'gustavo@verticerh.com', phone: '(11) 98763-4242', value: 5600, lastContact: 'Há 4 dias', owner: users[2], status: 'Fechado', tags: ['Indicação'] },
  { id: 'l13', name: 'Renata Pires', company: 'Orbe Eventos', email: 'renata@orbe.com', phone: '(21) 99773-5521', value: 3200, lastContact: 'Há 1 semana', owner: users[0], status: 'Perdido', tags: [] },
  { id: 'l14', name: 'Daniel Braga', company: 'Rota Prime', email: 'daniel@rotaprime.com', phone: '(11) 98237-6671', value: 6800, lastContact: 'Há 5 dias', owner: users[1], status: 'Perdido', tags: ['Sem retorno'] },
  { id: 'l15', name: 'Isabela Prado', company: 'Casa Mimo', email: 'isabela@casamimo.com', phone: '(48) 99622-1900', value: 2900, lastContact: 'Ontem', owner: users[2], status: 'Novo', tags: ['Instagram'] },
];

