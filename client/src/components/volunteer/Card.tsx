import { FcLike } from "react-icons/fc";
import styled from "styled-components";

const StyledCardContainer = styled.div`
	width: 360px;
	height: 440px;
	background-color: #ffffff;
	border-radius: 10px;
	display: flex;
	flex-direction: column;
	justify-content: center;
	cursor: pointer;
	box-shadow: 0 1px 3px rgba(0, 0, 0, 0.24), 0 1px 2px rgba(0, 0, 0, 0.21);
	transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);

	.title {
		font-weight: bold;
		font-size: 21px;
		margin-right: 10px;
	}

	.center {
		display: flex;
		justify-content: center;
		img {
			width: 90%;
			height: 200px;
			border-radius: 10px;
		}
	}

	:hover {
		transition-duration: 700ms;
		transform: scale(1.05);
	}
`;

const StyledCardPersonDiv = styled.div`
	font-size: 20px;
	display: flex;
	justify-content: flex-end;
	align-items: flex-end;
	width: 20%;
`;

const CardContentDiv = styled.div`
	padding: 20px;
	display: flex;
	div {
		margin-bottom: 3px;
	}
`;

interface IProps {
	src?: string;
	title?: string;
	date?: string;
	place?: string;
	person?: string | number;
	category?: React.ReactElement<any, any> | undefined;
	onClick?: React.MouseEventHandler<HTMLDivElement>;
	organizationName?: string;
	like?: number;
}

export default function Card({
	src,
	title,
	date,
	place,
	person,
	category,
	onClick,
	organizationName,
	like,
}: IProps) {
	return (
		<StyledCardContainer onClick={onClick}>
			<div className="center">
				<img src={src} alt="카드 이미지" />
			</div>
			<CardContentDiv>
				<div style={{ width: "80%" }}>
					<div className="title">{title}</div>
					<div>기관명 : {organizationName}</div>
					<div>{`날짜 : ${date.split("T")[0]}`}</div>
					<div style={{ display: "flex" }}>
						<span>{`장소 : ${place}`}</span>
					</div>
					<div style={{ marginRight: "5px" }}>{category}</div>
					<div style={{ display: "flex", alignContent: "center" }}>
						<FcLike size={23} />
						<span style={{ marginLeft: "5px" }}>{like}</span>
					</div>
				</div>
				<StyledCardPersonDiv>{person}</StyledCardPersonDiv>
			</CardContentDiv>
		</StyledCardContainer>
	);
}
