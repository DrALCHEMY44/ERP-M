BEGIN;

CREATE UNIQUE INDEX IF NOT EXISTS employees_scope_uidx
  ON employees(tenant_id, business_id, id);
CREATE UNIQUE INDEX IF NOT EXISTS suppliers_scope_uidx
  ON suppliers(tenant_id, business_id, id);

CREATE TABLE IF NOT EXISTS employment_events (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  business_id TEXT NOT NULL,
  employee_id TEXT NOT NULL,
  event_type TEXT NOT NULL CHECK (event_type IN ('HIRE','PROMOTION','TRANSFER','LEAVE','RETURN','SUSPENSION','TERMINATION','NOTE')),
  effective_date DATE NOT NULL,
  position TEXT,
  department TEXT,
  employment_status TEXT,
  notes TEXT,
  created_by TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  FOREIGN KEY (tenant_id, business_id) REFERENCES businesses(tenant_id, id),
  FOREIGN KEY (tenant_id, business_id, employee_id) REFERENCES employees(tenant_id, business_id, id)
);

CREATE INDEX IF NOT EXISTS employment_events_employee_date_idx
  ON employment_events(tenant_id, business_id, employee_id, effective_date DESC);

CREATE TABLE IF NOT EXISTS attendance_records (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  business_id TEXT NOT NULL,
  employee_id TEXT NOT NULL,
  attendance_date DATE NOT NULL,
  check_in TIMESTAMPTZ,
  check_out TIMESTAMPTZ,
  minutes_worked INTEGER CHECK (minutes_worked IS NULL OR minutes_worked >= 0),
  status TEXT NOT NULL CHECK (status IN ('PRESENT','ABSENT','LATE','EXCUSED','REMOTE','LEAVE')),
  notes TEXT,
  recorded_by TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (tenant_id, business_id, employee_id, attendance_date),
  FOREIGN KEY (tenant_id, business_id) REFERENCES businesses(tenant_id, id),
  FOREIGN KEY (tenant_id, business_id, employee_id) REFERENCES employees(tenant_id, business_id, id),
  CHECK (check_out IS NULL OR check_in IS NULL OR check_out >= check_in)
);

CREATE INDEX IF NOT EXISTS attendance_company_date_idx
  ON attendance_records(tenant_id, business_id, attendance_date DESC);

CREATE TABLE IF NOT EXISTS leave_requests (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  business_id TEXT NOT NULL,
  employee_id TEXT NOT NULL,
  leave_type TEXT NOT NULL CHECK (leave_type IN ('ANNUAL','SICK','MATERNITY','PATERNITY','COMPASSIONATE','UNPAID','OTHER')),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  requested_days NUMERIC(7,2) NOT NULL CHECK (requested_days > 0),
  reason TEXT,
  status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING','APPROVED','REJECTED','CANCELLED')),
  decided_by TEXT,
  decided_at TIMESTAMPTZ,
  decision_notes TEXT,
  created_by TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  FOREIGN KEY (tenant_id, business_id) REFERENCES businesses(tenant_id, id),
  FOREIGN KEY (tenant_id, business_id, employee_id) REFERENCES employees(tenant_id, business_id, id),
  CHECK (end_date >= start_date)
);

CREATE INDEX IF NOT EXISTS leave_requests_company_status_idx
  ON leave_requests(tenant_id, business_id, status, start_date DESC);

CREATE TABLE IF NOT EXISTS payroll_settings (
  business_id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  currency TEXT NOT NULL DEFAULT 'FCFA',
  pay_frequency TEXT NOT NULL DEFAULT 'MONTHLY' CHECK (pay_frequency IN ('WEEKLY','BIWEEKLY','MONTHLY')),
  professional_expense_rate NUMERIC(7,4) NOT NULL DEFAULT 30 CHECK (professional_expense_rate BETWEEN 0 AND 100),
  annual_tax_allowance NUMERIC(19,2) NOT NULL DEFAULT 500000 CHECK (annual_tax_allowance >= 0),
  local_surtax_rate NUMERIC(7,4) NOT NULL DEFAULT 10 CHECK (local_surtax_rate BETWEEN 0 AND 100),
  employee_social_rate NUMERIC(7,4) NOT NULL DEFAULT 2.8 CHECK (employee_social_rate BETWEEN 0 AND 100),
  employer_social_rate NUMERIC(7,4) NOT NULL DEFAULT 0 CHECK (employer_social_rate BETWEEN 0 AND 100),
  social_monthly_ceiling NUMERIC(19,2) NOT NULL DEFAULT 300000 CHECK (social_monthly_ceiling >= 0),
  monthly_tax_exempt_threshold NUMERIC(19,2) NOT NULL DEFAULT 62000 CHECK (monthly_tax_exempt_threshold >= 0),
  tax_brackets JSONB NOT NULL DEFAULT '[{"upTo":2000000,"rate":10},{"upTo":3000000,"rate":15},{"upTo":5000000,"rate":25},{"upTo":null,"rate":35}]'::jsonb,
  compliance_status TEXT NOT NULL DEFAULT 'DRAFT' CHECK (compliance_status IN ('DRAFT','CONFIRMED')),
  compliance_note TEXT,
  compliance_confirmed_by TEXT,
  compliance_confirmed_at TIMESTAMPTZ,
  updated_by TEXT NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  FOREIGN KEY (tenant_id, business_id) REFERENCES businesses(tenant_id, id)
);

