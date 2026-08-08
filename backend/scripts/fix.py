import re

with open('dataconnect/example/mutations.gql', 'r') as f:
    lines = f.readlines()

new_lines = []
skip = False
for line in lines:
    if line.startswith('<<<<<<< HEAD'):
        skip = True
    elif line.startswith('======='):
        skip = False
    elif line.startswith('>>>>>>> '):
        continue
    elif not skip:
        new_lines.append(line)

content = "".join(new_lines)

# Remove the generic task mutations correctly without matching the end
generic_task = """# -----------------------------------
# Task Mutations
# -----------------------------------
mutation CreateTask($data: Task_Data!) {
  task_insert(data: $data)
}
mutation UpdateTask($id: UUID!, $data: Task_Data!) {
  task_update(id: $id, data: $data)
}
mutation DeleteTask($id: UUID!) {
  task_delete(id: $id)
}
"""
content = content.replace(generic_task, '')

# Append our custom task mutations
custom_task = """
# -----------------------------------
# Task Mutations
# -----------------------------------
mutation CreateTask(
  $tenantId: String!
  $businessId: String!
  $title: String!
  $description: String
  $status: String!
  $priority: String
  $dueDate: Timestamp!
  $assignedToId: String
  $createdBy: String!
) @auth(level: USER, insecureReason: "Multi-tenant ERP: tenant isolation enforced at the application layer") {
  task_insert(data: {
    tenantId: $tenantId
    businessId: $businessId
    title: $title
    description: $description
    status: $status
    priority: $priority
    dueDate: $dueDate
    assignedToId: $assignedToId
    createdBy: $createdBy
    createdAt_expr: "request.time"
  })
}

mutation UpdateTask(
  $id: UUID!
  $title: String
  $description: String
  $status: String
  $priority: String
  $dueDate: Timestamp
  $assignedToId: String
) @auth(level: USER, insecureReason: "Multi-tenant ERP: tenant isolation enforced at the application layer") {
  task_update(id: $id, data: {
    title: $title
    description: $description
    status: $status
    priority: $priority
    dueDate: $dueDate
    assignedToId: $assignedToId
    updatedAt_expr: "request.time"
  })
}

mutation DeleteTask($id: UUID!) @auth(level: USER, insecureReason: "Multi-tenant ERP: tenant isolation enforced at the application layer") {
  task_delete(id: $id)
}
"""
content += custom_task

with open('dataconnect/example/mutations.gql', 'w') as f:
    f.write(content)
