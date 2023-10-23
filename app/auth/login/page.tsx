'use client'
import type { Metadata } from 'next'
import Link from "next/link"
import { useState, useEffect, } from 'react'
import { Form, FloatingLabel, Stack } from 'react-bootstrap'
import { useRouter } from 'next/navigation';
import { object, string, ZodType } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import styles from '@/app/auth/page.module.css'
// import Image from 'next/image'
// import getGoogleUrl from '../../utils/getGoogleUrl'
import { NextRequest } from 'next/server'
// import { loginAction } from '@/app/actions/userAction'
import { signIn } from 'next-auth/react'
// import { useSearchParams } from 'next/navigation'
import { SessionForm } from '../types'
import { loginAction } from '@/app/actions/userAction'
import FormContainer from '@/components/controls/formContainer'

const sessionSchema: ZodType<SessionForm> = object({
  email: string({
    required_error: "이메일 주소를 입력하세요.",
  }).email("이메일 형태에 맞게 입력하세요."),
  password: string({
    required_error: "비밀번호를 입력하세요",
  }),
});

export default function LoginPage(req: NextRequest) {

  useEffect(() => {
    try {
      reset({ 'email': '', password: '' })
  
    } catch (error: any) {
      console.log('error:', error)
    }
  
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ ])
  const { register, formState: { errors }, handleSubmit, reset } = useForm<SessionForm>({ resolver: zodResolver(sessionSchema), });
  const [loginError, setLoginError] = useState<string[]>()

  const googleLogin = () => {
    signIn('google', { callbackUrl:'/' })
  }

  async function onSubmit(values: SessionForm): Promise<void> {
    try {
      var result = await loginAction(values)
      if(result ==='user not registered')
      {
        alert('회원 가입하시거나 SNS계정으로 로그인 하세요.')
        return
      }
      if(result ==="password do not match"){
        alert('비밀번호가 일치하지 않습니다.')
        return
      }
      const rslt = await signIn('credentials', {email:values.email, password: values.password, callbackUrl:'/'})      
      reset({ 'email': '' })
    } catch (error: any) {
      alert('관리자에게 문의 하세요:' + JSON.stringify(error))
    }
  }

  return (
    <>
      <FormContainer>
        <form className={styles.loginFom} onSubmit={handleSubmit(onSubmit)}>
          <div className="d-flex flex-row align-items-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-envelope" viewBox="0 0 16 16">
              <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4Zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1H2Zm13 2.383-4.708 2.825L15 11.105V5.383Zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741ZM1 11.105l4.708-2.897L1 5.383v5.722Z" />
            </svg>
            <div className=" ms-2 form-outline flex-fill">
              <FloatingLabel
                label="이메일"
                className={styles.loginLabel}>
                <Form.Control
                  id='email'
                  type='email'
                  {...register("email")}
                />
              </FloatingLabel>
              <p className={styles.registerError}>{errors.email?.message}</p>
            </div>
          </div>
          <div className="d-flex flex-row align-items-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-key" viewBox="0 0 16 16">
              <path d="M0 8a4 4 0 0 1 7.465-2H14a.5.5 0 0 1 .354.146l1.5 1.5a.5.5 0 0 1 0 .708l-1.5 1.5a.5.5 0 0 1-.708 0L13 9.207l-.646.647a.5.5 0 0 1-.708 0L11 9.207l-.646.647a.5.5 0 0 1-.708 0L9 9.207l-.646.647A.5.5 0 0 1 8 10h-.535A4 4 0 0 1 0 8zm4-3a3 3 0 1 0 2.712 4.285A.5.5 0 0 1 7.163 9h.63l.853-.854a.5.5 0 0 1 .708 0l.646.647.646-.647a.5.5 0 0 1 .708 0l.646.647.646-.647a.5.5 0 0 1 .708 0l.646.647.793-.793-1-1h-6.63a.5.5 0 0 1-.451-.285A3 3 0 0 0 4 5z" />
              <path d="M4 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
            </svg>
            <div className=" ms-2 form-outline flex-fill">
              <FloatingLabel
                label="비밀번호"
                className={styles.loginLabel}>
                <Form.Control
                  id='password'
                  type='password'
                  {...register("password")}
                />
              </FloatingLabel>
              {errors.password && (
                <p className={styles.registerError}>{errors.password.message}</p>
              )}
            </div>
          </div>
          <div className=" ms-2 form-outline flex-fill" >
            {loginError && (
              loginError.map((msg, index) => {
                return (
                  <p key={index} className={styles.registerError}>{msg}</p>
                )
              })
            )}
          </div>
          <div className="row">
            <button type="submit" className="btn btn-primary btn-block" >로그인</button>
          </div>
          <div className="row">
            <hr />
          </div>
          <Stack direction="horizontal" gap={3} className='mb-3'>
            <div
              className={styles.loginRegist}>
              <Link href='/auth/register'>
                회원가입
              </Link>
            </div>
            <div className='ms-auto'>
              |
            </div>
            <div className={styles.loginRegist}>
              <Link href='/auth/findpassword'>
                비밀번호 찾기
              </Link>
            </div>
          </Stack>

          <div className="row">
            <hr />
          </div>
          <div className="row">
            <div className="btn btn-success" onClick={googleLogin} role="button">
              <svg className='me-3' xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 48 48">
                <defs>
                  <path id="a" d="M44.5 20H24v8.5h11.8C34.7 33.9 30.1 37 24 37c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.6 4.1 29.6 2 24 2 11.8 2 2 11.8 2 24s9.8 22 22 22c11 0 21-8 21-22 0-1.3-.2-2.7-.5-4z" />
                </defs>
                <clipPath id="b">
                  <use href="#a" overflow="visible" />
                </clipPath>
                <path clipPath="url(#b)" fill="#FBBC05" d="M0 37V11l17 13z" />
                <path clipPath="url(#b)" fill="#EA4335" d="M0 11l17 13 7-6.1L48 14V0H0z" />
                <path clipPath="url(#b)" fill="#34A853" d="M0 37l30-23 7.9 1L48 0v48H0z" />
                <path clipPath="url(#b)" fill="#4285F4" d="M48 48L17 24l-4-3 35-10z" />
              </svg>
              구글계정으로 로그인
            </div>
          </div>
        </form>
      </FormContainer>
    </>

  )
}