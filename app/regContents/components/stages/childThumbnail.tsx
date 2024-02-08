import React from 'react'
import Image from 'next/image';

type ThumbnailProps = {
  title: string,
  src: string,
  onClick: () => void,
  onContextMenu?: (e: any) => void,
}
const ChildThumbnail = (props: ThumbnailProps) => {
  return (
    <div className="card shadow p-3 col-2 project-stage mb-3 btn" onClick={props.onClick} onContextMenu={props.onContextMenu} tabIndex={0}>
      <div className='col-5 p-3 self-container mt-3'>
        <Image alt={props.title} src={props.src} quality={100} fill sizes="100vw" style={{ objectFit: 'contain', }} />
      </div>
    </div>
  )
}

export default ChildThumbnail