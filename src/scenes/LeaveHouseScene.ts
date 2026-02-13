import Phaser from "phaser";
import { DIALOGUES } from "../data/dialogues";
import { DialogueBox } from "../systems/DialogueBox";
import { DogFollower } from "../systems/DogFollower";

type LeavePhase = "walking" | "atCar" | "done";

export class LeaveHouseScene extends Phaser.Scene {
	private pawn!: Phaser.GameObjects.Sprite;
	private lucky!: DogFollower;
	private cooper!: DogFollower;
	private car!: Phaser.GameObjects.Sprite;
	private dialogueBox!: DialogueBox;
	private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
	private phase: LeavePhase = "walking";
	private interactPrompt!: Phaser.GameObjects.Text;
	private speed = 150;

	constructor() {
		super("LeaveHouseScene");
	}

	create(): void {
		this.phase = "walking";
		this.cameras.main.fadeIn(500);

		// Draw outdoor area
		this.drawOutdoors();

		// House (top of screen)
		const house = this.add.graphics();
		house.fillStyle(0xd4a574);
		house.fillRect(200, 20, 400, 150);
		house.fillStyle(0x8b5e3c);
		house.fillRect(370, 100, 60, 70); // door
		house.fillStyle(0xc44a4a);
		// Roof
		house.fillTriangle(200, 20, 600, 20, 400, -30);
		house.setDepth(0);

		// Car parked at bottom
		this.car = this.add.sprite(400, 480, "playerCar").setScale(5);
		this.car.setDepth(1);

		// Pawn starts near house door
		this.pawn = this.add.sprite(400, 200, "pawn").setScale(4);
		this.pawn.setDepth(5);

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
		this.lucky.setPosition(360, 210);
		this.lucky.setDepth(4);

		this.cooper = new DogFollower({
			scene: this,
			texture: "cooper",
			scale: 4,
			followDistance: 20,
			speed: 130,
			isEnergetic: false,
			side: "right",
		});
		this.cooper.setPosition(440, 215);
		this.cooper.setDepth(4);

		// Interact prompt near car
		this.interactPrompt = this.add.text(400, 430, "[SPACE] Get in car", {
			fontFamily: "monospace",
			fontSize: "14px",
			color: "#ffff00",
		});
		this.interactPrompt.setOrigin(0.5);
		this.interactPrompt.setVisible(false);
		this.interactPrompt.setDepth(100);

		// Dialogue
		this.dialogueBox = new DialogueBox({ scene: this });

		if (this.input.keyboard) {
			this.cursors = this.input.keyboard.createCursorKeys();
		}

		// Intro dialogue
		this.dialogueBox.show(DIALOGUES.leaveHouse.walkOut, () => {
			this.phase = "walking";
		});
	}

	private drawOutdoors(): void {
		// Grass everywhere
		for (let y = 0; y < 38; y++) {
			for (let x = 0; x < 50; x++) {
				this.add
					.sprite(x * 16, y * 16, "grassTile")
					.setOrigin(0)
					.setDepth(0);
			}
		}
		// Path from house to car
		for (let y = 10; y < 32; y++) {
			for (let x = 23; x < 27; x++) {
				const tile = this.add.graphics();
				tile.fillStyle(0xb0a090);
				tile.fillRect(x * 16, y * 16, 16, 16);
				tile.setDepth(0);
			}
		}
	}

	update(_time: number, delta: number): void {
		this.dialogueBox.update();

		if (this.dialogueBox.isActive()) return;

		if (this.phase === "walking") {
			this.handleMovement(delta);
			this.lucky.update(this.pawn.x, this.pawn.y, delta);
			this.cooper.update(this.pawn.x, this.pawn.y, delta);

			// Check if near car
			const dist = Phaser.Math.Distance.Between(this.pawn.x, this.pawn.y, this.car.x, this.car.y);
			if (dist < 80) {
				this.interactPrompt.setVisible(true);
				if (this.input.keyboard) {
					const spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
					if (Phaser.Input.Keyboard.JustDown(spaceKey)) {
						this.getInCar();
					}
				}
			} else {
				this.interactPrompt.setVisible(false);
			}
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
		this.pawn.y = Phaser.Math.Clamp(this.pawn.y, 180, 550);
	}

	private getInCar(): void {
		this.phase = "atCar";
		this.interactPrompt.setVisible(false);

		// Everyone moves to car
		this.tweens.add({
			targets: [this.pawn, this.lucky.sprite, this.cooper.sprite],
			alpha: 0,
			duration: 400,
		});

		this.dialogueBox.show(DIALOGUES.leaveHouse.getInCar, () => {
			this.cameras.main.fadeOut(500, 0, 0, 0);
			this.cameras.main.once("camerafadeoutcomplete", () => {
				this.scene.start("DrivingScene");
			});
		});
	}
}
