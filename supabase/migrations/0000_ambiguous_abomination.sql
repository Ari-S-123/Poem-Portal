CREATE TABLE IF NOT EXISTS "favorite" (
	"id" uuid PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"author" text NOT NULL,
	"title" text NOT NULL
);

ALTER TABLE "favorite" ENABLE ROW LEVEL SECURITY;
