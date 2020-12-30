import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import gsap from 'gsap';

import { PlayerDeath } from '../../../../types/hlae';
import { stateType } from '../../../replicant-store';
import { KillIcon } from './kill-icon';

const KillContainer = styled.div`
	height: 0;
	font-size: 18px;
	background: rgba(10, 0, 20, 0.8);
	border: 0px solid #fff;
	box-shadow: inset 0 0 5px #fff;
	display: flex;
	align-items: center;
	justify-content: flex-end;
	width: fit-content;
	overflow: hidden;
	box-sizing: border-box;
	margin-top: 8px;
`;

const InfoIcon = styled.img`
	margin: 0 4px;
`;

interface Props {
	data: PlayerDeath;
}

export const Kill: React.FC<Props> = (props: Props) => {
	const containerRef = useRef<HTMLDivElement>(null);
	const playerDead = useSelector((state: stateType) => state.game.allplayers[props.data.keys.userid.xuid]);
	const attacker = useSelector((state: stateType) => state.game.allplayers[props.data.keys.attacker.xuid]);
	const assister = useSelector((state: stateType) => state.game.allplayers[props.data.keys.assister.xuid]);

	useEffect(() => {
		const tl = gsap.timeline();

		tl.set(containerRef.current, { height: 0, borderWidth: 0 });
		tl.to(containerRef.current, { height: 42, borderWidth: 1, duration: 0.1 });
		tl.to(containerRef.current, { height: 0, borderWidth: 0, duration: 0.3 }, '+=5');
	}, []);

	return (
		<KillContainer ref={containerRef}>
			{props.data.keys.attackerblind ? (
				<InfoIcon src={require('../../../images/in-game/weapons/blind_kill.svg')} />
			) : (
				<></>
			)}
			<PlayerName name={attacker?.name || 'Test'} team={attacker?.team || 'CT'} />
			{assister ? (
				<>
					<span style={{ color: '#ffffff' }}>+</span>
					{props.data.keys.assistedflash ? (
						<InfoIcon src={require('../../../images/in-game/grenades/flashbang.svg')} />
					) : (
						<></>
					)}
					<PlayerName name={assister?.name || 'Test'} team={assister?.team || 'CT'} />
				</>
			) : (
				<></>
			)}
			<KillIcon weapon={props.data.keys.weapon} />
			{props.data.keys.noscope ? (
				<InfoIcon src={require('../../../images/in-game/weapons/noscope.svg')} />
			) : (
				<></>
			)}
			{props.data.keys.thrusmoke ? (
				<InfoIcon src={require('../../../images/in-game/weapons/smoke_kill.svg')} />
			) : (
				<></>
			)}
			{props.data.keys.penetrated ? (
				<InfoIcon src={require('../../../images/in-game/weapons/penetrate.svg')} />
			) : (
				<></>
			)}
			{props.data.keys.headshot ? (
				<InfoIcon src={require('../../../images/in-game/weapons/icon_headshot.svg')} />
			) : (
				<></>
			)}
			<PlayerName name={playerDead?.name || 'Test'} team={playerDead?.team || 'T'} />
		</KillContainer>
	);
};

const Name = styled.span`
	margin: 0 8px;
`;

interface NameProps {
	name: string;
	team: 'CT' | 'T';
}

const PlayerName: React.FC<NameProps> = (props: NameProps) => {
	const fontColour = props.team === 'CT' ? '#59B9F5' : '#F1CA3D';

	return <Name style={{ color: fontColour }}>{props.name}</Name>;
};
