'use client';
import { Vote } from "@prisma/client";
import Card from "react-bootstrap/Card";
import { useRouter } from 'next/navigation';
import { useSession } from "next-auth/react";
import GeneralFooter from "@/app/components/controls/generalFooter";
import { updateKnowHowAction } from "@/app/actions/knowhowAction";
import './scroll.css';

type KnowHowProps = {
    knowhow: any,
};

export type VoteData = Omit<Vote, "id">;

const DisplayMemberItem = (props: KnowHowProps) => {
    const { knowhow } = props;
    const { data: session } = useSession();
    const router = useRouter();
    const handleClickOnCard = async (e: any) => {
        try {
            knowhow.viewCount++;
            await updateKnowHowAction(knowhow);
            if (knowhow.knowhowDeetailInfo) {
                router.push(`/groupMembersContents/${props.knowhow?.knowhowDeetailInfo.id}`);
            }
            // else {
            //     alert('세부 내용이 등록되지 않았습니다.')
            // }

            // router.push(`/knowhow/${props.knowhow?.id}`);
        } catch (error) {
            alert('error on handle click on card' + error);
        }
    };

    const getTags = () => {
        if (knowhow && knowhow.tags && knowhow.tags.length > 0) {
            const names = knowhow?.tags?.map((s: any) => s.name);
            return names.join(", ")
        }
        else {
            return '';
        }
    }
    const handleDisplayGroupItem = () => {
        router.push(`/${knowhow?.id}`);
    }
    return (
        <div key={knowhow?.id} className='col-sm btn' onClick={handleDisplayGroupItem}>
            <Card className='card shadow-lg p-1 sm-body rounded h-100' >
                <Card.Img onClick={(e) => handleClickOnCard(e)} variant="top" src={knowhow?.thumbnailCloudinaryData?.secure_url} sizes="100vw" height={200} style={{ objectFit: 'contain', }} />
                <Card.Body onClick={handleClickOnCard} className="card-body p-0">
                    <Card.Title className='text-center fw-bold'>{knowhow?.title}</Card.Title>
                    <div className='text-center card-text'>
                        <div className="scrollabletextbox">{knowhow?.description}</div>
                        <div>
                            <span className="me-2">작성자:</span>
                            <span className="me-2">{knowhow.author?.name}</span>
                        </div>
                    </div>
                </Card.Body>
                <Card.Footer className="text-center" >
                    <GeneralFooter knowhow={knowhow} session={session} />
                </Card.Footer>
            </Card>
        </div>
    );
};
export default DisplayMemberItem;
