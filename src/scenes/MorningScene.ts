import Phaser from "phaser";
import { DIALOGUES } from "../data/dialogues";
import { DialogueBox } from "../systems/DialogueBox";
import { DogFollower } from "../systems/DogFollower";

type MorningPhase = "sleeping" | "wakeUp" | "freeWalk" | "feeding" | "fed" | "done";

export class MorningScene extends Phaser.Scene {
	private pawn!: Phaser.GameObjects.Sprite;
	private pawnSleeping!: Phaser.GameObjects.Sprite;
	private lucky!: DogFollower;
	private cooper!: DogFollower;
	private dialogueBox!: DialogueBox;
	private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
	private phase: MorningPhase = "sleeping";
	private dogBowl1!: Phaser.GameObjects.Sprite;
	private dogBowl2!: Phaser.GameObjects.Sprite;
	private bowlZone!: Phaser.GameObjects.Zone;
	private interactPrompt!: Phaser.GameObjects.Text;
	private speed = 150;

	constructor() {
		super("MorningScene");
	}

	create(): void {
		this.phase = "sleeping";
		this.cameras.main.fadeIn(500);

		// Draw bedroom
		this.drawBedroom();

		// Bed (right side of room)
		const bed = this.add.sprite(550, 200, "bed").setScale(6);
		bed.setDepth(1);

		// Pawn sleeping on bed
		this.pawnSleeping = this.add.sprite(570, 185, "pawnSleeping").setScale(4);
		this.pawnSleeping.setDepth(2);

		// Pawn (walking sprite, hidden initially)
		this.pawn = this.add.sprite(550, 260, "pawn").setScale(4);
		this.pawn.setDepth(5);
		this.pawn.setVisible(false);

		// Dogs on/near bed
		this.lucky = new DogFollower({
			scene: this,
			texture: "lucky",
			scale: 4,
			followDistance: 30,
			speed: 180,
			isEnergetic: true,
			side: "left",
		});
		this.lucky.setPosition(590, 180);
		this.lucky.setDepth(3);

		this.cooper = new DogFollower({
			scene: this,
			texture: "cooper",
			scale: 4,
			followDistance: 20,
			speed: 130,
			isEnergetic: false,
			side: "right",
		});
		this.cooper.setPosition(510, 200);
		this.cooper.setDepth(3);

		// Dog bowls (bottom-left area of room, near kitchen-ish area)
		this.dogBowl1 = this.add.sprite(180, 420, "dogBowl").setScale(5);
		this.dogBowl2 = this.add.sprite(250, 420, "dogBowl").setScale(5);
		this.dogBowl1.setDepth(1);
		this.dogBowl2.setDepth(1);

		// Bowl labels
		this.add
			.text(180, 445, "Lucky", {
				fontFamily: "monospace",
				fontSize: "10px",
				color: "#ffffff",
				stroke: "#000000",
				strokeThickness: 2,
			})
			.setOrigin(0.5)
			.setDepth(2);
		this.add
			.text(250, 445, "Cooper", {
				fontFamily: "monospace",
				fontSize: "10px",
				color: "#ffffff",
				stroke: "#000000",
				strokeThickness: 2,
			})
			.setOrigin(0.5)
			.setDepth(2);

		// Interact zone near bowls
		this.bowlZone = this.add.zone(215, 420, 140, 80);

		// Interact prompt
		this.interactPrompt = this.add.text(215, 380, "[SPACE] Feed dogs", {
			fontFamily: "monospace",
			fontSize: "14px",
			color: "#ffff00",
		});
		this.interactPrompt.setOrigin(0.5);
		this.interactPrompt.setVisible(false);
		this.interactPrompt.setDepth(100);

		// Dialogue box
		this.dialogueBox = new DialogueBox({ scene: this });

		// Controls
		if (this.input.keyboard) {
			this.cursors = this.input.keyboard.createCursorKeys();
		}

		// Start with wake-up dialogue
		this.dialogueBox.show(DIALOGUES.morning.wakeUp, () => {
			this.wakeUp();
		});
	}

