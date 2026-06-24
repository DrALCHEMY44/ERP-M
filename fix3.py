with open('dataconnect/example/mutations.gql', 'r') as f:
    content = f.read()

content = content.replace('$task: Task!', '$taskId: UUID!')
content = content.replace('$user: User!', '$userId: String!')
content = content.replace('task: $task', 'task: { id: $taskId }')
content = content.replace('user: $user', 'user: { id: $userId }')

content = content.replace('$task: Task', '$taskId: UUID')
content = content.replace('$user: User', '$userId: String')

with open('dataconnect/example/mutations.gql', 'w') as f:
    f.write(content)
