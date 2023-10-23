'use client';
import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useLayoutEffect, useRef, useState } from 'react';
import Image from 'next/image';
import styles from '../../page.module.css';
import { YoutubeInfo, getYoutubeData, getWatchUrl, Default } from '../../lib/convert';
import { Alert } from 'react-bootstrap';

type YTProps = {
  videoIds: string[] | undefined,
  thumbnailType: string,
};

export const DispYoutube = (props: YTProps) => {
  const { videoIds, thumbnailType } = props;
  const [embedUrl, setEmbedUrl] = useState('');
  const [url, setUrl] = useState<string>('');
  const [ytdata, setYtData] = useState<YoutubeInfo[]>([]);

  useEffect(() => {
    const fetchData = () => {
      if (videoIds) {
        videoIds.forEach(async id => {
          const url = getWatchUrl(id);
          const yd = await getYoutubeData(url) as YoutubeInfo;
          if (!ytdata.find(s => s.videoId === yd.videoId)) {
            setYtData(s => [...s, yd]);
          }
          // console.log('url', url)
        });
      }
    };
    fetchData();

  }, [videoIds, ytdata]);

  const handleHide = () => {
    setEmbedUrl('');
  };

  const handleImageClick = (url: string) => {
    setEmbedUrl(url);
  };

  return (
    <>
      {ytdata.length > 0 && (<div>
        <h3 className='mt-3'>유튜브</h3>
        <div>
          {embedUrl ?
            <div>
              <div ><button className='btn btn-primary-outline' type="button" onClick={handleHide}>회면 숨기기</button></div>
              <iframe src={embedUrl} width={854} height={480} title="YouTube video player" allowFullScreen></iframe>
            </div>
            : <div></div>}

        </div>
        {ytdata.length > 0 && <div className='ms-3 mb-0'>썸네일을 클릭하시면 비디오를 볼 수 있습니다.</div>}
        <div className='row row-cols-1 row-cols-md-3 row-cols-sm-2 mt-0 g-2'>
          {ytdata.map((item, index) => (
            <div key={index} className={styles.listItem} >
              <Alert variant="white">
                <Image src={item.thumbnails.medium.url} width={item.thumbnails.medium.width} height={item.thumbnails.medium.height} alt={item.videoId} onClick={(e) => handleImageClick(item.embedUrl)} />
              </Alert>
            </div>
          ))}
        </div>
      </div>)}

    </>
  );

};

export default DispYoutube




