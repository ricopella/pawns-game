import type Phaser from "phaser";

// Color palette — Valentine retro with Game Boy vibes
const COLORS = {
	// Skin tones
	skin: 0xf5c5a3,
	skinDark: 0xd4a574,
	skinLight: 0xfde8d0,

	// Hair
	darkHair: 0x2a1a0a,
	brownHair: 0x5c3a1e,
	lightHair: 0xc4956a,

	// Clothing
	pink: 0xff69b4,
	pinkDark: 0xd44a8a,
	red: 0xe74c3c,
	white: 0xffffff,
	whiteOff: 0xf0e6d6,
	blue: 0x4a90d9,
	blueDark: 0x2c5f8a,
	gray: 0x808080,
	grayDark: 0x505050,
	grayLight: 0xb0b0b0,
	black: 0x1a1a1a,
	green: 0x4caf50,
	greenDark: 0x2e7d32,
	brown: 0x8b5e3c,
	brownDark: 0x5d3a1a,
	brownLight: 0xc49a6c,
	yellow: 0xffd700,
	orange: 0xff8c00,

	// Dogs
	luckyFur: 0xf5e6c8,
	luckyFurDark: 0xd4c4a0,
	cooperFur: 0x5c3a1e,
	cooperFurDark: 0x3d2510,

	// Environment
	wallBeige: 0xe8d5b0,
	floorBrown: 0xc4956a,
	roadGray: 0x555555,
	roadLine: 0xffff00,
	grassGreen: 0x5ca04a,
	concrete: 0x999999,
	concreteDark: 0x777777,
	concreteLight: 0xbbbbbb,
	teal: 0x00a896,
	awningOrange: 0xe87d2f,
	awningRed: 0xc0392b,
	neonPink: 0xff1493,
	neonBlue: 0x00d4ff,
	skyBlue: 0x87ceeb,

	// Valentine's
	heartRed: 0xff1744,
	heartPink: 0xff69b4,

	// UI
	dialogBg: 0x1a1a2e,
	dialogBorder: 0xff69b4,
} as const;

function drawPixel(g: Phaser.GameObjects.Graphics, x: number, y: number, color: number): void {
	g.fillStyle(color);
	g.fillRect(x, y, 1, 1);
}

// Pawn — Thai woman, dark hair, pink top
function drawPawn(g: Phaser.GameObjects.Graphics): void {
	// Hair (top)
	for (let x = 5; x <= 10; x++) drawPixel(g, x, 1, COLORS.darkHair);
	for (let x = 4; x <= 11; x++) drawPixel(g, x, 2, COLORS.darkHair);
	for (let x = 4; x <= 11; x++) drawPixel(g, x, 3, COLORS.darkHair);

	// Face
	for (let x = 5; x <= 10; x++) drawPixel(g, x, 4, COLORS.skin);
	for (let x = 5; x <= 10; x++) drawPixel(g, x, 5, COLORS.skin);
	drawPixel(g, 6, 5, COLORS.black); // left eye
	drawPixel(g, 9, 5, COLORS.black); // right eye
	for (let x = 5; x <= 10; x++) drawPixel(g, x, 6, COLORS.skin);
	drawPixel(g, 7, 6, COLORS.pinkDark); // mouth
	drawPixel(g, 8, 6, COLORS.pinkDark);
	// Hair sides
	drawPixel(g, 4, 4, COLORS.darkHair);
	drawPixel(g, 4, 5, COLORS.darkHair);
	drawPixel(g, 4, 6, COLORS.darkHair);
	drawPixel(g, 11, 4, COLORS.darkHair);
	drawPixel(g, 11, 5, COLORS.darkHair);
	drawPixel(g, 11, 6, COLORS.darkHair);

	// Neck
	drawPixel(g, 7, 7, COLORS.skin);
	drawPixel(g, 8, 7, COLORS.skin);

	// Body (pink top)
	for (let x = 5; x <= 10; x++) drawPixel(g, x, 8, COLORS.pink);
	for (let x = 5; x <= 10; x++) drawPixel(g, x, 9, COLORS.pink);
	for (let x = 5; x <= 10; x++) drawPixel(g, x, 10, COLORS.pink);
	for (let x = 5; x <= 10; x++) drawPixel(g, x, 11, COLORS.pink);

	// Arms
	drawPixel(g, 4, 8, COLORS.skin);
	drawPixel(g, 4, 9, COLORS.skin);
	drawPixel(g, 11, 8, COLORS.skin);
	drawPixel(g, 11, 9, COLORS.skin);

	// Legs / skirt
	for (let x = 5; x <= 10; x++) drawPixel(g, x, 12, COLORS.blueDark);
	for (let x = 6; x <= 7; x++) drawPixel(g, x, 13, COLORS.blueDark);
	for (let x = 8; x <= 9; x++) drawPixel(g, x, 13, COLORS.blueDark);

	// Feet
	drawPixel(g, 6, 14, COLORS.brownDark);
	drawPixel(g, 7, 14, COLORS.brownDark);
	drawPixel(g, 8, 14, COLORS.brownDark);
	drawPixel(g, 9, 14, COLORS.brownDark);
}

