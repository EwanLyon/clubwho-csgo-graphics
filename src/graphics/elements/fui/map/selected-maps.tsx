import React from 'react';
import styled, { keyframes, css } from 'styled-components';

import { ExtraMapData } from '../../../../types/map-data';
import { DesktopWindows } from '@material-ui/icons';

const Container = styled.div`
	width: 1004px;
	background: white;
	border: 1px solid white;
	display: flex;
	justify-content: space-evenly;
	align-items: center;
	color: #000;
	padding: 10px;
`;

const SetMap = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
`;

const ServerImage = styled(DesktopWindows)`
	font-size: 50px !important;
	margin-right: 20px;
`;

const TeamImage = styled.img`
	height: 50px;
	margin-right: 10px;
	width: auto;
	margin: 0 auto;
`;

const MapName = styled.span`
	font-size: 40px;
	font-weight: bold;
	margin-left: 10px;
	text-transform: uppercase;
`;

const SingleGrid = styled.div`
	display: grid;
`;

const TextFade = keyframes`
	0%, 50% {
		opacity: 0;
	}
	55%, 100% {
		opacity: 1;
	}
`;

const animationText = css`
	animation: ${TextFade} 10s alternate-reverse infinite both;
`;

const FadeImage1 = styled(TeamImage)`
	${animationText};
	grid-column: 1;
	grid-row: 1;
`;
const FadeImage2 = styled(FadeImage1)`
	animation-direction: alternate;
`;

// Servers can't win games lmao
const FadeServerImage = styled(ServerImage)`
	${animationText};
`;

const FadeText1 = styled(MapName)`
	${animationText};
	grid-column: 1;
	grid-row: 1;
`;

const FadeText2 = styled(FadeText1)`
	animation-direction: alternate;
`;

interface Props {
	mapData: ExtraMapData[];
	teamOneLogo: string;
	teamTwoLogo: string;
	swapTeams?: boolean;
}

export const SelectedMaps: React.FC<Props> = React.memo((props: Props) => {
	if (props.mapData.length === 0) {
		// If no selected maps then show nothing;
		return <React.Fragment></React.Fragment>;
	}

	const selectedMapsMap = props.mapData.map((map, index) => {
		if (map.ban) {
			return undefined;
		}

		const teamImage = map.team === '1' ? props.teamOneLogo : props.teamTwoLogo;
		const mapName = map.map.replace('de_', '');

		let matchScore = '';
		let matchWinnerLogo = teamImage;
		if (typeof map.teamOneScore === 'number' && typeof map.teamTwoScore === 'number') {
			if (map.teamOneScore >= 16 || map.teamTwoScore >= 16) {
				matchScore = props.swapTeams
					? `${map.teamTwoScore}:${map.teamOneScore}`
					: `${map.teamOneScore}:${map.teamTwoScore}`;

				if (map.teamOneScore > map.teamTwoScore) {
					matchWinnerLogo = props.teamOneLogo;
				} else {
					matchWinnerLogo = props.teamTwoLogo;
				}
			}
		}

		return (
			<SetMap key={index}>
				{matchScore === '' || matchWinnerLogo === teamImage ? (
					map.team === 'Server' ? (
						<ServerImage />
					) : (
						<TeamImage src={teamImage} />
					)
				) : (
					<SingleGrid>
						{map.team === 'Server' ? (
							<FadeServerImage />
						) : (
							<FadeImage1 src={teamImage} />
						)}
						<FadeImage2 src={matchWinnerLogo} />
					</SingleGrid>
				)}
				{matchScore === '' ? (
					<MapName>{mapName}</MapName>
				) : (
					<SingleGrid>
						<FadeText1>{mapName}</FadeText1>
						<FadeText2>{matchScore}</FadeText2>
					</SingleGrid>
				)}
			</SetMap>
		);
	});

	return <Container>{selectedMapsMap}</Container>;
});

SelectedMaps.displayName = 'SelectedMaps';
