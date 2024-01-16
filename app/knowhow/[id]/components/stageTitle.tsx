import React from 'react'
type TitleProps = {
    title: string,
}
const StageTitle = (props: TitleProps) => {
    return (
        <div className='mb-3 border border-dark p-0 text-center title-box'>
            <h2>{props.title}</h2>
        </div>
    )
}

export default StageTitle