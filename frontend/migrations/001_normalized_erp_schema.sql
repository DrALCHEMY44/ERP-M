BEGIN;

CREATE TABLE IF NOT EXISTS tenants (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  business_sector TEXT NOT NULL,
  location TEXT NOT NULL,
  owner_email TEXT NOT NULL,
  tax_id TEXT,
  logo_url TEXT,
  subscription_tier TEXT,
  status TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS businesses (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  business_type TEXT,
  region TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  code TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  business_id TEXT NOT NULL,
  email TEXT NOT NULL,
  role TEXT NOT NULL,
  full_name TEXT,
  department TEXT,
  phone_number TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  access_code TEXT
);

CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  business_id TEXT NOT NULL,
  name TEXT NOT NULL,
  category TEXT,
  quantity INTEGER NOT NULL,
  cost_price DOUBLE PRECISION,
  selling_price DOUBLE PRECISION NOT NULL,
  expiry_date DATE,
  low_stock_level INTEGER,
  created_by TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS transactions (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  business_id TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('SALE', 'EXPENSE')),
  amount DOUBLE PRECISION NOT NULL,
  date TIMESTAMPTZ NOT NULL,
  category TEXT,
  receipt_url TEXT,
  recorded_by TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS tasks (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  business_id TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL CHECK (status IN ('PENDING', 'ONGOING', 'COMPLETED', 'LATE')),
  priority TEXT CHECK (priority IS NULL OR priority IN ('LOW', 'MEDIUM', 'HIGH')),
  due_date TIMESTAMPTZ NOT NULL,
  assigned_to_id TEXT,
  created_by TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS task_comments (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  business_id TEXT NOT NULL,
  task_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS employees (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  business_id TEXT NOT NULL,
  full_name TEXT NOT NULL,
  position TEXT NOT NULL,
  role TEXT,
  salary DOUBLE PRECISION,
  department TEXT,
  start_date DATE,
  status TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  code TEXT
);

CREATE TABLE IF NOT EXISTS customers (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  business_id TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  phone_number TEXT,
  email TEXT,
  location TEXT,
  total_orders INTEGER,
  total_spent DOUBLE PRECISION,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS suppliers (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  business_id TEXT NOT NULL,
  supplier_name TEXT NOT NULL,
  phone_number TEXT,
  email TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS documents (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  business_id TEXT NOT NULL,
  title TEXT NOT NULL,
  document_type TEXT NOT NULL,
  file_url TEXT NOT NULL,
  uploaded_by TEXT NOT NULL,
  uploaded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS activity_logs (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  business_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  user_name TEXT NOT NULL,
  action_type TEXT NOT NULL,
  module TEXT NOT NULL,
  description TEXT,
  record_id TEXT,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ai_queries (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  business_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  query_text TEXT NOT NULL,
  response TEXT,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS notifications (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  business_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS businesses_tenant_idx ON businesses (tenant_id);
CREATE INDEX IF NOT EXISTS users_company_idx ON users (tenant_id, business_id);
CREATE INDEX IF NOT EXISTS products_company_idx ON products (tenant_id, business_id);
CREATE INDEX IF NOT EXISTS transactions_company_date_idx ON transactions (tenant_id, business_id, date DESC);
CREATE INDEX IF NOT EXISTS tasks_company_idx ON tasks (tenant_id, business_id);
CREATE INDEX IF NOT EXISTS tasks_assigned_to_idx ON tasks (assigned_to_id);
CREATE INDEX IF NOT EXISTS task_comments_task_idx ON task_comments (task_id);
CREATE INDEX IF NOT EXISTS employees_company_idx ON employees (tenant_id, business_id);
CREATE INDEX IF NOT EXISTS customers_company_idx ON customers (tenant_id, business_id);
CREATE INDEX IF NOT EXISTS suppliers_company_idx ON suppliers (tenant_id, business_id);
CREATE INDEX IF NOT EXISTS documents_company_idx ON documents (tenant_id, business_id);
CREATE INDEX IF NOT EXISTS activity_logs_company_time_idx ON activity_logs (tenant_id, business_id, timestamp DESC);
CREATE INDEX IF NOT EXISTS ai_queries_company_idx ON ai_queries (tenant_id, business_id);
CREATE INDEX IF NOT EXISTS notifications_user_idx ON notifications (tenant_id, business_id, user_id, created_at DESC);

CREATE OR REPLACE FUNCTION sync_erp_mirror_to_normalized()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
DECLARE p JSONB := NEW.payload;
BEGIN
  IF NEW.operation = 'delete' THEN
    CASE NEW.entity_type
      WHEN 'tenant' THEN DELETE FROM tenants WHERE id = NEW.record_id;
      WHEN 'business' THEN DELETE FROM businesses WHERE id = NEW.record_id;
      WHEN 'user' THEN DELETE FROM users WHERE id = NEW.record_id;
      WHEN 'product' THEN DELETE FROM products WHERE id = NEW.record_id;
      WHEN 'transaction' THEN DELETE FROM transactions WHERE id = NEW.record_id;
      WHEN 'task' THEN DELETE FROM tasks WHERE id = NEW.record_id;
      WHEN 'task_comment' THEN DELETE FROM task_comments WHERE id = NEW.record_id;
      WHEN 'employee' THEN DELETE FROM employees WHERE id = NEW.record_id;
      WHEN 'customer' THEN DELETE FROM customers WHERE id = NEW.record_id;
      WHEN 'supplier' THEN DELETE FROM suppliers WHERE id = NEW.record_id;
      WHEN 'document' THEN DELETE FROM documents WHERE id = NEW.record_id;
      WHEN 'activity_log' THEN DELETE FROM activity_logs WHERE id = NEW.record_id;
      WHEN 'ai_query' THEN DELETE FROM ai_queries WHERE id = NEW.record_id;
      WHEN 'notification' THEN DELETE FROM notifications WHERE id = NEW.record_id;
      ELSE NULL;
    END CASE;
    RETURN NEW;
  END IF;

  CASE NEW.entity_type
    WHEN 'tenant' THEN
      INSERT INTO tenants VALUES (
        NEW.record_id, COALESCE(p->>'name',''), COALESCE(p->>'businessSector',''),
        COALESCE(p->>'location',''), COALESCE(p->>'ownerEmail',''), p->>'taxId',
        p->>'logoUrl', p->>'subscriptionTier', p->>'status',
        COALESCE((p->>'createdAt')::timestamptz, NOW())
      ) ON CONFLICT (id) DO UPDATE SET
        name=COALESCE(NULLIF(p->>'name',''),tenants.name), business_sector=COALESCE(p->>'businessSector',tenants.business_sector),
        location=COALESCE(p->>'location',tenants.location), owner_email=COALESCE(p->>'ownerEmail',tenants.owner_email),
        tax_id=COALESCE(p->>'taxId',tenants.tax_id), logo_url=COALESCE(p->>'logoUrl',tenants.logo_url),
        subscription_tier=COALESCE(p->>'subscriptionTier',tenants.subscription_tier), status=COALESCE(p->>'status',tenants.status);
    WHEN 'business' THEN
      INSERT INTO businesses VALUES (
        NEW.record_id, NEW.tenant_id, COALESCE(p->>'name',''), COALESCE(p->>'location',''),
        p->>'businessType', p->>'region', COALESCE((p->>'createdAt')::timestamptz,NOW()), COALESCE(p->>'code','')
      ) ON CONFLICT (id) DO UPDATE SET
        tenant_id=EXCLUDED.tenant_id, name=COALESCE(NULLIF(p->>'name',''),businesses.name),
        location=COALESCE(p->>'location',businesses.location), business_type=COALESCE(p->>'businessType',businesses.business_type),
        region=COALESCE(p->>'region',businesses.region), code=COALESCE(p->>'code',businesses.code);
    WHEN 'user' THEN
      INSERT INTO users VALUES (
        NEW.record_id, NEW.tenant_id, NEW.business_id, COALESCE(p->>'email',''), COALESCE(p->>'role',''),
        p->>'fullName', p->>'department', p->>'phoneNumber', COALESCE((p->>'createdAt')::timestamptz,NOW()), p->>'accessCode'
      ) ON CONFLICT (id) DO UPDATE SET
        tenant_id=EXCLUDED.tenant_id,business_id=EXCLUDED.business_id,email=COALESCE(NULLIF(p->>'email',''),users.email),
        role=COALESCE(NULLIF(p->>'role',''),users.role),full_name=COALESCE(p->>'fullName',users.full_name),
        department=COALESCE(p->>'department',users.department),phone_number=COALESCE(p->>'phoneNumber',users.phone_number),
        access_code=COALESCE(p->>'accessCode',users.access_code);
    WHEN 'product' THEN
      INSERT INTO products VALUES (
        NEW.record_id,NEW.tenant_id,NEW.business_id,COALESCE(p->>'name',''),p->>'category',COALESCE((p->>'quantity')::int,0),
        (p->>'costPrice')::float8,COALESCE((p->>'sellingPrice')::float8,0),(p->>'expiryDate')::date,
        (p->>'lowStockLevel')::int,COALESCE(p->>'createdBy',''),COALESCE((p->>'createdAt')::timestamptz,NOW()),NOW()
      ) ON CONFLICT (id) DO UPDATE SET
        tenant_id=EXCLUDED.tenant_id,business_id=EXCLUDED.business_id,name=COALESCE(NULLIF(p->>'name',''),products.name),
        category=COALESCE(p->>'category',products.category),quantity=COALESCE((p->>'quantity')::int,products.quantity),
        cost_price=COALESCE((p->>'costPrice')::float8,products.cost_price),selling_price=COALESCE((p->>'sellingPrice')::float8,products.selling_price),
        expiry_date=COALESCE((p->>'expiryDate')::date,products.expiry_date),low_stock_level=COALESCE((p->>'lowStockLevel')::int,products.low_stock_level),updated_at=NOW();
    WHEN 'transaction' THEN
      INSERT INTO transactions VALUES (
        NEW.record_id,NEW.tenant_id,NEW.business_id,COALESCE(p->>'type','SALE'),COALESCE((p->>'amount')::float8,0),
        COALESCE((p->>'date')::timestamptz,NOW()),p->>'category',p->>'receiptUrl',COALESCE(p->>'recordedBy',''),
        COALESCE((p->>'createdAt')::timestamptz,NOW())
      ) ON CONFLICT (id) DO UPDATE SET
        tenant_id=EXCLUDED.tenant_id,business_id=EXCLUDED.business_id,type=COALESCE(p->>'type',transactions.type),
        amount=COALESCE((p->>'amount')::float8,transactions.amount),date=COALESCE((p->>'date')::timestamptz,transactions.date),
        category=COALESCE(p->>'category',transactions.category),receipt_url=COALESCE(p->>'receiptUrl',transactions.receipt_url),recorded_by=COALESCE(p->>'recordedBy',transactions.recorded_by);
    WHEN 'task' THEN
      INSERT INTO tasks VALUES (
        NEW.record_id,NEW.tenant_id,NEW.business_id,COALESCE(p->>'title',''),p->>'description',COALESCE(p->>'status','PENDING'),
        p->>'priority',COALESCE((p->>'dueDate')::timestamptz,NOW()),COALESCE(p->>'assignedToId',p->'assignedTo'->>'id'),
        COALESCE(p->>'createdBy',''),COALESCE((p->>'createdAt')::timestamptz,NOW()),NOW()
      ) ON CONFLICT (id) DO UPDATE SET
        tenant_id=EXCLUDED.tenant_id,business_id=EXCLUDED.business_id,title=COALESCE(NULLIF(p->>'title',''),tasks.title),
        description=COALESCE(p->>'description',tasks.description),status=COALESCE(p->>'status',tasks.status),priority=COALESCE(p->>'priority',tasks.priority),
        due_date=COALESCE((p->>'dueDate')::timestamptz,tasks.due_date),assigned_to_id=COALESCE(p->>'assignedToId',p->'assignedTo'->>'id',tasks.assigned_to_id),updated_at=NOW();
    WHEN 'task_comment' THEN
      INSERT INTO task_comments VALUES (
        NEW.record_id,NEW.tenant_id,NEW.business_id,COALESCE(p->>'taskId',p->'task'->>'id',''),
        COALESCE(p->>'userId',p->'user'->>'id',''),COALESCE(p->>'content',''),COALESCE((p->>'createdAt')::timestamptz,NOW())
      ) ON CONFLICT (id) DO UPDATE SET content=COALESCE(p->>'content',task_comments.content);
    WHEN 'employee' THEN
      INSERT INTO employees VALUES (
        NEW.record_id,NEW.tenant_id,NEW.business_id,COALESCE(p->>'fullName',''),COALESCE(p->>'position',''),p->>'role',
        (p->>'salary')::float8,p->>'department',(p->>'startDate')::date,p->>'status',COALESCE((p->>'createdAt')::timestamptz,NOW()),p->>'code'
      ) ON CONFLICT (id) DO UPDATE SET
        tenant_id=EXCLUDED.tenant_id,business_id=EXCLUDED.business_id,full_name=COALESCE(NULLIF(p->>'fullName',''),employees.full_name),
        position=COALESCE(NULLIF(p->>'position',''),employees.position),role=COALESCE(p->>'role',employees.role),salary=COALESCE((p->>'salary')::float8,employees.salary),
        department=COALESCE(p->>'department',employees.department),start_date=COALESCE((p->>'startDate')::date,employees.start_date),status=COALESCE(p->>'status',employees.status),code=COALESCE(p->>'code',employees.code);
    WHEN 'customer' THEN
      INSERT INTO customers VALUES (
        NEW.record_id,NEW.tenant_id,NEW.business_id,COALESCE(p->>'customerName',''),p->>'phoneNumber',p->>'email',p->>'location',
        (p->>'totalOrders')::int,(p->>'totalSpent')::float8,COALESCE((p->>'createdAt')::timestamptz,NOW())
      ) ON CONFLICT (id) DO UPDATE SET
        tenant_id=EXCLUDED.tenant_id,business_id=EXCLUDED.business_id,customer_name=COALESCE(NULLIF(p->>'customerName',''),customers.customer_name),
        phone_number=COALESCE(p->>'phoneNumber',customers.phone_number),email=COALESCE(p->>'email',customers.email),location=COALESCE(p->>'location',customers.location),
        total_orders=COALESCE((p->>'totalOrders')::int,customers.total_orders),total_spent=COALESCE((p->>'totalSpent')::float8,customers.total_spent);
    WHEN 'supplier' THEN
      INSERT INTO suppliers VALUES (
        NEW.record_id,NEW.tenant_id,NEW.business_id,COALESCE(p->>'supplierName',''),p->>'phoneNumber',p->>'email',COALESCE((p->>'createdAt')::timestamptz,NOW())
      ) ON CONFLICT (id) DO UPDATE SET
        tenant_id=EXCLUDED.tenant_id,business_id=EXCLUDED.business_id,supplier_name=COALESCE(NULLIF(p->>'supplierName',''),suppliers.supplier_name),
        phone_number=COALESCE(p->>'phoneNumber',suppliers.phone_number),email=COALESCE(p->>'email',suppliers.email);
    WHEN 'document' THEN
      INSERT INTO documents VALUES (
        NEW.record_id,NEW.tenant_id,NEW.business_id,COALESCE(p->>'title',''),COALESCE(p->>'documentType',''),COALESCE(p->>'fileUrl',''),
        COALESCE(p->>'uploadedBy',''),COALESCE((p->>'uploadedAt')::timestamptz,NOW())
      ) ON CONFLICT (id) DO UPDATE SET
        tenant_id=EXCLUDED.tenant_id,business_id=EXCLUDED.business_id,title=COALESCE(NULLIF(p->>'title',''),documents.title),
        document_type=COALESCE(NULLIF(p->>'documentType',''),documents.document_type),file_url=COALESCE(NULLIF(p->>'fileUrl',''),documents.file_url),uploaded_by=COALESCE(NULLIF(p->>'uploadedBy',''),documents.uploaded_by);
    WHEN 'activity_log' THEN
      INSERT INTO activity_logs VALUES (
        NEW.record_id,NEW.tenant_id,NEW.business_id,COALESCE(p->>'userId',''),COALESCE(p->>'userName',''),COALESCE(p->>'actionType',''),
        COALESCE(p->>'module',''),p->>'description',p->>'recordId',COALESCE((p->>'timestamp')::timestamptz,NOW())
      ) ON CONFLICT (id) DO UPDATE SET description=COALESCE(p->>'description',activity_logs.description),record_id=COALESCE(p->>'recordId',activity_logs.record_id);
    WHEN 'ai_query' THEN
      INSERT INTO ai_queries VALUES (
        NEW.record_id,NEW.tenant_id,NEW.business_id,COALESCE(p->>'userId',''),COALESCE(p->>'queryText',''),p->>'response',COALESCE((p->>'timestamp')::timestamptz,NOW())
      ) ON CONFLICT (id) DO UPDATE SET response=COALESCE(p->>'response',ai_queries.response);
    WHEN 'notification' THEN
      INSERT INTO notifications VALUES (
        NEW.record_id,NEW.tenant_id,NEW.business_id,COALESCE(p->>'userId',''),COALESCE(p->>'message',''),COALESCE((p->>'isRead')::boolean,FALSE),COALESCE((p->>'createdAt')::timestamptz,NOW())
      ) ON CONFLICT (id) DO UPDATE SET message=COALESCE(p->>'message',notifications.message),is_read=COALESCE((p->>'isRead')::boolean,notifications.is_read);
    ELSE NULL;
  END CASE;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS erp_mirror_normalize ON erp_mirror_records;
CREATE TRIGGER erp_mirror_normalize
AFTER INSERT OR UPDATE ON erp_mirror_records
FOR EACH ROW EXECUTE FUNCTION sync_erp_mirror_to_normalized();

COMMIT;
