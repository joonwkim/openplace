'use client';
import { Container, FloatingLabel, Form, Nav, Navbar, Overlay, Popover } from 'react-bootstrap';
import { FaSignInAlt, FaSignOutAlt, FaUser } from "react-icons/fa";
import Image from 'next/image';
import { useRouter, } from 'next/navigation';
import { useSession, signIn, signOut } from 'next-auth/react';
import { useRef, useState } from 'react';
import SearchBar from './controls/searchBar';
import { ProfileChange } from './controls/profileChange';
import { updateProfileAction } from '@/app/actions/userAction';
interface Props {

}

const Header = () => {

  const { data: session } = useSession();
  const [search, setSearch] = useState('');
  const [showOverlay, setShowOverlay] = useState(false);
  const [overlayTarget, setOverlayTarget] = useState(null);
  const router = useRouter();
  const ref = useRef(null);
  const profileChangeRef = useRef<any>(null);

  const handleSignIn = (e: any) => {
    e.preventDefault();
    signIn();
  };

  const handleCancelBtnClicked = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
    setSearch('');
    router.push('/');
  };

  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.key === 'Enter' || e.key === ' ') {
      router.push(`/?searchText=${search}`);
    }
  };

  const handleShowMyKnowhow = () => {
    router.push(`/?myhome=registered&id=${session?.user.id}`);
  }
  const handleShowKnowhowsPaticipate = () => {
    router.push(`/?myhome=paticipated&id=${session?.user.id}`);
  }

  const handleUserIconOrNameClick = (event: any) => {
    setShowOverlay(!showOverlay);
    setOverlayTarget(event.target);
  };

  const handleSaveProfile = () => {
    profileChangeRef.current.handleSubmit();
  }
  const saveProfileChanged = async (data: any) => {
    const result = await updateProfileAction(session?.user, data)
    if (result === "password do not match") {
      alert('비밀번호가 일치하지 않습니다.')
    } else {
      alert('프로필이 변경되었습니다.')
    }
    router.push(`/`);
  }

  return (<>
    <Navbar bg="dark" variant='dark' expand="lg" collapseOnSelect>
      <Container>
        <Navbar.Brand href="/">
          {'오픈플레이스홈'}
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link href="/?category=놀기">놀기</Nav.Link>
            <Nav.Link href="/?category=배우기">배우기</Nav.Link>
            <Nav.Link href="/?category=만들기">만들기</Nav.Link>
          </Nav>
          <Nav className="ms-2 me-2">
            <SearchBar value={search} placeholder='Search...' handleChange={(e) => setSearch(e.target.value)} onKeyUp={handleKeyUp}
              handleCancelBtnClick={handleCancelBtnClicked} />
          </Nav>
          <Nav className="ms-2 me-2">
            <Nav.Link href="/email">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="white" className="bi bi-envelope" viewBox="0 0 16 16">
                <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4Zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1H2Zm13 2.383-4.708 2.825L15 11.105V5.383Zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741ZM1 11.105l4.708-2.897L1 5.383v5.722Z" />
              </svg>
            </Nav.Link>
            <Nav.Link href="/notification">
              {session?.user.notificationCount > 0 ? (<button type="button" className="btn position-relative">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="white" className="bi bi-bell" viewBox="0 0 16 16">
                  <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2zM8 1.918l-.797.161A4.002 4.002 0 0 0 4 6c0 .628-.134 2.197-.459 3.742-.16.767-.376 1.566-.663 2.258h10.244c-.287-.692-.502-1.49-.663-2.258C12.134 8.197 12 6.628 12 6a4.002 4.002 0 0 0-3.203-3.92L8 1.917zM14.22 12c.223.447.481.801.78 1H1c.299-.199.557-.553.78-1C2.68 10.2 3 6.88 3 6c0-2.42 1.72-4.44 4.005-4.901a1 1 0 1 1 1.99 0A5.002 5.002 0 0 1 13 6c0 .88.32 4.2 1.22 6z" />
                </svg>
                <span className="position-absolute top-0 start-90 translate-middle badge rounded-pill bg-danger">
                  {session?.user.notificationCount}
                  <span className="visually-hidden">unread messages</span>
                </span>
              </button>) : (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="white" className="bi bi-bell" viewBox="0 0 16 16">
                <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2zM8 1.918l-.797.161A4.002 4.002 0 0 0 4 6c0 .628-.134 2.197-.459 3.742-.16.767-.376 1.566-.663 2.258h10.244c-.287-.692-.502-1.49-.663-2.258C12.134 8.197 12 6.628 12 6a4.002 4.002 0 0 0-3.203-3.92L8 1.917zM14.22 12c.223.447.481.801.78 1H1c.299-.199.557-.553.78-1C2.68 10.2 3 6.88 3 6c0-2.42 1.72-4.44 4.005-4.901a1 1 0 1 1 1.99 0A5.002 5.002 0 0 1 13 6c0 .88.32 4.2 1.22 6z" />
              </svg>)}
            </Nav.Link>
            <Nav.Link href="/regContents"> <button className="btn btn-outline-danger ms-2" type="submit" title='notification'>등록하기</button></Nav.Link>
          </Nav>

          {session && session.user ? (
            <Nav className="ms-auto" title={session?.user.name}>
              {session.user.image ? (<Nav.Link ref={ref} onClick={handleUserIconOrNameClick}>
                <Image id="userpicture" style={{ borderRadius: '50%' }} unoptimized src={session.user.image} alt={session.user.email} width="30" height="30" />
                <Overlay show={showOverlay} target={ref} placement="left" container={ref} containerPadding={20}>
                  <Popover id="popover-contained">
                    <Popover.Header className='bg-dark text-center' as="h3">마이 홈</Popover.Header>
                    <Popover.Body>
                      {session.user.googleLogin ? <div className="text-center" data-bs-toggle="modal" data-bs-target="#staticBackdropForProfileChange">내 정보 수정</div> : <></>}
                      <div className='text-center' onClick={handleShowMyKnowhow}>내가 등록한 컨텐츠 보기</div>
                      <div className='text-center' onClick={handleShowKnowhowsPaticipate}>내가 참여중인 컨텐츠 보기</div>
                    </Popover.Body>
                  </Popover>
                </Overlay>
              </Nav.Link>) :
                (<Nav.Link ref={ref} onClick={handleUserIconOrNameClick}> {session.user.name}
                  <Overlay show={showOverlay} target={ref} placement="left" container={ref} containerPadding={20}                  >
                    <Popover id="popover-contained">
                      <Popover.Header className='bg-dark text-center' as="h3">마이 홈</Popover.Header>
                      <Popover.Body>
                        {!session.user.googleLogin ? <div className="text-center" data-bs-toggle="modal" data-bs-target="#staticBackdropForProfileChange">내 정보 수정</div> : <></>}
                        <div className='text-center' onClick={handleShowMyKnowhow}>내가 등록한 컨텐츠 보기</div>
                        <div className='text-center' onClick={handleShowKnowhowsPaticipate}>내가 참여중인 컨텐츠 보기</div>
                      </Popover.Body>
                    </Popover>
                  </Overlay>
                </Nav.Link>)
              }
              <Nav.Link href="/" onClick={(e) => { e.preventDefault(); signOut(); }}>  <FaSignOutAlt /> Logout</Nav.Link>
            </Nav>
          ) : (<Nav className="ms-auto">
            <Nav.Link href="/auth/login" onClick={(e) => handleSignIn(e)}><FaSignInAlt />로그인</Nav.Link>
            <Nav.Link href="/auth/register"> <FaUser />회원가입</Nav.Link>
          </Nav>)}
        </Navbar.Collapse>
      </Container>
    </Navbar>

    <div className="modal modal-lg fade" id="staticBackdropForProfileChange" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex={-1} aria-labelledby="staticBackdropForProfileChangeLabel" aria-hidden="true">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h3 className="modal-title" id="staticBackdropForProfileChangeLabel">내 정보 수정</h3>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div className="modal-body">
            <ProfileChange ref={profileChangeRef} user={session?.user} setChangeDataToSave={saveProfileChanged} />
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">취소</button>
            <button type="submit" form="profileChangeForm" className="btn btn-primary" data-bs-dismiss="modal" onClick={handleSaveProfile} >저장</button>
          </div>
        </div>
      </div>
    </div>
  </>

  );
};

export default Header;


