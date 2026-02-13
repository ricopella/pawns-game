import Phaser from "phaser";
import { DIALOGUES } from "../data/dialogues";
import { DialogueBox } from "../systems/DialogueBox";
import { DogFollower } from "../systems/DogFollower";

type OfficePhase =
	| "entering"
	| "meetPloy"
	| "walkToInside"
	| "meetBestie"
	| "walkHallway"
	| "seniorApproach"
	| "postSenior"
	| "walkToBoss"
	| "bossApproach";

export class OfficeArrivalScene extends Phaser.Scene {
	private pawn!: Phaser.GameObjects.Sprite;
	private lucky!: DogFollower;
	private cooper!: DogFollower;
	private dialogueBox!: DialogueBox;
	private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
	private phase: OfficePhase = "entering";
	private speed = 150;
	private ploy!: Phaser.GameObjects.Sprite;
	private bestie!: Phaser.GameObjects.Sprite;
	private mrSenior!: Phaser.GameObjects.Sprite;
	private theBoss!: Phaser.GameObjects.Sprite;
	private npcsTriggered = {
		ploy: false,
		bestie: false,
		senior: false,
		boss: false,
	};

	constructor() {
		super("OfficeArrivalScene");
	}

	create(data?: { phase?: string }): void {
		this.cameras.main.fadeIn(500);
		this.npcsTriggered = { ploy: false, bestie: false, senior: false, boss: false };

		// Draw office
		this.drawOffice();

		// Determine starting phase
		if (data?.phase === "postSenior") {
			this.setupPostSenior();
		} else {
			this.setupEntering();
		}

		// Dialogue
		this.dialogueBox = new DialogueBox({ scene: this });

		if (this.input.keyboard) {
			this.cursors = this.input.keyboard.createCursorKeys();
		}
	}

	private addNpcLabel(x: number, y: number, name: string, depth: number): void {
		this.add
			.text(x, y, name, {
				fontFamily: "monospace",
				fontSize: "12px",
				color: "#ffffff",
				stroke: "#000000",
				strokeThickness: 3,
			})
			.setOrigin(0.5)
			.setDepth(depth + 1);
	}

	private setupEntering(): void {
		this.phase = "entering";

		// Pawn enters from bottom
		this.pawn = this.add.sprite(400, 550, "pawn").setScale(4);
		this.pawn.setDepth(10);

		// Dogs
		this.lucky = new DogFollower({
			scene: this,
			texture: "lucky",
			scale: 4,
			followDistance: 30,
			speed: 180,
			isEnergetic: true,
			side: "left",
		});
		this.lucky.setPosition(360, 560);
		this.lucky.setDepth(9);

		this.cooper = new DogFollower({
			scene: this,
			texture: "cooper",
			scale: 4,
			followDistance: 20,
			speed: 130,
			isEnergetic: false,
			side: "right",
		});
		this.cooper.setPosition(440, 565);
		this.cooper.setDepth(9);

		// Ploy near entrance
		this.ploy = this.add.sprite(300, 420, "ploy").setScale(4);
		this.ploy.setDepth(5);
		this.addNpcLabel(300, 388, "Ploy", 5);

		// Bestie further inside
		this.bestie = this.add.sprite(500, 280, "bestie").setScale(4);
		this.bestie.setDepth(5);
		this.addNpcLabel(500, 248, "Bestie", 5);

		// Mr. Senior in hallway
		this.mrSenior = this.add.sprite(400, 150, "mrSenior").setScale(4);
		this.mrSenior.setDepth(5);
		this.addNpcLabel(400, 118, "Mr. Senior", 5);

		// Boss (hidden initially, for postSenior phase)
		this.theBoss = this.add.sprite(400, 80, "theBoss").setScale(4);
		this.theBoss.setDepth(5);
		this.theBoss.setVisible(false);

		// Office desks as decoration
		this.add.sprite(150, 300, "desk").setScale(3).setDepth(2);
		this.add.sprite(650, 300, "desk").setScale(3).setDepth(2);
		this.add.sprite(150, 180, "desk").setScale(3).setDepth(2);
		this.add.sprite(650, 180, "desk").setScale(3).setDepth(2);

		// Enter dialogue
		this.dialogueBox = new DialogueBox({ scene: this });
		this.time.delayedCall(300, () => {
			this.dialogueBox.show(DIALOGUES.office.enterBuilding, () => {
				this.phase = "meetPloy";
			});
		});
	}

