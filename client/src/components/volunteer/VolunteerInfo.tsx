import styled from "styled-components";
import Button from "../../components/Button";
import { useEffect, useState } from "react";
import { FcLikePlaceholder, FcLike } from "react-icons/fc";
import { useParams } from "react-router-dom";
import { myPageGet } from "../../api/mypage/MypageGet";
import axios from "axios";
import dayjs from "dayjs";
import { KakaoShareButton } from "../../utils/KakaoShareButton";

const StyledContainerDiv = styled.div`
	width: 100%;
	align-items: center;
	justify-content: center;
	margin: 20px;
	display: flex;
	flex-direction: column;
	min-width: 1035px;

	.volunteerImg {
		border-radius: 10px;
		margin: 50px 20px 20px 20px;
	}

	div {
		> span {
			margin-bottom: 10px;
			font-size: 1.3rem;
			color: #383838;
		}

		h2 {
			color: #383838;
			font-size: 1.8rem;
			margin-bottom: 10px;
		}
	}

	button {
		background-color: white;
		border: 1px solid gray;
		cursor: pointer;
		border-radius: 5px;
	}

	.button-container {
		display: flex;
		width: 290px;
		border: 1px solid gray;
		align-items: center;
		justify-content: center;
		cursor: pointer;
	}
`;
const StyledEmptyLineDiv = styled.div`
	width: 100%;
	height: 50px;
	border-bottom: 3px solid #383838;
	color: #383838;
	font-size: 1.35rem;
	font-weight: 900;
	display: flex;
	justify-content: center;
	align-items: center;
	min-width: 1035px;
`;

const StyledShareContainer = styled.div`
	display: flex;
	flex-direction: column;
	align-items: flex-start;
`;

export default function VolunteerInfo() {
	const params = useParams();
	const [getVolunteerInfoData, setGetVolunteerInfoData] = useState<any>({});
	const [isLike, setIsLike] = useState(false);
	const [shareButton, setShareButton] = useState(false);
	const [myInfoData, setMyInfoData] = useState<any>({});
	const [applicationUserList, setApplicationUserList] = useState<any>([]);
	const [isApplied, setIsApplied] = useState(false);

	useEffect(() => {
		const id = localStorage.getItem(`${params.id}`);
		if (id) {
			setIsLike(JSON.parse(id));
		}
	}, [params.id]);

	const heartHandler = async () => {
		try {
			if (isLike === false) {
				await axios.post(`http://3.35.252.234:8080/likes/${params.id}`, null, {
					headers: {
						Authorization: `${localStorage.getItem("accessToken")}`,
					},
				});
			} else if (isLike === true) {
				await axios.delete(`http://3.35.252.234:8080/likes/${params.id}`, {
					headers: {
						Authorization: `${localStorage.getItem("accessToken")}`,
					},
				});
			}
			setIsLike((prev) => !prev);
			localStorage.setItem(`${params.id}`, JSON.stringify(!isLike));
		} catch (err) {
			console.log(err);
		}
	};
	useEffect(() => {
		const fetchData = async () => {
			myPageGet(`volunteers/${params.id}`).then((res) => setGetVolunteerInfoData(res.volunteer));
			myPageGet("members/me").then((res) => setMyInfoData(res.data));
			myPageGet("apply/member/plan?pageNum=1").then((res) => setApplicationUserList(res.data));
		};
		fetchData();
		if (applicationUserList?.map((el: any) => el.volunteerId === params.id)) {
			setIsApplied(true);
		}
	}, [params.id]);

	const {
		title,
		volunteerImage,
		applyDate,
		volunteerDate,
		volunteerTime,
		applyLimit,
		applyCount,
		place,
		content,
		organizationName,
	} = getVolunteerInfoData;
	const handlePost = async () => {
		try {
			await axios.post(`http://3.35.252.234:8080/apply/${params.id}`, null, {
				headers: {
					Authorization: `${localStorage.getItem("accessToken")}`,
				},
			});
			alert("봉사가 신청되었어요 :)");
			await myPageGet(`volunteers/${params.id}`).then((res) =>
				setGetVolunteerInfoData(res.volunteer),
			);
		} catch (err) {
			alert("이미 신청하셨어요.");
		}
	};

	useEffect(() => {
		const script = document.createElement("script");
		script.src = "https://developers.kakao.com/sdk/js/kakao.js";
		script.async = true;
		document.body.appendChild(script);

		script.onload = () => {
			setShareButton(true);
		};
		return () => {
			document.body.removeChild(script);
		};
	}, []);

	const startDate = dayjs(applyDate).format("YYYY-MM-DD");
	const endDate = dayjs(volunteerDate).subtract(1, "day").format("YYYY-MM-DD");
	const volunDate = dayjs(volunteerDate).format("YYYY-MM-DD");

	return (
		<StyledContainerDiv>
			<section
				style={{
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
				}}
			>
				<img
					className="volunteerImg"
					src={
						volunteerImage
							? volunteerImage
							: "https://main014-bucket.s3.ap-northeast-2.amazonaws.com/profile/pexels-min-an-853168.jpg"
					}
					style={{ width: "500px", height: "400px" }}
					alt="봉사 타이틀 사진"
				/>
				<div style={{ display: "flex", flexDirection: "column", marginLeft: "40px" }}>
					<h2>{title}</h2>
					<span>기관명 : {organizationName}</span>
					<span>
						모집 기간 : {startDate} ~ {endDate}
					</span>
					<span>봉사 일자 : {volunDate}</span>
					<span style={{ width: "350px" }}>봉사 장소 : {place}</span>
					<span>봉사 시간 : {volunteerTime}시간</span>
					<span>
						모집 인원 : {applyCount}명 / {applyLimit}명
					</span>
					<StyledShareContainer>
						<div style={{ display: "flex", alignContent: "center" }}>
							{myInfoData.checkOrg || isApplied ? (
								<Button
									value={myInfoData.checkOrg ? "기업회원은 신청 불가해요!" : "이미 신청하셨어요!"}
									width={250}
									height={50}
									textSize={15}
									radius={5}
									bgColor={"gray"}
								/>
							) : (
								<Button
									onClick={handlePost}
									value="나도 할래!"
									width={250}
									height={50}
									textSize={15}
									radius={5}
								/>
							)}

							<button onClick={heartHandler} style={{ margin: "0px 5px 0px 5px" }}>
								{!isLike ? <FcLikePlaceholder size={40} /> : <FcLike size={40} />}
							</button>
						</div>
						{shareButton && <KakaoShareButton getVolunteerInfoData={getVolunteerInfoData} />}
					</StyledShareContainer>
				</div>
			</section>
			<StyledEmptyLineDiv>활동 정보</StyledEmptyLineDiv>
			<div style={{ height: "400px", margin: "20px" }}>
				<div dangerouslySetInnerHTML={{ __html: content }} style={{ fontSize: "18px" }} />
			</div>
			<StyledEmptyLineDiv>봉사 후기</StyledEmptyLineDiv>
		</StyledContainerDiv>
	);
}
