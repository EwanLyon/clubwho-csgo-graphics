import React from 'react';
import styled from 'styled-components';

import { TeamData } from '../../../../types/extra-data';

const Container = styled.div`
	color: #fff;
	margin: 0 20px;
`;

const TextContainer = styled.div`
	display: flex;
	flex-direction: column;
	align-items: ${(props: OnRight): string => (props.right ? 'flex-end' : 'flex-start')};
	margin: 10px 0;
`;

const Title = styled.span`
	font-weight: lighter;
	font-size: 18px;
`;

const Data = styled.span`
	font-weight: bold;
	font-size: 26px;
`;

interface OnRight {
	right?: boolean;
}

interface Props {
	right?: boolean;
	teamData: TeamData;
}

export const TeamEco: React.FC<Props> = (props: Props) => {
	return (
		<Container>
			<TextContainer right={props.right}>
				<Title>TEAM MONEY</Title>
				<Data>
					<span style={{ fontSize: 15 }}>$</span>
					{props.teamData.totalMoney}
				</Data>
			</TextContainer>
			<TextContainer right={props.right}>
				<Title>EQUIPMENT VALUE</Title>
				<Data>
					<span style={{ fontSize: 15 }}>$</span>
					{props.teamData.equipmentValue}
				</Data>
			</TextContainer>
		</Container>
	);
};
