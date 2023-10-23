'use client';
import Image from 'next/image';
import React, { useCallback, useLayoutEffect, useState } from 'react';
import styles from '@/app/regContents/page.module.css';
import { useSession, } from 'next-auth/react';
import { Knowhow } from '@prisma/client';

type GenProps = {
    knowhow: any,
};

const DispGeneral = (props: GenProps) => {
    // console.log('rendering display general info');
    const { knowhow, } = props;
    const { data: session } = useSession();
    return (<>
        {knowhow && (<div className='d-flex mt-3 gap-2'>
            <div className="card shadow p-3 mb-5 col-2" tabIndex={0}>
                <div className='col-5 p-3'>
                    <Image alt={knowhow.title} src={`/images/${knowhow.thumbnailFilename}`} quality={100} fill sizes="100vw" style={{ objectFit: 'contain', }} />
                    {/* because of performance local image used */}
                    {/* {secureUrl && (<Image alt={knowhow.title} src={secureUrl} quality={100} fill sizes="100vw" style={{ objectFit: 'contain', }} />)} */}
                </div>
            </div>
            <div className="card shadow p-3 mb-5 col-7">
                <div className='fs-4'>{knowhow.title}</div>
                <div><span>{knowhow.KnowhowType?.name}</span><span>{` X ${knowhow.category.name}`}</span></div>
                <div></div>
                <div>{knowhow.description}</div>
            </div>

        </div >)

        }

    </>
    );
};

export default DispGeneral;
