import React from 'react';
import styled from 'styled-components';

import { FitText, Text as FitTextText } from '../../atoms/fit-text';
import * as Weapon from '../../atoms/weapons';
import { Armour } from '../../atoms/armour';
import { OtherIcons } from '../../atoms/other-icons';
import { ProgressBarBox } from '../../atoms/progress-bar-box';
import { useSelector } from 'react-redux';
import { stateType } from '../../../replicant-store';

const Container = styled.div`
	display: flex;
	flex-direction: ${(props: OnRightProps): string => (props.right ? 'row-reverse' : 'row')};
`;

const PlayerContainer = styled.div`
	background: rgba(10, 0, 20, 0.8);
	width: 340px;
	height: 70px;

	${(props: ContainerProps): string =>
		props.observed
			? `box-shadow: 
					${props.right ? '-5px' : '5px'} 0 5px #fff;`
			: ''}

	${(props: ContainerProps): string => (props.right ? 'margin-left: 2px' : 'margin-right: 2px')};
`;

const PlayerName = styled(FitText)`
	justify-content: ${(props: PlayerNameProps): string =>
		props.right ? 'flex-end' : 'flex-start'} !important;

	color: ${(props: PlayerNameProps): string =>
		props.dead ? 'rgba(255, 255, 255, 0.7)' : '#FFF'};

	text-shadow: ${(props: PlayerNameProps): string => (props.observed ? '0 0 5px #FFF' : '')};

	font-size: 25px;
	line-height: 38px;

	min-width: 150px;
	max-width: 150px;

	& > ${FitTextText} {
		transform-origin: ${(props: PlayerNameProps): string => (props.right ? 'right' : 'left')};
	}
`;

const HealthText = styled.span`
	text-align: center;
	width: 26px;
	font-size: 15px;
	color: #b9b9b9;
	margin: 0 10px;
	font-weight: bold;
	font-family: Roboto;
`;

const HealthBar = styled(ProgressBarBox)`
	height: 38px;
	width: 100%;
	grid-column: 1;
	grid-row: 1;
`;

const HealthBarOverlay = styled.div`
	grid-column: 1;
	grid-row: 1;
	display: flex;
	flex-direction: ${(props: OnRightProps): string => (props.right ? 'row-reverse' : 'row')};
	justify-content: space-between;
	align-items: center;
`;

const MainWeapon = styled(Weapon.PrimaryWeapon)`
	height: 23px;
	padding: 0 10px;
	object-fit: scale-down;
	filter: ${(props: MainWeaponsProps): string =>
		props.active ? 'drop-shadow(0 0 5px #fff)' : ''};
	float: ${(props: MainWeaponsProps): string => (props.right ? 'left' : 'right')};
`;

const SecondaryWeapon = styled(Weapon.SecondaryWeapon)`
	height: 20px;
	width: auto;
	min-width: 52px;
	object-fit: scale-down;
	margin: 0 10px;
	filter: ${(props: Active): string => (props.active ? 'drop-shadow(0 0 5px #fff)' : '')};
`;

const LowerBar = styled.div`
	height: 32px;
	display: flex;
	justify-content: space-between;
	align-items: center;
	color: rgba(255, 255, 255, 0.5);
	font-weight: lighter;
	font-size: 23px;
	line-height: 32px;
	padding: 0 5px;
	flex-direction: ${(props: OnRightProps): string => (props.right ? 'row-reverse' : 'row')};
`;

const GrenadeBar = styled.div`
	display: flex;
	align-items: bottom;
	justify-content: center;
	height: 25px;
	max-width: 90px;
	min-width: 90px;
`;

const Grenade = styled(Weapon.Grenades)`
	height: 100%;
	width: auto;
	margin: 0 4px;
	filter: ${(props: Active): string => (props.active ? 'drop-shadow(0 0 5px #fff)' : '')};
`;

const ArmourBombDefuseSize = `
	height: auto;
	width: 16px;
	margin: 0 2px;
`;

const ArmourImg = styled(Armour)`
	${ArmourBombDefuseSize}
`;

const BombDefuseImg = styled(OtherIcons)`
	${ArmourBombDefuseSize}
`;

const EmptySpace = styled.div`
	${ArmourBombDefuseSize}
`;

const KillBox = styled.div`
	height: 70px;
	width: 5px;
	margin: 0 2px;
	background-color: ${(props: CTProps): string => (props.ct ? '#F1CA3D' : '#59B9F5')};
`;

const SingleCell = styled.div`
	display: grid;
