export type TodoPriority = 'high' | 'medium' | 'low'

export type TodoItem = {
  id: string
  title: string
  completed: boolean
  priority: TodoPriority
  estimate: number
}

export type ChecklistItem = {
  id: string
  label: string
  checked: boolean
}
