-- Idempotency table for Stripe webhook events
-- Prevents duplicate processing when Stripe retries an event.
create table if not exists stripe_webhook_events (
  stripe_event_id  text        primary key,
  processed_at     timestamptz not null default now()
);

-- Only the service role (server-side) may insert; anon cannot read or write.
alter table stripe_webhook_events enable row level security;
-- No public policies → only service_role key (bypasses RLS) can access.
