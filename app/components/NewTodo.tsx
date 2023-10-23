'use client'
import { useRef } from "react"
import { createTodoAction } from "../actions/todoAction"

const NewTodo = () => {
    const formRef = useRef<HTMLFormElement>(null)
    const action = async (data: FormData) => {
        const title = data.get('title')
        if (!title || typeof title !== 'string') return

       await createTodoAction(title)

       formRef.current?.reset()
    }

    return (
        <form ref={formRef} action={action} className='mt-3'>
            <div className="fs-5">Create a new Todo</div>
            <input type="text" title='title' name="title" 
            className='border border-primary' />
            <button
                type='submit'
                className='btn btn-primary ms-3'  >
                Add Todo
            </button>
        </form>

    )
}

export default NewTodo