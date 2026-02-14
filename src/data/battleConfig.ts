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
	bgColor?: number;
	groundColor?: number;
	lineColor?: number;
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
	enemyHp: 95,
	playerHp: 110,
	playerMoves: PAWN_MOVES,
	enemyMoves: [
		{
			name: "Bathroom Lecture",
			minDamage: 12,
			maxDamage: 20,
			accuracy: 0.9,
			flavorText: '"You need to hold your pee more!"',
		},
		{
			name: "Weekend Assignment",
			minDamage: 15,
			maxDamage: 22,
			accuracy: 0.8,
			flavorText: '"You should come in on weekends too!"',
		},
		{
			name: "Proposal Pressure",
			minDamage: 18,
			maxDamage: 28,
			accuracy: 0.7,
			flavorText: '"Did you finish the proposal yet?!"',
		},
		{
			name: "Try Harder!",
			minDamage: 10,
			maxDamage: 18,
			accuracy: 0.95,
			flavorText: '"You need to try harder!"',
		},
	],
	introPhrases: ["The Boss looms over your desk..."],
	victoryText: "The Boss has been defeated! Pawn is FREE!",
	defeatText: "The Boss overwhelmed you... Try again!",
	nextScene: "VictoryScene",
	bgColor: 0x2e0a0a,
	groundColor: 0x4e1a1a,
	lineColor: 0x662222,
};