// Pawn sleeping (side view for bed)
function drawPawnSleeping(g: Phaser.GameObjects.Graphics): void {
	// Blanket area
	for (let y = 6; y <= 12; y++) {
		for (let x = 2; x <= 13; x++) {
			drawPixel(g, x, y, COLORS.pinkDark);
		}
	}
	// Head poking out
	for (let x = 10; x <= 13; x++) drawPixel(g, x, 3, COLORS.darkHair);
	for (let x = 10; x <= 13; x++) drawPixel(g, x, 4, COLORS.darkHair);
	for (let x = 10; x <= 13; x++) drawPixel(g, x, 5, COLORS.skin);
	drawPixel(g, 11, 5, COLORS.black); // closed eye (line)
	drawPixel(g, 12, 5, COLORS.black);
	// Pillow
	for (let x = 9; x <= 14; x++) drawPixel(g, x, 6, COLORS.whiteOff);
	for (let x = 9; x <= 14; x++) drawPixel(g, x, 7, COLORS.whiteOff);
}

// Lucky — small toy poodle, light fur (12x10 sprite)
function drawLucky(g: Phaser.GameObjects.Graphics): void {
	// Body
	for (let x = 2; x <= 6; x++) drawPixel(g, x, 4, COLORS.luckyFur);
	for (let x = 2; x <= 7; x++) drawPixel(g, x, 5, COLORS.luckyFur);
	for (let x = 3; x <= 7; x++) drawPixel(g, x, 6, COLORS.luckyFur);
	// Head
	for (let x = 7; x <= 10; x++) drawPixel(g, x, 2, COLORS.luckyFur);
	for (let x = 7; x <= 10; x++) drawPixel(g, x, 3, COLORS.luckyFur);
	for (let x = 7; x <= 10; x++) drawPixel(g, x, 4, COLORS.luckyFur);
	// Fluffy top
	drawPixel(g, 8, 1, COLORS.luckyFur);
	drawPixel(g, 9, 1, COLORS.luckyFur);
	// Eye
	drawPixel(g, 9, 3, COLORS.black);
	// Nose
	drawPixel(g, 10, 4, COLORS.black);
	// Ears (floppy)
	drawPixel(g, 7, 1, COLORS.luckyFurDark);
	drawPixel(g, 7, 2, COLORS.luckyFurDark);
	drawPixel(g, 11, 2, COLORS.luckyFurDark);
	drawPixel(g, 11, 3, COLORS.luckyFurDark);
	// Legs
	drawPixel(g, 3, 7, COLORS.luckyFurDark);
	drawPixel(g, 4, 7, COLORS.luckyFurDark);
	drawPixel(g, 6, 7, COLORS.luckyFurDark);
	drawPixel(g, 7, 7, COLORS.luckyFurDark);
	// Tail (curly up)
	drawPixel(g, 1, 4, COLORS.luckyFurDark);
	drawPixel(g, 1, 3, COLORS.luckyFurDark);
	drawPixel(g, 2, 3, COLORS.luckyFurDark);
}

// Cooper — bigger toy poodle, dark brown (14x12 sprite)
function drawCooper(g: Phaser.GameObjects.Graphics): void {
	// Body (bigger than Lucky)
	for (let x = 2; x <= 7; x++) drawPixel(g, x, 4, COLORS.cooperFur);
	for (let x = 1; x <= 8; x++) drawPixel(g, x, 5, COLORS.cooperFur);
	for (let x = 1; x <= 8; x++) drawPixel(g, x, 6, COLORS.cooperFur);
	for (let x = 2; x <= 8; x++) drawPixel(g, x, 7, COLORS.cooperFur);
	// Head
	for (let x = 8; x <= 12; x++) drawPixel(g, x, 2, COLORS.cooperFur);
	for (let x = 8; x <= 12; x++) drawPixel(g, x, 3, COLORS.cooperFur);
	for (let x = 8; x <= 12; x++) drawPixel(g, x, 4, COLORS.cooperFur);
	for (let x = 8; x <= 12; x++) drawPixel(g, x, 5, COLORS.cooperFur);
	// Fluffy top
	drawPixel(g, 9, 1, COLORS.cooperFur);
	drawPixel(g, 10, 1, COLORS.cooperFur);
	drawPixel(g, 11, 1, COLORS.cooperFur);
	// Eye
	drawPixel(g, 11, 3, COLORS.black);
	// Nose
	drawPixel(g, 12, 5, COLORS.black);
	drawPixel(g, 13, 5, COLORS.black);
	// Ears (floppy)
	drawPixel(g, 8, 1, COLORS.cooperFurDark);
	drawPixel(g, 8, 2, COLORS.cooperFurDark);
	drawPixel(g, 13, 2, COLORS.cooperFurDark);
	drawPixel(g, 13, 3, COLORS.cooperFurDark);
	// Legs
	drawPixel(g, 2, 8, COLORS.cooperFurDark);
	drawPixel(g, 3, 8, COLORS.cooperFurDark);
	drawPixel(g, 3, 9, COLORS.cooperFurDark);
	drawPixel(g, 6, 8, COLORS.cooperFurDark);
	drawPixel(g, 7, 8, COLORS.cooperFurDark);
	drawPixel(g, 7, 9, COLORS.cooperFurDark);
	// Tail (curly up)
	drawPixel(g, 0, 4, COLORS.cooperFurDark);
	drawPixel(g, 0, 3, COLORS.cooperFurDark);
	drawPixel(g, 1, 3, COLORS.cooperFurDark);
	drawPixel(g, 1, 2, COLORS.cooperFurDark);
}

