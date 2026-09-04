BEGIN;

ALTER TABLE ai_queries
  ADD COLUMN IF NOT EXISTS purpose TEXT NOT NULL DEFAULT 'assistant';

UPDATE ai_queries
SET purpose = 'dashboard'
WHERE purpose = 'assistant'
  AND query_text ILIKE 'Give me a concise business performance summary for this month.%';

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'ai_queries_purpose_check'
  ) THEN
    ALTER TABLE ai_queries
      ADD CONSTRAINT ai_queries_purpose_check
      CHECK (purpose IN ('assistant', 'dashboard'));
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS ai_queries_conversation_idx
  ON ai_queries (tenant_id, business_id, user_id, purpose, timestamp DESC);

COMMIT;