CREATE TABLE IF NOT EXISTS chart_of_accounts (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  business_id TEXT NOT NULL,
  code TEXT NOT NULL,
  name TEXT NOT NULL,
  account_type TEXT NOT NULL CHECK (account_type IN ('ASSET','LIABILITY','EQUITY','REVENUE','EXPENSE')),
  normal_balance TEXT NOT NULL CHECK (normal_balance IN ('DEBIT','CREDIT')),
  system_code TEXT,
  parent_account_id TEXT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  description TEXT,
  created_by TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (tenant_id, business_id, code),
  UNIQUE (tenant_id, business_id, id),
  FOREIGN KEY (tenant_id, business_id) REFERENCES businesses(tenant_id, id),
  FOREIGN KEY (tenant_id, business_id, parent_account_id) REFERENCES chart_of_accounts(tenant_id, business_id, id)
);

CREATE UNIQUE INDEX IF NOT EXISTS chart_accounts_system_code_uidx
  ON chart_of_accounts(tenant_id, business_id, system_code)
  WHERE system_code IS NOT NULL;

CREATE TABLE IF NOT EXISTS fiscal_periods (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  business_id TEXT NOT NULL,
  name TEXT NOT NULL,
  starts_on DATE NOT NULL,
  ends_on DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'OPEN' CHECK (status IN ('OPEN','CLOSED')),
  closed_by TEXT,
  closed_at TIMESTAMPTZ,
  created_by TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (tenant_id, business_id, starts_on, ends_on),
  UNIQUE (tenant_id, business_id, id),
  FOREIGN KEY (tenant_id, business_id) REFERENCES businesses(tenant_id, id),
  CHECK (ends_on >= starts_on)
);

CREATE TABLE IF NOT EXISTS journal_entries (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  business_id TEXT NOT NULL,
  entry_date DATE NOT NULL,
  reference TEXT NOT NULL,
  description TEXT NOT NULL,
  source_type TEXT NOT NULL,
  source_id TEXT,
  status TEXT NOT NULL DEFAULT 'DRAFT' CHECK (status IN ('DRAFT','POSTED')),
  reversal_of_id TEXT,
  created_by TEXT NOT NULL,
  posted_by TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  posted_at TIMESTAMPTZ,
  UNIQUE (tenant_id, business_id, reference),
  UNIQUE (tenant_id, business_id, id),
  FOREIGN KEY (tenant_id, business_id) REFERENCES businesses(tenant_id, id),
  FOREIGN KEY (tenant_id, business_id, reversal_of_id) REFERENCES journal_entries(tenant_id, business_id, id)
);

CREATE UNIQUE INDEX IF NOT EXISTS journal_entries_source_uidx
  ON journal_entries(tenant_id, business_id, source_type, source_id)
  WHERE source_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS journal_entries_company_date_idx
  ON journal_entries(tenant_id, business_id, entry_date DESC, created_at DESC);

CREATE TABLE IF NOT EXISTS journal_lines (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  business_id TEXT NOT NULL,
  journal_entry_id TEXT NOT NULL,
  account_id TEXT NOT NULL,
  line_number INTEGER NOT NULL CHECK (line_number > 0),
  description TEXT,
  debit NUMERIC(19,2) NOT NULL DEFAULT 0 CHECK (debit >= 0),
  credit NUMERIC(19,2) NOT NULL DEFAULT 0 CHECK (credit >= 0),
  employee_id TEXT,
  customer_id TEXT,
  supplier_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (journal_entry_id, line_number),
  FOREIGN KEY (tenant_id, business_id, journal_entry_id) REFERENCES journal_entries(tenant_id, business_id, id),
  FOREIGN KEY (tenant_id, business_id, account_id) REFERENCES chart_of_accounts(tenant_id, business_id, id),
  FOREIGN KEY (tenant_id, business_id, employee_id) REFERENCES employees(tenant_id, business_id, id),
  FOREIGN KEY (tenant_id, business_id, customer_id) REFERENCES customers(tenant_id, business_id, id),
  FOREIGN KEY (tenant_id, business_id, supplier_id) REFERENCES suppliers(tenant_id, business_id, id),
  CHECK ((debit > 0 AND credit = 0) OR (credit > 0 AND debit = 0))
);

