'use client'
import React, { useEffect, useState } from 'react'
import dynamic from 'next/dynamic';

const SimpleEditorPage = () => {
  const [simpleEditor, setSimpleEditor] = useState<any>();
  
  useEffect(()=>{
    const dySimple = dynamic(() => import('@/components/controls/simpleEditor'), { ssr: false, });
    setSimpleEditor(dySimple);
  },[])
  return (
    <div>{simpleEditor}</div>
  )
}

export default SimpleEditorPage