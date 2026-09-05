import type { Client } from '@/types/crm';
import { users } from './leads';

export const clients: Client[] = [
  { id: 'c1', name: 'Felipe Moura', company: 'Dot Finance', email: 'felipe@dotfinance.com', phone: '(11) 98551-8300', status: 'Ativo', totalValue: 24600, lastContact: 'Hoje', owner: users[0] },
  { id: 'c2', name: 'Sofia Mendes', company: 'Caju Digital', email: 'sofia@caju.digital', phone: '(62) 99127-0051', status: 'Ativo', totalValue: 18200, lastContact: 'Ontem', owner: users[1] },
  { id: 'c3', name: 'Gustavo Freitas', company: 'Vértice RH', email: 'gustavo@verticerh.com', phone: '(11) 98763-4242', status: 'Ativo', totalValue: 31800, lastContact: 'Há 4 dias', owner: users[2] },
  { id: 'c4', name: 'Bruna Teles', company: 'Oliva Foods', email: 'bruna@olivafoods.com', phone: '(19) 99634-2020', status: 'Em risco', totalValue: 12700, lastContact: 'Há 12 dias', owner: users[0] },
  { id: 'c5', name: 'Lucas Sá', company: 'Prisma Lab', email: 'lucas@prismalab.io', phone: '(11) 98110-4312', status: 'Ativo', totalValue: 45900, lastContact: 'Há 2 dias', owner: users[1] },
  { id: 'c6', name: 'Roberta Vaz', company: 'Serena Saúde', email: 'roberta@serena.com', phone: '(31) 99901-3320', status: 'Inativo', totalValue: 9400, lastContact: 'Há 1 mês', owner: users[2] },
  { id: 'c7', name: 'Marcelo Luz', company: 'Beta Obras', email: 'marcelo@betaobras.com', phone: '(81) 99212-0822', status: 'Ativo', totalValue: 28700, lastContact: 'Hoje', owner: users[0] },
  { id: 'c8', name: 'Nina Alves', company: 'Arco Educação', email: 'nina@arcoedu.com', phone: '(11) 98411-0002', status: 'Ativo', totalValue: 35600, lastContact: 'Há 3 dias', owner: users[1] },
];

