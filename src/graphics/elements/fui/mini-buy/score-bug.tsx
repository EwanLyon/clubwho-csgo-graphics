import React from 'react';
import styled from 'styled-components';

import { Map } from '../../../../types/csgo-gsi';
import { Wing } from './wing';

const Container = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
`;

interface Props {
	matchStats: Map;
	teamOneURL: string;
	teamTwoURL: string;
	style?: React.CSSProperties;
}

export const ScoreBug: React.FunctionComponent<Props> = (props: Props) => {
	return (
		<Container style={props.style}>
			<Wing
				teamImageURL={props.teamTwoURL}
				team={props.matchStats.team_t?.name || 'Terrorists'}
				oppositionTeamName={props.matchStats.team_ct?.name || 'Counter-Terrorists'}
				score={props.matchStats.team_t.score.toString()}
			/>
			<Wing
				teamImageURL={props.teamOneURL}
				right
				ct
				team={props.matchStats.team_ct?.name || 'Counter-Terrorists'}
				oppositionTeamName={props.matchStats.team_t?.name || 'Terrorists'}
				score={props.matchStats.team_ct.score.toString()}
			/>
		</Container>
	);
};
