import React from 'react';
import styled from 'styled-components';
import { CSGOOutputAllplayer } from '../../../../types/csgo-gsi';

import { FitText, Text as FitTextText } from '../../atoms/fit-text';
import * as Weapon from '../../atoms/weapons';
import { Armour } from '../../atoms/armour';
import { OtherIcons } from '../../atoms/other-icons';

const PlayerName = styled(FitText)`
	justify-content: ${(props: OnRightProps): string => (props.right ? 'flex-end' : 'flex-start')};
	color: #fff;
	font-size: 25px;
	line-height: 38px;
	min-width: 150px;
	max-width: 150px;
	& > ${FitTextText} {
		transform-origin: ${(props: OnRightProps): string => (props.right ? 'right' : 'left')};
	}
	margin: 0 5px;
`;

const Container = styled.div`
	background: ${(props: Both): string =>
		props.ct ? 'rgba(89, 185, 245, 0.5);' : 'rgba(217, 188, 80, 0.5);'};
	width: 580px;
	height: 37px;
	display: flex;
	align-items: center;
	justify-content: space-between;
	flex-direction: ${(props: Both): string => (props.right ? 'row-reverse' : 'row')};
`;

const MainWeapon = styled(Weapon.PrimaryWeapon)`
	height: 23px;
	padding: 0 10px;
	min-width: 98px;
	max-width: 98px;
	object-fit: scale-down;
`;

const SecondaryWeapon = styled(Weapon.SecondaryWeapon)`
	height: 20px;
	width: auto;
	min-width: 52px;
	object-fit: scale-down;
	margin: 0 10px;
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
`;

const ArmourBombDefuseSize = `
	height: auto;
	width: 16px;
	margin: 0 2px;
`;

const Money = styled.div`
	color: #fff;
	font-size: 23px;
	margin: 0 5px;
	max-width: 74px;
	min-width: 74px;
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

interface Props {
	extra?: {
		bomb?: boolean;
	};
	right?: boolean;
	playerData: CSGOOutputAllplayer;
}

interface OnRightProps {
	right?: boolean;
}

interface Both extends OnRightProps {
	ct?: boolean;
}

export const Player: React.FunctionComponent<Props> = (props: Props) => {
	const isCT = props.playerData.team === 'CT';
	const helmetOrNormal = props.playerData.state.helmet ? 'helmet' : 'normal';

	const weapons = Object.values(props.playerData.weapons);
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
					active={true}
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

	return (
		<Container right={props.right} ct={isCT}>
			<PlayerName right={props.right} text={props.playerData.name} />

			<div style={{ display: 'flex', justifyContent: 'center', minWidth: 50 }}>
				{props.playerData.state.armor ? <ArmourImg item={helmetOrNormal} /> : ''}
				{isCT ? (
					props.playerData.state.defusekit ? (
						<BombDefuseImg item="defuse" />
					) : (
						<EmptySpace />
					)
				) : props.extra?.bomb ? (
					<BombDefuseImg item="bomb" />
				) : (
					''
				)}
			</div>

			<GrenadeBar>{grenadeList}</GrenadeBar>
			{secondaryWeapon ? (
				<SecondaryWeapon
					active={true}
					flip={props.right}
					item={secondaryWeapon.name.replace('weapon_', '') as Weapon.SecondaryWeaponList}
				/>
			) : (
				''
			)}

			{primaryWeapon ? (
				<MainWeapon
					active={true}
					flip={props.right}
					item={primaryWeapon.name.replace('weapon_', '') as Weapon.PrimaryWeaponList}
				/>
			) : (
				''
			)}

			<Money>
				<span style={{ fontSize: 15 }}>$</span>
				{props.playerData.state.money}
			</Money>
		</Container>
	);
};
