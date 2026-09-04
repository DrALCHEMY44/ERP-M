import { randomUUID } from "crypto"
import type { PoolClient } from "@neondatabase/serverless"

import { withAccountingTransaction, writeAuditWithClient, type CompanyScope } from "./accounting"
import { db } from "./neon"

export async function getHrWorkspace(tenantId: string, businessId: string) {
  const sql = db()
  const employees = await sql`SELECT id,full_name,position,role,department,email,contact,start_date,status,salary
    FROM employees WHERE tenant_id=${tenantId} AND business_id=${businessId} ORDER BY full_name`
  const attendance = await sql`SELECT ar.*,e.full_name
    FROM attendance_records ar JOIN employees e
      ON e.tenant_id=ar.tenant_id AND e.business_id=ar.business_id AND e.id=ar.employee_id
    WHERE ar.tenant_id=${tenantId} AND ar.business_id=${businessId}
    ORDER BY ar.attendance_date DESC,ar.created_at DESC LIMIT 500`
  const leave = await sql`SELECT lr.*,e.full_name
    FROM leave_requests lr JOIN employees e
      ON e.tenant_id=lr.tenant_id AND e.business_id=lr.business_id AND e.id=lr.employee_id
    WHERE lr.tenant_id=${tenantId} AND lr.business_id=${businessId}
    ORDER BY lr.created_at DESC LIMIT 500`
  const events = await sql`SELECT ee.*,e.full_name
    FROM employment_events ee JOIN employees e
      ON e.tenant_id=ee.tenant_id AND e.business_id=ee.business_id AND e.id=ee.employee_id
    WHERE ee.tenant_id=${tenantId} AND ee.business_id=${businessId}
    ORDER BY ee.effective_date DESC,ee.created_at DESC LIMIT 500`
  return {
    employees: employees.map((row) => ({
      id: row.id, fullName: row.full_name, position: row.position, role: row.role, department: row.department,
      email: row.email, contact: row.contact, startDate: row.start_date, status: row.status, salary: row.salary == null ? null : Number(row.salary),
    })),
    attendance: attendance.map((row) => ({
      id: row.id, employeeId: row.employee_id, employeeName: row.full_name, attendanceDate: row.attendance_date,
      checkIn: row.check_in, checkOut: row.check_out, minutesWorked: row.minutes_worked == null ? null : Number(row.minutes_worked),
      status: row.status, notes: row.notes,
    })),
    leaveRequests: leave.map((row) => ({
      id: row.id, employeeId: row.employee_id, employeeName: row.full_name, leaveType: row.leave_type,
      startDate: row.start_date, endDate: row.end_date, requestedDays: Number(row.requested_days), reason: row.reason,
      status: row.status, decisionNotes: row.decision_notes, decidedAt: row.decided_at, createdAt: row.created_at,
    })),
    events: events.map((row) => ({
      id: row.id, employeeId: row.employee_id, employeeName: row.full_name, eventType: row.event_type,
      effectiveDate: row.effective_date, position: row.position, department: row.department,
      employmentStatus: row.employment_status, notes: row.notes, createdAt: row.created_at,
    })),
  }
}

async function assertEmployee(client: PoolClient, scope: CompanyScope, employeeId: string) {
  const result = await client.query(
    "SELECT id FROM employees WHERE id=$1 AND tenant_id=$2 AND business_id=$3",
    [employeeId, scope.tenantId, scope.businessId],
  )
  if (!result.rows[0]) throw new Error("Employee was not found in this company")
}

export async function recordAttendance(scope: CompanyScope & {
  employeeId: string
  attendanceDate: string
  checkIn?: string | null
  checkOut?: string | null
  status: "PRESENT" | "ABSENT" | "LATE" | "EXCUSED" | "REMOTE" | "LEAVE"
  notes?: string | null
}) {
  return withAccountingTransaction(async (client) => {
    await assertEmployee(client, scope, scope.employeeId)
    let minutesWorked: number | null = null
    if (scope.checkIn && scope.checkOut) {
      const start = new Date(scope.checkIn)
      const end = new Date(scope.checkOut)
      if (!Number.isFinite(start.getTime()) || !Number.isFinite(end.getTime()) || end < start) {
        throw new Error("Attendance check-out must be after check-in")
      }
      minutesWorked = Math.floor((end.getTime() - start.getTime()) / 60_000)
    }
    const result = await client.query(
      `INSERT INTO attendance_records(
        id,tenant_id,business_id,employee_id,attendance_date,check_in,check_out,minutes_worked,status,notes,recorded_by
      ) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
      ON CONFLICT(tenant_id,business_id,employee_id,attendance_date) DO UPDATE SET
        check_in=EXCLUDED.check_in,check_out=EXCLUDED.check_out,minutes_worked=EXCLUDED.minutes_worked,
        status=EXCLUDED.status,notes=EXCLUDED.notes,recorded_by=EXCLUDED.recorded_by,updated_at=NOW()
      RETURNING id`,
      [randomUUID(), scope.tenantId, scope.businessId, scope.employeeId, scope.attendanceDate,
        scope.checkIn || null, scope.checkOut || null, minutesWorked, scope.status, scope.notes || null, scope.actorId],
    )
    await writeAuditWithClient(client, scope, "UPSERT_ATTENDANCE", "HR", `Attendance ${scope.status} on ${scope.attendanceDate}`, String(result.rows[0].id))
    return { id: String(result.rows[0].id) }
  })
}

