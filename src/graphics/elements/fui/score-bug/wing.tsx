import React from 'react';
import styled from 'styled-components';

import { FitText, Text as FitTextText } from '../../atoms/fit-text';

const Text = styled(FitText)`
	& > ${FitTextText} {
	}
`;

const Container = styled.div`
	height: 70px;
	display: flex;
	align-items: center;
	justify-content: space-between;
	flex-direction: ${(props: Both): string => (props.right ? 'row-reverse' : 'row')};
	border: 1px solid ${(props: Both): string => (props.ct ? '#59B9F5' : '#F1CA3D')};
	border-right: ${(props: Both): string => (props.right ? '' : 'none')};
	border-left: ${(props: Both): string => (props.right ? 'none' : '')};
	box-shadow: inset 0 0 10px ${(props: Both): string => (props.ct ? '#59B9F5' : '#F1CA3D')};

	background-image: radial-gradient(rgba(255, 255, 255, 0.5) 1px, rgba(10, 0, 20, 0.8) 0px);
	background-size: 40px 40px;
	background-position: 0 -6px;
`;

const Score = styled.span`
	font-size: 64px;
	width: 72px;
	text-align: center;
	color: ${(props: Both): string => (props.ct ? '#59B9F5' : '#F1CA3D')};
	text-shadow: 0 0 5px ${(props: Both): string => (props.ct ? '#59B9F5' : '#F1CA3D')};
	margin: ${(props: Both): string => (props.right ? '0 39px 0 0' : '0 0 0 39px')};
`;

const SingleGrid = styled.div`
	display: grid;
`;

const TeamName = styled(Text)`
	font-weight: lighter;
	font-size: 47px;
	max-width: 500px;
	text-transform: uppercase;
	color: ${(props: CTProps): string => (props.ct ? '#59B9F5' : '#F1CA3D')};
	text-shadow: 0 0 5px ${(props: Both): string => (props.ct ? '#59B9F5' : '#F1CA3D')};
	grid-column: 1;
	grid-row: 1;
`;

const TeamLogo = styled.img`
	height: 50px;
	width: auto;
	margin: ${(props: OnRightProps): string => (props.right ? '0 22px 0 49px' : '0 49px 0 22px')};
	grid-column: 1;
	grid-row: 1;
`;

const matchWinsSize = 15;
const MatchWinsBox = styled.div`
	height: 100%;
	width: ${matchWinsSize}px;
	margin: 0 15px;
	display: flex;
	flex-direction: column;
	justify-content: space-evenly;
	align-items: center;
`;

const MatchWins = styled.div`
	width: ${matchWinsSize}px;
	height: ${matchWinsSize}px;
	background: ${(props: MatchWin): string =>
		props.win ? (props.ct ? '#59B9F5' : '#F1CA3D') : ''};
	border: 1px solid ${(props: MatchWin): string => (props.ct ? '#59B9F5' : '#F1CA3D')};
	box-shadow: ${(props: MatchWin): string =>
		props.win ? `0 0 10px ${props.ct ? '#59B9F5' : '#F1CA3D'}` : 'none'};
`;

interface MatchWin extends CTProps {
	win?: boolean;
}

interface OnRightProps {
	right?: boolean;
}

interface CTProps {
	ct?: boolean;
}

interface Both extends CTProps, OnRightProps {}

interface Props {
	right?: boolean;
	ct?: boolean;
	team: string;
	oppositionTeamName: string;
	score: string;
	teamImageURL: string;
	oppositionTeamImageURL: string;
	matchesWonThisSeries: number;
}

export const Wing: React.FunctionComponent<Props> = React.memo((props: Props) => {
	return (
		<Container right={props.right} ct={props.ct}>
			<SingleGrid>
				{/* Super hacky way to get both wings the same width.
				Put an invisible verison of the other team behind it */}
				<TeamLogo src={props.teamImageURL} right={props.right} />
				<TeamLogo
					src={props.oppositionTeamImageURL}
					right={props.right}
					style={{ opacity: 0 }}
				/>
			</SingleGrid>

			<SingleGrid>
				{/* Super hacky way to get both wings the same width.
				Put an invisible verison of the other team behind it */}
				<TeamName
					style={{ color: 'rgba(0, 0, 0, 0)', textShadow: 'none' }}
					text={props.oppositionTeamName}
				/>

				<TeamName ct={props.ct} text={props.team} />
			</SingleGrid>

			<Score right={props.right} ct={props.ct}>
				{props.score}
			</Score>
			<MatchWinsBox>
				<MatchWins win={props.matchesWonThisSeries >= 1} ct={props.ct} />
				<MatchWins win={props.matchesWonThisSeries >= 2} ct={props.ct} />
			</MatchWinsBox>
		</Container>
	);
});

Wing.displayName = 'ScoreBugWing';
