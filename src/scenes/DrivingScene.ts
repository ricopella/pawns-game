import Phaser from "phaser";
import { DIALOGUES } from "../data/dialogues";
import { DialogueBox } from "../systems/DialogueBox";

type DrivingSegment = "straight1" | "stoplight" | "turnLeft" | "straight2" | "arrival";

interface Obstacle {
	sprite: Phaser.GameObjects.Sprite;
	speed: number;
	lane: number;
}

export class DrivingScene extends Phaser.Scene {
	private car!: Phaser.GameObjects.Sprite;
	private dialogueBox!: DialogueBox;
	private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
	private obstacles: Obstacle[] = [];
	private roadLines: Phaser.GameObjects.Sprite[] = [];
	private lives = 3;
	private heartSprites: Phaser.GameObjects.Sprite[] = [];
	private segment: DrivingSegment = "straight1";
	private segmentTimer = 0;
	private scrollSpeed = 200;
	private invincible = false;
	private spawnTimer = 0;
	private spawnInterval = 1200;
	private roadOffset = 0;
	private stopped = false;
	private trafficLight: Phaser.GameObjects.Sprite | null = null;
	private waitingAtLight = false;
	private distanceTraveled = 0;
	private segmentDistances: Record<DrivingSegment, number> = {
		straight1: 3000,
		stoplight: 1000,
		turnLeft: 2000,
		straight2: 4000,
		arrival: 500,
	};
	private dogsInCar!: Phaser.GameObjects.Container;
	private roadTurnOffset = 0;
	private building: Phaser.GameObjects.Sprite | null = null;

	// Lane positions (x coordinates)
	private readonly lanes = [280, 370, 460, 540];
	private currentLane = 1;

	constructor() {
		super("DrivingScene");
	}

	create(): void {
		this.cameras.main.fadeIn(500);
		this.segment = "straight1";
		this.lives = 3;
		this.distanceTraveled = 0;
		this.obstacles = [];
		this.roadLines = [];
		this.invincible = false;
		this.stopped = false;
		this.waitingAtLight = false;
		this.scrollSpeed = 200;
		this.spawnInterval = 1200;
		this.roadTurnOffset = 0;
		this.building = null;

		// Draw road
		this.drawRoad();

		// Player car
		this.currentLane = 1;
		const laneX = this.lanes[this.currentLane] ?? 370;
		this.car = this.add.sprite(laneX, 480, "playerCar").setScale(4);
		this.car.setDepth(10);

		// Dogs visible in back of car (small sprites)
		this.dogsInCar = this.add.container(this.car.x, this.car.y - 20);
		const luckyInCar = this.add.sprite(-10, 10, "lucky").setScale(1.5);
		const cooperInCar = this.add.sprite(10, 10, "cooper").setScale(1.5);
		this.dogsInCar.add([luckyInCar, cooperInCar]);
		this.dogsInCar.setDepth(11);

		// Lives display
		this.heartSprites = [];
		for (let i = 0; i < 3; i++) {
			const heart = this.add.sprite(30 + i * 35, 30, "heart").setScale(4);
			heart.setDepth(100);
			this.heartSprites.push(heart);
		}

		// Segment label
		this.add
			.text(400, 20, "Bangkok Rush Hour", {
				fontFamily: "monospace",
				fontSize: "18px",
				color: "#ffffff",
			})
			.setOrigin(0.5)
			.setDepth(100);

		// Dialogue
		this.dialogueBox = new DialogueBox({ scene: this });

		if (this.input.keyboard) {
			this.cursors = this.input.keyboard.createCursorKeys();
		}

		// Intro dialogue
		this.dialogueBox.show(DIALOGUES.driving.start, () => {
			// Game starts
		});
	}

