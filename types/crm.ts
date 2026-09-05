export type LeadStatus = 'Novo' | 'Contato' | 'Negociação' | 'Fechado' | 'Perdido';

export interface User { id: string; name: string; initials: string; color: string }
export interface Lead { id: string; name: string; company: string; email: string; phone: string; value: number; lastContact: string; owner: User; status: LeadStatus; tags: string[]; notes?: string }
export interface Client { id: string; name: string; company: string; email: string; phone: string; status: 'Ativo' | 'Inativo' | 'Em risco'; totalValue: number; lastContact: string; owner: User }
export type ActivityType = 'Ligação' | 'Reunião' | 'Email' | 'WhatsApp' | 'Atualização' | 'Fechamento';
export interface Activity { id: string; type: ActivityType; title: string; description: string; lead: string; time: string; owner: User }

