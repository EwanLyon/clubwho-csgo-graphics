import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { stateType } from '../../../replicant-store';

import { ProgressBarBox } from '../../atoms/progress-bar-box';

const Container = styled.div`
	width: 654px;
	height: 50px;
	display: flex;
	align-items: center;
	justify-content: center;
	box-shadow: inset 0 0 10px 4px #eebe11;
	border: 1px solid #eebe11;
	background: rgba(0, 0, 0, 0.5);
`;

const PlantTimer = styled(ProgressBarBox)`
	width: 630px;
	height: 22px;
`;

const BombTimer = styled(PlantTimer)`
	position: absolute;
	background: rgba(0, 0, 0, 0.5);
`;

const DefuseTimer = styled(BombTimer)`
	z-index: 1;
	border: none;
`;

const PlayerText = styled.span`
	color: #fff;
	position: absolute;
	left: ${(props: HasKit): string => (props.kit ? '38' : '16')}px;
	top: 15.7px;
	z-index: 2;
`;

const TenSecondMark = styled.div`
	position: absolute;
	top: 12px;
	left: ${(630 / 40) * (40 - 10)}px;
	height: 26px;
	width: 3px;
	background-color: #fff;
`;

const KitImage = styled.img`
	position: absolute;
	left: 16px;
	top: 18px;
	width: 16px;
	height: auto;
	z-index: 1;
`;

interface HasKit {
	kit?: boolean;
}

interface Props {
	phase: string;
	playerName: string;
	className?: string;
	kit?: boolean;
	ref?: React.Ref<HTMLDivElement>;
	style?: React.CSSProperties;
}

// Const conditions = ['planting', 'planted', 'defusing'];

const playerConditions = ['planting', 'defusing'];

function addSeconds(dateMS: number, seconds: number): number {
	return dateMS + seconds * 1000;
}

export const BombPlanted: React.FC<Props> = React.forwardRef(
	// eslint-disable-next-line complexity
	(props: Props, ref: React.Ref<HTMLDivElement>) => {
		const gameSettings = useSelector((state: stateType) => state.gameSettings);
		const [bombTime, setBombTime] = useState<number>(Date.now());
		const [defuseTime, setDefuseTime] = useState<number>(Date.now());
		const [plantTime, setPlantTime] = useState<number>(Date.now());
		// Const [updateState, setUpdateState] = useState<number>(0);
		const [startedPlant, setStartedPlant] = useState(false);
		const [startedBomb, setStartedBomb] = useState(false);
		const [startedDefuse, setStartedDefuse] = useState(false);

		// Updates component every 10 milliseconds, should be fine...
		// useEffect(() => {
		// 	const interval = setInterval(() => {
		// 		setUpdateState(updateState + 1);
		// 	}, 10);
		// 	return (): void => clearInterval(interval);
		// }, [updateState]);

		let bombProgress = 0;
		let plantProgress = 0;
		let defuseProgress = 0;
		if (props.phase === 'planting') {
			if (startedPlant) {
				const plantSetDate = addSeconds(plantTime, -gameSettings.bombPlantTime);
				plantProgress = ((Date.now() - plantSetDate) / (plantTime - plantSetDate)) * 100;
			} else {
				setStartedPlant(true);
				setPlantTime(addSeconds(Date.now(), gameSettings.bombPlantTime));
			}
		}

		if (props.phase === 'planted') {
			if (startedBomb) {
				if (startedDefuse) {
					// Reset defuse time
					setStartedDefuse(false);
				}

				const bombSetDate = addSeconds(bombTime, -gameSettings.bombTime);
				bombProgress = ((Date.now() - bombSetDate) / (bombTime - bombSetDate)) * 100;
			} else {
				setStartedBomb(true);
				setBombTime(addSeconds(Date.now(), gameSettings.bombTime));
			}
		}

		if (props.phase === 'defusing') {
			if (startedDefuse) {
				const defuseSetDate = addSeconds(
					defuseTime,
					props.kit ? -gameSettings.kitDefusedTime : -gameSettings.noKitDefuseTime,
				);
				defuseProgress =
					((Date.now() - defuseSetDate) / (defuseTime - defuseSetDate)) * 100;

				// The bomb needs to be updated too
				if (startedBomb) {
					const bombSetDate = addSeconds(bombTime, -gameSettings.bombTime);
					bombProgress = ((Date.now() - bombSetDate) / (bombTime - bombSetDate)) * 100;
				}
			} else {
				setStartedDefuse(true);
				setDefuseTime(
					addSeconds(
						Date.now(),
						props.kit ? gameSettings.kitDefusedTime : gameSettings.noKitDefuseTime,
					),
				);
			}
		}

		if (['exploded', 'defused', 'carried'].includes(props.phase)) {
			if (startedPlant) setStartedPlant(false);
			if (startedBomb) setStartedBomb(false);
			if (startedDefuse) setStartedDefuse(false);
		}

		const plantColour: React.CSSProperties = {
			border: `1px solid #fff`,
			boxSizing: 'border-box',
			boxShadow: `inset 0 0 10px #fff`,
			background: 'rgba(0, 0, 0, 0.5)',
		};

		const bombColour: React.CSSProperties = {
			background: `linear-gradient(to left, #F46666, rgba(244, 102, 102, 0.3) 50%)`,
		};

		const defuseColour: React.CSSProperties = {
			background: `linear-gradient(to left, #0C7BC0, rgba(12, 123, 192, 0.3) 70%)`,
		};

		return (
			<Container className={props.className} ref={ref} style={props.style}>
				<PlantTimer
					progressBarStyle={plantColour}
					progress={props.phase === 'planting' ? plantProgress : 0}
					style={{ display: props.phase === 'planting' ? '' : 'none' }}
				/>
				<BombTimer
					progress={['planted', 'defusing'].includes(props.phase) ? bombProgress : 0}
					progressBarStyle={bombColour}
					style={{
						border:
							props.phase === 'planted' || props.phase === 'defusing'
								? '1px solid white'
								: 'none',
						display: ['planted', 'defusing', 'exploded', 'defused'].includes(
							props.phase,
						)
							? ''
							: 'none',
						boxShadow: `inset 0 0 10px #fff`,
						boxSizing: 'border-box',
					}}
				/>
				<DefuseTimer
					progressBarStyle={defuseColour}
					progress={props.phase === 'defusing' ? defuseProgress : 0}
					style={{
						border: '1px solid transparent',
						display: ['defusing', 'defused'].includes(props.phase) ? '' : 'none',
						boxSizing: 'border-box',
					}}
				/>
				<KitImage
					src={require('../../../images/in-game/elements/defuse.png')}
					style={{ display: props.kit ? '' : 'none' }}
				/>
				<PlayerText kit={props.kit}>
					{playerConditions.includes(props.phase)
						? `${props.playerName} ${
								props.phase === 'defusing' ? 'is defusing' : 'is planting'
						  }`
						: ''}
				</PlayerText>
				{props.phase === 'planted' || props.phase === 'defusing' ? <TenSecondMark /> : ''}
			</Container>
		);
	},
);

BombPlanted.displayName = 'BombPlanted';