	private drawRoad(): void {
		// Grass sides
		const bg = this.add.graphics();
		bg.fillStyle(0x5ca04a);
		bg.fillRect(0, 0, 800, 600);
		bg.setDepth(0);

		// Road
		const road = this.add.graphics();
		road.fillStyle(0x555555);
		road.fillRect(230, 0, 340, 600);
		road.setDepth(1);

		// Road edges
		road.lineStyle(3, 0xffffff);
		road.lineBetween(230, 0, 230, 600);
		road.lineBetween(570, 0, 570, 600);

		// Create scrolling road lines
		for (let y = -50; y < 650; y += 80) {
			const line = this.add.sprite(400, y, "roadLineTile").setScale(2, 3);
			line.setDepth(2);
			this.roadLines.push(line);
		}
	}

	update(_time: number, delta: number): void {
		this.dialogueBox.update();
		if (this.dialogueBox.isActive()) return;

		if (this.segment === "arrival" && this.building) {
			return; // Wait for arrival sequence
		}

		// Scroll road lines
		if (!this.stopped) {
			this.roadOffset += this.scrollSpeed * (delta / 1000);
			for (const line of this.roadLines) {
				line.y += this.scrollSpeed * (delta / 1000);
				if (line.y > 650) {
					line.y -= 700;
				}
			}
		}

		// Handle input (lane switching)
		this.handleInput();

		// Update car position (smooth movement to lane)
		const targetX = (this.lanes[this.currentLane] ?? 370) + this.roadTurnOffset;
		this.car.x += (targetX - this.car.x) * 0.15;
		this.dogsInCar.x = this.car.x;

		// Update segment logic
		if (!this.stopped) {
			this.distanceTraveled += this.scrollSpeed * (delta / 1000);
			this.updateSegment(delta);
		}

		// Spawn obstacles
		if (!this.stopped && this.segment !== "arrival") {
			this.spawnTimer += delta;
			if (this.spawnTimer > this.spawnInterval) {
				this.spawnTimer = 0;
				this.spawnObstacle();
			}
		}

		// Update obstacles
		this.updateObstacles(delta);

		// Check collisions
		if (!this.invincible) {
			this.checkCollisions();
		}
	}

	private handleInput(): void {
		if (this.stopped) return;

		if (Phaser.Input.Keyboard.JustDown(this.cursors.left)) {
			this.currentLane = Math.max(0, this.currentLane - 1);
		} else if (Phaser.Input.Keyboard.JustDown(this.cursors.right)) {
			this.currentLane = Math.min(this.lanes.length - 1, this.currentLane + 1);
		}
	}

	private updateSegment(delta: number): void {
		const threshold = this.segmentDistances[this.segment] ?? 3000;

		if (this.distanceTraveled > threshold) {
			this.advanceSegment();
		}

		// Stoplight logic
		if (this.segment === "stoplight" && !this.waitingAtLight) {
			this.startStoplight();
		}

		// Turn left visual offset
		if (this.segment === "turnLeft") {
			this.segmentTimer += delta;
			this.roadTurnOffset = Math.sin(this.segmentTimer / 1000) * 30;
		} else {
			this.roadTurnOffset = 0;
		}
	}

	private advanceSegment(): void {
		this.distanceTraveled = 0;

		switch (this.segment) {
			case "straight1":
				this.segment = "stoplight";
				break;
			case "stoplight":
				this.segment = "turnLeft";
				this.segmentTimer = 0;
				break;
			case "turnLeft":
				this.segment = "straight2";
				this.scrollSpeed = 250;
				this.spawnInterval = 900;
				break;
			case "straight2":
				this.segment = "arrival";
				this.startArrival();
				break;
		}
	}

	private startStoplight(): void {
		this.waitingAtLight = true;
		this.stopped = true;
		this.scrollSpeed = 0;

		// Show red traffic light
		this.trafficLight = this.add.sprite(600, 200, "trafficLightRed").setScale(5);
		this.trafficLight.setDepth(50);

		this.dialogueBox.show(DIALOGUES.driving.redLight, () => {
			// Wait 2-4 seconds at red
			const waitTime = 2000 + Math.random() * 2000;
			this.time.delayedCall(waitTime, () => {
				// Turn green
				if (this.trafficLight) {
					this.trafficLight.setTexture("trafficLightGreen");
				}
				this.dialogueBox.show(DIALOGUES.driving.greenLight, () => {
					this.stopped = false;
					this.scrollSpeed = 200;
					if (this.trafficLight) {
						this.tweens.add({
							targets: this.trafficLight,
							alpha: 0,
							duration: 500,
							onComplete: () => {
								this.trafficLight?.destroy();
								this.trafficLight = null;
							},
						});
					}
					// Advance past stoplight segment
					this.distanceTraveled = (this.segmentDistances.stoplight ?? 1000) + 1;
				});
			});
		});
	}

