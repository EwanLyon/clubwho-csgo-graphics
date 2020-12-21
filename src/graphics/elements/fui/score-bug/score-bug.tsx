import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import gsap from 'gsap';

import { stateType } from '../../../replicant-store';

import { FitText, Text as FitTextText } from '../../atoms/fit-text';
import Grid from '@material-ui/core/Grid';
import { Wing } from './wing';
import { Time } from './time';
import { BombPlanted } from './bomb-planted';

const Text = styled(FitText)`
	& > ${FitTextText} {
	}
`;

const Container = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
`;

const Hub = styled.div`
	color: #fff;
	width: 115px;
	height: 94px;
	background-size: 13px 13px;
	z-index: 1;
	display: flex;
	justify-content: center;
	align-items: center;
	flex-direction: column;
`;

const Round = styled(Text)`
	font-size: 25px;
`;

const OTText = styled(Round)`
	max-width: 52px;
`;

const BombPlantedStyled = styled(BombPlanted)`
	position: absolute;
	top: 135px;
`;

interface Props {
	style?: React.CSSProperties;
}

const bombConditions = ['planting', 'planted', 'defusing', 'defused', 'exploded'];
const bombShowPos = 110;
const bombHidePos = 40;

export const ScoreBug: React.FunctionComponent<Props> = (props: Props) => {
	const bomb = useSelector((state: stateType) => state.bomb);
	const phase = useSelector((state: stateType) => state.phase);
	const matchStats = useSelector((state: stateType) => state.matchStats);
	const teamOne = useSelector((state: stateType) => state.teamOne);
	const teamTwo = useSelector((state: stateType) => state.teamTwo);
	const swapTeams = useSelector((state: stateType) => state.swapTeams);
	const allPlayers = useSelector((state: stateType) => state.allPlayers);

	const [playerKit, setPlayerKit] = useState(false);
	const time = parseFloat(phase.phase_ends_in);
	const tl = useRef<gsap.core.Timeline>();
	const bombElement = useRef<HTMLDivElement>(null);
	const [playerName, setPlayerName] = useState('');
	const [animating, setAnimating] = useState(false);
	const [currentRound, setCurrentRound] = useState(0);

	let roundWinner;
	if (phase.phase === 'over') {
		roundWinner = matchStats.round_wins[`${matchStats.round}`][0];
	}

	const ct =
		currentRound > 14
			? currentRound >= 30
				? Boolean(Math.floor((currentRound - 30) / 3) % 2)
				: true
			: false;

	let otText: JSX.Element | null = null;
	if (matchStats.round >= 30) {
		otText = (
			<div
				style={{
					fontSize: 25,
					display: 'flex',
					justifyContent: 'space-around',
					width: 102,
				}}>
				<OTText
					text={`OT${Math.ceil((matchStats.round - 29) / 6)}`}
					style={{ fontStyle: 'italic' }}
				/>
				<OTText text={`${matchStats.round - 29 - ~~((matchStats.round - 30) / 6) * 6}/6`} />
			</div>
		);
	}

	let hubColour = 'rgb(53, 53, 53)';
	let borderColour = '#fff';
	if (phase.phase === 'bomb') {
		hubColour = 'rgb(128, 1, 4)';
		borderColour = 'rgba(255, 0, 0, 1)';
	} else if (roundWinner) {
		if (roundWinner === 't') {
			hubColour = 'rgb(73, 62, 20)';
			borderColour = '#f1ca3d';
		} else {
			hubColour = 'rgb(29, 59, 7)';
			borderColour = '#59b9f5';
		}
	}

	const bombAnimation = (stage: string): void => {
		if (tl && tl.current) {
			const currentTime = tl.current.time();
			const labelTime = tl.current.labels[stage];
			console.log('current time', currentTime);

			tl.current.resume();
			if (currentTime >= labelTime) {
				console.log('jumping to ' + stage, labelTime);
				tl.current.play(labelTime);
			} else {
				console.log('tweening to ' + stage, labelTime);
				gsap.to(tl.current, {
					duration: 0.3,
					time: labelTime,
					ease: 'none',
					onComplete: () => {
						if (tl && tl.current) {
							tl.current.resume();
						}
					},
				});
			}
		}
	};

	useEffect(() => {
		// No bomb in warmup
		if (bomb === undefined) {
			return;
		}

		if (animating && ['carried', 'planted'].includes(bomb.state)) {
			setAnimating(false);
		}

		if (bomb.state === 'defusing') {
			const player = allPlayers.find((player) => player.steamId === bomb.player);
			if (player) {
				setPlayerName(player.name);
				setPlayerKit(Boolean(player.state.defusekit));
			}
		}

		if (bomb.state === 'planting') {
			const player = allPlayers.find((player) => player.steamId === bomb.player);
			if (player) {
				setPlayerName(player.name);
			}

			if (!animating) {
				setAnimating(true);
				bombAnimation('ShowBomb');
			}
		} else if (bomb.state === 'exploded' || bomb.state === 'defused') {
			if (!animating) {
				setAnimating(true);
				bombAnimation('HideBomb');
			}
		}
	}, [animating, allPlayers, bomb]);

	// Create timeline
	useEffect(() => {
		tl.current = gsap.timeline({ paused: true });

		// Console.log('instantiating timeline');

		tl.current.addLabel('ShowBomb');

		tl.current.set(bombElement.current, { top: bombHidePos, opacity: 0 });
		tl.current.to(bombElement.current, { top: bombShowPos, opacity: 1 });

		tl.current.addPause('+=0.1');

		tl.current.addLabel('HideBomb');

		tl.current.set(bombElement.current, { top: bombShowPos, opacity: 1 });
		tl.current.to(bombElement.current, { top: bombHidePos, opacity: 0 });
	}, []);

	useEffect(() => {
		if (phase.phase === 'freezetime' && currentRound !== matchStats.round) {
			setCurrentRound(matchStats.round);
		}
	}, [currentRound, matchStats.round, phase.phase]);

	return (
		<Container style={props.style}>
			<Grid
				container
				direction={swapTeams ? 'row-reverse' : 'row'}
				justify="center"
				alignItems="center">
				<Wing
					teamImageURL={teamOne.teamURL}
					oppositionTeamImageURL={teamTwo.teamURL}
					ct={ct}
					right={swapTeams}
					team={teamOne.name}
					oppositionTeamName={teamTwo.name}
					score={teamOne.score.toString()}
					matchesWonThisSeries={teamOne.matchesWonThisSeries}
				/>
				<Hub
					style={{
						backgroundImage: `linear-gradient(to right, ${hubColour} 1px, transparent 1px),
		linear-gradient(to bottom, ${hubColour} 1px, #000 1px)`,
						border: `1px solid ${borderColour}`,
						boxShadow: `inset 0 0 10px ${borderColour}`,
					}}>
					<Time phase={phase.phase} time={time} roundWin={roundWinner} />
					{otText ? otText : <Round text={`${currentRound + 1}/30`} />}
				</Hub>
				<Wing
					teamImageURL={teamTwo.teamURL}
					oppositionTeamImageURL={teamOne.teamURL}
					ct={!ct}
					right={!swapTeams}
					team={teamTwo.name}
					oppositionTeamName={teamOne.name}
					score={teamTwo.score.toString()}
					matchesWonThisSeries={teamTwo.matchesWonThisSeries}
				/>
			</Grid>
			<BombPlantedStyled
				phase={bomb?.state || 'carried'}
				playerName={playerName || ''}
				kit={bomb?.state === 'defusing' ? playerKit : false}
				ref={bombElement}
				style={bombConditions.includes(bomb?.state) ? {} : { display: 'none' }}
			/>
		</Container>
	);
};
