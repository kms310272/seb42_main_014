import styled from "styled-components";

interface TProps {
	src: string;
	title: string;
	date: string;
	place: string;
	person: string;
	category?: any;
}

export default function Card({ src, title, date, place, person, category }: TProps) {
	const StyledCardContainer = styled.div`
		width: 380px;
		height: 350px;
		background-color: #ffffff;
		border-radius: 20px;
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
		}

		:hover {
			transition-duration: 700ms;
			transform: scale(1.05);
		}
	`;
	return (
		<StyledCardContainer>
			<div className="center">
				<img src={src} alt="카드 이미지" style={{ width: "350px", borderRadius: "10px" }} />
			</div>
			<div style={{ padding: "20px", display: "flex" }}>
				<div style={{ width: "80%" }}>
					<span className="title">{title}</span>
					<span style={{ justifyContent: "center" }}>{category}</span>
					<div>{date}</div>
					<div style={{ display: "flex" }}>
						<span>{place}</span>
					</div>
				</div>
				<div
					style={{
						fontSize: "20px",
						display: "flex",
						justifyContent: "flex-end",
						alignItems: "flex-end",
						width: "20%",
					}}
				>
					{person}
				</div>
			</div>
		</StyledCardContainer>
	);
}
