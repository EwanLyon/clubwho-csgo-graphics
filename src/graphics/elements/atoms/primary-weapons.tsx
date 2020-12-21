/* eslint-disable camelcase */
import React from 'react';

export const primaryWeaponImages = {
	// Rifle
	ak47: require('../../images/in-game/weapons/ak47.png'),
	aug: require('../../images/in-game/weapons/aug.png'),
	awp: require('../../images/in-game/weapons/awp.png'),
	famas: require('../../images/in-game/weapons/famas.png'),
	g3sg1: require('../../images/in-game/weapons/g3sg1.png'),
	galilar: require('../../images/in-game/weapons/galilar.png'),
	m4a1_silencer: require('../../images/in-game/weapons/m4a1_silencer.png'),
	m4a1: require('../../images/in-game/weapons/m4a1.png'),
	scar20: require('../../images/in-game/weapons/scar20.png'),
	sg556: require('../../images/in-game/weapons/sg556.png'),
	ssg08: require('../../images/in-game/weapons/ssg08.png'),

	// Heavy
	m249: require('../../images/in-game/weapons/m249.png'),
	mag7: require('../../images/in-game/weapons/mag7.png'),
	negev: require('../../images/in-game/weapons/negev.png'),
	nova: require('../../images/in-game/weapons/nova.png'),
	sawedoff: require('../../images/in-game/weapons/sawedoff.png'),
	xm1014: require('../../images/in-game/weapons/xm1014.png'),

	// SMG
	bizon: require('../../images/in-game/weapons/bizon.png'),
	mac10: require('../../images/in-game/weapons/mac10.png'),
	mp5sd: require('../../images/in-game/weapons/mp5sd.png'),
	mp7: require('../../images/in-game/weapons/mp7.png'),
	mp9: require('../../images/in-game/weapons/mp9.png'),
	p90: require('../../images/in-game/weapons/p90.png'),
	ump45: require('../../images/in-game/weapons/ump45.png'),
};

interface Props {
	item: keyof typeof primaryWeaponImages;
	active?: boolean;
	flip?: boolean;
	className?: string;
	style?: React.CSSProperties;
}

export type PrimaryWeaponList = keyof typeof primaryWeaponImages;

export const PrimaryWeapon: React.FunctionComponent<Props> = (props: Props) => {
	return (
		<img
			className={props.className}
			style={Object.assign(
				{
					transform: props.flip ? 'scaleX(-1)' : '',
					opacity: props.active ? '1' : '0.7',
				},
				props.style,
			)}
			src={primaryWeaponImages[props.item]}
		/>
	);
};
