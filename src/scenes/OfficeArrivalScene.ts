import Phaser from "phaser";
import { DOGS, FADE, INTERACTION, PLAYER, PLAYER_BOUNDS } from "../config/constants";
import { DIALOGUES } from "../data/dialogues";
import { DialogueBox } from "../systems/DialogueBox";
import { DogFollower } from "../systems/DogFollower";
import { createMusicToggle } from "../systems/MusicManager";
import { PlayerController } from "../systems/PlayerController";

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
	private playerController!: PlayerController;
	private phase: OfficePhase = "entering";
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
		this.cameras.main.fadeIn(FADE.DEFAULT);
		createMusicToggle(this);
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

		// Scene cleanup
		this.events.on("shutdown", this.cleanup, this);
	}

	private cleanup(): void {
		this.lucky.destroy();
		this.cooper.destroy();
		this.dialogueBox.destroy();
		this.events.off("shutdown", this.cleanup, this);
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
		this.pawn = this.add.sprite(400, 550, "pawn").setScale(PLAYER.SCALE);
		this.pawn.setDepth(PLAYER.DEPTH);

		// Player controller
		this.playerController = new PlayerController({
			scene: this,
			sprite: this.pawn,
			bounds: PLAYER_BOUNDS.office,
		});

		// Dogs
		this.lucky = new DogFollower({
			scene: this,
			texture: "lucky",
			...DOGS.lucky,
		});
		this.lucky.setPosition(360, 560);
		this.lucky.setDepth(9);

		this.cooper = new DogFollower({
			scene: this,
			texture: "cooper",
			...DOGS.cooper,
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
		this.pawn = this.add.sprite(400, 250, "pawn").setScale(PLAYER.SCALE);
		this.pawn.setDepth(PLAYER.DEPTH);

		// Player controller
		this.playerController = new PlayerController({
			scene: this,
			sprite: this.pawn,
			bounds: PLAYER_BOUNDS.office,
		});

		this.lucky = new DogFollower({
			scene: this,
			texture: "lucky",
			...DOGS.lucky,
		});
		this.lucky.setPosition(360, 260);
		this.lucky.setDepth(9);

		this.cooper = new DogFollower({
			scene: this,
			texture: "cooper",
			...DOGS.cooper,
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

		const g = this.add.graphics();
		g.setDepth(1);

		// Walls at top and left/right
		g.fillStyle(0xd0d0d0);
		g.fillRect(0, 0, 800, 35);
		g.fillStyle(0xc0c0c0);
		g.fillRect(0, 0, 10, 600);
		g.fillRect(790, 0, 10, 600);

		// Windows along top wall (high floor city view)
		for (let i = 0; i < 8; i++) {
			const wx = 30 + i * 95;
			// Window frame
			g.fillStyle(0x888888);
			g.fillRect(wx - 2, 2, 74, 30);
			// Sky view
			g.fillStyle(0x87ceeb);
			g.fillRect(wx, 4, 70, 26);
			// City skyline silhouette
			g.fillStyle(0x555555, 0.4);
			// Random building heights in view
			const heights = [18, 12, 22, 8, 16, 20, 10];
			for (let b = 0; b < 7; b++) {
				const bh = heights[b] ?? 12;
				g.fillRect(wx + b * 10, 30 - bh, 8, bh);
			}
			// Clouds
			g.fillStyle(0xffffff, 0.5);
			g.fillRect(wx + 10, 8, 20, 5);
			g.fillRect(wx + 40, 10, 15, 4);
		}

		// Windows along left wall
		for (let i = 0; i < 4; i++) {
			const wy = 80 + i * 120;
			g.fillStyle(0x888888);
			g.fillRect(0, wy - 2, 10, 64);
			g.fillStyle(0x87ceeb);
			g.fillRect(0, wy, 8, 60);
			g.fillStyle(0x555555, 0.4);
			g.fillRect(0, wy + 40, 8, 20);
		}

		// Desk pod clusters (open plan layout)
		this.drawDeskPod(g, 100, 150, 3); // left pod, 3 desks
		this.drawDeskPod(g, 500, 150, 3); // right pod, 3 desks
		this.drawDeskPod(g, 100, 350, 2); // bottom left pod
		this.drawDeskPod(g, 500, 350, 2); // bottom right pod

		// Partition / low divider between pods
		g.fillStyle(0xb0b0b0);
		g.fillRect(360, 100, 4, 200);
		g.fillStyle(0xaaaaaa);
		g.fillRect(360, 105, 4, 5);
		g.fillRect(360, 200, 4, 5);
		g.fillRect(360, 290, 4, 5);

		// Water cooler
		g.fillStyle(0x6ab0d8);
		g.fillRect(760, 200, 20, 30);
		g.fillStyle(0xc0e0ff);
		g.fillRect(763, 200, 14, 15);
		g.fillStyle(0x666666);
		g.fillRect(760, 230, 20, 5);
		this.add
			.text(770, 240, "Water", {
				fontFamily: "monospace",
				fontSize: "8px",
				color: "#aaaaaa",
			})
			.setOrigin(0.5)
			.setDepth(2);

		// Printer/copier area
		g.fillStyle(0x444444);
		g.fillRect(750, 400, 35, 25);
		g.fillStyle(0x333333);
		g.fillRect(753, 403, 29, 10);
		g.fillStyle(0xffffff);
		g.fillRect(755, 415, 10, 5);
		this.add
			.text(768, 430, "Printer", {
				fontFamily: "monospace",
				fontSize: "8px",
				color: "#aaaaaa",
			})
			.setOrigin(0.5)
			.setDepth(2);

		// Whiteboard on right wall
		g.fillStyle(0xffffff);
		g.fillRect(785, 100, 12, 80);
		g.lineStyle(1, 0x888888);
		g.strokeRect(785, 100, 12, 80);

		// Potted plant near entrance
		g.fillStyle(0x8b4513);
		g.fillRect(30, 520, 20, 15);
		g.fillStyle(0x228b22);
		g.fillCircle(40, 510, 15);
		g.fillStyle(0x2e8b57);
		g.fillCircle(35, 505, 10);
	}

	private drawDeskPod(
		g: Phaser.GameObjects.Graphics,
		startX: number,
		startY: number,
		rows: number,
	): void {
		for (let r = 0; r < rows; r++) {
			const dy = startY + r * 60;
			// Left desk
			g.fillStyle(0xc49a6c);
			g.fillRect(startX, dy, 70, 25);
			g.fillStyle(0xb08a5c);
			g.fillRect(startX, dy + 23, 70, 2);
			// Monitor on desk
			g.fillStyle(0x333333);
			g.fillRect(startX + 25, dy - 5, 20, 12);
			g.fillStyle(0x6a9cc5);
			g.fillRect(startX + 27, dy - 3, 16, 8);

			// Right desk (facing the left one)
			g.fillStyle(0xc49a6c);
			g.fillRect(startX + 80, dy, 70, 25);
			g.fillStyle(0xb08a5c);
			g.fillRect(startX + 80, dy + 23, 70, 2);
			// Monitor
			g.fillStyle(0x333333);
			g.fillRect(startX + 105, dy - 5, 20, 12);
			g.fillStyle(0x6a9cc5);
			g.fillRect(startX + 107, dy - 3, 16, 8);

			// Chairs (using office chair sprites)
			this.add
				.sprite(startX + 35, dy + 38, "officeChair")
				.setScale(3)
				.setDepth(1);
			this.add
				.sprite(startX + 115, dy + 38, "officeChair")
				.setScale(3)
				.setDepth(1);
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
			this.playerController.update(delta);
			this.lucky.update(this.pawn.x, this.pawn.y, delta);
			this.cooper.update(this.pawn.x, this.pawn.y, delta);
			this.checkNPCProximity();
		}
	}

	private checkNPCProximity(): void {
		// Meet Ploy
		if (
			!this.npcsTriggered.ploy &&
			Phaser.Math.Distance.Between(this.pawn.x, this.pawn.y, this.ploy.x, this.ploy.y) <
				INTERACTION.NPC_DISTANCE
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
			Phaser.Math.Distance.Between(this.pawn.x, this.pawn.y, this.bestie.x, this.bestie.y) <
				INTERACTION.NPC_DISTANCE
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
			Phaser.Math.Distance.Between(this.pawn.x, this.pawn.y, this.mrSenior.x, this.mrSenior.y) <
				INTERACTION.SENIOR_DISTANCE
		) {
			this.npcsTriggered.senior = true;
			this.dialogueBox.show(DIALOGUES.office.seniorApproach, () => {
				this.cameras.main.fadeOut(FADE.FAST, 0, 0, 0);
				this.cameras.main.once("camerafadeoutcomplete", () => {
					this.scene.start("BattleScene", { battle: "mrSenior" });
				});
			});
		}

		// The Boss (post-senior phase)
		if (
			this.npcsTriggered.senior &&
			!this.npcsTriggered.boss &&
			Phaser.Math.Distance.Between(this.pawn.x, this.pawn.y, this.theBoss.x, this.theBoss.y) <
				INTERACTION.BOSS_DISTANCE
		) {
			this.npcsTriggered.boss = true;
			this.cameras.main.fadeOut(FADE.FAST, 0, 0, 0);
			this.cameras.main.once("camerafadeoutcomplete", () => {
				this.scene.start("BattleScene", { battle: "theBoss" });
			});
		}
	}
}
