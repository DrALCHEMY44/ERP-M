BEGIN;
CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE IF NOT EXISTS document_intelligence (
  document_id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  business_id TEXT NOT NULL,
  object_key TEXT NOT NULL,
  mime_type TEXT NOT NULL,
  file_size BIGINT NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING','PROCESSING','READY','FAILED')),
  raw_text TEXT,
  summary TEXT,
  classification TEXT,
  structured_data JSONB NOT NULL DEFAULT '{}'::jsonb,
  processing_model TEXT,
  error_message TEXT,
  processed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  search_vector TSVECTOR GENERATED ALWAYS AS (to_tsvector('simple', COALESCE(raw_text,'') || ' ' || COALESCE(summary,''))) STORED
);

CREATE TABLE IF NOT EXISTS document_chunks (
  id BIGSERIAL PRIMARY KEY,
  document_id TEXT NOT NULL REFERENCES document_intelligence(document_id) ON DELETE CASCADE,
  tenant_id TEXT NOT NULL,
  business_id TEXT NOT NULL,
  chunk_index INTEGER NOT NULL,
  content TEXT NOT NULL,
  embedding VECTOR(384),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(document_id, chunk_index)
);

CREATE INDEX IF NOT EXISTS document_intelligence_company_idx ON document_intelligence(tenant_id,business_id,status);
CREATE INDEX IF NOT EXISTS document_intelligence_search_idx ON document_intelligence USING GIN(search_vector);
CREATE INDEX IF NOT EXISTS document_chunks_company_idx ON document_chunks(tenant_id,business_id,document_id);
CREATE INDEX IF NOT EXISTS document_chunks_embedding_idx ON document_chunks USING hnsw(embedding vector_cosine_ops);
COMMIT;