CREATE INDEX IF NOT EXISTS journal_lines_account_idx
  ON journal_lines(tenant_id, business_id, account_id, journal_entry_id);

ALTER TABLE transactions
  ADD COLUMN IF NOT EXISTS accounting_journal_entry_id TEXT,
  ADD COLUMN IF NOT EXISTS voided_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS voided_by TEXT;
CREATE UNIQUE INDEX IF NOT EXISTS transactions_scope_uidx
  ON transactions(tenant_id, business_id, id);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname='transactions_accounting_journal_fkey'
      AND conrelid='transactions'::regclass
  ) THEN
    ALTER TABLE transactions
      ADD CONSTRAINT transactions_accounting_journal_fkey
      FOREIGN KEY (tenant_id, business_id, accounting_journal_entry_id)
      REFERENCES journal_entries(tenant_id, business_id, id) NOT VALID;
  END IF;
END
$$;

CREATE TABLE IF NOT EXISTS payroll_runs (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  business_id TEXT NOT NULL,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  pay_date DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'DRAFT' CHECK (status IN ('DRAFT','APPROVED','POSTED','PAID','VOID')),
  currency TEXT NOT NULL DEFAULT 'FCFA',
  total_gross NUMERIC(19,2) NOT NULL DEFAULT 0 CHECK (total_gross >= 0),
  total_employee_tax NUMERIC(19,2) NOT NULL DEFAULT 0 CHECK (total_employee_tax >= 0),
  total_employee_social NUMERIC(19,2) NOT NULL DEFAULT 0 CHECK (total_employee_social >= 0),
  total_employer_social NUMERIC(19,2) NOT NULL DEFAULT 0 CHECK (total_employer_social >= 0),
  total_other_deductions NUMERIC(19,2) NOT NULL DEFAULT 0 CHECK (total_other_deductions >= 0),
  total_net NUMERIC(19,2) NOT NULL DEFAULT 0 CHECK (total_net >= 0),
  journal_entry_id TEXT,
  payment_journal_entry_id TEXT,
  created_by TEXT NOT NULL,
  approved_by TEXT,
  approved_at TIMESTAMPTZ,
  posted_by TEXT,
  posted_at TIMESTAMPTZ,
  paid_by TEXT,
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (tenant_id, business_id, period_start, period_end),
  UNIQUE (tenant_id, business_id, id),
  FOREIGN KEY (tenant_id, business_id) REFERENCES businesses(tenant_id, id),
  FOREIGN KEY (tenant_id, business_id, journal_entry_id) REFERENCES journal_entries(tenant_id, business_id, id),
  FOREIGN KEY (tenant_id, business_id, payment_journal_entry_id) REFERENCES journal_entries(tenant_id, business_id, id),
  CHECK (period_end >= period_start)
);

CREATE TABLE IF NOT EXISTS payroll_items (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  business_id TEXT NOT NULL,
  payroll_run_id TEXT NOT NULL,
  employee_id TEXT NOT NULL,
  base_salary NUMERIC(19,2) NOT NULL CHECK (base_salary >= 0),
  earnings JSONB NOT NULL DEFAULT '[]'::jsonb,
  deductions JSONB NOT NULL DEFAULT '[]'::jsonb,
  gross_pay NUMERIC(19,2) NOT NULL CHECK (gross_pay >= 0),
  taxable_pay NUMERIC(19,2) NOT NULL CHECK (taxable_pay >= 0),
  employee_tax NUMERIC(19,2) NOT NULL CHECK (employee_tax >= 0),
  employee_social NUMERIC(19,2) NOT NULL CHECK (employee_social >= 0),
  employer_social NUMERIC(19,2) NOT NULL CHECK (employer_social >= 0),
  other_deductions NUMERIC(19,2) NOT NULL CHECK (other_deductions >= 0),
  net_pay NUMERIC(19,2) NOT NULL CHECK (net_pay >= 0),
  calculation_snapshot JSONB NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (tenant_id, business_id, payroll_run_id, employee_id),
  FOREIGN KEY (tenant_id, business_id, payroll_run_id) REFERENCES payroll_runs(tenant_id, business_id, id) ON DELETE CASCADE,
  FOREIGN KEY (tenant_id, business_id, employee_id) REFERENCES employees(tenant_id, business_id, id)
);

