'use client';
import { updatemembershipRequestAction } from '@/app/actions/membershipRequestAction';
import { getDateToLocale } from '@/app/lib/convert';
import { MembershipRequest, MembershipRequestStatus } from '@prisma/client';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { Form } from 'react-bootstrap';

interface MemberRequestAndProcesses {
    membershipProcessedBys: MembershipRequest[],
}
interface StatusChanged {
    membershipRequestProcess: MembershipRequest,
    status: MembershipRequestStatus;
}

const RequestStatusPage = (props: MemberRequestAndProcesses) => {
    const router = useRouter();
    const { membershipProcessedBys } = props;
    const [statusChanged, setStatusChanged] = useState<StatusChanged[]>([]);
    const requestStatus = (mr: MembershipRequest) => {
        const st = mr.membershipRequestStatus;
        type statusValue = [MembershipRequestStatus, string];
        let statusValues: statusValue[] = [
            [MembershipRequestStatus.REQUESTED, "가입요청"],
            [MembershipRequestStatus.APPROVED, "승인"],
            [MembershipRequestStatus.PENDING, "보류"],
            [MembershipRequestStatus.REJECTED, "거절"],
        ];

        return statusValues;

    };

    const handleSave = () => {
        statusChanged.map(async (s: any) => {
            const res = await updatemembershipRequestAction(s);

        });
        router.push('/');
    };

    const isSelected = (mr: MembershipRequest, status: any) => {
        let result = false;
        if (mr.membershipRequestStatus === status) {
            result = true;
        }
        return result;
    };

    const isBtnDisabled = () => {
        return statusChanged.length === 0;
    };

    const handleChanged = (mr: MembershipRequest, value: any) => {
        const cv: StatusChanged = {
            membershipRequestProcess: mr,
            status: value
        };
        const sc = statusChanged.find(s => s.membershipRequestProcess.id === cv.membershipRequestProcess.id);
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
                        {membershipProcessedBys.map((mr: any, index: number) => (
                            <tr key={index}>
                                <td>{mr.knowhow.title}</td>
                                <td>{mr.membershipRequestedBy.name}</td>
                                <td>{getDateToLocale(mr.createdAt as Date)}</td>
                                <td>
                                    <Form.Select name='membershipRequestStatus' onChange={(e) => handleChanged(mr, e.target.value)}>
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