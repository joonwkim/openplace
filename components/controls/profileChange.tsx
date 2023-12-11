'use client'
import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { FloatingLabel, Form } from 'react-bootstrap'
import styles from '../page.module.css';
import { literal, object, string, TypeOf, ZodType } from "zod";
import { ProfileChangeForm, RegisterForm } from '@/app/auth/types';
import { useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";
import { User } from 'next-auth';

const profileChangeSchema: ZodType<ProfileChangeForm> = object({
    name: string({ required_error: "이름을 입력하세요", }).min(3, "이름을 3글자 이상으로 입력하세요."),
    currentPassword: string({ required_error: "비밀번호를 입력하세요", })
        .min(6, "6글자 이상 이전 비밀번호를 입력하세요."),
    newPassword: string({ required_error: "비밀번호를 입력하세요", })
        .min(6, "6글자 이상 새 비밀번호를 입력하세요."),
    newPasswordConfirmation: string({ required_error: "새 비밀번호를 재입력하세요", }).min(6, "위와 동일한 새 비밀번호를 입력하세요."),
}).refine((data: any) => data.newPassword === data.newPasswordConfirmation, {
    message: "새로 입력한 비밀번호가 일치하지 않습니다.",
    path: ["newPasswordConfirmation"],
});

type ChangeProps = {
    user: User,
    setChangeDataToSave: (data: any) => void,
}

export const ProfileChange = forwardRef<any, ChangeProps>((props: ChangeProps, ref) => {

    const { user, setChangeDataToSave } = props;
    const { register, getValues, formState: { errors }, setValue, handleSubmit, reset } = useForm<ProfileChangeForm>({ resolver: zodResolver(profileChangeSchema), });
    const changeFormRef = useRef<any>();
    const [validated, setValidated] = useState(false);

    useEffect(() => {
        if (user && user.name) {
            setValue('name', user?.name)
            setValue('currentPassword', '')
            setValue('newPassword', '')
            setValue('newPasswordConfirmation', '')
        }
    }, [setValue, user])

    useImperativeHandle(
        ref,
        () => ({
            handleSubmit() {
                const values = getValues();
                setChangeDataToSave(values);
                reset({ 'name': '' });
                reset({ 'currentPassword': '' });
                reset({ 'newPassword': '' });
                reset({ 'newPasswordConfirmation': '' });
            }
        }),
    );
    async function onSubmit(values: any) {
    }

    return (
        <div className='d-flex mt-1 gap-2'>
            <div className="card shadow p-3 col-4" tabIndex={0}>
                <h4 className='text-center mb-5'>프로필 사진</h4>
                <div>

                </div>
            </div>
            <div className="card shadow p-3 col-8">
                <form id='profileChangeForm' ref={changeFormRef} className='border p-4' onSubmit={handleSubmit(onSubmit)}>
                    <div className="d-flex flex-row align-items-center mb-1">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="24" fill="currentColor" className="bi bi-person" viewBox="0 0 16 16">
                            <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4Zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10Z" />
                        </svg>
                        <div className=" ms-2 form-outline flex-fill" >
                            <FloatingLabel
                                label="이름/닉네임"
                                className="mb-1">
                                <Form.Control
                                    id='name'
                                    type='text'
                                    {...register("name")}
                                />
                            </FloatingLabel>
                            <p className={styles.registerError}>{errors.name?.message}</p>
                        </div>
                    </div>
                    <div className="d-flex flex-row align-items-center mb-1">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="24" fill="currentColor" className="bi bi-key" viewBox="0 0 16 16">
                            <path d="M0 8a4 4 0 0 1 7.465-2H14a.5.5 0 0 1 .354.146l1.5 1.5a.5.5 0 0 1 0 .708l-1.5 1.5a.5.5 0 0 1-.708 0L13 9.207l-.646.647a.5.5 0 0 1-.708 0L11 9.207l-.646.647a.5.5 0 0 1-.708 0L9 9.207l-.646.647A.5.5 0 0 1 8 10h-.535A4 4 0 0 1 0 8zm4-3a3 3 0 1 0 2.712 4.285A.5.5 0 0 1 7.163 9h.63l.853-.854a.5.5 0 0 1 .708 0l.646.647.646-.647a.5.5 0 0 1 .708 0l.646.647.646-.647a.5.5 0 0 1 .708 0l.646.647.793-.793-1-1h-6.63a.5.5 0 0 1-.451-.285A3 3 0 0 0 4 5z" />
                            <path d="M4 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
                        </svg>
                        <div className=" ms-2 form-outline flex-fill">
                            <FloatingLabel
                                label="현재 비밀번호"
                                className="mb-1">
                                <Form.Control
                                    id='currentPassword'
                                    type='password'
                                    {...register("currentPassword")}
                                />
                            </FloatingLabel>
                            <p className={styles.registerError}>{errors.currentPassword?.message}</p>
                        </div>
                    </div>
                    <div className="d-flex flex-row align-items-center mb-1">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="24" fill="currentColor" className="bi bi-key" viewBox="0 0 16 16">
                            <path d="M0 8a4 4 0 0 1 7.465-2H14a.5.5 0 0 1 .354.146l1.5 1.5a.5.5 0 0 1 0 .708l-1.5 1.5a.5.5 0 0 1-.708 0L13 9.207l-.646.647a.5.5 0 0 1-.708 0L11 9.207l-.646.647a.5.5 0 0 1-.708 0L9 9.207l-.646.647A.5.5 0 0 1 8 10h-.535A4 4 0 0 1 0 8zm4-3a3 3 0 1 0 2.712 4.285A.5.5 0 0 1 7.163 9h.63l.853-.854a.5.5 0 0 1 .708 0l.646.647.646-.647a.5.5 0 0 1 .708 0l.646.647.646-.647a.5.5 0 0 1 .708 0l.646.647.793-.793-1-1h-6.63a.5.5 0 0 1-.451-.285A3 3 0 0 0 4 5z" />
                            <path d="M4 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
                        </svg>
                        <div className=" ms-2 form-outline flex-fill">
                            <FloatingLabel
                                label="변경 비밀번호"
                                className="mb-1">
                                <Form.Control
                                    id='newPassword'
                                    type='password'
                                    {...register("newPassword")}
                                />
                            </FloatingLabel>
                            {errors.newPassword && (
                                <p className={styles.registerError}>{errors.newPassword.message}</p>
                            )}
                        </div>
                    </div>

                    <div className="d-flex flex-row align-items-center mb-1">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="24" fill="currentColor" className="bi bi-repeat" viewBox="0 0 16 16">
                            <path d="M11 5.466V4H5a4 4 0 0 0-3.584 5.777.5.5 0 1 1-.896.446A5 5 0 0 1 5 3h6V1.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384l-2.36 1.966a.25.25 0 0 1-.41-.192Zm3.81.086a.5.5 0 0 1 .67.225A5 5 0 0 1 11 13H5v1.466a.25.25 0 0 1-.41.192l-2.36-1.966a.25.25 0 0 1 0-.384l2.36-1.966a.25.25 0 0 1 .41.192V12h6a4 4 0 0 0 3.585-5.777.5.5 0 0 1 .225-.67Z" />
                        </svg>
                        <div className=" ms-2 form-outline flex-fill">
                            <FloatingLabel
                                label="비밀번호 확인"
                                className="mb-1">
                                <Form.Control
                                    id='newPasswordConfirmation'
                                    type='password'
                                    {...register("newPasswordConfirmation")}
                                />
                            </FloatingLabel>
                            {errors.newPasswordConfirmation && (
                                <p className={styles.registerError}>{errors.newPasswordConfirmation.message}</p>
                            )}
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )

});

ProfileChange.displayName = "ProfileChange"
