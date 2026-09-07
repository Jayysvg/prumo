import { index, integer, sqliteTable, text, uniqueIndex } from 'drizzle-orm/sqlite-core';

export const workspaces = sqliteTable('workspaces', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  createdAt: text('created_at').notNull(),
});

export const workspaceMembers = sqliteTable('workspace_members', {
  id: text('id').primaryKey(),
  workspaceId: text('workspace_id').notNull().references(() => workspaces.id),
  userId: text('user_id').notNull(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  role: text('role', { enum: ['admin', 'member'] }).notNull().default('member'),
  createdAt: text('created_at').notNull(),
}, (table) => [
  uniqueIndex('idx_workspace_members_user_id').on(table.userId),
  index('idx_workspace_members_workspace_id').on(table.workspaceId),
]);

export const leads = sqliteTable('leads', {
  id: text('id').primaryKey(),
  workspaceId: text('workspace_id').notNull().references(() => workspaces.id),
  name: text('name').notNull(),
  company: text('company').notNull(),
  email: text('email'),
  phone: text('phone'),
  estimatedValue: integer('estimated_value').notNull().default(0),
  source: text('source'),
  stage: text('stage', { enum: ['Novo', 'Contato', 'Negociação', 'Fechado', 'Perdido'] }).notNull().default('Novo'),
  assigneeMemberId: text('assignee_member_id').references(() => workspaceMembers.id),
  notes: text('notes'),
  lastContactAt: text('last_contact_at'),
  nextActionAt: text('next_action_at'),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
  archivedAt: text('archived_at'),
}, (table) => [
  index('idx_leads_workspace_active_stage').on(table.workspaceId, table.archivedAt, table.stage),
]);

export const leadHistory = sqliteTable('lead_history', {
  id: text('id').primaryKey(),
  workspaceId: text('workspace_id').notNull().references(() => workspaces.id),
  leadId: text('lead_id').notNull().references(() => leads.id),
  authorMemberId: text('author_member_id').references(() => workspaceMembers.id),
  eventType: text('event_type', { enum: ['created', 'updated', 'stage_changed', 'archived'] }).notNull(),
  previousStage: text('previous_stage'),
  newStage: text('new_stage'),
  description: text('description').notNull(),
  createdAt: text('created_at').notNull(),
}, (table) => [
  index('idx_lead_history_lead_created').on(table.leadId, table.createdAt),
  index('idx_lead_history_workspace').on(table.workspaceId),
]);

export const activities = sqliteTable('activities', {
  id: text('id').primaryKey(),
  workspaceId: text('workspace_id').notNull().references(() => workspaces.id),
  leadId: text('lead_id').notNull().references(() => leads.id),
  createdByMemberId: text('created_by_member_id').references(() => workspaceMembers.id),
  type: text('type', { enum: ['Ligação', 'Reunião', 'Email', 'Tarefa'] }).notNull(),
  title: text('title').notNull(),
  description: text('description'),
  scheduledAt: text('scheduled_at').notNull(),
  status: text('status', { enum: ['pending', 'completed'] }).notNull().default('pending'),
  completedAt: text('completed_at'),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
}, (table) => [
  index('idx_activities_workspace_status_scheduled').on(table.workspaceId, table.status, table.scheduledAt),
  index('idx_activities_lead_scheduled').on(table.leadId, table.scheduledAt),
]);