export async function createLeaveRequest(scope: CompanyScope & {
  employeeId: string
  leaveType: "ANNUAL" | "SICK" | "MATERNITY" | "PATERNITY" | "COMPASSIONATE" | "UNPAID" | "OTHER"
  startDate: string
  endDate: string
  requestedDays: number
  reason?: string | null
}) {
  return withAccountingTransaction(async (client) => {
    await assertEmployee(client, scope, scope.employeeId)
    const conflict = await client.query(
      `SELECT id FROM leave_requests WHERE tenant_id=$1 AND business_id=$2 AND employee_id=$3
       AND status IN ('PENDING','APPROVED') AND daterange(start_date,end_date,'[]') && daterange($4::date,$5::date,'[]') LIMIT 1`,
      [scope.tenantId, scope.businessId, scope.employeeId, scope.startDate, scope.endDate],
    )
    if (conflict.rows[0]) throw new Error("This employee already has an overlapping leave request")
    const id = randomUUID()
    await client.query(
      `INSERT INTO leave_requests(
        id,tenant_id,business_id,employee_id,leave_type,start_date,end_date,requested_days,reason,created_by
      ) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
      [id, scope.tenantId, scope.businessId, scope.employeeId, scope.leaveType, scope.startDate,
        scope.endDate, scope.requestedDays, scope.reason || null, scope.actorId],
    )
    await writeAuditWithClient(client, scope, "CREATE_LEAVE", "HR", `${scope.leaveType} leave request`, id)
    return { id, status: "PENDING" as const }
  })
}

export async function decideLeaveRequest(
  scope: CompanyScope,
  requestId: string,
  decision: "APPROVED" | "REJECTED" | "CANCELLED",
  notes?: string | null,
) {
  return withAccountingTransaction(async (client) => {
    const result = await client.query(
      `UPDATE leave_requests SET status=$1,decision_notes=$2,decided_by=$3,decided_at=NOW(),updated_at=NOW()
       WHERE id=$4 AND tenant_id=$5 AND business_id=$6 AND status='PENDING' RETURNING id,employee_id,start_date,end_date`,
      [decision, notes || null, scope.actorId, requestId, scope.tenantId, scope.businessId],
    )
    if (!result.rows[0]) throw new Error("Pending leave request was not found in this company")
    if (decision === "APPROVED") {
      await client.query(
        `INSERT INTO employment_events(id,tenant_id,business_id,employee_id,event_type,effective_date,notes,created_by)
         VALUES($1,$2,$3,$4,'LEAVE',$5,$6,$7)`,
        [randomUUID(), scope.tenantId, scope.businessId, result.rows[0].employee_id,
          result.rows[0].start_date, `Approved through ${String(result.rows[0].end_date)}${notes ? `: ${notes}` : ""}`, scope.actorId],
      )
    }
    await writeAuditWithClient(client, scope, "DECIDE_LEAVE", "HR", `Leave request ${decision.toLowerCase()}`, requestId)
    return { id: requestId, status: decision }
  })
}

export async function addEmploymentEvent(scope: CompanyScope & {
  employeeId: string
  eventType: "HIRE" | "PROMOTION" | "TRANSFER" | "LEAVE" | "RETURN" | "SUSPENSION" | "TERMINATION" | "NOTE"
  effectiveDate: string
  position?: string | null
  department?: string | null
  employmentStatus?: string | null
  notes?: string | null
}) {
  return withAccountingTransaction(async (client) => {
    await assertEmployee(client, scope, scope.employeeId)
    const id = randomUUID()
    await client.query(
      `INSERT INTO employment_events(
        id,tenant_id,business_id,employee_id,event_type,effective_date,position,department,employment_status,notes,created_by
      ) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)`,
      [id, scope.tenantId, scope.businessId, scope.employeeId, scope.eventType, scope.effectiveDate,
        scope.position || null, scope.department || null, scope.employmentStatus || null, scope.notes || null, scope.actorId],
    )
    const derivedStatus = scope.employmentStatus
      || (scope.eventType === "TERMINATION" ? "Inactive" : scope.eventType === "SUSPENSION" ? "Suspended" : null)
    if (scope.position || scope.department || derivedStatus) {
      await client.query(
        `UPDATE employees SET position=COALESCE($1,position),department=COALESCE($2,department),status=COALESCE($3,status)
         WHERE id=$4 AND tenant_id=$5 AND business_id=$6`,
        [scope.position || null, scope.department || null, derivedStatus, scope.employeeId, scope.tenantId, scope.businessId],
      )
    }
    await writeAuditWithClient(client, scope, "EMPLOYMENT_EVENT", "HR", `${scope.eventType} event for employee ${scope.employeeId}`, id)
    return { id }
  })
}
