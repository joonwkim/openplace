'use client';
import { Vote } from "@prisma/client";
import Card from "react-bootstrap/Card";
import { useRouter } from 'next/navigation';
import { useSession } from "next-auth/react";
import { updateKnowHowAction } from "../actions/knowhowAction";
import GeneralFooter from "./controls/generalFooter";
import { useState } from "react";
import Image from 'next/image';
import { getImgSecureUrl, getThumbnailSecureUrl } from "../services/cloudinaryService";

type KnowHowProps = {
    knowhow: any,
};

export type VoteData = Omit<Vote, "id">;

const KnowHowItem = (props: KnowHowProps) => {
    const { knowhow } = props;
    const { data: session } = useSession();
    const [thumbnailSecureUrl, setThumbnailSecureUrl] = useState(getThumbnailSecureUrl(knowhow) as string);

    const router = useRouter();
    const handleClickOnCard = async (e: any) => {
        try {
            knowhow.viewCount++;
            await updateKnowHowAction(knowhow);
            router.push(`/${props.knowhow?.id}`);
        } catch (error) {
            alert(error);
        }
    };

    return (
        <>
            <div key={knowhow?.id} className='col-sm btn'>
                <Card className='card shadow-lg p-1 bg-body rounded h-100' >
                    {thumbnailSecureUrl ? (<>
                        <Card.Img onClick={(e) => handleClickOnCard(e)} variant="top" src={thumbnailSecureUrl} sizes="100vw" height={250} style={{ objectFit: 'contain', }} /></>)
                        : (<> <Card.Img onClick={(e) => handleClickOnCard(e)} variant="top" src={`/images/${knowhow.thumbnailFilename}`} sizes="100vw" height={250} style={{ objectFit: 'contain', }} /></>)}
                    <Card.Body onClick={handleClickOnCard} >
                        <Card.Title className='text-center fw-bold'>{knowhow?.title}</Card.Title>
                        <div className='text-center card-text'>
                            <div>  {knowhow?.description}</div>
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
        </>
    );
};
export default KnowHowItem;
