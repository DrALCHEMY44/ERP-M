import re

with open('dataconnect/schema/schema.gql', 'r') as f:
    schema = f.read()

models = {}
for m in re.finditer(r'type\s+(\w+)\s+@table\s+\{([^}]+)\}', schema):
    model_name = m.group(1)
    fields_raw = m.group(2)
    fields = []
    for line in fields_raw.split('\n'):
        line = line.split('#')[0].strip()
        if not line: continue
        parts = line.split(':')
        if len(parts) == 2:
            fname = parts[0].strip()
            fields.append(fname)
    models[model_name] = fields

queries = []
for model, fields in models.items():
    if model in ['Task', 'Tenant', 'Business', 'User', 'Product', 'Transaction', 'Notification', 'AiQuery', 'Sale']: continue
    
    # ListByBusiness
    queries.append(f'''
query List{model}sByBusiness(
  $tenantId: String!
  $businessId: String!
) @auth(level: USER, insecureReason: "Multi-tenant ERP: tenant isolation enforced at the application layer") {{
  {model[0].lower()+model[1:]}s(
    where: {{ tenantId: {{ eq: $tenantId }}, businessId: {{ eq: $businessId }} }}
  ) {{
    {chr(10).join(['    ' + f for f in fields if f not in ['tenantId', 'businessId']])}
    tenantId
    businessId
  }}
}}
''')

with open('dataconnect/example/queries.gql', 'a') as f:
    f.write('\n'.join(queries))