// Ploy — female NPC, long hair, feminine
function drawPloy(g: Phaser.GameObjects.Graphics): void {
	// Long flowing hair (top + sides going down)
	for (let x = 5; x <= 10; x++) drawPixel(g, x, 0, COLORS.brownHair);
	for (let x = 4; x <= 11; x++) drawPixel(g, x, 1, COLORS.brownHair);
	for (let x = 4; x <= 11; x++) drawPixel(g, x, 2, COLORS.brownHair);
	for (let x = 4; x <= 11; x++) drawPixel(g, x, 3, COLORS.brownHair);
	// Hair bow (pink)
	drawPixel(g, 10, 1, COLORS.pink);
	drawPixel(g, 11, 1, COLORS.pink);
	drawPixel(g, 10, 0, COLORS.pink);
	// Face
	for (let x = 5; x <= 10; x++) drawPixel(g, x, 4, COLORS.skin);
	for (let x = 5; x <= 10; x++) drawPixel(g, x, 5, COLORS.skin);
	drawPixel(g, 6, 5, COLORS.black); // eyes
	drawPixel(g, 9, 5, COLORS.black);
	for (let x = 5; x <= 10; x++) drawPixel(g, x, 6, COLORS.skin);
	drawPixel(g, 7, 6, COLORS.pinkDark); // smile
	drawPixel(g, 8, 6, COLORS.pinkDark);
	// Long hair sides flowing down past face
	drawPixel(g, 4, 4, COLORS.brownHair);
	drawPixel(g, 4, 5, COLORS.brownHair);
	drawPixel(g, 4, 6, COLORS.brownHair);
	drawPixel(g, 4, 7, COLORS.brownHair);
	drawPixel(g, 4, 8, COLORS.brownHair);
	drawPixel(g, 11, 4, COLORS.brownHair);
	drawPixel(g, 11, 5, COLORS.brownHair);
	drawPixel(g, 11, 6, COLORS.brownHair);
	drawPixel(g, 11, 7, COLORS.brownHair);
	drawPixel(g, 11, 8, COLORS.brownHair);
	// Neck
	drawPixel(g, 7, 7, COLORS.skin);
	drawPixel(g, 8, 7, COLORS.skin);
	// Body (cute yellow blouse)
	for (let x = 5; x <= 10; x++) drawPixel(g, x, 8, COLORS.yellow);
	for (let x = 5; x <= 10; x++) drawPixel(g, x, 9, COLORS.yellow);
	for (let x = 5; x <= 10; x++) drawPixel(g, x, 10, COLORS.yellow);
	// Arms
	drawPixel(g, 3, 8, COLORS.skin);
	drawPixel(g, 3, 9, COLORS.skin);
	drawPixel(g, 12, 8, COLORS.skin);
	drawPixel(g, 12, 9, COLORS.skin);
	// Pink skirt
	for (let x = 4; x <= 11; x++) drawPixel(g, x, 11, COLORS.pinkDark);
	for (let x = 5; x <= 10; x++) drawPixel(g, x, 12, COLORS.pinkDark);
	for (let x = 5; x <= 10; x++) drawPixel(g, x, 13, COLORS.pink);
	// Feet
	drawPixel(g, 6, 14, COLORS.brownDark);
	drawPixel(g, 7, 14, COLORS.brownDark);
	drawPixel(g, 8, 14, COLORS.brownDark);
	drawPixel(g, 9, 14, COLORS.brownDark);
}

// Bestie — tomboy styled
function drawBestie(g: Phaser.GameObjects.Graphics): void {
	// Short hair
	for (let x = 5; x <= 10; x++) drawPixel(g, x, 1, COLORS.darkHair);
	for (let x = 5; x <= 10; x++) drawPixel(g, x, 2, COLORS.darkHair);
	for (let x = 5; x <= 10; x++) drawPixel(g, x, 3, COLORS.darkHair);
	// Face
	for (let x = 5; x <= 10; x++) drawPixel(g, x, 4, COLORS.skin);
	for (let x = 5; x <= 10; x++) drawPixel(g, x, 5, COLORS.skin);
	drawPixel(g, 6, 5, COLORS.black);
	drawPixel(g, 9, 5, COLORS.black);
	for (let x = 5; x <= 10; x++) drawPixel(g, x, 6, COLORS.skin);
	drawPixel(g, 7, 6, COLORS.brownDark); // small smile
	drawPixel(g, 8, 6, COLORS.brownDark);
	// Neck
	drawPixel(g, 7, 7, COLORS.skin);
	drawPixel(g, 8, 7, COLORS.skin);
	// Body (green t-shirt — tomboy)
	for (let x = 5; x <= 10; x++) drawPixel(g, x, 8, COLORS.green);
	for (let x = 5; x <= 10; x++) drawPixel(g, x, 9, COLORS.green);
	for (let x = 5; x <= 10; x++) drawPixel(g, x, 10, COLORS.green);
	for (let x = 5; x <= 10; x++) drawPixel(g, x, 11, COLORS.green);
	drawPixel(g, 4, 8, COLORS.skin);
	drawPixel(g, 4, 9, COLORS.skin);
	drawPixel(g, 11, 8, COLORS.skin);
	drawPixel(g, 11, 9, COLORS.skin);
	// Legs (jeans)
	for (let x = 5; x <= 10; x++) drawPixel(g, x, 12, COLORS.blue);
	for (let x = 6; x <= 7; x++) drawPixel(g, x, 13, COLORS.blue);
	for (let x = 8; x <= 9; x++) drawPixel(g, x, 13, COLORS.blue);
	drawPixel(g, 6, 14, COLORS.brownDark);
	drawPixel(g, 7, 14, COLORS.brownDark);
	drawPixel(g, 8, 14, COLORS.brownDark);
	drawPixel(g, 9, 14, COLORS.brownDark);
}

