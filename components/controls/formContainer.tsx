'use client'
import React from 'react'

interface FormContainerProps {
    children: React.ReactNode
}

export default function FormContainer({ children }: FormContainerProps) {
    return (
        <>
            <section className="pb-1">
                <div className='bg-white'>
                    <section className='p-4 d-flex justify-content-center'>
                        {children}
                    </section>
                </div>
            </section>
        </>

    )
}
