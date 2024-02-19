'use client'
import React, { useState } from 'react'
import Image from 'next/image';
import plusicon from '@/public/images/plus.png';
import '../styles.css';
import { useRouter } from 'next/navigation';
import { User } from '@prisma/client';

type SearchUserProps = {
    users: User[]
}

const SearchUser = ({ users }: SearchUserProps) => {
    const router = useRouter();
    const [inputValue, setInputValue] = useState(' ');
    const handleOnKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        router.push(`/message/?searchUser=${inputValue}`);
    }

    const handleOnUserClicked = (user: User) => {
        // alert('user selected:' + JSON.stringify(user, null, 2))
        router.push(`/message/?selectedUserId=${user.id}`);
    }

    return (
        <>
            <div className="dropdown message-header">
                <span>받은 메시지함</span>
                <button className="btn btn-outline-light border-0" onClick={() => setInputValue('')} type="button" id="dropdownMenuOffset" data-bs-toggle="dropdown" aria-expanded="false" data-bs-offset="-10,20" title='search user'>
                    <Image
                        src={plusicon}
                        alt="plusbtn"
                        width={20}
                        height={20}
                        style={{ cursor: 'pointer' }}
                    />
                </button>
                <ul className="dropdown-menu user-search-dropdown shadow" aria-labelledby="dropdownMenuOffset">
                    <li><a className="dropdown-item" href="#">
                        <input className='userSearch-input' type='text'
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder='회원 검색' autoFocus onKeyUp={handleOnKeyUp} /></a>
                    </li>
                    {users?.length > 0 && (
                        <>
                            {users?.map((user: User, index: number) => (<>
                                <li key={index}><a className="dropdown-item" href="#"
                                    onClick={() => handleOnUserClicked(user)}>{`${user.name} - ${user.email}`}</a></li>
                            </>))}
                        </>
                    )}
                </ul>
            </div>
        </>
    )
}

export default SearchUser