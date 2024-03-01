import React from 'react'
import Image from 'next/image';
import { User } from '@prisma/client';
import styles from './page.module.css'

type UserProps = {
    user: User,
}

const UserThumbnail = ({ user }: UserProps) => {
    const getFirstLetter = () => {
        if (user && user.name) {
            const chars = Array.from(user?.name);
            return chars[0].toUpperCase()
        }
        else {
            return 'N'
        }

    }
    return (
        <>
            {user?.image ? <Image id="userpicture" style={{ borderRadius: '50%' }} unoptimized src={user.image} alt={user.email} width="40" height="40" /> : (<>
                <div title={user ? user.email : ''} className={`bg-danger ${styles.thumbnailImageSize} `}><span><h4 className={styles.thumbnailLetter}> {getFirstLetter()}</h4></span></div>
            </>)}
        </>

    )
}

export default UserThumbnail