/* eslint-disable camelcase */
import React from 'react';

export const secondaryWeaponImages = {
	cz75a: require('../../images/in-game/weapons/cz75a.png'),
	deagle: require('../../images/in-game/weapons/deagle.png'),
	elite: require('../../images/in-game/weapons/elite.png'),
	fiveseven: require('../../images/in-game/weapons/fiveseven.png'),
	glock: require('../../images/in-game/weapons/glock.png'),
	hkp2000: require('../../images/in-game/weapons/hkp2000.png'),
	p250: require('../../images/in-game/weapons/p250.png'),
	revolver: require('../../images/in-game/weapons/revolver.png'),
	tec9: require('../../images/in-game/weapons/tec9.png'),
	usp_silencer: require('../../images/in-game/weapons/usp_silencer.png'),
};

interface Props {
	item: keyof typeof secondaryWeaponImages;
	active?: boolean;
	flip?: boolean;
	className?: string;
	style?: React.CSSProperties;
}

export type SecondaryWeaponList = keyof typeof secondaryWeaponImages;

export const SecondaryWeapon: React.FunctionComponent<Props> = (props: Props) => {
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
			src={secondaryWeaponImages[props.item]}
		/>
	);
};
