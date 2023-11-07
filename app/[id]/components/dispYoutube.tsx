'use client';
import { useState } from 'react';
import Image from 'next/image';
import styles from '../../page.module.css';
import { YoutubeInfo, } from '../../lib/convert';
import { Alert } from 'react-bootstrap';
import { getYoutubeDataAction } from '@/app/actions/youtubeAction';
import { getYtInfos } from '@/app/lib/arrayLib';

type YTProps = {
  thumbnailType: string,
  ytInfos: YoutubeInfo[],
};

export const DispYoutube = (props: YTProps) => {
  const { ytInfos } = props;
  const [embedUrl, setEmbedUrl] = useState('');
  const [ytdata, setYtData] = useState<YoutubeInfo[]>(ytInfos);

  const handleHide = () => {
    setEmbedUrl('');
  };

  const handleImageClick = (url: string) => {
    setEmbedUrl(url);
  };

  return (
    <>
      {ytdata && ytdata.length > 0 && (<div>
        <h3 className='mt-3'>유튜브</h3>
        {embedUrl &&
          <div>
            <div className='fs-7'><button className='btn btn-primary-outline' type="button" onClick={handleHide}>회면 숨기기</button></div>
            <iframe src={embedUrl} width={854} height={480} title="YouTube video player" allowFullScreen></iframe>
          </div>}
        <div className='row row-cols-1 row-cols-md-3 row-cols-sm-2 mt-0 g-2'>
          {ytdata.map((item, index) => (
            <div key={index} className={styles.listItem} >
              {item.thumbnails !== undefined ? (<> <Alert variant="white">
                <Image src={item.thumbnails?.medium.url} width={item.thumbnails?.medium.width} height={item.thumbnails?.medium.height} alt={item.videoId} onClick={(e) => handleImageClick(item.embedUrl)} />
              </Alert></>) : (<> <h6>대표 이미지가 등록되지 않았습니다.</h6></>)}
            </div>
          ))}
        </div>
        <div className='fs-7 mb-3'>
          {ytdata.length > 0 && <div className='ms-3 mb-0'>썸네일을 클릭하시면 비디오를 볼 수 있습니다.</div>}
        </div>
      </div>)}
    </>
  );

};




