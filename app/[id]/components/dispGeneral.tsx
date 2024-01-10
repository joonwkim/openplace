'use client';
import Image from 'next/image';
import { Card, } from 'react-bootstrap';
import GeneralFooter from '../../components/controls/generalFooter';

type GenProps = {
    knowhow: any,
    session: any,
    thumbnailSecureUrl: string,
};

const DispGeneral = (props: GenProps) => {
    const { knowhow, session, thumbnailSecureUrl } = props;
    // console.log('knowhow:', JSON.stringify(knowhow, null, 2))

    const getTags = () => {
        if (knowhow && knowhow.tags && knowhow.tags.length > 0) {
            const names = knowhow?.tags?.map((s: any) => s.name);
            return names.join(", ")
        }
        else {
            return '';
        }
    }
    return (<>
        {knowhow && (<div className='d-flex mt-3 gap-2'>
            <div className="card shadow p-3 mb-5 col-2" tabIndex={0}>
                <div className='col-5 p-3'>
                    {thumbnailSecureUrl ?
                        (<> <Image alt={knowhow.title} src={thumbnailSecureUrl} quality={100} fill sizes="100vw" style={{ objectFit: 'contain', }} /></>) :
                        (<> <Image alt={knowhow.title} src={`/images/${knowhow.thumbnailFilename}`} quality={100} fill sizes="100vw" style={{ objectFit: 'contain', }} /></>)}
                </div>
            </div>
            <div className="card shadow p-3 mb-5 col-7">
                <Card.Body>
                    <Card.Title className='text-center fw-bold'>{knowhow?.title}</Card.Title>
                    <div className='text-center card-text'>
                        <div>
                            <span>{knowhow?.KnowhowType?.name}</span><span>{` X ${knowhow?.category.name}`}</span>
                        </div>
                        <div>{knowhow?.description}</div>
                        <div>
                            <span className="me-2">작성자:</span>
                            <span className="me-2">{knowhow?.author?.name}</span>
                        </div>
                        <div>
                            <span className="me-2">태그:</span>
                            <span className="me-2">{getTags()}</span>
                        </div>
                    </div>
                </Card.Body>
                <Card.Footer className='text-center'>
                    <GeneralFooter knowhow={knowhow} session={session} />
                </Card.Footer>
            </div>
        </div>)}
    </>);
};
export default DispGeneral;
