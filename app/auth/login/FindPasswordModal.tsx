// components/FindPasswordModal.tsx
import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { useForm } from "react-hook-form";
import './FindPasswordModal.css';

interface FindPasswordModalProps {
  show: boolean;
  handleClose: () => void;
}

interface FormData {
  email: string;
}

const FindPasswordModal: React.FC<FindPasswordModalProps> = ({ show, handleClose }) => {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();

  const [generatedPassword, setGeneratedPassword] = useState('');

  const generatePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const passwordLength = Math.floor(Math.random() * 3) + 8; // 8~10 사이의 길이
    let password = '';
    for (let i = 0; i < passwordLength; i++) {
      const randomIndex = Math.floor(Math.random() * chars.length);
      password += chars[randomIndex];
    }
    return password;
  };

  const onGeneratePassword = () => {
    const newPassword = generatePassword();
    setGeneratedPassword(newPassword);
  };

  const modifiedHandleClose = () => {
    setGeneratedPassword(''); // 비밀번호 초기화
    handleClose(); // 원래의 handleClose 함수 호출
  }

  const onSubmit = (data: FormData) => {
    console.log(data);
    handleClose();
  };

  return (
    <Modal show={show} onHide={modifiedHandleClose} className="custom-modal">
      <Modal.Header closeButton>
        <Modal.Title className='modal-title'>비밀번호 찾기</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Form.Group controlId="formBasicEmail">
            <Form.Label className='modal-label'>이메일 주소</Form.Label>
            <Form.Control type="email" placeholder="이메일을 입력하세요" {...register("email", { required: true })} />
            {errors.email && <span className="text-danger">이메일을 입력해주세요.</span>}
          </Form.Group>
          <Button className='password-btn' onClick={onGeneratePassword}>
            비밀번호 발급
          </Button>
          {generatedPassword && <div className='generated-password'>생성된 비밀번호: {generatedPassword}</div>}
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default FindPasswordModal;
