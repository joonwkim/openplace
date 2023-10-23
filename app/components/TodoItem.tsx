'use client'
import { Todo } from '@prisma/client'
import { useTransition } from 'react'
import { updateTodoAction } from '../actions/todoAction'
import styles from './page.module.css'

type TodoItemProps = {
  todo: Todo
}

const TodoItem = ({ todo }: TodoItemProps) => {

  const [isPending, startTransition] = useTransition()
  return (
    <li className='list-group-item border-0 p-0'>
      <input type="checkbox"
        className={styles.todoCheckbox}
        name="isCompleted"
        title='isCompleted'
        id={todo.id}
        onChange={(e) => startTransition(() => updateTodoAction(todo.id, e.target.checked))}
        defaultChecked={todo.isCompleted} />
      {!todo.isCompleted ?
        (<>
          <label htmlFor='{todo.id}'
            className='ms-1'  >{todo.title}</label>
          <span className='ms-3'>
            {todo.updatedAt.toUTCString()}
          </span>
        </>) : (<>
          <label htmlFor='{todo.id}'
            className='ms-1 text-decoration-line-through'  >{todo.title}</label>
          <span className='ms-3 text-decoration-line-through'>
            {todo.updatedAt.toUTCString()}
          </span>
        </>)
      }
    </li>
  )
}

export default TodoItem