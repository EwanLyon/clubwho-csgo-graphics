import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { Grid } from '@material-ui/core';
import gsap from 'gsap';
import { Grenades } from '../../atoms/grenades';
import { useSelector } from 'react-redux';
import { stateType } from '../../../replicant-store';

const Container = styled.div`
	position: relative;
	background: rgba(10, 0, 20, 0.85);
	width: 330px;
	height: 50px;
	color: #fff;
	border: 1px solid ${(props: CT): string => (props.ct ? '#59B9F5' : '#F1CA3D')};
	box-shadow: inset 0 0 7px ${(props: CT): string => (props.ct ? '#59B9F5' : '#F1CA3D')};
	padding: 5px;
	display: flex;
	justify-content: center;
	align-items: center;
	overflow: hidden;
`;

const Corner = styled.div`
	position: absolute;
	top: ${(props: CornerProps): string => (props.top ? '5px' : '')};
	right: ${(props: CornerProps): string => (props.right ? '5px' : '')};
	bottom: ${(props: CornerProps): string => (props.top ? '' : '5px')};
	left: ${(props: CornerProps): string => (props.right ? '' : '5px')};
	width: ${(props: CornerProps): string => props.size + 'px'};
	height: ${(props: CornerProps): string => props.size + 'px'};
	border-width: ${(props: CornerProps): string =>
		`${props.top ? props.size + 'px' : '0'} ${props.right ? props.size + 'px' : '0'} ${
			props.top ? '0' : props.size + 'px'
		} ${props.right ? '0' : props.size + 'px'}`};
	border-style: solid;
	border-color: ${(props: CornerProps): string => props.colour};
`;

const NadeHolder = styled.div`
	width: 50px;
	display: flex;
	justify-content: space-around;
	align-items: flex-end;
`;

const NadeImage = styled(Grenades)`
	height: 30px;
	width: auto;
`;

const NadeText = styled.span`
	display: block;
	font-family: Roboto;
	font-size: 25px;
	font-family: Roboto;
	line-height: 14px;
`;

interface CornerProps {
	top?: boolean;
	right?: boolean;
	size: number;
	colour: string;
}

interface CT {
	ct?: boolean;
}

interface Props {
	ct?: boolean;
	right?: boolean;
	style?: React.CSSProperties;
	className?: string;
	show?: boolean;
	teamTwo?: boolean;
}

export const TeamNade: React.FC<Props> = (props: Props) => {
	const teamData = useSelector((state: stateType) =>
		props.teamTwo ? state.teamTwo : state.teamOne,
	);
	const tl = useRef<gsap.core.Timeline>();
	const containerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		tl.current = gsap.timeline({ paused: true });

		// Console.log('Initialising InGameStat animation');

		tl.current.addLabel('Show');

		tl.current.set(containerRef.current, {
			opacity: 0,
			width: 0,
			paddingLeft: 0,
			paddingRight: 0,
		});
		tl.current.to(containerRef.current, 0.5, { opacity: 1 });
		tl.current.to(containerRef.current, 1, {
			ease: 'expo.out',
			width: 330,
			paddingLeft: 5,
			paddingRight: 5,
		});

		tl.current.addPause('+=0.1');

		tl.current.addLabel('Hide');

		tl.current.set(containerRef.current, {
			opacity: 1,
			width: 330,
			paddingLeft: 5,
			paddingRight: 5,
		});
		tl.current.to(containerRef.current, 1, {
			ease: 'expo.out',
			width: 0,
			paddingLeft: 0,
			paddingRight: 0,
		});
		tl.current.to(containerRef.current, 0.5, { opacity: 0 });
	}, []);

	const goToAnimation = (stage: string): void => {
		if (tl && tl.current) {
			const currentTime = tl.current.time();
			const labelTime = tl.current.labels[stage];
			// Console.log('current time', currentTime);

			tl.current.resume();
			if (currentTime >= labelTime) {
				// Console.log('jumping to ' + stage, labelTime);
				tl.current.play(labelTime);
			} else {
				// Console.log('tweening to ' + stage, labelTime);
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
		if (props.show) {
			goToAnimation('Show');
		} else {
			goToAnimation('Hide');
		}
	}, [props.show]);

	return (
		<Container ct={props.ct} style={props.style} className={props.className} ref={containerRef}>
			<Corner
				size={5}
				top
				right={props.right}
				colour={props.ct ? '#59B9F5' : '#F1CA3D'}
				style={{ float: props.right ? 'right' : 'left' }}
			/>
			<Grid
				container
				direction={props.right ? 'row-reverse' : 'row'}
				justify="space-evenly"
				alignItems="center"
				spacing={4}
				style={{ overflow: 'hidden', flexWrap: 'nowrap' }}>
				<NadeHolder>
					<NadeImage item="hegrenade" />
					<NadeText>
						<span style={{ fontSize: 17 }}>x</span>
						{teamData.grenades.he}
					</NadeText>
				</NadeHolder>
				<NadeHolder>
					<NadeImage item="flashbang" />
					<NadeText>
						<span style={{ fontSize: 17 }}>x</span>
						{teamData.grenades.flash}
					</NadeText>
				</NadeHolder>
				<NadeHolder>
					<NadeImage item="smokegrenade" />
					<NadeText>
						<span style={{ fontSize: 17 }}>x</span>
						{teamData.grenades.smoke}
					</NadeText>
				</NadeHolder>
				<NadeHolder>
					<NadeImage item={props.ct ? 'incgrenade' : 'molotov'} />
					<NadeText>
						<span style={{ fontSize: 17 }}>x</span>
						{teamData.grenades.fire}
					</NadeText>
				</NadeHolder>
			</Grid>
			<Corner
				size={5}
				right={!props.right}
				colour={props.ct ? '#59B9F5' : '#F1CA3D'}
				style={{ float: props.right ? 'left' : 'right' }}
			/>
		</Container>
	);
};
