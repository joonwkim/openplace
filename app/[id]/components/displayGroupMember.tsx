import KnowhowItem from '@/app/components/knowhowItem'
import { Knowhow } from '@prisma/client'
import React from 'react'
import DisplayMemberItem from './displayMemberItem'

type DispGroupMemberProps = {
    knowhow: any | Knowhow,
}
const DisplayGroupMember = ({ knowhow }: DispGroupMemberProps) => {
    return (<>
        <div className="row row-col-1 row-cols-md-4 row-cols-sm-1 g-2">
            <DisplayMemberItem knowhow={knowhow} />
            {knowhow.children?.map((child: any) => (
                <DisplayMemberItem key={child.id} knowhow={child} />
            ))}
        </div>
    </>


    )
}

export default DisplayGroupMember