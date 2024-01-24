'use client';
import React, { forwardRef, useCallback, useImperativeHandle, useRef, useState } from 'react';
import Image from 'next/image';
import { Alert } from 'react-bootstrap';
import { YouTubeData } from '@prisma/client';
import ImgUploader from '@/components/controls/imgUploader';
import { DropzoneOptions } from 'react-dropzone';
import { getYoutubeData } from '@/app/lib/convert';
import styles from '../../page.module.css'

type YTProps = {
  showYtInput: boolean,
  setRegDataToSave: (data: any) => void,
  initialYtData: YouTubeData[],
  editMode: boolean | undefined,
};

type CanHandleSubmit = {
  handleSubmit: () => void;
};

export const Youtube = forwardRef<CanHandleSubmit, YTProps>((props: YTProps, ref) => {

  const { showYtInput, setRegDataToSave, initialYtData, editMode } = props;
  const [embedUrl, setEmbedUrl] = useState('');
  const [url, setUrl] = useState<string>('');
  const [ytData, setYtData] = useState<YouTubeData[]>(initialYtData);
  if (initialYtData === null || undefined) {
    setYtData([]);
  }
  const dragItem = useRef<any>(null);
  const dragOverItem = useRef<any>(null);
  useImperativeHandle(
    ref,
    () => ({
      handleSubmit() {
        setRegDataToSave({ ytData });
      }
    }),
  );

  const handleInputChange = async (e: any) => {
    try {
      const url = e.target.value;
      if (url === ' ') {
        return;
      }
      const yd = await getYoutubeData(url) as YouTubeData;
      if (yd) {
        if (ytData === null || ytData === undefined) {
          setYtData([]);
        }
        setYtData(prev => [...prev, yd]);
      }
    } catch (error) {
      console.log('handle input changed on regiYoutube error');
    }
  };

  const handleSort = () => {
    let _ytdata = [...ytData];
    const draggedItemContent = _ytdata.splice(dragItem.current, 1)[0];
    _ytdata.splice(dragOverItem.current, 0, draggedItemContent);
    dragItem.current = null;
    dragOverItem.current = null;
    setYtData(_ytdata);
    // setYtInfo(_ytdata);
  };

  const handleHide = () => {
    setEmbedUrl('');
  };

  const handleImageClick = (url: string) => {
    setEmbedUrl(url);
  };

  const handleRemove = (indexToDelete: number) => {
    setYtData(ytData.filter((file, i) => i !== indexToDelete));
  };

  return (
    <>
      {/* thumbnail이 등록되야 Darg 할 수 있음 */}
      {showYtInput && (<input className={`border border-primary ${styles.inputDropYt}`}
        value={url}
        type="text"
        name="youtube"
        placeholder="유튜브를 끌어오세요"
        onChange={handleInputChange}
      />)}
      <div>
        {embedUrl ?
          <div>
            <div ><button className='btn btn-primary-outline' type="button" onClick={handleHide}>회면 숨기기</button></div>
            <iframe src={embedUrl} width={854} height={480} title="YouTube video player" allowFullScreen></iframe>
          </div>
          : <div></div>}
      </div>
      <div className='row row-cols-1 row-cols-md-3 row-cols-sm-2 mt-0 g-3'>
        {ytData?.map((item, index) => (
          <div key={index} className={styles.listItem} draggable
            onDragStart={(e) => (dragItem.current = index)} onDragEnter={(e) => (dragOverItem.current = index)} onDragEnd={handleSort} onDragOver={(e) => e.preventDefault()}          >
            <Alert variant="white" onClose={() => handleRemove(index)} dismissible>
              <Image src={item.thumbnailUrl} width={item.thumbnailWidth} height={item.thumbnailHeight} alt={item.watchUrl} onClick={(e) => handleImageClick(item.embedUrl)} />
            </Alert>
          </div>
        ))}
      </div>
    </>
  );

});
Youtube.displayName = "Youtube"
