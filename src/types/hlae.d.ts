export interface BaseGameEvent {
	clientTime: number;
	round: number;
}

export interface PlayerDeath extends BaseGameEvent {
	name: "player_death";
	keys: PlayerDeathKeys;
}

interface PlayerDeathKeys {
	userid: Userid;
	attacker: Userid;
	assister: Userid;
	assistedflash: boolean;
	weapon: string;
	weaponItemid: string;
	weaponFauxitemid: string;
	weaponOriginalownerXuid: string;
	headshot: boolean;
	dominated: number;
	revenge: number;
	wipe: number;
	penetrated: number;
	noreplay: boolean;
	noscope: boolean;
	thrusmoke: boolean;
	attackerblind: boolean;
}

export interface WeaponFire extends BaseGameEvent {
	name: "weapon_fire";
	keys: WeaponFireKeys;
}

interface WeaponFireKeys {
    userid:   Userid;
    weapon:   string;
    silenced: boolean;
}

interface Userid {
    value:     number;
    xuid:      string;
    eyeOrigin: number[];
    eyeAngles: number[];
}

