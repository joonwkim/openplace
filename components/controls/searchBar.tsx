'use client'

import styles from './page.module.css'
type SearchBarProps = {
    value: string
    placeholder: string
    handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void
    handleCancelBtnClick: (event: React.MouseEvent<HTMLSpanElement, MouseEvent>) => void
    onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void
}

import { useState } from "react"

const SearchBar = (props: SearchBarProps) => {

    return (<>
        <div className={`my-3 container ${styles.container}`}>
            <span className={`input-group-text border-0 bg-white ${styles.searchIcon}`} id="basic-addon1">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-search" viewBox="0 0 16 16">
                    <path d="M10.68 11.74a6 6 0 0 1-7.922-8.982 6 6 0 0 1 8.982 7.922l3.04 3.04a.749.749 0 0 1-.326 1.275.749.749 0 0 1-.734-.215ZM11.5 7a4.499 4.499 0 1 0-8.997 0A4.499 4.499 0 0 0 11.5 7Z"></path>
                </svg>
            </span>
            <input type="text" className={`form-control ${styles.searchInput} `}
                placeholder={props.placeholder} aria-label="Username"
                aria-describedby="basic-addon1" value={props.value}
                onChange={(e) => props.handleChange(e)}
                onKeyDown={props.onKeyDown} />
            {props.value ? (<span className={`input-group-text border-0 bg-white ${styles.closeIcon} `} onClick={props.handleCancelBtnClick} id="basic-addon3">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                    className="bi bi-search"
                    viewBox="0 0 16 16">
                    <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z" />
                </svg>
            </span>) : (<div> </div>)}

        </div>
     

    </>

    )
}

export default SearchBar