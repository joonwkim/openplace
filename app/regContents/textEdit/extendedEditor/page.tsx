'use client'
import React, { useEffect, useState } from 'react'
import dynamic from 'next/dynamic';

const ExtendedEditorPage = () => {
    const [extendedEditor, setExtendedEditor] = useState<any>();
  
  useEffect(()=>{
    const dyExtended = dynamic(() => import('@/components/controls/extendedEditor'), { ssr: false, });
    setExtendedEditor(dyExtended);
  },[])
  return (
    <div>{extendedEditor}</div>
  )
}

export default ExtendedEditorPage