	private drawBedroom(): void {
		const g = this.add.graphics();
		g.setDepth(0);

		// Floor — warm wooden floor
		g.fillStyle(0xc49a6c);
		g.fillRect(0, 48, 800, 552);

		// Walls — soft lavender
		g.fillStyle(0xdeb8e6);
		g.fillRect(0, 0, 800, 80);

		// Baseboard
		g.fillStyle(0xb8865a);
		g.fillRect(0, 76, 800, 4);

		// Window (top-left wall)
		g.fillStyle(0x87ceeb); // sky blue
		g.fillRect(100, 10, 80, 55);
		g.lineStyle(3, 0x8b5e3c); // brown frame
		g.strokeRect(100, 10, 80, 55);
		g.lineBetween(140, 10, 140, 65); // window divider
		g.lineBetween(100, 37, 180, 37);
		// Curtains
		g.fillStyle(0xff99cc, 0.7);
		g.fillRect(85, 5, 20, 65);
		g.fillRect(175, 5, 20, 65);

		// Dresser (left side)
		g.fillStyle(0x8b5e3c);
		g.fillRect(50, 130, 100, 70);
		g.fillStyle(0x6d4a2d);
		g.fillRect(50, 155, 100, 3); // drawer line
		g.fillRect(50, 180, 100, 3);
		// Drawer knobs
		g.fillStyle(0xffd700);
		g.fillCircle(100, 145, 3);
		g.fillCircle(100, 170, 3);
		g.fillCircle(100, 190, 3);

		// Mirror on wall above dresser
		g.fillStyle(0xadd8e6, 0.4);
		g.fillRect(70, 10, 50, 50);
		g.lineStyle(2, 0xffd700);
		g.strokeRect(70, 10, 50, 50);

		// Nightstand (next to bed)
		g.fillStyle(0x6d4a2d);
		g.fillRect(390, 180, 40, 40);
		g.fillStyle(0x8b5e3c);
		g.fillRect(390, 180, 40, 15);

		// Lamp on nightstand
		g.fillStyle(0xffd700, 0.8);
		g.fillCircle(410, 165, 12);
		g.fillStyle(0x8b5e3c);
		g.fillRect(407, 175, 6, 8);

		// Rug (center of room)
		g.fillStyle(0xff69b4, 0.3);
		g.fillRoundedRect(250, 280, 200, 120, 10);
		g.lineStyle(2, 0xff69b4, 0.5);
		g.strokeRoundedRect(250, 280, 200, 120, 10);

		// Small bookshelf (bottom-right)
		g.fillStyle(0x8b5e3c);
		g.fillRect(650, 350, 80, 60);
		g.fillStyle(0x6d4a2d);
		g.fillRect(650, 375, 80, 3);
		// Books (colorful)
		g.fillStyle(0xe74c3c);
		g.fillRect(655, 355, 10, 18);
		g.fillStyle(0x3498db);
		g.fillRect(668, 355, 8, 18);
		g.fillStyle(0x2ecc71);
		g.fillRect(679, 355, 12, 18);
		g.fillStyle(0xf39c12);
		g.fillRect(694, 355, 10, 18);
		g.fillStyle(0x9b59b6);
		g.fillRect(658, 380, 10, 18);
		g.fillStyle(0xe74c3c);
		g.fillRect(671, 380, 8, 18);

		// Wall decorations — small heart picture
		g.fillStyle(0xffffff);
		g.fillRect(300, 15, 40, 35);
		g.lineStyle(2, 0x8b5e3c);
		g.strokeRect(300, 15, 40, 35);
		g.fillStyle(0xff69b4);
		g.fillTriangle(310, 38, 330, 38, 320, 44);
		g.fillCircle(315, 33, 6);
		g.fillCircle(325, 33, 6);

		// Plant in corner
		g.fillStyle(0x8b5e3c);
		g.fillRect(730, 100, 20, 30);
		g.fillStyle(0x2ecc71);
		g.fillCircle(740, 90, 18);
		g.fillCircle(730, 85, 12);
		g.fillCircle(750, 85, 12);
	}

