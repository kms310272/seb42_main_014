import styled from "styled-components";
import { FaUserCircle } from "react-icons/fa";
import { useEffect, useState } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import Button from "../Button";
import CommentList from "./CommentList";
import { myPageGet } from "../../api/mypage/MypageGet";
import { useParams } from "react-router-dom";
import { volunteerCommentPost } from "../../api/volunteer/volunteerData";
import { CommentDelete } from "../../api/volunteer/volunteerComment";

const StyledContainerDiv = styled.div`
	width: 100%;
	height: auto;
	box-shadow: 0 1px 3px rgba(0, 0, 0, 0.24), 0 1px 2px rgba(0, 0, 0, 0.21);
	display: flex;
	align-items: center;
	flex-direction: column;
	justify-content: center;
	min-width: 1035px;
	margin-top: 30px;
	.answer-input-container {
		display: flex;
		align-items: center;
		width: 100%;
		height: 60px;
		border-radius: 20px;
		justify-content: center;
		min-width: 900px;
	}
	input {
		width: 100%;
		height: 40px;
		border: 2px solid gray;
		border-radius: 20px;
		margin: 20px;
		padding: 20px;
		min-width: 500px;
	}
	.answer-read-container {
		display: flex;
		align-items: center;
		border: 1px solid gray;
		width: 90%;
		border-radius: 20px;
		padding: 20px;
		margin: 20px;
		min-width: 1000px;
	}
`;
const Comment = styled.div`
	width: 90%;
	margin-top: 15px;
`;

const FilterContainer = styled.div`
	display: flex;
	justify-content: flex-end;
	width: 100%;
	input {
		margin-right: 10px;
	}
`;

export default function VolunteerComment(disabled: any) {
	const params = useParams();
	const [reviewList, setReviewList] = useState([]);
	const [comment, setComment] = useState("");
	const [myReviewId, setMyReviewId] = useState("");
	const [ment, setMent] = useState("");
	const [isFilteredReviewChecked, setIsFilteredReviewChecked] = useState("allReview");

	console.log(myReviewId, reviewList);

	const handleComment = (e: any) => {
		setComment(e.target.value);
	};

	useEffect(() => {
		const fetchData = async () => {
			const result = await myPageGet(`reviews/${params.id}`);
			const myComment = await myPageGet(`reviews/my/${params.id}`);
			setReviewList(result.data);
			setMyReviewId(myComment.data.reviewId);
		};
		fetchData();
	}, [params.id]);

	useEffect(() => {
		const fetchData = async () => {
			const result = await myPageGet(`volunteers/${params.id}`);
			setMent(result.volunteer.volunteerStatus);
		};
		fetchData();
	}, [params.id]);

	const handleCommentPost = () => {
		const data = {
			content: comment,
		};
		volunteerCommentPost(`reviews/${params.id}`, data);
		window.location.reload();
	};
	const onRemove = async () => {
		if (window.confirm("이 후기를 삭제 하시겠습니까?")) {
			CommentDelete(`reviews/${myReviewId}`);
		} else {
			alert("취소합니다.");
		}
	};

	const handleMyReviewClick = () => {
		setIsFilteredReviewChecked("myReview");
		setReviewList(reviewList.filter((el) => el.reviewId === myReviewId));
	};

	const handleAllReviewClick = () => {
		setIsFilteredReviewChecked("allReview");
		myPageGet(`reviews/${params.id}`).then((res) => setReviewList(res.data));
	};

	return (
		<>
			<FilterContainer>
				<input
					type="radio"
					id="allReview"
					value={"allReview"}
					name="allReview"
					onClick={handleAllReviewClick}
					checked={isFilteredReviewChecked === "allReview"}
				/>
				<label htmlFor="allReview" style={{ marginRight: "10px" }}>
					모든 후기 조회
				</label>
				<input
					type="radio"
					id="myReview"
					value={"myReview"}
					name="myReview"
					onClick={handleMyReviewClick}
					checked={isFilteredReviewChecked === "myReview"}
				/>
				<label htmlFor="myReview">내가 작성한 후기 조회</label>
			</FilterContainer>
			<StyledContainerDiv>
				<Comment>
					<div className="answer-input-container">
						<FaUserCircle size={40} />
						<input placeholder="봉사 후기를 남겨주세요." value={comment} onChange={handleComment} />
						<Button
							onClick={handleCommentPost}
							value="등록하기"
							width={90}
							height={40}
							radius={10}
							textSize={14}
							bgColor="black"
							iconName={<AiOutlinePlus style={{ marginLeft: "10px" }} />}
						/>
					</div>
				</Comment>
				{reviewList.map((user) => (
					<CommentList
						key={user.id}
						id={user.reviewId}
						time={user.modifiedAt}
						content={user.content}
						memberName={user.memberName}
						onClick={onRemove}
						myId={myReviewId}
						editComment={function (id: any): void {
							throw new Error("Function not implemented.");
						}}
					/>
				))}
			</StyledContainerDiv>
		</>
	);
}
