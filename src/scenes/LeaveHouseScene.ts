import Phaser from "phaser";
import { DOGS, FADE, INTERACTION, PLAYER, PLAYER_BOUNDS } from "../config/constants";
import { DIALOGUES } from "../data/dialogues";
import { DialogueBox } from "../systems/DialogueBox";
import { DogFollower } from "../systems/DogFollower";
import { createMusicToggle } from "../systems/MusicManager";
import { PlayerController } from "../systems/PlayerController";

type LeavePhase = "walking" | "atCar" | "done";

export class LeaveHouseScene extends Phaser.Scene {
	private pawn!: Phaser.GameObjects.Sprite;
	private lucky!: DogFollower;
	private cooper!: DogFollower;
	private car!: Phaser.GameObjects.Sprite;
	private dialogueBox!: DialogueBox;
	private playerController!: PlayerController;
	private phase: LeavePhase = "walking";
	private interactPrompt!: Phaser.GameObjects.Text;

	constructor() {
		super("LeaveHouseScene");
	}

	create(): void {
		this.phase = "walking";
		this.cameras.main.fadeIn(FADE.DEFAULT);
		createMusicToggle(this);

		// Draw Bangkok street scene
		this.drawBangkokStreet();
		this.drawApartmentBuilding();
		this.drawParkingArea();
		this.drawStreetVendors();

		// Car parked in parking area
		this.car = this.add.sprite(200, 420, "playerCar").setScale(5);
		this.car.setDepth(3);

		// Pawn starts at building entrance
		this.pawn = this.add.sprite(180, 280, "pawn").setScale(PLAYER.SCALE);
		this.pawn.setDepth(PLAYER.DEPTH);

		// Dogs
		this.lucky = new DogFollower({
			scene: this,
			texture: "lucky",
			...DOGS.lucky,
		});
		this.lucky.setPosition(140, 290);
		this.lucky.setDepth(4);

		this.cooper = new DogFollower({
			scene: this,
			texture: "cooper",
			...DOGS.cooper,
		});
		this.cooper.setPosition(220, 295);
		this.cooper.setDepth(4);

		// Interact prompt near car
		this.interactPrompt = this.add.text(200, 370, "[SPACE] Get in car", {
			fontFamily: "monospace",
			fontSize: "14px",
			color: "#ffff00",
		});
		this.interactPrompt.setOrigin(0.5);
		this.interactPrompt.setVisible(false);
		this.interactPrompt.setDepth(100);

		// Dialogue
		this.dialogueBox = new DialogueBox({ scene: this });

		// Player controller
		this.playerController = new PlayerController({
			scene: this,
			sprite: this.pawn,
			bounds: PLAYER_BOUNDS.leaveHouse,
		});

		// Scene cleanup
		this.events.on("shutdown", this.cleanup, this);

		// Intro dialogue
		this.dialogueBox.show(DIALOGUES.leaveHouse.walkOut, () => {
			this.phase = "walking";
		});
	}

	private cleanup(): void {
		this.lucky.destroy();
		this.cooper.destroy();
		this.dialogueBox.destroy();
		this.events.off("shutdown", this.cleanup, this);
	}

	private drawBangkokStreet(): void {
		// Sidewalk/concrete for the whole scene
		for (let y = 0; y < 38; y++) {
			for (let x = 0; x < 50; x++) {
				this.add
					.sprite(x * 16, y * 16, "sidewalkTile")
					.setOrigin(0)
					.setDepth(0);
			}
		}

		// Road at the bottom
		const road = this.add.graphics();
		road.fillStyle(0x555555);
		road.fillRect(0, 480, 800, 120);
		road.setDepth(0);
		road.lineStyle(2, 0xffffff);
		road.lineBetween(0, 480, 800, 480);
		road.lineStyle(2, 0xffff00);
		road.lineBetween(0, 540, 800, 540);
		// Curb
		road.fillStyle(0xaaaaaa);
		road.fillRect(0, 475, 800, 5);
	}

