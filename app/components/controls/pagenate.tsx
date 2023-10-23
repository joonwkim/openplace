import React from 'react'

const Pagenate = () => {
    return (
        <div className="level">
            <div>
            </div>
            <div>
                <div>
                    <button className="btn btn-primary">Previous</button>
                    <span className='ms-3'>
                        Page:
                        <input className='ms-3' type="number" max="10" min="1" value="" placeholder='1' />

                    </span>
                    <button className="btn btn-primary ms-3">Next</button>
                </div>
            </div >

        </div >
    )
}

export default Pagenate