BEGIN;

-- Composite keys make tenant and business ownership part of every relational
-- reference. NOT VALID preserves imported legacy rows for explicit review,
-- while PostgreSQL still enforces each constraint for every new write.
CREATE UNIQUE INDEX IF NOT EXISTS businesses_scope_uidx
  ON businesses (tenant_id, id);
CREATE UNIQUE INDEX IF NOT EXISTS tasks_scope_uidx
  ON tasks (tenant_id, business_id, id);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'businesses_tenant_scope_fkey'
      AND conrelid = 'businesses'::regclass
  ) THEN
    ALTER TABLE businesses
      ADD CONSTRAINT businesses_tenant_scope_fkey
      FOREIGN KEY (tenant_id) REFERENCES tenants(id) NOT VALID;
  END IF;
END
$$;

DO $$
DECLARE
  item RECORD;
BEGIN
  FOR item IN
    SELECT * FROM (VALUES
      ('business_settings', 'business_settings_company_scope_fkey'),
      ('users', 'users_company_scope_fkey'),
      ('products', 'products_company_scope_fkey'),
      ('transactions', 'transactions_company_scope_fkey'),
      ('tasks', 'tasks_company_scope_fkey'),
      ('task_comments', 'task_comments_company_scope_fkey'),
      ('employees', 'employees_company_scope_fkey'),
      ('customers', 'customers_company_scope_fkey'),
      ('suppliers', 'suppliers_company_scope_fkey'),
      ('documents', 'documents_company_scope_fkey'),
      ('document_intelligence', 'document_intelligence_company_scope_fkey'),
      ('activity_logs', 'activity_logs_company_scope_fkey'),
      ('ai_queries', 'ai_queries_company_scope_fkey'),
      ('notifications', 'notifications_company_scope_fkey'),
      ('sales', 'sales_company_scope_fkey'),
      ('announcements', 'announcements_company_scope_fkey'),
      ('integration_outbox', 'integration_outbox_company_scope_fkey')
    ) AS company_tables(table_name, constraint_name)
  LOOP
    IF NOT EXISTS (
      SELECT 1 FROM pg_constraint
      WHERE conname = item.constraint_name
        AND conrelid = item.table_name::regclass
    ) THEN
      EXECUTE format(
        'ALTER TABLE %I ADD CONSTRAINT %I FOREIGN KEY (tenant_id, business_id) REFERENCES businesses(tenant_id, id) NOT VALID',
        item.table_name,
        item.constraint_name
      );
    END IF;
  END LOOP;
END
$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'tasks_assignee_company_scope_fkey'
      AND conrelid = 'tasks'::regclass
  ) THEN
    ALTER TABLE tasks
      ADD CONSTRAINT tasks_assignee_company_scope_fkey
      FOREIGN KEY (tenant_id, business_id, assigned_to_id)
      REFERENCES users(tenant_id, business_id, id) NOT VALID;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'task_comments_task_company_scope_fkey'
      AND conrelid = 'task_comments'::regclass
  ) THEN
    ALTER TABLE task_comments
      ADD CONSTRAINT task_comments_task_company_scope_fkey
      FOREIGN KEY (tenant_id, business_id, task_id)
      REFERENCES tasks(tenant_id, business_id, id) NOT VALID;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'task_comments_user_company_scope_fkey'
      AND conrelid = 'task_comments'::regclass
  ) THEN
    ALTER TABLE task_comments
      ADD CONSTRAINT task_comments_user_company_scope_fkey
      FOREIGN KEY (tenant_id, business_id, user_id)
      REFERENCES users(tenant_id, business_id, id) NOT VALID;
  END IF;
END
$$;

COMMIT;