// Mr. Senior — male NPC, staring expression
function drawMrSenior(g: Phaser.GameObjects.Graphics): void {
	// Hair
	for (let x = 5; x <= 10; x++) drawPixel(g, x, 1, COLORS.darkHair);
	for (let x = 5; x <= 10; x++) drawPixel(g, x, 2, COLORS.darkHair);
	// Face
	for (let x = 5; x <= 10; x++) drawPixel(g, x, 3, COLORS.skin);
	for (let x = 5; x <= 10; x++) drawPixel(g, x, 4, COLORS.skin);
	for (let x = 5; x <= 10; x++) drawPixel(g, x, 5, COLORS.skin);
	// Big staring eyes
	drawPixel(g, 6, 4, COLORS.white);
	drawPixel(g, 7, 4, COLORS.black);
	drawPixel(g, 9, 4, COLORS.white);
	drawPixel(g, 10, 4, COLORS.black);
	// Flat mouth
	drawPixel(g, 7, 5, COLORS.brownDark);
	drawPixel(g, 8, 5, COLORS.brownDark);
	for (let x = 5; x <= 10; x++) drawPixel(g, x, 6, COLORS.skin);
	// Neck
	drawPixel(g, 7, 7, COLORS.skin);
	drawPixel(g, 8, 7, COLORS.skin);
	// Body (white shirt + tie)
	for (let x = 5; x <= 10; x++) drawPixel(g, x, 8, COLORS.whiteOff);
	for (let x = 5; x <= 10; x++) drawPixel(g, x, 9, COLORS.whiteOff);
	for (let x = 5; x <= 10; x++) drawPixel(g, x, 10, COLORS.whiteOff);
	for (let x = 5; x <= 10; x++) drawPixel(g, x, 11, COLORS.whiteOff);
	drawPixel(g, 7, 8, COLORS.red); // tie
	drawPixel(g, 8, 8, COLORS.red);
	drawPixel(g, 7, 9, COLORS.red);
	drawPixel(g, 8, 9, COLORS.red);
	drawPixel(g, 7, 10, COLORS.red);
	drawPixel(g, 4, 8, COLORS.skin);
	drawPixel(g, 4, 9, COLORS.skin);
	drawPixel(g, 11, 8, COLORS.skin);
	drawPixel(g, 11, 9, COLORS.skin);
	// Pants
	for (let x = 5; x <= 10; x++) drawPixel(g, x, 12, COLORS.grayDark);
	for (let x = 6; x <= 7; x++) drawPixel(g, x, 13, COLORS.grayDark);
	for (let x = 8; x <= 9; x++) drawPixel(g, x, 13, COLORS.grayDark);
	drawPixel(g, 6, 14, COLORS.black);
	drawPixel(g, 7, 14, COLORS.black);
	drawPixel(g, 8, 14, COLORS.black);
	drawPixel(g, 9, 14, COLORS.black);
}

// The Boss — short, bald on top, hair on sides (Thai George Costanza)
function drawTheBoss(g: Phaser.GameObjects.Graphics): void {
	// Bald top + hair on sides
	for (let x = 5; x <= 10; x++) drawPixel(g, x, 1, COLORS.skinDark); // bald
	drawPixel(g, 4, 2, COLORS.darkHair); // hair sides
	drawPixel(g, 4, 3, COLORS.darkHair);
	drawPixel(g, 11, 2, COLORS.darkHair);
	drawPixel(g, 11, 3, COLORS.darkHair);
	for (let x = 5; x <= 10; x++) drawPixel(g, x, 2, COLORS.skinDark);
	// Face (slightly different skin tone)
	for (let x = 5; x <= 10; x++) drawPixel(g, x, 3, COLORS.skin);
	for (let x = 5; x <= 10; x++) drawPixel(g, x, 4, COLORS.skin);
	for (let x = 5; x <= 10; x++) drawPixel(g, x, 5, COLORS.skin);
	// Angry eyes
	drawPixel(g, 6, 3, COLORS.black); // eyebrows
	drawPixel(g, 7, 3, COLORS.black);
	drawPixel(g, 9, 3, COLORS.black);
	drawPixel(g, 10, 3, COLORS.black);
	drawPixel(g, 6, 4, COLORS.black); // eyes
	drawPixel(g, 9, 4, COLORS.black);
	// Frowning mouth
	drawPixel(g, 7, 5, COLORS.red);
	drawPixel(g, 8, 5, COLORS.red);
	for (let x = 5; x <= 10; x++) drawPixel(g, x, 6, COLORS.skin);
	// Neck
	drawPixel(g, 7, 7, COLORS.skin);
	drawPixel(g, 8, 7, COLORS.skin);
	// Body (dark suit)
	for (let x = 5; x <= 10; x++) drawPixel(g, x, 8, COLORS.grayDark);
	for (let x = 5; x <= 10; x++) drawPixel(g, x, 9, COLORS.grayDark);
	for (let x = 5; x <= 10; x++) drawPixel(g, x, 10, COLORS.grayDark);
	for (let x = 5; x <= 10; x++) drawPixel(g, x, 11, COLORS.grayDark);
	drawPixel(g, 7, 8, COLORS.red); // tie
	drawPixel(g, 8, 8, COLORS.red);
	drawPixel(g, 7, 9, COLORS.red);
	drawPixel(g, 4, 8, COLORS.skin);
	drawPixel(g, 4, 9, COLORS.skin);
	drawPixel(g, 11, 8, COLORS.skin);
	drawPixel(g, 11, 9, COLORS.skin);
	// Pants
	for (let x = 5; x <= 10; x++) drawPixel(g, x, 12, COLORS.black);
	for (let x = 6; x <= 7; x++) drawPixel(g, x, 13, COLORS.black);
	for (let x = 8; x <= 9; x++) drawPixel(g, x, 13, COLORS.black);
	drawPixel(g, 6, 14, COLORS.black);
	drawPixel(g, 7, 14, COLORS.black);
	drawPixel(g, 8, 14, COLORS.black);
	drawPixel(g, 9, 14, COLORS.black);
}

