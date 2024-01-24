'use client';
import { updatemembershipRequestAction } from '@/app/actions/membershipRequestAction';
import { getDate, } from '@/app/lib/convert';
import { MembershipRequest, MembershipRequestStatus } from '@prisma/client';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { Form } from 'react-bootstrap';
interface MemberRequestAndProcesses {
    membershipProcessedBys: MembershipRequest[],
}
export interface StatusChanged {
    membershipRequestProcess: MembershipRequest,
    status: MembershipRequestStatus;
}

const RequestStatusPage = (props: MemberRequestAndProcesses) => {
    const { membershipProcessedBys } = props;
    const [statusChanged, setStatusChanged] = useState<any[]>([]);
    const router = useRouter();

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

    const requestStatusConverted = (status: MembershipRequestStatus) => {
        if (status === MembershipRequestStatus.APPROVED) return "승인"
        else if (status === MembershipRequestStatus.REQUESTED) return "가입요청"
        else if (status === MembershipRequestStatus.PENDING) return "보류"
        else if (status === MembershipRequestStatus.REJECTED) return "거절"
        else if (status === MembershipRequestStatus.JOINED) return "가입"
    }

    const handleSave = async () => {
        await updatemembershipRequestAction(statusChanged);
        alert('그룹 가입요청 처리 내용이 저장 되었습니다.');
        setStatusChanged([]);
        window.location.reload();
        router.push('/notification');
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
        // return statusChanged.length === 0;
    };

    const handleChanged = (id: string, value: string) => {
        const sc = { id, value };
        setStatusChanged(prev => [...prev, sc]);
    };

    return (
        <>
            <section className='py-3'>
                {/* <div className='d-flex justify-content-between'>
                    <h4 className='mb-3'>그룹 참여요청 현황</h4>
                    <div>
                        <button type='button' className='btn btn-primary me-5' onClick={handleSave} disabled={isBtnDisabled()} >저  장</button>
                    </div>
                </div> */}
                <table className="table table-fixed table-hover table-sm">
                    <thead>
                        <tr>
                            <th className='col-2'>컨텐츠 제목</th>
                            <th className='col-1'>요청자 성명</th>
                            <th className='col-1'>요청 일자</th>
                            <th className='col-1 text-center'>현황</th>
                        </tr>
                    </thead>
                    <tbody>
                        {membershipProcessedBys?.map((mr: any, index: number) => (
                            <tr key={index}>
                                <td>{mr.knowhow.title}</td>
                                <td>{mr.membershipRequestedBy.name}</td>
                                <td>{getDate(mr.createdAt as Date)}</td>
                                <td className='text-center'>{requestStatusConverted(mr.membershipRequestStatus)}</td>
                                {/* <td>
                                    <Form.Select name='membershipRequestStatus' onChange={(e) => handleChanged(mr.id, e.target.value)}>
                                        {requestStatus(mr).map((st) => (
                                            <option key={st[0]} selected={isSelected(mr, st[0])} value={st[0]}>{st[1]}</option>
                                        ))}
                                    </Form.Select>
                                </td> */}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>
        </>
    );
};

export default RequestStatusPage;