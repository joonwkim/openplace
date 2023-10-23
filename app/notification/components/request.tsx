'use client';
import { updateRequestProcessAction } from '@/app/actions/memberRequestProcessAction';
import { getDateToLocale } from '@/app/lib/convert';
import { MemberRequestAndProcess, MemberRequestAndProcessStatus } from '@prisma/client';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { Form } from 'react-bootstrap';

interface MemberRequestAndProcesses {
    memberProcessedBys: MemberRequestAndProcess[],
}
interface StatusChanged {
    memberRequestProcess: MemberRequestAndProcess,
    status: MemberRequestAndProcessStatus;
}

const RequestStatusPage = (props: MemberRequestAndProcesses) => {
    const router = useRouter()
    const { memberProcessedBys } = props;
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

    const handleSave = () => {
        statusChanged.map(async (s: any) => {
            const res = await updateRequestProcessAction(s);
          
        });
        router.push('/')
    };

    const isSelected = (mr: MemberRequestAndProcess, status: any) => {
        let result = false;
        if (mr.memberRequestStatus === status) {
            result = true;
        }
        return result;
    };

    const isBtnDisabled = () => {
        return statusChanged.length === 0;
    };

    const handleChanged = (mr: MemberRequestAndProcess, value: any) => {
        const cv: StatusChanged = {
            memberRequestProcess: mr,
            status: value
        };
        const sc = statusChanged.find(s => s.memberRequestProcess.id === cv.memberRequestProcess.id);
        if (sc) {
            sc.status = value;
        } else {
            setStatusChanged(prev => [...prev, cv]);
        }
    };

    return (
        <>
            <section className='py-3'>
                <div className='d-flex justify-content-between'>
                    <h4 className='mb-3'>그룹 참여요청 현황</h4>
                    <div>
                        <button type='button' className='btn btn-primary me-5' onClick={handleSave} disabled={isBtnDisabled()} >저  장</button>
                    </div>
                </div>
                <table className="table table-fixed table-hover table-sm">
                    <thead>
                        <tr>
                            <th className='col-2'>컨텐츠 제목</th>
                            <th className='col-1'>요청자 성명</th>
                            <th className='col-1'>요청 일자</th>
                            <th className='col-1 text-center'>선택</th>
                        </tr>
                    </thead>
                    <tbody>
                        {memberProcessedBys.map((mr: any, index: number) => (
                            <tr key={index}>
                                <td>{mr.knowhow.title}</td>
                                <td>{mr.memberRequestedBy.name}</td>
                                <td>{getDateToLocale(mr.createdAt as Date)}</td>
                                <td>
                                    <Form.Select name='memberRequestStatus' onChange={(e) => handleChanged(mr, e.target.value)}>
                                        {requestStatus(mr).map((st) => (
                                            <option key={st[0]} selected={isSelected(mr, st[0])} value={st[0]}>{st[1]}</option>
                                        ))}
                                    </Form.Select>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>
        </>
    );
};

export default RequestStatusPage;