CREATE TABLE `anonymous_questions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`question` text NOT NULL,
	`answer` text,
	`prompt` text,
	`is_public` integer DEFAULT true NOT NULL,
	`is_archived` integer DEFAULT false NOT NULL,
	`likes` integer DEFAULT 0 NOT NULL,
	`ip_hash` text,
	`user_agent` text,
	`answered_at` integer,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `anonymous_questions_created_at_idx` ON `anonymous_questions` (`created_at`);--> statement-breakpoint
CREATE INDEX `anonymous_questions_public_idx` ON `anonymous_questions` (`is_public`,`created_at`);