export type LeadStatus = 'Novo' | 'Contato' | 'Negociação' | 'Fechado' | 'Perdido';

export interface User { id: string; name: string; initials: string; color: string }
export interface Lead { id: string; name: string; company: string; email: string; phone: string; value: number; lastContact: string; owner: User; status: LeadStatus; tags: string[]; source?: string; notes?: string; nextActionAt?: string | null; createdAt?: string; updatedAt?: string }
export interface LeadHistory { id: string; type: 'created' | 'updated' | 'stage_changed' | 'archived'; previousStage: string | null; newStage: string | null; description: string; createdAt: string; authorName: string }
export interface SessionUser { name: string; email: string; role: 'admin' | 'member'; workspaceName: string }
export interface Client { id: string; name: string; company: string; email: string; phone: string; status: 'Ativo' | 'Inativo' | 'Em risco'; totalValue: number; lastContact: string; owner: User }
export type ActivityType = 'Ligação' | 'Reunião' | 'Email' | 'Tarefa';
export type ActivityStatus = 'pending' | 'completed';
export interface Activity { id: string; leadId: string; leadName: string; leadCompany: string; type: ActivityType; title: string; description: string; scheduledAt: string; status: ActivityStatus; completedAt: string | null; createdAt: string; updatedAt: string }