	private startArrival(): void {
		this.stopped = true;
		this.scrollSpeed = 0;

		// Clear remaining obstacles
		for (const obs of this.obstacles) {
			obs.sprite.destroy();
		}
		this.obstacles = [];

		// Show TTB Bank building
		this.building = this.add.sprite(400, -50, "building").setScale(6);
		this.building.setDepth(5);

		this.tweens.add({
			targets: this.building,
			y: 150,
			duration: 2000,
			ease: "Power2",
			onComplete: () => {
				this.dialogueBox.show(DIALOGUES.driving.arrival, () => {
					this.cameras.main.fadeOut(500, 0, 0, 0);
					this.cameras.main.once("camerafadeoutcomplete", () => {
						this.scene.start("OfficeArrivalScene");
					});
				});
			},
		});
	}

	private spawnObstacle(): void {
		const lane = Math.floor(Math.random() * this.lanes.length);
		const laneX = this.lanes[lane];
		if (laneX === undefined) return;

		// Don't spawn in player's lane too often
		if (lane === this.currentLane && Math.random() > 0.3) return;

		const textures = ["obstacleCar", "obstacleCar", "motorbike"] as const;
		const texture = textures[Math.floor(Math.random() * textures.length)] ?? "obstacleCar";
		const scale = texture === "motorbike" ? 3 : 3.5;

		const sprite = this.add.sprite(laneX, -40, texture).setScale(scale);
		sprite.setDepth(8);

		this.obstacles.push({
			sprite,
			speed: 100 + Math.random() * 100,
			lane,
		});
	}

	private updateObstacles(delta: number): void {
		for (let i = this.obstacles.length - 1; i >= 0; i--) {
			const obs = this.obstacles[i];
			if (!obs) continue;
			obs.sprite.y += (obs.speed + this.scrollSpeed) * (delta / 1000);

			if (obs.sprite.y > 650) {
				obs.sprite.destroy();
				this.obstacles.splice(i, 1);
			}
		}
	}

	private checkCollisions(): void {
		const carBounds = new Phaser.Geom.Rectangle(this.car.x - 30, this.car.y - 40, 60, 80);

		for (let i = this.obstacles.length - 1; i >= 0; i--) {
			const obs = this.obstacles[i];
			if (!obs) continue;
			const obsBounds = new Phaser.Geom.Rectangle(obs.sprite.x - 25, obs.sprite.y - 30, 50, 60);

			if (Phaser.Geom.Rectangle.Overlaps(carBounds, obsBounds)) {
				this.hitObstacle(i);
				break;
			}
		}
	}

	private hitObstacle(index: number): void {
		const obs = this.obstacles[index];
		if (!obs) return;

		obs.sprite.destroy();
		this.obstacles.splice(index, 1);

		this.lives--;

		// Update heart display
		const heart = this.heartSprites[this.lives];
		if (heart) {
			heart.setVisible(false);
		}

		// Flash car (invincibility)
		this.invincible = true;
		this.tweens.add({
			targets: this.car,
			alpha: { from: 0.3, to: 1 },
			duration: 100,
			repeat: 10,
			onComplete: () => {
				this.invincible = false;
				this.car.setAlpha(1);
			},
		});

		// Screen shake
		this.cameras.main.shake(200, 0.01);

		if (this.lives <= 0) {
			this.gameOver();
		}
	}

	private gameOver(): void {
		this.stopped = true;
		this.dialogueBox.show(DIALOGUES.driving.gameOver, () => {
			this.cameras.main.fadeOut(300, 0, 0, 0);
			this.cameras.main.once("camerafadeoutcomplete", () => {
				this.scene.restart();
			});
		});
	}
}
