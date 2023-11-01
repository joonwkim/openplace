'use client';
import React, { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import Image from 'next/image';
import styles from '../../page.module.css';
import { YoutubeInfo, getWatchUrl, Default } from '../../lib/convert';
import { Alert } from 'react-bootstrap';
import { getYoutubeDataAction } from '@/app/actions/youtubeAction';

type YTProps = {
  videoIds: string[] | undefined,
  thumbnailType: string,
};

export const DispYoutube = (props: YTProps) => {
  const { videoIds, } = props;
  const [embedUrl, setEmbedUrl] = useState('');
  const [ytdata, setYtData] = useState<YoutubeInfo[]>([]);

  const handleHide = () => {
    setEmbedUrl('');
  };

  const handleImageClick = (url: string) => {
    setEmbedUrl(url);
  };

  const getYtData = () => {
    if (videoIds && videoIds.length > 0) {

      videoIds.forEach(async id => {
        const yd = await getYoutubeDataAction(id) as YoutubeInfo;
        if (ytdata.length < videoIds.length) {
          setYtData([...ytdata, yd]);
        }
      });
    }
    return ytdata as YoutubeInfo[];
  };

  return (
    <>
      {videoIds && videoIds.length > 0 && (<div>
        <h3 className='mt-3'>유튜브</h3>
        {embedUrl &&
          <div>
            <div className='fs-7'><button className='btn btn-primary-outline' type="button" onClick={handleHide}>회면 숨기기</button></div>
            <iframe src={embedUrl} width={854} height={480} title="YouTube video player" allowFullScreen></iframe>
          </div>}
        <div className='row row-cols-1 row-cols-md-3 row-cols-sm-2 mt-0 g-2'>
          {getYtData().map((item, index) => (
            <div key={index} className={styles.listItem} >
              <Alert variant="white">
                {item.thumbnails !== undefined ? (<Image src={item.thumbnails.medium.url} width={item.thumbnails.medium.width} height={item.thumbnails.medium.height} alt={item.videoId} onClick={(e) => handleImageClick(item.embedUrl)} />) : (
                  <h6>대표 이미지가 등록되지 않았습니다.</h6>
                )}
              </Alert>
            </div>
          ))}
        </div>
        <div className='fs-7 mb-3'>
          {videoIds.length > 0 && <div className='ms-3 mb-0'>썸네일을 클릭하시면 비디오를 볼 수 있습니다.</div>}
        </div>
      </div>)}
    </>
  );

};

export default DispYoutube