CREATE INDEX IF NOT EXISTS payroll_runs_company_period_idx
  ON payroll_runs(tenant_id, business_id, period_end DESC);
ALTER TABLE payroll_runs
  DROP CONSTRAINT IF EXISTS payroll_runs_tenant_id_business_id_period_start_period_end_key;
CREATE UNIQUE INDEX IF NOT EXISTS payroll_runs_active_period_uidx
  ON payroll_runs(tenant_id, business_id, period_start, period_end)
  WHERE status <> 'VOID';

CREATE TABLE IF NOT EXISTS bank_accounts (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  business_id TEXT NOT NULL,
  account_name TEXT NOT NULL,
  bank_name TEXT NOT NULL,
  masked_account_number TEXT,
  currency TEXT NOT NULL DEFAULT 'FCFA',
  ledger_account_id TEXT NOT NULL,
  opening_balance NUMERIC(19,2) NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_by TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (tenant_id, business_id, account_name),
  UNIQUE (tenant_id, business_id, id),
  FOREIGN KEY (tenant_id, business_id) REFERENCES businesses(tenant_id, id),
  FOREIGN KEY (tenant_id, business_id, ledger_account_id) REFERENCES chart_of_accounts(tenant_id, business_id, id)
);

CREATE TABLE IF NOT EXISTS bank_transactions (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  business_id TEXT NOT NULL,
  bank_account_id TEXT NOT NULL,
  transaction_date DATE NOT NULL,
  description TEXT NOT NULL,
  reference TEXT,
  amount NUMERIC(19,2) NOT NULL CHECK (amount <> 0),
  status TEXT NOT NULL DEFAULT 'UNMATCHED' CHECK (status IN ('UNMATCHED','RECONCILED')),
  matched_journal_entry_id TEXT,
  reconciled_by TEXT,
  reconciled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (tenant_id, business_id, id),
  FOREIGN KEY (tenant_id, business_id, bank_account_id) REFERENCES bank_accounts(tenant_id, business_id, id),
  FOREIGN KEY (tenant_id, business_id, matched_journal_entry_id) REFERENCES journal_entries(tenant_id, business_id, id)
);

CREATE TABLE IF NOT EXISTS receivable_invoices (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  business_id TEXT NOT NULL,
  customer_id TEXT NOT NULL,
  invoice_number TEXT NOT NULL,
  issue_date DATE NOT NULL,
  due_date DATE NOT NULL,
  description TEXT NOT NULL,
  total_amount NUMERIC(19,2) NOT NULL CHECK (total_amount > 0),
  amount_paid NUMERIC(19,2) NOT NULL DEFAULT 0 CHECK (amount_paid >= 0),
  status TEXT NOT NULL DEFAULT 'OPEN' CHECK (status IN ('OPEN','PARTIAL','PAID','VOID')),
  journal_entry_id TEXT NOT NULL,
  created_by TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (tenant_id, business_id, invoice_number),
  UNIQUE (tenant_id, business_id, id),
  FOREIGN KEY (tenant_id, business_id) REFERENCES businesses(tenant_id, id),
  FOREIGN KEY (tenant_id, business_id, customer_id) REFERENCES customers(tenant_id, business_id, id),
  FOREIGN KEY (tenant_id, business_id, journal_entry_id) REFERENCES journal_entries(tenant_id, business_id, id),
  CHECK (due_date >= issue_date AND amount_paid <= total_amount)
);

CREATE TABLE IF NOT EXISTS payable_bills (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  business_id TEXT NOT NULL,
  supplier_id TEXT NOT NULL,
  bill_number TEXT NOT NULL,
  issue_date DATE NOT NULL,
  due_date DATE NOT NULL,
  description TEXT NOT NULL,
  total_amount NUMERIC(19,2) NOT NULL CHECK (total_amount > 0),
  amount_paid NUMERIC(19,2) NOT NULL DEFAULT 0 CHECK (amount_paid >= 0),
  status TEXT NOT NULL DEFAULT 'OPEN' CHECK (status IN ('OPEN','PARTIAL','PAID','VOID')),
  journal_entry_id TEXT NOT NULL,
  created_by TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (tenant_id, business_id, bill_number),
  UNIQUE (tenant_id, business_id, id),
  FOREIGN KEY (tenant_id, business_id) REFERENCES businesses(tenant_id, id),
  FOREIGN KEY (tenant_id, business_id, supplier_id) REFERENCES suppliers(tenant_id, business_id, id),
  FOREIGN KEY (tenant_id, business_id, journal_entry_id) REFERENCES journal_entries(tenant_id, business_id, id),
  CHECK (due_date >= issue_date AND amount_paid <= total_amount)
);