// Boyfriend — half Asian/half white, light skin, clean haircut, handsome
function drawBoyfriend(g: Phaser.GameObjects.Graphics): void {
	// Clean short hair
	for (let x = 5; x <= 10; x++) drawPixel(g, x, 1, COLORS.brownHair);
	for (let x = 5; x <= 10; x++) drawPixel(g, x, 2, COLORS.brownHair);
	// Face (lighter skin)
	for (let x = 5; x <= 10; x++) drawPixel(g, x, 3, COLORS.skinLight);
	for (let x = 5; x <= 10; x++) drawPixel(g, x, 4, COLORS.skinLight);
	for (let x = 5; x <= 10; x++) drawPixel(g, x, 5, COLORS.skinLight);
	drawPixel(g, 6, 4, COLORS.brownDark); // eyes
	drawPixel(g, 9, 4, COLORS.brownDark);
	// Smile
	drawPixel(g, 7, 5, COLORS.pinkDark);
	drawPixel(g, 8, 5, COLORS.pinkDark);
	for (let x = 5; x <= 10; x++) drawPixel(g, x, 6, COLORS.skinLight);
	// Neck
	drawPixel(g, 7, 7, COLORS.skinLight);
	drawPixel(g, 8, 7, COLORS.skinLight);
	// Body (nice red shirt for Valentine's)
	for (let x = 5; x <= 10; x++) drawPixel(g, x, 8, COLORS.red);
	for (let x = 5; x <= 10; x++) drawPixel(g, x, 9, COLORS.red);
	for (let x = 5; x <= 10; x++) drawPixel(g, x, 10, COLORS.red);
	for (let x = 5; x <= 10; x++) drawPixel(g, x, 11, COLORS.red);
	drawPixel(g, 4, 8, COLORS.skinLight);
	drawPixel(g, 4, 9, COLORS.skinLight);
	drawPixel(g, 11, 8, COLORS.skinLight);
	drawPixel(g, 11, 9, COLORS.skinLight);
	// Pants
	for (let x = 5; x <= 10; x++) drawPixel(g, x, 12, COLORS.blueDark);
	for (let x = 6; x <= 7; x++) drawPixel(g, x, 13, COLORS.blueDark);
	for (let x = 8; x <= 9; x++) drawPixel(g, x, 13, COLORS.blueDark);
	drawPixel(g, 6, 14, COLORS.brownDark);
	drawPixel(g, 7, 14, COLORS.brownDark);
	drawPixel(g, 8, 14, COLORS.brownDark);
	drawPixel(g, 9, 14, COLORS.brownDark);
}

// Top-down car (Pawn's gray Mazda sedan)
function drawCarTopDown(g: Phaser.GameObjects.Graphics): void {
	// Car body (24x32 sprite area, centered)
	const cx = 4;
	const cy = 2;
	// Main body
	for (let y = cy; y < cy + 28; y++) {
		for (let x = cx; x < cx + 16; x++) {
			drawPixel(g, x, y, COLORS.grayDark);
		}
	}
	// Windshields (lighter)
	for (let x = cx + 2; x < cx + 14; x++) {
		for (let y = cy + 3; y < cy + 7; y++) {
			drawPixel(g, x, y, COLORS.blueDark);
		}
	}
	// Rear window
	for (let x = cx + 2; x < cx + 14; x++) {
		for (let y = cy + 20; y < cy + 24; y++) {
			drawPixel(g, x, y, COLORS.blueDark);
		}
	}
	// Headlights
	drawPixel(g, cx + 2, cy, COLORS.yellow);
	drawPixel(g, cx + 3, cy, COLORS.yellow);
	drawPixel(g, cx + 12, cy, COLORS.yellow);
	drawPixel(g, cx + 13, cy, COLORS.yellow);
	// Taillights
	drawPixel(g, cx + 2, cy + 27, COLORS.red);
	drawPixel(g, cx + 3, cy + 27, COLORS.red);
	drawPixel(g, cx + 12, cy + 27, COLORS.red);
	drawPixel(g, cx + 13, cy + 27, COLORS.red);
	// Wheels
	for (let y = cy + 5; y < cy + 9; y++) {
		drawPixel(g, cx - 1, y, COLORS.black);
		drawPixel(g, cx + 16, y, COLORS.black);
	}
	for (let y = cy + 19; y < cy + 23; y++) {
		drawPixel(g, cx - 1, y, COLORS.black);
		drawPixel(g, cx + 16, y, COLORS.black);
	}
}

