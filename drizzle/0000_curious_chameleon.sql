CREATE TABLE `lead_history` (
	`id` text PRIMARY KEY NOT NULL,
	`workspace_id` text NOT NULL,
	`lead_id` text NOT NULL,
	`author_member_id` text,
	`event_type` text NOT NULL,
	`previous_stage` text,
	`new_stage` text,
	`description` text NOT NULL,
	`created_at` text NOT NULL,
	FOREIGN KEY (`workspace_id`) REFERENCES `workspaces`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`lead_id`) REFERENCES `leads`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`author_member_id`) REFERENCES `workspace_members`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `idx_lead_history_lead_created` ON `lead_history` (`lead_id`,`created_at`);--> statement-breakpoint
CREATE INDEX `idx_lead_history_workspace` ON `lead_history` (`workspace_id`);--> statement-breakpoint
CREATE TABLE `leads` (
	`id` text PRIMARY KEY NOT NULL,
	`workspace_id` text NOT NULL,
	`name` text NOT NULL,
	`company` text NOT NULL,
	`email` text,
	`phone` text,
	`estimated_value` integer DEFAULT 0 NOT NULL,
	`source` text,
	`stage` text DEFAULT 'Novo' NOT NULL,
	`assignee_member_id` text,
	`notes` text,
	`last_contact_at` text,
	`next_action_at` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	`archived_at` text,
	FOREIGN KEY (`workspace_id`) REFERENCES `workspaces`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`assignee_member_id`) REFERENCES `workspace_members`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `idx_leads_workspace_active_stage` ON `leads` (`workspace_id`,`archived_at`,`stage`);--> statement-breakpoint
CREATE TABLE `workspace_members` (
	`id` text PRIMARY KEY NOT NULL,
	`workspace_id` text NOT NULL,
	`user_id` text NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`role` text DEFAULT 'member' NOT NULL,
	`created_at` text NOT NULL,
	FOREIGN KEY (`workspace_id`) REFERENCES `workspaces`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_workspace_members_user_id` ON `workspace_members` (`user_id`);--> statement-breakpoint
CREATE INDEX `idx_workspace_members_workspace_id` ON `workspace_members` (`workspace_id`);--> statement-breakpoint
CREATE TABLE `workspaces` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
PRAGMA optimize;
