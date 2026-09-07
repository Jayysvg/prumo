CREATE TABLE `activities` (
	`id` text PRIMARY KEY NOT NULL,
	`workspace_id` text NOT NULL,
	`lead_id` text NOT NULL,
	`created_by_member_id` text,
	`type` text NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`scheduled_at` text NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`completed_at` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`workspace_id`) REFERENCES `workspaces`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`lead_id`) REFERENCES `leads`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`created_by_member_id`) REFERENCES `workspace_members`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `idx_activities_workspace_status_scheduled` ON `activities` (`workspace_id`,`status`,`scheduled_at`);--> statement-breakpoint
CREATE INDEX `idx_activities_lead_scheduled` ON `activities` (`lead_id`,`scheduled_at`);--> statement-breakpoint
PRAGMA optimize;