// Obstacle car (red, simpler)
function drawObstacleCar(g: Phaser.GameObjects.Graphics): void {
	const cx = 4;
	const cy = 2;
	for (let y = cy; y < cy + 24; y++) {
		for (let x = cx; x < cx + 14; x++) {
			drawPixel(g, x, y, COLORS.red);
		}
	}
	// Windshield
	for (let x = cx + 2; x < cx + 12; x++) {
		for (let y = cy + 4; y < cy + 7; y++) {
			drawPixel(g, x, y, COLORS.blueDark);
		}
	}
	// Taillights
	drawPixel(g, cx + 1, cy + 23, COLORS.yellow);
	drawPixel(g, cx + 12, cy + 23, COLORS.yellow);
}

// Motorbike obstacle
function drawMotorbike(g: Phaser.GameObjects.Graphics): void {
	// Rider body
	for (let x = 3; x <= 5; x++) drawPixel(g, x, 1, COLORS.darkHair);
	for (let x = 3; x <= 5; x++) drawPixel(g, x, 2, COLORS.skin);
	for (let x = 3; x <= 5; x++) drawPixel(g, x, 3, COLORS.black);
	for (let x = 3; x <= 5; x++) drawPixel(g, x, 4, COLORS.black);
	// Bike
	for (let x = 2; x <= 6; x++) drawPixel(g, x, 5, COLORS.gray);
	for (let x = 2; x <= 6; x++) drawPixel(g, x, 6, COLORS.gray);
	for (let x = 3; x <= 5; x++) drawPixel(g, x, 7, COLORS.grayDark);
	// Wheels
	drawPixel(g, 4, 0, COLORS.black);
	drawPixel(g, 4, 8, COLORS.black);
}

// Heart sprite for UI
function drawHeart(g: Phaser.GameObjects.Graphics): void {
	const c = COLORS.heartRed;
	drawPixel(g, 1, 0, c);
	drawPixel(g, 2, 0, c);
	drawPixel(g, 4, 0, c);
	drawPixel(g, 5, 0, c);
	for (let x = 0; x <= 6; x++) drawPixel(g, x, 1, c);
	for (let x = 0; x <= 6; x++) drawPixel(g, x, 2, c);
	for (let x = 1; x <= 5; x++) drawPixel(g, x, 3, c);
	for (let x = 2; x <= 4; x++) drawPixel(g, x, 4, c);
	drawPixel(g, 3, 5, c);
}

// Dog bowl
function drawDogBowl(g: Phaser.GameObjects.Graphics): void {
	for (let x = 1; x <= 5; x++) drawPixel(g, x, 0, COLORS.grayLight);
	for (let x = 0; x <= 6; x++) drawPixel(g, x, 1, COLORS.gray);
	for (let x = 0; x <= 6; x++) drawPixel(g, x, 2, COLORS.gray);
	for (let x = 1; x <= 5; x++) drawPixel(g, x, 3, COLORS.grayDark);
	// Food
	for (let x = 2; x <= 4; x++) drawPixel(g, x, 0, COLORS.brown);
}

// Bed
function drawBed(g: Phaser.GameObjects.Graphics): void {
	// Bed frame
	for (let y = 0; y < 24; y++) {
		for (let x = 0; x < 32; x++) {
			drawPixel(g, x, y, COLORS.brownDark);
		}
	}
	// Mattress
	for (let y = 2; y < 22; y++) {
		for (let x = 2; x < 30; x++) {
			drawPixel(g, x, y, COLORS.whiteOff);
		}
	}
	// Blanket
	for (let y = 8; y < 20; y++) {
		for (let x = 2; x < 30; x++) {
			drawPixel(g, x, y, COLORS.pink);
		}
	}
	// Pillow
	for (let y = 3; y < 7; y++) {
		for (let x = 18; x < 28; x++) {
			drawPixel(g, x, y, COLORS.whiteOff);
		}
	}
}

// Traffic light
function drawTrafficLight(g: Phaser.GameObjects.Graphics, color: "red" | "green"): void {
	// Post
	for (let y = 0; y < 12; y++) {
		drawPixel(g, 3, y, COLORS.grayDark);
		drawPixel(g, 4, y, COLORS.grayDark);
	}
	// Box
	for (let y = 0; y < 8; y++) {
		for (let x = 1; x <= 6; x++) {
			drawPixel(g, x, y, COLORS.black);
		}
	}
	// Lights
	drawPixel(g, 3, 1, color === "red" ? COLORS.red : COLORS.grayDark);
	drawPixel(g, 4, 1, color === "red" ? COLORS.red : COLORS.grayDark);
	drawPixel(g, 3, 3, COLORS.grayDark);
	drawPixel(g, 4, 3, COLORS.grayDark);
	drawPixel(g, 3, 5, color === "green" ? COLORS.green : COLORS.grayDark);
	drawPixel(g, 4, 5, color === "green" ? COLORS.green : COLORS.grayDark);
}