	private drawApartmentBuilding(): void {
		const g = this.add.graphics();
		g.setDepth(1);

		// Main building (3 stories, left side)
		g.fillStyle(0xc9b8a0);
		g.fillRect(50, 20, 280, 260);
		g.lineStyle(2, 0x8a7d6b);
		g.strokeRect(50, 20, 280, 260);

		// Floor dividers
		g.lineStyle(1, 0xa09080);
		g.lineBetween(50, 107, 330, 107);
		g.lineBetween(50, 193, 330, 193);

		// Windows - 3rd floor (Pawn's floor - pink curtain hint)
		for (let i = 0; i < 4; i++) {
			const wx = 70 + i * 65;
			g.fillStyle(0x6a9cc5);
			g.fillRect(wx, 40, 35, 45);
			g.lineStyle(1, 0x888888);
			g.lineBetween(wx + 17, 40, wx + 17, 85);
			if (i === 1) {
				g.fillStyle(0xff69b4, 0.3);
				g.fillRect(wx, 40, 12, 45);
			}
		}

		// Windows - 2nd floor
		for (let i = 0; i < 4; i++) {
			const wx = 70 + i * 65;
			g.fillStyle(0x6a9cc5);
			g.fillRect(wx, 125, 35, 45);
			g.lineStyle(1, 0x888888);
			g.lineBetween(wx + 17, 125, wx + 17, 170);
		}

		// Windows - 1st floor
		for (let i = 0; i < 4; i++) {
			const wx = 70 + i * 65;
			g.fillStyle(0x6a9cc5);
			g.fillRect(wx, 210, 35, 45);
			g.lineStyle(1, 0x888888);
			g.lineBetween(wx + 17, 210, wx + 17, 255);
		}

		// Entrance / stairwell
		g.fillStyle(0x5d4a3a);
		g.fillRect(155, 235, 70, 45);
		g.fillStyle(0x8b5e3c);
		g.fillRect(170, 245, 40, 35);
		g.fillStyle(0xffd700);
		g.fillCircle(204, 262, 2);

		// Floor label
		this.add
			.text(190, 225, "3F", {
				fontFamily: "monospace",
				fontSize: "10px",
				color: "#ffffff",
				stroke: "#000000",
				strokeThickness: 2,
			})
			.setOrigin(0.5)
			.setDepth(2);

		// Roof railing
		g.fillStyle(0x8a7d6b);
		g.fillRect(48, 15, 284, 5);

		// Water tank on roof (very Bangkok)
		g.fillStyle(0x606060);
		g.fillRect(270, 0, 40, 15);
		g.fillStyle(0x555555);
		g.fillRect(275, -5, 30, 5);

		// Power lines
		g.lineStyle(1, 0x333333);
		g.lineBetween(0, 10, 800, 12);
		g.lineBetween(0, 15, 800, 17);
		g.lineBetween(0, 20, 800, 22);

		// Power pole (right side)
		g.fillStyle(0x555555);
		g.fillRect(700, 0, 6, 300);
		g.fillStyle(0x444444);
		g.fillRect(688, 8, 30, 3);
		g.fillRect(688, 15, 30, 3);
		g.fillRect(688, 22, 30, 3);
	}

	private drawParkingArea(): void {
		const g = this.add.graphics();
		g.setDepth(0);

		// Parking slab under building
		g.fillStyle(0x777777);
		g.fillRect(50, 310, 280, 160);

		// Parking lines
		g.lineStyle(1, 0xffffff, 0.5);
		for (let i = 0; i < 5; i++) {
			g.lineBetween(70 + i * 55, 310, 70 + i * 55, 470);
		}

		this.add
			.text(190, 310, "PARKING", {
				fontFamily: "monospace",
				fontSize: "10px",
				color: "#cccccc",
			})
			.setOrigin(0.5)
			.setDepth(1);

		// Neighbor's parked car
		const neighborCar = this.add.sprite(310, 400, "obstacleCar").setScale(3);
		neighborCar.setDepth(2);
		neighborCar.setAlpha(0.7);
	}

