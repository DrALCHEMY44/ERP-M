import re

with open('dataconnect/schema/schema.gql', 'r') as f:
    schema = f.read()

models = {}
# Support table decorators with parameters (like @table(key: "id"))
for m in re.finditer(r'type\s+(\w+)\s+@table(?:\([^)]*\))?\s*\{([^}]+)\}', schema):
    model_name = m.group(1)
    fields_raw = m.group(2)
    fields = []
    for line in fields_raw.split('\n'):
        line = line.split('#')[0].strip()
        if not line: continue
        parts = line.split(':')
        if len(parts) == 2:
            fname = parts[0].strip()
            ftype = parts[1].strip()
            fields.append((fname, ftype))
    models[model_name] = fields

mutations = []
for model, fields in models.items():
    if model in ['Task']: continue # We already have custom Task mutations
    
    # Create
    mutations.append(f'# --- {model} ---')
    create_args = []
    insert_fields = []
    for fname, ftype in fields:
        if fname in ['createdAt', 'updatedAt', 'timestamp', 'uploadedAt']:
            insert_fields.append(f'    {fname}_expr: "request.time"')
        else:
            create_args.append(f'  ${fname}: {ftype}')
            insert_fields.append(f'    {fname}: ${fname}')
    
    mutations.append(f'mutation Create{model}(\n' + '\n'.join(create_args) + f'\n) @auth(level: USER, insecureReason: "Multi-tenant ERP: tenant isolation enforced at the application layer") {{\n  {model[0].lower()+model[1:]}_insert(data: {{\n' + '\n'.join(insert_fields) + '\n  })\n}')
    
    # Update
    # All tables in the updated schema use String! as their primary key
    id_type = 'String!'
    update_args = [f'  $id: {id_type}']
    update_fields = []
    for fname, ftype in fields:
        if fname in ['createdAt', 'timestamp', 'uploadedAt']:
            continue
        if fname in ['updatedAt']:
            update_fields.append(f'    {fname}_expr: "request.time"')
        else:
            t = ftype.replace('!', '')
            update_args.append(f'  ${fname}: {t}')
            update_fields.append(f'    {fname}: ${fname}')
            
    mutations.append(f'mutation Update{model}(\n' + '\n'.join(update_args) + f'\n) @auth(level: USER, insecureReason: "Multi-tenant ERP: tenant isolation enforced at the application layer") {{\n  {model[0].lower()+model[1:]}_update(id: $id, data: {{\n' + '\n'.join(update_fields) + '\n  })\n}')
    
    # Delete
    id_type = 'String!'
    mutations.append(f'mutation Delete{model}($id: {id_type}) @auth(level: USER, insecureReason: "Multi-tenant ERP: tenant isolation enforced at the application layer") {{\n  {model[0].lower()+model[1:]}_delete(id: $id)\n}}')

custom_task = """
# -----------------------------------
# Task Mutations
# -----------------------------------
mutation CreateTask(
  $tenantId: String!
  $businessId: String!
  $title: String!
  $description: String
  $status: TaskStatus!
  $priority: TaskPriority
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
  $id: String!
  $title: String
  $description: String
  $status: TaskStatus
  $priority: TaskPriority
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

mutation DeleteTask($id: String!) @auth(level: USER, insecureReason: "Multi-tenant ERP: tenant isolation enforced at the application layer") {
  task_delete(id: $id)
}
"""

with open('dataconnect/example/mutations.gql', 'w') as f:
    f.write('\n\n'.join(mutations) + custom_task)