// Building (TTB Bank)
function drawBuilding(g: Phaser.GameObjects.Graphics): void {
	// Main structure
	for (let y = 0; y < 48; y++) {
		for (let x = 0; x < 64; x++) {
			drawPixel(g, x, y, COLORS.wallBeige);
		}
	}
	// Windows
	for (let row = 0; row < 4; row++) {
		for (let col = 0; col < 5; col++) {
			const wx = 4 + col * 12;
			const wy = 4 + row * 10;
			for (let y = wy; y < wy + 6; y++) {
				for (let x = wx; x < wx + 8; x++) {
					drawPixel(g, x, y, COLORS.blueDark);
				}
			}
		}
	}
	// Door
	for (let y = 36; y < 48; y++) {
		for (let x = 26; x < 38; x++) {
			drawPixel(g, x, y, COLORS.brownDark);
		}
	}
	// Sign "TTB"
	// T
	for (let x = 20; x < 26; x++) drawPixel(g, x, 1, COLORS.blue);
	drawPixel(g, 22, 2, COLORS.blue);
	drawPixel(g, 23, 2, COLORS.blue);
	drawPixel(g, 22, 3, COLORS.blue);
	drawPixel(g, 23, 3, COLORS.blue);
	// T
	for (let x = 28; x < 34; x++) drawPixel(g, x, 1, COLORS.blue);
	drawPixel(g, 30, 2, COLORS.blue);
	drawPixel(g, 31, 2, COLORS.blue);
	drawPixel(g, 30, 3, COLORS.blue);
	drawPixel(g, 31, 3, COLORS.blue);
	// B
	for (let y = 1; y <= 3; y++) drawPixel(g, 36, y, COLORS.blue);
	drawPixel(g, 37, 1, COLORS.blue);
	drawPixel(g, 38, 1, COLORS.blue);
	drawPixel(g, 37, 2, COLORS.blue);
	drawPixel(g, 37, 3, COLORS.blue);
	drawPixel(g, 38, 3, COLORS.blue);
}

// Tuk-tuk (iconic Bangkok vehicle)
function drawTukTuk(g: Phaser.GameObjects.Graphics): void {
	// Canopy (blue/teal top)
	for (let x = 1; x <= 7; x++) drawPixel(g, x, 0, COLORS.teal);
	for (let x = 0; x <= 8; x++) drawPixel(g, x, 1, COLORS.teal);
	for (let x = 0; x <= 8; x++) drawPixel(g, x, 2, COLORS.teal);
	// Body (yellow/gold)
	for (let x = 1; x <= 7; x++) drawPixel(g, x, 3, COLORS.yellow);
	for (let x = 1; x <= 7; x++) drawPixel(g, x, 4, COLORS.yellow);
	for (let x = 1; x <= 7; x++) drawPixel(g, x, 5, COLORS.yellow);
	// Open back
	drawPixel(g, 2, 4, COLORS.black);
	drawPixel(g, 6, 4, COLORS.black);
	// Wheels
	drawPixel(g, 1, 6, COLORS.black);
	drawPixel(g, 4, 6, COLORS.black);
	drawPixel(g, 7, 6, COLORS.black);
	// Headlight
	drawPixel(g, 4, 0, COLORS.yellow);
}

// Bus (Bangkok city bus, big obstacle)
function drawBus(g: Phaser.GameObjects.Graphics): void {
	// Main body (red/orange Bangkok bus)
	for (let y = 0; y < 36; y++) {
		for (let x = 1; x < 17; x++) {
			drawPixel(g, x, y, COLORS.awningRed);
		}
	}
	// White stripe
	for (let y = 14; y < 17; y++) {
		for (let x = 1; x < 17; x++) {
			drawPixel(g, x, y, COLORS.white);
		}
	}
	// Windshield
	for (let x = 3; x < 15; x++) {
		for (let y = 2; y < 6; y++) {
			drawPixel(g, x, y, COLORS.blueDark);
		}
	}
	// Windows along sides
	for (let y = 7; y < 10; y++) {
		for (let x = 3; x < 7; x++) drawPixel(g, x, y, COLORS.blueDark);
		for (let x = 9; x < 13; x++) drawPixel(g, x, y, COLORS.blueDark);
	}
	// Rear window
	for (let x = 3; x < 15; x++) {
		for (let y = 28; y < 32; y++) {
			drawPixel(g, x, y, COLORS.blueDark);
		}
	}
	// Wheels
	for (let y = 5; y < 9; y++) {
		drawPixel(g, 0, y, COLORS.black);
		drawPixel(g, 17, y, COLORS.black);
	}
	for (let y = 26; y < 30; y++) {
		drawPixel(g, 0, y, COLORS.black);
		drawPixel(g, 17, y, COLORS.black);
	}
}

// Office chair (top-down view)
function drawOfficeChair(g: Phaser.GameObjects.Graphics): void {
	// Seat (dark gray circle-ish)
	for (let x = 1; x <= 5; x++) drawPixel(g, x, 1, COLORS.grayDark);
	for (let x = 0; x <= 6; x++) drawPixel(g, x, 2, COLORS.grayDark);
	for (let x = 0; x <= 6; x++) drawPixel(g, x, 3, COLORS.grayDark);
	for (let x = 1; x <= 5; x++) drawPixel(g, x, 4, COLORS.grayDark);
	// Backrest
	for (let x = 1; x <= 5; x++) drawPixel(g, x, 0, COLORS.black);
	// Wheels (5 points)
	drawPixel(g, 0, 5, COLORS.gray);
	drawPixel(g, 3, 5, COLORS.gray);
	drawPixel(g, 6, 5, COLORS.gray);
}

function generateTexture(
	scene: Phaser.Scene,
	key: string,
	width: number,
	height: number,
	drawFn: (g: Phaser.GameObjects.Graphics) => void,
): void {
	const g = scene.add.graphics();
	drawFn(g);
	g.generateTexture(key, width, height);
	g.destroy();
}

