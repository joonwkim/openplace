'use client';
import { getDateToLocale } from '@/app/lib/convert';
import { MemberRequestAndProcess, MemberRequestAndProcessStatus } from '@prisma/client';
import React, { useState } from 'react';

interface MemberRequestAndProcesses {
    memberRequestedBys: MemberRequestAndProcess[],
}
interface StatusChanged {
    memberRequest: MemberRequestAndProcess,
    status: MemberRequestAndProcessStatus;
}

const ProcessStatusPage = (props:MemberRequestAndProcesses) => {
    const {memberRequestedBys} = props;
    const [statusChanged, setStatusChanged] = useState<StatusChanged[]>([]);
    const requestStatus = (mr: MemberRequestAndProcess) => {
        const st = mr.memberRequestStatus;
        type statusValue = [MemberRequestAndProcessStatus, string];
        let statusValues: statusValue[] = [
            [MemberRequestAndProcessStatus.REQUESTED, "가입요청"],
            [MemberRequestAndProcessStatus.APPROVED, "승인"],
            [MemberRequestAndProcessStatus.PENDING, "보류"],
            [MemberRequestAndProcessStatus.REJECTED, "거절"],
        ];

        return statusValues;

    };

    return (
        <>
            <section className='py-3'>
                    <div className='d-flex justify-content-between'>
                        <h4 className='mb-3'>그룹 참여요청 처리 현황</h4>
                    </div>
                    <table className="table table-fixed table-hover table-sm">
                        <thead>
                            <tr>
                                <th className='col-2'>컨텐츠 제목</th>
                                <th className='col-1'>가입승인자</th>
                                <th className='col-1'>처리 일자</th>
                                <th className='col-1 text-center'>처리결과</th>
                            </tr>
                        </thead>
                        <tbody>
                            {memberRequestedBys.map((mr: any, index: number) => (
                                <tr key={index}>
                                    <td>{mr.knowhow.title}</td>
                                    <td>{mr.memberProcessedBy.name}</td>
                                    <td>{mr.processAt && getDateToLocale(mr.processedAt as Date)}</td>
                                    <td className='text-center'>{mr.memberRequestStatus}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </section>

        </>
    );
};

export default ProcessStatusPage;