`;

interface Props {
	// Observed?: boolean;
	// carryingBomb?: boolean;
	right?: boolean;
	// PlayerData: CSGOOutputAllplayer;
	steamId: string;
}

interface PlayerNameProps extends BeingObserved {
	dead: boolean;
}

interface OnRightProps {
	right?: boolean;
}

interface BeingObserved extends OnRightProps {
	observed?: boolean;
}

interface Active {
	active?: boolean;
}
interface CTProps {
	ct?: boolean;
}

interface MainWeaponsProps extends Active, OnRightProps {}

interface ContainerProps extends BeingObserved, CTProps {}

export const Player: React.FunctionComponent<Props> = React.memo((props: Props) => {
	const player = useSelector((state: stateType) => state.game.allplayers[props.steamId]);
	const obsPlayerId = useSelector((state: stateType) => state.observingPlayer.steamid);
	const bombId = useSelector((state: stateType) => state.bomb?.player);

	if (!player) return <></>;

	const observed = obsPlayerId === props.steamId;
	const carryingBomb = bombId === props.steamId;
	const isCT = player.team === 'CT';
	const helmetOrNormal = player.state.helmet ? 'helmet' : 'normal';

	const weapons = Object.values(player.weapons);
	const grenades = weapons.map((weapon) => {
		if (weapon.type === 'Grenade') {
			return weapon;
		}

		return undefined;
	});
	const grenadeList = grenades.map((grenade, index) => {
		if (grenade) {
			return (
				<Grenade
					item={grenade.name.replace('weapon_', '') as Weapon.GrenadeList}
					active={grenade.state === 'active'}
					key={index}
				/>
			);
		}

		return undefined;
	});

	const primaryWeapon = weapons.find((weapon) => {
		switch (weapon.type) {
			case 'C4':
			case 'Grenade':
			case 'Knife':
			case 'Pistol':
				return undefined;

			default:
				return weapon;
		}
	});

	const secondaryWeapon = weapons.find((weapon) => {
		switch (weapon.type) {
			case 'Pistol':
				return weapon;

			default:
				return undefined;
		}
	});

	// BoxShadow: `inset 0 0 10px ${isCT ? '#59B9F5' : '#F1CA3D'}`,
	const healthBarColour: React.CSSProperties = {
		border: `1px solid ${isCT ? '#59B9F5' : '#F1CA3D'}`,
		background: `linear-gradient(to ${props.right ? 'right' : 'left'}, ${
			isCT ? '#59B9F5' : '#F1CA3D'
		}, transparent ${100 - player.state.health + 5}%) `,
		boxSizing: 'border-box',
		boxShadow: `inset 0 0 10px ${isCT ? '#59B9F5' : '#F1CA3D'}`,
	};

	const KillBoxes = [];
	for (let i = 0; i < player.state.round_kills; i++) {
		KillBoxes.push(<KillBox ct={isCT} />);
	}

	const dead = player.state.health <= 0;

	return (
		<Container right={props.right}>
			<PlayerContainer right={props.right} observed={observed} ct={isCT}>
				<SingleCell style={{ width: '100%' }}>
					<HealthBar
						progressBarStyle={healthBarColour}
						right={props.right}
						progress={player.state.health}
					/>
					<HealthBarOverlay right={props.right}>
						<HealthText>{player.state.health}</HealthText>
						<PlayerName
							right={props.right}
							text={player.name}
							dead={dead}
							observed={observed}
						/>
						{primaryWeapon ? (
							<div style={{ width: 142 }}>
								<MainWeapon
									active={primaryWeapon.state === 'active'}
									flip={props.right}
									right={props.right}
									item={
										primaryWeapon.name.replace(
											'weapon_',
											'',
										) as Weapon.PrimaryWeaponList
									}
								/>
							</div>
						) : (
							<div style={{ width: 142 }}></div>
						)}
					</HealthBarOverlay>
				</SingleCell>

				<LowerBar right={props.right}>
					<div
						style={{
							minWidth: 72,
							textAlign: props.right ? 'right' : 'left',
							fontFamily: 'Roboto',
						}}>
						<span style={{ fontSize: 15 }}>$</span>
						{player.state.money}
					</div>

					<div style={{ display: 'flex', justifyContent: 'center', minWidth: 50 }}>
						{player.state.armor ? <ArmourImg item={helmetOrNormal} /> : ''}
						{isCT ? (
							player.state.defusekit ? (
								<BombDefuseImg item="defuse" />
							) : (
								<EmptySpace />
							)
						) : carryingBomb ? (
							<BombDefuseImg item="bomb" />
						) : (
							''
						)}
					</div>

					<GrenadeBar>{grenadeList}</GrenadeBar>
					{secondaryWeapon ? (
						<SecondaryWeapon
							active={secondaryWeapon.state === 'active'}
							flip={props.right}
							item={
								secondaryWeapon.name.replace(
									'weapon_',
									'',
								) as Weapon.SecondaryWeaponList
							}
						/>
					) : (
						''
					)}
				</LowerBar>
			</PlayerContainer>
			{KillBoxes}
		</Container>
	);
});

Player.displayName = 'Player';