export function generateAllTextures(scene: Phaser.Scene): void {
	// Characters (16x16)
	generateTexture(scene, "pawn", 16, 16, drawPawn);
	generateTexture(scene, "pawnSleeping", 16, 16, drawPawnSleeping);
	generateTexture(scene, "ploy", 16, 16, drawPloy);
	generateTexture(scene, "bestie", 16, 16, drawBestie);
	generateTexture(scene, "mrSenior", 16, 16, drawMrSenior);
	generateTexture(scene, "theBoss", 16, 16, drawTheBoss);
	generateTexture(scene, "boyfriend", 16, 16, drawBoyfriend);

	// Dogs (8x8)
	generateTexture(scene, "lucky", 12, 10, drawLucky);
	generateTexture(scene, "cooper", 14, 12, drawCooper);

	// Vehicles
	generateTexture(scene, "playerCar", 24, 32, drawCarTopDown);
	generateTexture(scene, "obstacleCar", 22, 28, drawObstacleCar);
	generateTexture(scene, "motorbike", 9, 9, drawMotorbike);
	generateTexture(scene, "tukTuk", 9, 7, drawTukTuk);
	generateTexture(scene, "bus", 18, 36, drawBus);

	// Office furniture
	generateTexture(scene, "officeChair", 7, 6, drawOfficeChair);

	// UI
	generateTexture(scene, "heart", 7, 6, drawHeart);
	generateTexture(scene, "dogBowl", 7, 4, drawDogBowl);

	// Environment
	generateTexture(scene, "bed", 32, 24, drawBed);
	generateTexture(scene, "building", 64, 48, drawBuilding);
	generateTexture(scene, "trafficLightRed", 8, 12, (g) => drawTrafficLight(g, "red"));
	generateTexture(scene, "trafficLightGreen", 8, 12, (g) => drawTrafficLight(g, "green"));

	// Simple colored rectangles for tiles
	const tileG = scene.add.graphics();

	// Road tile
	tileG.fillStyle(COLORS.roadGray);
	tileG.fillRect(0, 0, 16, 16);
	tileG.generateTexture("roadTile", 16, 16);
	tileG.clear();

	// Road line (dashed)
	tileG.fillStyle(COLORS.roadGray);
	tileG.fillRect(0, 0, 16, 16);
	tileG.fillStyle(COLORS.roadLine);
	tileG.fillRect(7, 2, 2, 6);
	tileG.generateTexture("roadLineTile", 16, 16);
	tileG.clear();

	// Grass tile
	tileG.fillStyle(COLORS.grassGreen);
	tileG.fillRect(0, 0, 16, 16);
	tileG.generateTexture("grassTile", 16, 16);
	tileG.clear();

	// Floor tile
	tileG.fillStyle(COLORS.floorBrown);
	tileG.fillRect(0, 0, 16, 16);
	tileG.fillStyle(0xb8865a);
	tileG.fillRect(0, 0, 8, 8);
	tileG.fillRect(8, 8, 8, 8);
	tileG.generateTexture("floorTile", 16, 16);
	tileG.clear();

	// Wall tile
	tileG.fillStyle(COLORS.wallBeige);
	tileG.fillRect(0, 0, 16, 16);
	tileG.generateTexture("wallTile", 16, 16);
	tileG.clear();

	// Bedroom wall
	tileG.fillStyle(0xdeb8e6);
	tileG.fillRect(0, 0, 16, 16);
	tileG.generateTexture("bedroomWall", 16, 16);
	tileG.clear();

	// Bedroom floor
	tileG.fillStyle(0xc49a6c);
	tileG.fillRect(0, 0, 16, 16);
	tileG.generateTexture("bedroomFloor", 16, 16);
	tileG.clear();

	// Office floor
	tileG.fillStyle(0xd0d0d0);
	tileG.fillRect(0, 0, 16, 16);
	tileG.fillStyle(0xc8c8c8);
	tileG.fillRect(0, 0, 8, 8);
	tileG.fillRect(8, 8, 8, 8);
	tileG.generateTexture("officeTile", 16, 16);
	tileG.clear();

	// Desk
	tileG.fillStyle(COLORS.brown);
	tileG.fillRect(0, 0, 32, 16);
	tileG.fillStyle(COLORS.brownDark);
	tileG.fillRect(0, 14, 32, 2);
	tileG.generateTexture("desk", 32, 16);
	tileG.clear();

	// Sidewalk tile (Bangkok concrete)
	tileG.fillStyle(0xc0b8a8);
	tileG.fillRect(0, 0, 16, 16);
	tileG.fillStyle(0xb5ad9d);
	tileG.fillRect(0, 8, 16, 1);
	tileG.fillRect(8, 0, 1, 16);
	tileG.generateTexture("sidewalkTile", 16, 16);
	tileG.clear();

	// Building side tile (for driving scene sides)
	tileG.fillStyle(0x8a7d6b);
	tileG.fillRect(0, 0, 16, 16);
	tileG.fillStyle(0x7a6d5b);
	tileG.fillRect(0, 0, 16, 1);
	tileG.fillStyle(0x6a9cc5);
	tileG.fillRect(3, 4, 5, 4);
	tileG.fillRect(10, 4, 5, 4);
	tileG.fillRect(3, 11, 5, 4);
	tileG.generateTexture("buildingSideTile", 16, 16);
	tileG.clear();

	// Parking concrete tile
	tileG.fillStyle(0x888888);
	tileG.fillRect(0, 0, 16, 16);
	tileG.fillStyle(0x808080);
	tileG.fillRect(0, 15, 16, 1);
	tileG.fillRect(15, 0, 1, 16);
	tileG.generateTexture("parkingTile", 16, 16);
	tileG.clear();

	tileG.destroy();
}
