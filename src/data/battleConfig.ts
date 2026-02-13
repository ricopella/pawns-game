export interface Move {
	name: string;
	minDamage: number;
	maxDamage: number;
	accuracy: number;
	isHeal?: boolean;
	flavorText: string;
}

export interface BattleConfig {
	enemyName: string;
	enemyTexture: string;
	enemyHp: number;
	playerHp: number;
	playerMoves: Move[];
	enemyMoves: Move[];
	introPhrases: string[];
	victoryText: string;
	defeatText: string;
	nextScene: string;
	nextSceneData?: Record<string, unknown>;
}

const PAWN_MOVES: Move[] = [
	{
		name: "Punch",
		minDamage: 15,
		maxDamage: 25,
		accuracy: 1.0,
		flavorText: "Pawn throws a solid punch!",
	},
	{
		name: "Throw Stapler",
		minDamage: 20,
		maxDamage: 35,
		accuracy: 0.8,
		flavorText: "Pawn hurls a stapler across the office!",
	},
	{
		name: "Complain to HR",
		minDamage: 30,
		maxDamage: 40,
		accuracy: 0.6,
		flavorText: "Pawn files an HR complaint!",
	},
	{
		name: "Coffee Break",
		minDamage: 20,
		maxDamage: 20,
		accuracy: 1.0,
		isHeal: true,
		flavorText: "Pawn takes a coffee break and feels better!",
	},
];

export const MR_SENIOR_BATTLE: BattleConfig = {
	enemyName: "Mr. Senior",
	enemyTexture: "mrSenior",
	enemyHp: 80,
	playerHp: 100,
	playerMoves: PAWN_MOVES,
	enemyMoves: [
		{
			name: "Awkward Stare",
			minDamage: 10,
			maxDamage: 15,
			accuracy: 1.0,
			flavorText: "It's super uncomfortable!",
		},
		{
			name: "Stupid Question",
			minDamage: 15,
			maxDamage: 20,
			accuracy: 0.9,
			flavorText: "Why would he even ask that?!",
		},
		{
			name: "Hover Over Desk",
			minDamage: 10,
			maxDamage: 20,
			accuracy: 0.85,
			flavorText: "He won't go away!",
		},
	],
	introPhrases: ["Mr. Senior is staring at you again...", "He's asking another stupid question..."],
	victoryText: "Mr. Senior retreated to his desk!",
	defeatText: "Mr. Senior wore you down... Try again!",
	nextScene: "OfficeArrivalScene",
	nextSceneData: { phase: "postSenior" },
};

export const THE_BOSS_BATTLE: BattleConfig = {
	enemyName: "The Boss",
	enemyTexture: "theBoss",
	enemyHp: 120,
	playerHp: 100,
	playerMoves: PAWN_MOVES,
	enemyMoves: [
		{
			name: "Hold Your Pee!",
			minDamage: 15,
			maxDamage: 25,
			accuracy: 0.9,
			flavorText: "This is a human rights violation!",
		},
		{
			name: "Work Weekends!",
			minDamage: 20,
			maxDamage: 30,
			accuracy: 0.8,
			flavorText: "But it's Valentine's Day!",
		},
		{
			name: "KPI Pressure",
			minDamage: 25,
			maxDamage: 35,
			accuracy: 0.7,
			flavorText: "Those aren't even MY KPIs!",
		},
		{
			name: "Stay Late!",
			minDamage: 15,
			maxDamage: 20,
			accuracy: 0.95,
			flavorText: "I have dogs to feed!",
		},
	],
	introPhrases: [
		"The Boss appears!",
		'"You need to hold your pee more!"',
		'"You should stay late AND come in early!"',
		'"Finish those proposals faster or I won\'t hit MY KPIs!"',
	],
	victoryText: "The Boss has been defeated! Pawn is FREE!",
	defeatText: "The Boss overwhelmed you... Try again!",
	nextScene: "VictoryScene",
};
