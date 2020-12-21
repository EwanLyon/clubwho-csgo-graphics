import React from 'react';
import styled from 'styled-components';

import { FitText, Text as FitTextText } from '../../atoms/fit-text';

const Text = styled(FitText)`
	& > ${FitTextText} {
	}
`;

const Container = styled.div`
	background: rgba(0, 0, 0, 0.5);
	height: 64px;
	display: flex;
	align-items: center;
	justify-content: space-between;
	flex-direction: ${(props: OnRightProps): string => (props.right ? 'row-reverse' : 'row')};
`;

const ScoreBox = styled.div`
	height: 100%;
	display: flex;
	justify-content: center;
	background-color: ${(props: CTProps): string => (props.ct ? '#59B9F5' : '#F1CA3D')};
`;

const Score = styled.span`
	font-size: 50px;
	line-height: 63px;
	width: 70px;
	text-align: center;
	color: #fff;
	margin: ${(props: OnRightProps): string => (props.right ? '' : '')};
`;

const SingleGrid = styled.div`
	display: grid;
	justify-items: ${(props: OnRightProps): string => (props.right ? 'left' : 'right')};
	margin: ${(props: OnRightProps): string => (props.right ? '0 20px 0 5px' : '0 5px 0 20px')};
`;

const TeamName = styled(Text)`
	font-weight: lighter;
	font-size: 30px;
	max-width: 500px;
	text-transform: uppercase;
	color: ${(props: CTProps): string => (props.ct ? '#59B9F5' : '#F1CA3D')};
	grid-column: 1;
	grid-row: 1;
`;

const TeamLogo = styled.img`
	height: 50px;
	width: auto;
	margin: 0 10px;
`;

interface OnRightProps {
	right?: boolean;
}

interface CTProps {
	ct?: boolean;
}

interface Props {
	right?: boolean;
	ct?: boolean;
	team: string;
	oppositionTeamName: string;
	score: string;
	teamImageURL: string;
}

export const Wing: React.FunctionComponent<Props> = (props: Props) => {
	return (
		<Container right={props.right}>
			<SingleGrid right={props.right}>
				{/* Super hacky way to get both wings the same width.
				Put an invisible verison of the other team behind it */}
				<TeamName style={{ color: 'rgba(0, 0, 0, 0)' }} text={props.oppositionTeamName} />

				<TeamName ct={props.ct} text={props.team} />
			</SingleGrid>
			<TeamLogo src={props.teamImageURL} />
			<ScoreBox ct={props.ct}>
				<Score right={props.right}>{props.score}</Score>
			</ScoreBox>
		</Container>
	);
};
