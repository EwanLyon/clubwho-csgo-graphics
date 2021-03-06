import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
	display: flex;
	background-image: radial-gradient(#777 1px, rgba(10, 0, 20, 1) 0px);
	background-size: 25px 25px;
	background-position: 0 -6px;
	align-items: center;
	color: #fff;
	padding: 0 11px;
	border: 1px solid #fff;
`;

const KillsBox = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	margin: 0 5px;
	grid-column: 1;
	grid-row: 1;
`;

const KillText = styled.span`
	font-size: 25px;
	margin-right: 5px;
	max-width: 14px;
	min-width: 14px;
	text-align: center;
	text-shadow: 0 0 4px black;
`;

const PrimaryWheel = styled.div`
	height: 50px;
	width: 50px;
	border-radius: 25px;
	background: conic-gradient(
		#fff ${(props: Progress): number => props.progress}%,
		#777 ${(props: Progress): number => props.progress + 1}%
	);
	display: flex;
	justify-content: center;
	align-items: center;
	mask-image: radial-gradient(transparent 55%, black 60%);
	grid-column: 1;
	grid-row: 1;
`;

const CurrentAmmo = styled.span`
	grid-column: 1;
	grid-row: 1;
	display: flex;
	justify-content: center;
	align-items: center;
	font-size: 23px;
	text-align: center;
`;

const SingleGrid = styled.div`
	display: grid;
`;

const KillIndicatorContainer = styled.div`
	width: 100%;
	display: flex;
	flex-direction: column;
	grid-column: 1;
	grid-row: 1;
`;

const KillIndicator = styled.div`
	width: 100%;
	height: 5px;
	background: ${(props: Kills): string =>
		props.active ? (props.ct ? '#59B9F5' : '#F1CA3D') : 'rgba(255, 255, 255, 0.1)'};
	margin: 3px 0;
`;

const Divider = styled.div`
	width: 1px;
	height: 80%;
	background: #888;
	margin: 0 11px;
`;

interface Props {
	secMax?: number;
	secPossible?: number;
	secCur?: number;
	primMax?: number;
	primPossible?: number;
	primCur?: number;
	kills: number;
	ct?: boolean;
}

interface Kills {
	active?: boolean;
	ct?: boolean;
}

interface Progress {
	progress: number;
}

export const WeaponsBox: React.FunctionComponent<Props> = (props: Props) => {
	const whichGun =
		typeof props.primMax === 'number' ? 'p' : typeof props.secMax === 'number' ? 's' : 'n';
	const currentAmmo = whichGun === 'p' ? props.primCur : props.secCur;
	const currentReserve = whichGun === 'p' ? props.primMax : props.secMax;
	const ammoClipMax = whichGun === 'p' ? props.primPossible : props.secPossible;

	return (
		<Container>
			<SingleGrid style={{ minWidth: 55 }}>
				<KillIndicatorContainer>
					<KillIndicator active={props.kills > 4} ct={props.ct} />
					<KillIndicator active={props.kills > 3} ct={props.ct} />
					<KillIndicator active={props.kills > 2} ct={props.ct} />
					<KillIndicator active={props.kills > 1} ct={props.ct} />
					<KillIndicator active={props.kills > 0} ct={props.ct} />
				</KillIndicatorContainer>
				<KillsBox>
					<KillText>{props.kills}</KillText>
					<img
						src={require('../../../images/in-game/kill_icon_solid.png')}
						style={{ height: 25, width: 'auto' }}
					/>
				</KillsBox>
			</SingleGrid>
			<Divider style={{ display: whichGun === 'n' ? 'none' : '' }} />
			{whichGun === 'n' ? (
				''
			) : (
				<div style={{ display: 'flex', alignItems: 'flex-end' }}>
					<SingleGrid>
						{/* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */}
						<PrimaryWheel progress={(currentAmmo! / ammoClipMax!) * 100}></PrimaryWheel>
						<CurrentAmmo>{currentAmmo}</CurrentAmmo>
					</SingleGrid>
					<span style={{ width: 33, textAlign: 'left' }}>/{currentReserve}</span>
				</div>
			)}
		</Container>
	);
};
