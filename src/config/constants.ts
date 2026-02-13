export const GAME = {
	WIDTH: 800,
	HEIGHT: 600,
	BACKGROUND_COLOR: "#1a0a2e",
} as const;

export const PLAYER = {
	SPEED: 150,
	SCALE: 4,
	DEPTH: 5,
	BOB_FREQUENCY: 100,
	BOB_AMPLITUDE: 0.5,
} as const;

export const PLAYER_BOUNDS = {
	morning: { minX: 30, maxX: 770, minY: 90, maxY: 550 },
	leaveHouse: { minX: 60, maxX: 770, minY: 260, maxY: 470 },
	office: { minX: 30, maxX: 770, minY: 40, maxY: 570 },
} as const;

export const DOGS = {
	lucky: {
		scale: 4,
		followDistance: 30,
		speed: 180,
		isEnergetic: true,
		side: "left" as const,
	},
	cooper: {
		scale: 4,
		followDistance: 20,
		speed: 130,
		isEnergetic: false,
		side: "right" as const,
	},
} as const;

export const DOG_FOLLOWER = {
	SIDE_OFFSET: 45,
	Y_OFFSET: 5,
	WANDER_INTERVAL: 800,
	WANDER_X_RANGE: 30,
	WANDER_Y_RANGE: 20,
	MIN_MOVE_DIST: 4,
	FLIP_THRESHOLD: 2,
	ENERGETIC_BOB_FREQUENCY: 150,
	ENERGETIC_BOB_AMPLITUDE: 0.8,
	ENERGETIC_HISTORY_DELAY: 8,
	CALM_HISTORY_DELAY: 12,
} as const;

export const INTERACTION = {
	BOWL_DISTANCE: 80,
	CAR_DISTANCE: 80,
	NPC_DISTANCE: 70,
	SENIOR_DISTANCE: 80,
	BOSS_DISTANCE: 80,
} as const;

export const DRIVING = {
	LANES: [280, 370, 460, 540] as readonly number[],
	START_LANE: 1,
	DEFAULT_LANE_X: 370,
	LANE_LERP: 0.15,
	INITIAL_SCROLL_SPEED: 200,
	FAST_SCROLL_SPEED: 250,
	INITIAL_SPAWN_INTERVAL: 1200,
	FAST_SPAWN_INTERVAL: 900,
	OBSTACLE_MIN_SPEED: 100,
	OBSTACLE_SPEED_RANGE: 100,
	PLAYER_LANE_AVOID_CHANCE: 0.3,
	CAR_HITBOX: { width: 60, height: 80 },
	OBSTACLE_HITBOX: { width: 50, height: 60 },
	SPAWN_Y: -40,
	DESPAWN_Y: 650,
	LIVES: 3,
	INVINCIBILITY_FLASH_DURATION: 100,
	INVINCIBILITY_FLASH_REPEATS: 10,
	TURN_AMPLITUDE: 30,
	TURN_FREQUENCY: 1000,
	SEGMENT_DISTANCES: {
		straight1: 3000,
		stoplight: 1000,
		turnLeft: 2000,
		straight2: 4000,
		arrival: 500,
	},
	STOPLIGHT_MIN_WAIT: 2000,
	STOPLIGHT_WAIT_RANGE: 2000,
} as const;

export const BATTLE_UI = {
	PLAYER_X: 180,
	PLAYER_Y: 260,
	PLAYER_SCALE: 8,
	ENEMY_X: 620,
	ENEMY_Y: 180,
	ENEMY_SCALE: 8,
	LUCKY_X: 100,
	LUCKY_Y: 320,
	COOPER_X: 260,
	COOPER_Y: 320,
	DOG_SCALE: 4,
	HP_BAR_WIDTH: 200,
	HP_BAR_HEIGHT: 16,
	PLAYER_HP_BAR: { x: 30, y: 385 },
	ENEMY_HP_BAR: { x: 520, y: 75 },
	PLAYER_NAME_POS: { x: 30, y: 340 },
	PLAYER_HP_TEXT_POS: { x: 30, y: 365 },
	ENEMY_NAME_POS: { x: 520, y: 30 },
	ENEMY_HP_TEXT_POS: { x: 520, y: 55 },
	MENU: { x: 350, y: 420, width: 430, height: 160 },
	MOVE_START_X: 390,
	MOVE_START_Y: 440,
	MOVE_COL_OFFSET: 200,
	MOVE_ROW_OFFSET: 50,
	SELECTOR_X: 380,
	SELECTOR_Y: 434,
	SELECTOR_WIDTH: 180,
	SELECTOR_HEIGHT: 36,
	BATTLE_TEXT: { x: 30, y: 440, wrapWidth: 300 },
	GROUND_LINE_Y: 300,
} as const;

export const FADE = {
	DEFAULT: 500,
	FAST: 300,
	SLOW: 800,
	VICTORY: 1000,
} as const;

export const TILE_SIZE = 16;

export const DEPTHS = {
	BACKGROUND: 0,
	FURNITURE: 1,
	FURNITURE_LABEL: 2,
	DOG: 3,
	NPC: 5,
	PLAYER: 10,
	DOG_IN_CAR: 11,
	UI_OVERLAY: 50,
	UI: 100,
	DIALOGUE: 1000,
} as const;
