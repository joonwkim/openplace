'use client';
import Image from 'next/image';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import parse from "html-react-parser";
import { useState } from 'react';
import styles from '../page.module.css'

export default function TextEditpage() {
  const [data, setData] = useState<string>("");
  return (
    <main className='container'>
    </main>
  );
}
