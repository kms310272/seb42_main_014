import axios from "axios";
import styled from "styled-components";

interface ItemProps {
	title: string;
	time: string;
	id: string;
}

const Container = styled.div`
	display: flex;
	justify-content: space-between;
	margin-bottom: 5px;

	& > div:first-child {
		width: 140px;
	}
	button {
		color: #ffffff;
		background-color: #000000;
		border-radius: 30px;
		padding: 2px 20px;
	}
`;

export default function OrgVolItem1(props: ItemProps) {
	const date = props.time.split("T")[0];
	const apiUrl = `http://3.35.252.234:8080/volunteers/${props.id}`;

	const onRemove = () => {
		if (window.confirm("이 작업이 수행되면 게시글이 삭제 됩니다.")) {
			axios
				.delete(apiUrl, {
					headers: {
						Authorization: `${localStorage.getItem("accessToken")}`,
					},
				})
				.then(() => {
					alert("삭제되었습니다.");
				})
				.catch((error) => {
					console.error(error);
					alert("삭제에 실패했습니다.");
				});
		} else {
			alert("취소합니다.");
		}
	};
	return (
		<>
			<Container>
				<div>{props.title}</div>
				<div>게시일 :{date}</div>
				<div>
					<button onClick={onRemove}>삭제하기</button>
				</div>
			</Container>
		</>
	);
}
