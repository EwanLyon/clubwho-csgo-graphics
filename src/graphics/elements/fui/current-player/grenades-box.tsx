import React from 'react';
import styled from 'styled-components';

import { Grenades, GrenadeList } from '../../atoms/grenades';

const Container = styled.div``;

const Box = styled.div`
	display: flex;
	align-items: center;
	height: 45px;
	background-color: rgba(0, 0, 0, 0.8);
	padding: 0 15px;
	background-image: radial-gradient(#777 1px, rgba(10, 0, 20, 1) 0px);
	background-size: 25px 25px;
	background-position: 0 -6px;
	border: 1px solid #fff;
`;

const GrenadeImg = styled(Grenades)`
	height: 25px;
	width: auto;
	margin: 0 4px;
`;

interface Props {
	grenades?: GrenadeList[];
}

export const GrenadesBox: React.FunctionComponent<Props> = (props: Props) => {
	const grenadesDisplay = props.grenades
		? props.grenades.map((grenade, index) => <GrenadeImg item={grenade} key={index} />)
		: '';

	return <Container>{props.grenades?.length ? <Box>{grenadesDisplay}</Box> : ''}</Container>;
};