	private setupPostSenior(): void {
		this.phase = "postSenior";

		// Pawn in middle of office
		this.pawn = this.add.sprite(400, 250, "pawn").setScale(4);
		this.pawn.setDepth(10);

		this.lucky = new DogFollower({
			scene: this,
			texture: "lucky",
			scale: 4,
			followDistance: 30,
			speed: 180,
			isEnergetic: true,
			side: "left",
		});
		this.lucky.setPosition(360, 260);
		this.lucky.setDepth(9);

		this.cooper = new DogFollower({
			scene: this,
			texture: "cooper",
			scale: 4,
			followDistance: 20,
			speed: 130,
			isEnergetic: false,
			side: "right",
		});
		this.cooper.setPosition(440, 265);
		this.cooper.setDepth(9);

		// Hide defeated NPCs, show the boss
		this.ploy = this.add.sprite(-100, -100, "ploy").setScale(4).setVisible(false);
		this.bestie = this.add.sprite(-100, -100, "bestie").setScale(4).setVisible(false);
		this.mrSenior = this.add.sprite(-100, -100, "mrSenior").setScale(4).setVisible(false);

		this.theBoss = this.add.sprite(400, 100, "theBoss").setScale(4);
		this.theBoss.setDepth(5);
		this.addNpcLabel(400, 68, "The Boss", 5);

		this.npcsTriggered = { ploy: true, bestie: true, senior: true, boss: false };

		// Desks
		this.add.sprite(150, 300, "desk").setScale(3).setDepth(2);
		this.add.sprite(650, 300, "desk").setScale(3).setDepth(2);

		this.dialogueBox = new DialogueBox({ scene: this });
		this.time.delayedCall(300, () => {
			this.dialogueBox.show(DIALOGUES.office.betweenBattles, () => {
				this.phase = "walkToBoss";
			});
		});
	}

	private drawOffice(): void {
		// Office floor
		for (let y = 0; y < 38; y++) {
			for (let x = 0; x < 50; x++) {
				this.add
					.sprite(x * 16, y * 16, "officeTile")
					.setOrigin(0)
					.setDepth(0);
			}
		}
		// Walls at top
		for (let x = 0; x < 50; x++) {
			this.add
				.sprite(x * 16, 0, "wallTile")
				.setOrigin(0)
				.setDepth(0);
			this.add
				.sprite(x * 16, 16, "wallTile")
				.setOrigin(0)
				.setDepth(0);
		}
	}

	update(_time: number, delta: number): void {
		this.dialogueBox.update();
		if (this.dialogueBox.isActive()) return;

		const canMove =
			this.phase === "meetPloy" ||
			this.phase === "walkToInside" ||
			this.phase === "meetBestie" ||
			this.phase === "walkHallway" ||
			this.phase === "walkToBoss";

		if (canMove) {
			this.handleMovement(delta);
			this.lucky.update(this.pawn.x, this.pawn.y, delta);
			this.cooper.update(this.pawn.x, this.pawn.y, delta);
			this.checkNPCProximity();
		}
	}

	private handleMovement(delta: number): void {
		const moveAmount = this.speed * (delta / 1000);

		if (this.cursors.left.isDown) {
			this.pawn.x -= moveAmount;
			this.pawn.setFlipX(true);
		} else if (this.cursors.right.isDown) {
			this.pawn.x += moveAmount;
			this.pawn.setFlipX(false);
		}
		if (this.cursors.up.isDown) {
			this.pawn.y -= moveAmount;
		} else if (this.cursors.down.isDown) {
			this.pawn.y += moveAmount;
		}

		this.pawn.x = Phaser.Math.Clamp(this.pawn.x, 30, 770);
		this.pawn.y = Phaser.Math.Clamp(this.pawn.y, 40, 570);
	}

	private checkNPCProximity(): void {
		// Meet Ploy
		if (
			!this.npcsTriggered.ploy &&
			Phaser.Math.Distance.Between(this.pawn.x, this.pawn.y, this.ploy.x, this.ploy.y) < 70
		) {
			this.npcsTriggered.ploy = true;
			this.dialogueBox.show(
				[...DIALOGUES.office.meetPloy.ploy, ...DIALOGUES.office.meetPloy.pawn],
				() => {
					this.phase = "walkToInside";
				},
			);
		}

		// Meet Bestie
		if (
			this.npcsTriggered.ploy &&
			!this.npcsTriggered.bestie &&
			Phaser.Math.Distance.Between(this.pawn.x, this.pawn.y, this.bestie.x, this.bestie.y) < 70
		) {
			this.npcsTriggered.bestie = true;
			this.dialogueBox.show(
				[...DIALOGUES.office.meetBestie.bestie, ...DIALOGUES.office.meetBestie.pawn],
				() => {
					this.phase = "walkHallway";
				},
			);
		}

		// Mr. Senior
		if (
			this.npcsTriggered.bestie &&
			!this.npcsTriggered.senior &&
			Phaser.Math.Distance.Between(this.pawn.x, this.pawn.y, this.mrSenior.x, this.mrSenior.y) < 80
		) {
			this.npcsTriggered.senior = true;
			this.dialogueBox.show(DIALOGUES.office.seniorApproach, () => {
				this.cameras.main.fadeOut(300, 0, 0, 0);
				this.cameras.main.once("camerafadeoutcomplete", () => {
					this.scene.start("BattleScene", { battle: "mrSenior" });
				});
			});
		}

		// The Boss (post-senior phase)
		if (
			this.npcsTriggered.senior &&
			!this.npcsTriggered.boss &&
			Phaser.Math.Distance.Between(this.pawn.x, this.pawn.y, this.theBoss.x, this.theBoss.y) < 80
		) {
			this.npcsTriggered.boss = true;
			this.cameras.main.fadeOut(300, 0, 0, 0);
			this.cameras.main.once("camerafadeoutcomplete", () => {
				this.scene.start("BattleScene", { battle: "theBoss" });
			});
		}
	}
}