	private wakeUp(): void {
		this.phase = "wakeUp";

		// Hide sleeping sprite, show walking sprite
		this.pawnSleeping.setVisible(false);
		this.pawn.setVisible(true);
		this.pawn.setPosition(550, 260);

		// Dogs wake up animation
		this.dialogueBox.show(DIALOGUES.morning.dogsWake, () => {
			this.phase = "freeWalk";
		});
	}

	update(_time: number, delta: number): void {
		this.dialogueBox.update();

		if (this.dialogueBox.isActive()) return;

		if (this.phase === "freeWalk") {
			this.handleMovement(delta);
			this.lucky.update(this.pawn.x, this.pawn.y, delta);
			this.cooper.update(this.pawn.x, this.pawn.y, delta);

			// Check if near dog bowls
			const dist = Phaser.Math.Distance.Between(
				this.pawn.x,
				this.pawn.y,
				this.bowlZone.x,
				this.bowlZone.y,
			);
			if (dist < 80) {
				this.interactPrompt.setVisible(true);
				if (this.input.keyboard) {
					const spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
					if (Phaser.Input.Keyboard.JustDown(spaceKey)) {
						this.feedDogs();
					}
				}
			} else {
				this.interactPrompt.setVisible(false);
			}
		}

		if (this.phase === "fed") {
			this.lucky.update(this.pawn.x, this.pawn.y, delta);
			this.cooper.update(this.pawn.x, this.pawn.y, delta);
		}
	}

	private handleMovement(delta: number): void {
		const moveAmount = this.speed * (delta / 1000);
		let moved = false;

		if (this.cursors.left.isDown) {
			this.pawn.x -= moveAmount;
			this.pawn.setFlipX(true);
			moved = true;
		} else if (this.cursors.right.isDown) {
			this.pawn.x += moveAmount;
			this.pawn.setFlipX(false);
			moved = true;
		}
		if (this.cursors.up.isDown) {
			this.pawn.y -= moveAmount;
			moved = true;
		} else if (this.cursors.down.isDown) {
			this.pawn.y += moveAmount;
			moved = true;
		}

		if (moved) {
			// Simple bob animation
			this.pawn.y += Math.sin(Date.now() / 100) * 0.5;
		}

		// Keep in bounds
		this.pawn.x = Phaser.Math.Clamp(this.pawn.x, 30, 770);
		this.pawn.y = Phaser.Math.Clamp(this.pawn.y, 90, 550);
	}

	private feedDogs(): void {
		this.phase = "feeding";
		this.interactPrompt.setVisible(false);

		// Dogs go to bowls
		this.tweens.add({
			targets: this.lucky.sprite,
			x: this.dogBowl1.x,
			y: this.dogBowl1.y - 15,
			duration: 500,
		});
		this.tweens.add({
			targets: this.cooper.sprite,
			x: this.dogBowl2.x,
			y: this.dogBowl2.y - 15,
			duration: 500,
			onComplete: () => {
				// Eating animation (bounce)
				this.tweens.add({
					targets: [this.lucky.sprite, this.cooper.sprite],
					y: "-=5",
					duration: 200,
					yoyo: true,
					repeat: 5,
					onComplete: () => {
						this.phase = "fed";
						this.dialogueBox.show(DIALOGUES.morning.feedDogs, () => {
							this.dialogueBox.show(DIALOGUES.morning.timeToGo, () => {
								this.cameras.main.fadeOut(500, 0, 0, 0);
								this.cameras.main.once("camerafadeoutcomplete", () => {
									this.scene.start("LeaveHouseScene");
								});
							});
						});
					},
				});
			},
		});
	}
}
