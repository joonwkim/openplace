'use client';
import React from "react";
import { useSession } from "next-auth/react";
/*
섬네일 포함한 간단한정보(깃허브개인정보양식참고해서만들겠음),
프로필 편집,
리뷰,
등록한 경험아이템목록,
참여중인 경험아이템목록
[좌측]
섬네일 | 이름 | 간단소개 | 프로필수정 => 모달 | 소셜계정정보 | 가입한그룹 섬네일작게
[우측]
리뷰점수(크게) | 리뷰자세히보기버튼추가 => 모달 | 등록한 경험아이템목록(폴더블) | 참여중인 경험아이템목록(폴더블)
*/

const MePage = () => {
  const { data: session } = useSession();

  return <>
		<div className="container-fluid">
		  <div className="row content">
		    <div className="col-sm-3">
				<div><img src="..." className="mw-100 rounded"  alt="face"/></div>
				<h2>{session?.user.name}</h2>
				<div><span>introduction</span></div>
				<div><button>Edit profile</button></div>
				<div><span>x: </span></div>
				<div><span>youtube:</span></div>
				<div><span>instagram:</span></div>
			</div>
			<div className="col-sm-9">
			  <div className="well">
				<h4>dashboard: review!</h4>
				<p>some text...</p>
			  </div>
			  <div className="well"><p>list what you created</p></div>
			  <div className="row">
				<div className="col-sm-3"><div className="well"><h4>title</h4><p>text</p></div></div>
				<div className="col-sm-3"><div className="well"><h4>title</h4><p>text</p></div></div>
				<div className="col-sm-3"><div className="well"><h4>title</h4><p>text</p></div></div>
			  </div>
			</div>
		  </div>

		</div>


  </>; 

  // <div> {session?.user.name} </div>;
};

export default MePage;