	private drawStreetVendors(): void {
		const g = this.add.graphics();
		g.setDepth(1);

		// Food vendor stall (right side)
		g.fillStyle(0xe87d2f);
		g.fillRect(450, 300, 80, 50);
		g.fillStyle(0xffd700);
		g.fillRect(455, 305, 70, 15);
		g.fillStyle(0x8b4513);
		g.fillRect(460, 320, 60, 25);
		// Food dots
		const foodColors = [0xff6347, 0xffd700, 0x90ee90, 0xff6347, 0xffd700];
		for (let i = 0; i < foodColors.length; i++) {
			g.fillStyle(foodColors[i] ?? 0xff6347);
			g.fillCircle(470 + i * 10, 330, 3);
		}

		this.add
			.text(490, 290, "Som Tam", {
				fontFamily: "monospace",
				fontSize: "9px",
				color: "#ffff00",
				stroke: "#000000",
				strokeThickness: 2,
			})
			.setOrigin(0.5)
			.setDepth(2);

		// Drinks stall
		g.fillStyle(0xc0392b);
		g.fillRect(580, 250, 70, 45);
		g.fillStyle(0xff6b6b);
		g.fillRect(585, 255, 60, 12);
		g.fillStyle(0x8b4513);
		g.fillRect(585, 267, 60, 23);
		for (let i = 0; i < 5; i++) {
			g.fillStyle(i % 2 === 0 ? 0x00bfff : 0xff69b4);
			g.fillRect(590 + i * 10, 270, 6, 15);
		}

		this.add
			.text(615, 240, "Drinks", {
				fontFamily: "monospace",
				fontSize: "9px",
				color: "#00ffff",
				stroke: "#000000",
				strokeThickness: 2,
			})
			.setOrigin(0.5)
			.setDepth(2);

		// 7-Eleven
		g.fillStyle(0x1a7742);
		g.fillRect(400, 100, 120, 130);
		g.fillStyle(0xff8c00);
		g.fillRect(400, 100, 120, 20);
		g.fillStyle(0x1a7742);
		g.fillRect(410, 105, 100, 10);
		g.fillStyle(0xc0e0ff, 0.6);
		g.fillRect(410, 130, 45, 60);
		g.fillRect(465, 130, 45, 60);
		g.fillStyle(0xc0e0ff, 0.8);
		g.fillRect(445, 155, 30, 75);

		this.add
			.text(460, 112, "7-ELEVEN", {
				fontFamily: "monospace",
				fontSize: "10px",
				color: "#ffffff",
				stroke: "#1a7742",
				strokeThickness: 2,
			})
			.setOrigin(0.5)
			.setDepth(2);

		// Building across the street
		g.fillStyle(0xb0a090);
		g.fillRect(680, 80, 120, 200);
		g.fillStyle(0x6a9cc5);
		for (let row = 0; row < 3; row++) {
			for (let col = 0; col < 2; col++) {
				g.fillRect(695 + col * 50, 100 + row * 60, 30, 35);
			}
		}

		// Parked motorbikes on sidewalk
		this.add.sprite(550, 460, "motorbike").setScale(3).setDepth(2).setAngle(90);
		this.add.sprite(600, 460, "motorbike").setScale(3).setDepth(2).setAngle(90);

		// Soi sign
		g.fillStyle(0x2244aa);
		g.fillRect(345, 55, 80, 25);
		this.add
			.text(385, 67, "Soi 15", {
				fontFamily: "monospace",
				fontSize: "11px",
				color: "#ffffff",
			})
			.setOrigin(0.5)
			.setDepth(2);
		g.fillStyle(0x888888);
		g.fillRect(383, 80, 4, 200);
	}

	update(_time: number, delta: number): void {
		this.dialogueBox.update();

		if (this.dialogueBox.isActive()) return;

		if (this.phase === "walking") {
			this.playerController.update(delta);
			this.lucky.update(this.pawn.x, this.pawn.y, delta);
			this.cooper.update(this.pawn.x, this.pawn.y, delta);

			// Check if near car
			const dist = Phaser.Math.Distance.Between(this.pawn.x, this.pawn.y, this.car.x, this.car.y);
			if (dist < INTERACTION.CAR_DISTANCE) {
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

	private getInCar(): void {
		this.phase = "atCar";
		this.interactPrompt.setVisible(false);

		this.tweens.add({
			targets: [this.pawn, this.lucky.sprite, this.cooper.sprite],
			alpha: 0,
			duration: 400,
		});

		this.dialogueBox.show(DIALOGUES.leaveHouse.getInCar, () => {
			this.cameras.main.fadeOut(FADE.DEFAULT, 0, 0, 0);
			this.cameras.main.once("camerafadeoutcomplete", () => {
				this.scene.start("DrivingScene");
			});
		});
	}
}
