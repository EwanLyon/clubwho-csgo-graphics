import React from 'react';
import styled from 'styled-components';

import { ScoreBug } from './score-bug';
import { Player } from './player';
import { TeamEco } from './team-eco';
import { Map, CSGOOutputBomb, CSGOOutputAllplayer } from '../../../../types/csgo-gsi';
import { TeamData } from '../../../../types/extra-data';

const Container = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: center;
`;

const PlayerContainer = styled.div`
	background-color: rgba(0, 0, 0, 0.5);
	display: flex;
	justify-conent: space-between;
	align-items: center;
`;

const Sides = styled.div`
	display: flex;
	flex-direction: column;
	align-items: ${(props: Right): string => (props.right ? 'flex-end' : 'flex-start')};

	& > * {
		margin-bottom: 1px;
	}

	& > *:last-child {
		margin-bottom: 0;
	}
`;

interface Right {
	right?: boolean;
}

interface Props {
	matchData: Map;
	allPlayerData: CSGOOutputAllplayer[];
	bombData: CSGOOutputBomb;
	teamOne: TeamData;
	teamTwo: TeamData;
	teamOneURL: string;
	teamTwoURL: string;
	className?: string;
}

export const MiniBuy: React.FC<Props> = (props: Props) => {
	const leftPlayers = props.allPlayerData.map((player) => {
		if (player.team === 'T') {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const extraSettings: any = {};

			if (props.bombData.player) {
				extraSettings.bomb = props.bombData.player === player.steamId;
			}

			return <Player extra={extraSettings} playerData={player} key={player.steamId} />;
		}

		return undefined;
	});

	const rightPlayers = props.allPlayerData.map((player) => {
		if (player.team === 'CT') {
			return <Player right playerData={player} key={player.steamId} />;
		}

		return undefined;
	});

	return (
		<Container className={props.className}>
			<ScoreBug
				matchStats={props.matchData}
				teamOneURL={props.teamOneURL}
				teamTwoURL={props.teamTwoURL}
			/>
			<PlayerContainer>
				<Sides>{leftPlayers}</Sides>
				<TeamEco teamData={props.teamOne} />
				<TeamEco teamData={props.teamTwo} right />
				<Sides right>{rightPlayers}</Sides>
			</PlayerContainer>
		</Container>
	);
};
