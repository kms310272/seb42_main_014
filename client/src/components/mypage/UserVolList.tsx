import axios from "axios";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { myPageGet } from "../../api/mypage/MypageGet";
import Paginations from "../Pagination";
import UserVolItem1 from "./UserVolItem1";
import UserVolItem2 from "./UserVolItem2";

const Container = styled.div`
	background-color: #ffffff;
	display: flex;
	flex-direction: column;
	width: 100%;
	box-shadow: 0px 0px 10px 1px #dbdbdb;
	border-radius: 10px;
	padding: 20px 40px;
	margin-bottom: 30px;
	h2 {
		font-size: 1.3rem;
	}
	li {
		list-style-type: none;
	}
	& > div:first-child {
		border-bottom: 1px solid #000000;
	}
`;

export default function UserVolList() {
	const [totalPages, setTotalPages] = useState<number>(0);
	const [currentPage, setCurrentPage] = useState<number>(1);
	const [totalPages1, setTotalPages1] = useState<number>(0);
	const [currentPage1, setCurrentPage1] = useState<number>(1);
	const [Vol, setVol] = useState<any[]>([]);
	const [history, setHistory] = useState<any[]>([]);

	const handlePageChange = (pageNumber: number) => {
		setCurrentPage(pageNumber);
	};
	const handlePageChange1 = (pageNumber: number) => {
		setCurrentPage1(pageNumber);
	};
	useEffect(() => {
		const fetchData = async () => {
			const plan = await myPageGet(`apply/member/plan?pageNum=${currentPage}`);
			const pageUrl = await myPageGet(`apply/member/plan?pageNum=1`);
			setTotalPages(pageUrl.data.length * plan.totalPages);

			setVol(plan.data);
		};
		fetchData();
	}, [currentPage, totalPages]);

	useEffect(() => {
		const fetchData = async () => {
			const history = await myPageGet(`apply/my/history?pageNum=${currentPage1}`);
			const pageUrl = await myPageGet(`apply/my/history?pageNum=1`);
			setHistory(history.data);
			setTotalPages1(pageUrl.data.length * history.totalPages);
		};
		fetchData();
	}, [currentPage1]);

	const deleteItem = async (id: number) => {
		try {
			const response = await axios.patch(`http://3.35.252.234:8080/apply/${id}`, null, {
				headers: {
					Authorization: `${localStorage.getItem("accessToken")}`,
				},
			});
			const plan = await myPageGet(`apply/member/plan?pageNum=${currentPage}`);
			const pageUrl = await myPageGet(`apply/member/plan?pageNum=1`);
			setTotalPages(pageUrl.data.length * plan.totalPages);
			setVol(plan.data);
		} catch (err) {
			alert("봉사 취소에 실패했어요. 잠시 후 다시 시도해 주세요.");
		}
	};

	return (
		<>
			<Container>
				<div>
					<h2>나의 봉사 활동 내역</h2>
					<div>
						{history.length ? (
							history.map((v) => (
								<>
									<li key={v.id}>
										<UserVolItem1
											title={v.volunteerName}
											time={v.volunteerDate}
											id={v.volunteerId}
										/>
									</li>
								</>
							))
						) : (
							<p>신청한 봉사가 없습니다.</p>
						)}
					</div>
					{history.length ? (
						<Paginations
							totalPages={totalPages1}
							currentPage={currentPage1}
							onPageChange={handlePageChange1}
							itemsCountPerPage={5}
						/>
					) : null}
				</div>
				<div>
					<h2>봉사 활동 신청 현황</h2>
					<div>
						{Vol.length ? (
							Vol.map((v) => (
								<li key={v.likeId}>
									<UserVolItem2
										deleteItem={deleteItem}
										id={v.volunteerId}
										title={v.volunteerName}
										time={v.volunteerDate}
									/>
								</li>
							))
						) : (
							<p>신청한 봉사가 없습니다.</p>
						)}
					</div>
				</div>
				{Vol.length ? (
					<Paginations
						totalPages={totalPages}
						currentPage={currentPage}
						onPageChange={handlePageChange}
						itemsCountPerPage={5}
					/>
				) : null}
			</Container>
		</>
	);
}