CREATE TABLE IF NOT EXISTS accounting_payments (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  business_id TEXT NOT NULL,
  direction TEXT NOT NULL CHECK (direction IN ('RECEIPT','PAYMENT')),
  receivable_invoice_id TEXT,
  payable_bill_id TEXT,
  bank_account_id TEXT,
  payment_date DATE NOT NULL,
  amount NUMERIC(19,2) NOT NULL CHECK (amount > 0),
  reference TEXT,
  journal_entry_id TEXT NOT NULL,
  created_by TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  FOREIGN KEY (tenant_id, business_id) REFERENCES businesses(tenant_id, id),
  FOREIGN KEY (tenant_id, business_id, receivable_invoice_id) REFERENCES receivable_invoices(tenant_id, business_id, id),
  FOREIGN KEY (tenant_id, business_id, payable_bill_id) REFERENCES payable_bills(tenant_id, business_id, id),
  FOREIGN KEY (tenant_id, business_id, bank_account_id) REFERENCES bank_accounts(tenant_id, business_id, id),
  FOREIGN KEY (tenant_id, business_id, journal_entry_id) REFERENCES journal_entries(tenant_id, business_id, id),
  CHECK (
    (direction='RECEIPT' AND receivable_invoice_id IS NOT NULL AND payable_bill_id IS NULL)
    OR (direction='PAYMENT' AND payable_bill_id IS NOT NULL AND receivable_invoice_id IS NULL)
  )
);

CREATE OR REPLACE FUNCTION enforce_posted_journal_entry()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
DECLARE
  total_debit NUMERIC(19,2);
  total_credit NUMERIC(19,2);
  line_count INTEGER;
BEGIN
  IF TG_OP = 'DELETE' THEN
    IF OLD.status = 'POSTED' THEN
      RAISE EXCEPTION 'Posted journal entries are immutable; create a reversal entry';
    END IF;
    RETURN OLD;
  END IF;
  IF OLD.status = 'POSTED' THEN
    RAISE EXCEPTION 'Posted journal entries are immutable; create a reversal entry';
  END IF;
  IF NEW.status = 'POSTED' THEN
    SELECT COALESCE(SUM(debit),0), COALESCE(SUM(credit),0), COUNT(*)
      INTO total_debit,total_credit,line_count
    FROM journal_lines
    WHERE journal_entry_id=NEW.id AND tenant_id=NEW.tenant_id AND business_id=NEW.business_id;
    IF line_count < 2 OR total_debit <= 0 OR total_debit <> total_credit THEN
      RAISE EXCEPTION 'Journal entry must contain at least two balanced non-zero lines';
    END IF;
    IF EXISTS (
      SELECT 1 FROM fiscal_periods
      WHERE tenant_id=NEW.tenant_id AND business_id=NEW.business_id
        AND NEW.entry_date BETWEEN starts_on AND ends_on AND status='CLOSED'
    ) THEN
      RAISE EXCEPTION 'The accounting period is closed';
    END IF;
    NEW.posted_at := COALESCE(NEW.posted_at,NOW());
  END IF;
  RETURN NEW;
END
$$;

DROP TRIGGER IF EXISTS journal_entry_post_guard ON journal_entries;
CREATE TRIGGER journal_entry_post_guard
BEFORE UPDATE OR DELETE ON journal_entries
FOR EACH ROW EXECUTE FUNCTION enforce_posted_journal_entry();

CREATE OR REPLACE FUNCTION enforce_posted_journal_lines()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
DECLARE
  target_entry TEXT;
BEGIN
  IF TG_OP = 'DELETE' THEN
    target_entry := OLD.journal_entry_id;
  ELSE
    target_entry := NEW.journal_entry_id;
  END IF;
  IF EXISTS (SELECT 1 FROM journal_entries WHERE id=target_entry AND status='POSTED') THEN
    RAISE EXCEPTION 'Posted journal lines are immutable; create a reversal entry';
  END IF;
  IF TG_OP = 'DELETE' THEN RETURN OLD; END IF;
  RETURN NEW;
END
$$;

DROP TRIGGER IF EXISTS journal_line_mutation_guard ON journal_lines;
CREATE TRIGGER journal_line_mutation_guard
BEFORE INSERT OR UPDATE OR DELETE ON journal_lines
FOR EACH ROW EXECUTE FUNCTION enforce_posted_journal_lines();

COMMIT;
