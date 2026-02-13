import Phaser from "phaser";
import { DEPTHS, DRIVING, FADE } from "../config/constants";
import { DIALOGUES } from "../data/dialogues";
import { DialogueBox } from "../systems/DialogueBox";
import { createMusicToggle } from "../systems/MusicManager";

type DrivingSegment = "straight1" | "stoplight" | "turnLeft" | "straight2" | "arrival";

interface Obstacle {
	sprite: Phaser.GameObjects.Sprite;
	speed: number;
	lane: number;
	active: boolean;
}

export class DrivingScene extends Phaser.Scene {
	private car!: Phaser.GameObjects.Sprite;
	private dialogueBox!: DialogueBox;
	private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
	private obstaclePool: Obstacle[] = [];
	private roadLines: Phaser.GameObjects.Sprite[] = [];
	private lives: number = DRIVING.LIVES;
	private heartSprites: Phaser.GameObjects.Sprite[] = [];
	private segment: DrivingSegment = "straight1";
	private segmentTimer = 0;
	private scrollSpeed: number = DRIVING.INITIAL_SCROLL_SPEED;
	private invincible = false;
	private spawnTimer = 0;
	private spawnInterval: number = DRIVING.INITIAL_SPAWN_INTERVAL;
	private roadOffset = 0;
	private stopped = false;
	private trafficLight: Phaser.GameObjects.Sprite | null = null;
	private waitingAtLight = false;
	private distanceTraveled = 0;
	private dogsInCar!: Phaser.GameObjects.Container;
	private roadTurnOffset = 0;
	private building: Phaser.GameObjects.Sprite | null = null;
	private currentLane: number = DRIVING.START_LANE;
	private sceneryElements: Phaser.GameObjects.GameObject[] = [];

	constructor() {
		super("DrivingScene");
	}

	create(): void {
		this.cameras.main.fadeIn(FADE.DEFAULT);
		createMusicToggle(this);
		this.segment = "straight1";
		this.lives = DRIVING.LIVES;
		this.distanceTraveled = 0;
		this.obstaclePool = [];
		this.roadLines = [];
		this.invincible = false;
		this.stopped = false;
		this.waitingAtLight = false;
		this.scrollSpeed = DRIVING.INITIAL_SCROLL_SPEED;
		this.spawnInterval = DRIVING.INITIAL_SPAWN_INTERVAL;
		this.roadTurnOffset = 0;
		this.building = null;
		this.sceneryElements = [];

		// Draw road
		this.drawRoad();

		// Player car
		this.currentLane = DRIVING.START_LANE;
		const laneX = DRIVING.LANES[this.currentLane] ?? DRIVING.DEFAULT_LANE_X;
		this.car = this.add.sprite(laneX, 480, "playerCar").setScale(4);
		this.car.setDepth(DEPTHS.PLAYER);

		// Dogs visible in back of car (small sprites)
		this.dogsInCar = this.add.container(this.car.x, this.car.y - 20);
		const luckyInCar = this.add.sprite(-10, 10, "lucky").setScale(1.5);
		const cooperInCar = this.add.sprite(10, 10, "cooper").setScale(1.5);
		this.dogsInCar.add([luckyInCar, cooperInCar]);
		this.dogsInCar.setDepth(DEPTHS.DOG_IN_CAR);

		// Lives display
		this.heartSprites = [];
		for (let i = 0; i < DRIVING.LIVES; i++) {
			const heart = this.add.sprite(30 + i * 35, 30, "heart").setScale(4);
			heart.setDepth(DEPTHS.UI);
			this.heartSprites.push(heart);
		}

		// Pre-allocate obstacle pool
		this.initObstaclePool();

		// Segment label
		this.add
			.text(400, 20, "Lat Prao Rush Hour", {
				fontFamily: "monospace",
				fontSize: "18px",
				color: "#ffffff",
			})
			.setOrigin(0.5)
			.setDepth(DEPTHS.UI);

		// Dialogue
		this.dialogueBox = new DialogueBox({ scene: this });

		if (this.input.keyboard) {
			this.cursors = this.input.keyboard.createCursorKeys();
		}

		// Scene cleanup
		this.events.on("shutdown", this.cleanup, this);

		// Intro dialogue
		this.dialogueBox.show(DIALOGUES.driving.start, () => {
			// Game starts
		});
	}

	private cleanup(): void {
		this.dialogueBox.destroy();
		this.events.off("shutdown", this.cleanup, this);
	}

	private initObstaclePool(): void {
		const poolSize = 10;
		for (let i = 0; i < poolSize; i++) {
			const sprite = this.add.sprite(0, DRIVING.SPAWN_Y, "obstacleCar").setScale(3.5);
			sprite.setDepth(8);
			sprite.setActive(false);
			sprite.setVisible(false);
			this.obstaclePool.push({ sprite, speed: 0, lane: 0, active: false });
		}
	}

	private getPooledObstacle(): Obstacle | null {
		for (const obs of this.obstaclePool) {
			if (!obs.active) return obs;
		}
		return null;
	}

	private drawRoad(): void {
		const bg = this.add.graphics();
		bg.setDepth(0);

		// Sidewalk on both sides
		bg.fillStyle(0xc0b8a8);
		bg.fillRect(0, 0, 230, 600);
		bg.fillRect(570, 0, 230, 600);

		// Buildings on the left side
		this.drawBuildingSide(bg, 0, 230, "left");
		// Buildings on the right side
		this.drawBuildingSide(bg, 570, 230, "right");

		// Road
		const road = this.add.graphics();
		road.fillStyle(0x555555);
		road.fillRect(230, 0, 340, 600);
		road.setDepth(1);

		// Road edges (white curb lines)
		road.lineStyle(3, 0xffffff);
		road.lineBetween(230, 0, 230, 600);
		road.lineBetween(570, 0, 570, 600);

		// Sidewalk curb
		road.fillStyle(0xaaaaaa);
		road.fillRect(225, 0, 5, 600);
		road.fillRect(570, 0, 5, 600);

		// Create scrolling road lines
		for (let y = -50; y < 650; y += 80) {
			const line = this.add.sprite(400, y, "roadLineTile").setScale(2, 3);
			line.setDepth(2);
			this.roadLines.push(line);
		}

		// Power lines across the top
		const powerLines = this.add.graphics();
		powerLines.setDepth(DEPTHS.UI - 1);
		powerLines.lineStyle(1, 0x333333, 0.4);
		powerLines.lineBetween(0, 8, 800, 8);
		powerLines.lineBetween(0, 14, 800, 14);
	}

	private drawBuildingSide(
		bg: Phaser.GameObjects.Graphics,
		startX: number,
		width: number,
		side: "left" | "right",
	): void {
		const buildingColors = [0x8a7d6b, 0xa09080, 0x7a6d5b, 0x9a8d7b, 0xb0a090];
		let y = 0;

		while (y < 600) {
			const buildingHeight = 80 + Math.floor(Math.random() * 80);
			const colorIndex = Math.floor(Math.random() * buildingColors.length);
			const color = buildingColors[colorIndex] ?? 0x8a7d6b;

			// Building body
			bg.fillStyle(color);
			bg.fillRect(startX, y, width, buildingHeight);

			// Building outline
			bg.lineStyle(1, 0x5a5040);
			bg.strokeRect(startX, y, width, buildingHeight);

			// Windows
			const windowStartX = side === "left" ? startX + 10 : startX + 15;
			const windowCols = side === "left" ? 4 : 4;
			const windowSpacing = 45;
			for (let row = 0; row < Math.floor(buildingHeight / 30); row++) {
				for (let col = 0; col < windowCols; col++) {
					const wx = windowStartX + col * windowSpacing;
					const wy = y + 10 + row * 30;
					// Some windows lit (yellow), most blue
					const isLit = Math.random() > 0.7;
					bg.fillStyle(isLit ? 0xffd700 : 0x6a9cc5, isLit ? 0.6 : 0.8);
					bg.fillRect(wx, wy, 25, 18);
				}
			}

			// Occasional shop at ground level (street-facing)
			if (Math.random() > 0.5) {
				const shopColors = [0xe87d2f, 0xc0392b, 0x1a7742, 0x2244aa, 0xff69b4];
				const shopColor = shopColors[Math.floor(Math.random() * shopColors.length)] ?? 0xe87d2f;
				const awningY = y + buildingHeight - 35;
				// Awning
				bg.fillStyle(shopColor, 0.8);
				bg.fillRect(startX, awningY, width, 12);
				// Shop window
				bg.fillStyle(0xc0e0ff, 0.5);
				bg.fillRect(startX + 5, awningY + 12, width - 10, 20);
			}

			// Neon signs (random)
			if (Math.random() > 0.6) {
				const signY = y + 5;
				const signX = side === "left" ? startX + width - 60 : startX + 10;
				const neonColors = [0xff1493, 0x00d4ff, 0xffd700, 0x00ff7f];
				const neonColor = neonColors[Math.floor(Math.random() * neonColors.length)] ?? 0xff1493;
				bg.fillStyle(neonColor, 0.5);
				bg.fillRect(signX, signY, 50, 10);
			}

			y += buildingHeight;
		}

		// Vendor stalls along the sidewalk (closer to road)
		const vendorX = side === "left" ? startX + width - 40 : startX + 5;
		for (let vy = 50; vy < 550; vy += 150 + Math.random() * 100) {
			const g = this.add.graphics();
			g.setDepth(3);
			// Cart
			g.fillStyle(0x8b4513);
			g.fillRect(vendorX, vy, 35, 20);
			// Umbrella
			const umbrellaColors = [0xff4444, 0x4488ff, 0xff8c00, 0x44bb44];
			const umbColor =
				umbrellaColors[Math.floor(Math.random() * umbrellaColors.length)] ?? 0xff4444;
			g.fillStyle(umbColor);
			g.fillRect(vendorX - 5, vy - 8, 45, 8);
			this.sceneryElements.push(g);
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
		const targetX =
			(DRIVING.LANES[this.currentLane] ?? DRIVING.DEFAULT_LANE_X) + this.roadTurnOffset;
		this.car.x += (targetX - this.car.x) * DRIVING.LANE_LERP;
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
			this.currentLane = Math.min(DRIVING.LANES.length - 1, this.currentLane + 1);
		}
	}

	private updateSegment(delta: number): void {
		const threshold = DRIVING.SEGMENT_DISTANCES[this.segment] ?? 3000;

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
			this.roadTurnOffset =
				Math.sin(this.segmentTimer / DRIVING.TURN_FREQUENCY) * DRIVING.TURN_AMPLITUDE;
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
				this.scrollSpeed = DRIVING.FAST_SCROLL_SPEED;
				this.spawnInterval = DRIVING.FAST_SPAWN_INTERVAL;
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
			const waitTime = DRIVING.STOPLIGHT_MIN_WAIT + Math.random() * DRIVING.STOPLIGHT_WAIT_RANGE;
			this.time.delayedCall(waitTime, () => {
				// Turn green
				if (this.trafficLight) {
					this.trafficLight.setTexture("trafficLightGreen");
				}
				this.dialogueBox.show(DIALOGUES.driving.greenLight, () => {
					this.stopped = false;
					this.scrollSpeed = DRIVING.INITIAL_SCROLL_SPEED;
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
					this.distanceTraveled = DRIVING.SEGMENT_DISTANCES.stoplight + 1;
				});
			});
		});
	}

	private startArrival(): void {
		this.stopped = true;
		this.scrollSpeed = 0;

		// Clear remaining obstacles (return to pool)
		for (const obs of this.obstaclePool) {
			if (obs.active) {
				obs.active = false;
				obs.sprite.setActive(false);
				obs.sprite.setVisible(false);
			}
		}

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
					this.cameras.main.fadeOut(FADE.DEFAULT, 0, 0, 0);
					this.cameras.main.once("camerafadeoutcomplete", () => {
						this.scene.start("OfficeArrivalScene");
					});
				});
			},
		});
	}

	private spawnObstacle(): void {
		const lane = Math.floor(Math.random() * DRIVING.LANES.length);
		const laneX = DRIVING.LANES[lane];
		if (laneX === undefined) return;

		// Don't spawn in player's lane too often
		if (lane === this.currentLane && Math.random() > DRIVING.PLAYER_LANE_AVOID_CHANCE) return;

		const obs = this.getPooledObstacle();
		if (!obs) return; // Pool exhausted

		const textures = [
			"obstacleCar",
			"obstacleCar",
			"motorbike",
			"tukTuk",
			"bus",
			"motorbike",
		] as const;
		const texture = textures[Math.floor(Math.random() * textures.length)] ?? "obstacleCar";
		const scaleMap: Record<string, number> = {
			obstacleCar: 3.5,
			motorbike: 3,
			tukTuk: 4,
			bus: 3,
		};
		const scale = scaleMap[texture] ?? 3.5;

		obs.sprite.setTexture(texture);
		obs.sprite.setScale(scale);
		obs.sprite.setPosition(laneX, DRIVING.SPAWN_Y);
		obs.sprite.setActive(true);
		obs.sprite.setVisible(true);
		obs.speed = DRIVING.OBSTACLE_MIN_SPEED + Math.random() * DRIVING.OBSTACLE_SPEED_RANGE;
		obs.lane = lane;
		obs.active = true;
	}

	private updateObstacles(delta: number): void {
		for (const obs of this.obstaclePool) {
			if (!obs.active) continue;
			obs.sprite.y += (obs.speed + this.scrollSpeed) * (delta / 1000);

			if (obs.sprite.y > DRIVING.DESPAWN_Y) {
				obs.active = false;
				obs.sprite.setActive(false);
				obs.sprite.setVisible(false);
			}
		}
	}

	private checkCollisions(): void {
		const hb = DRIVING.CAR_HITBOX;
		const carBounds = new Phaser.Geom.Rectangle(
			this.car.x - hb.width / 2,
			this.car.y - hb.height / 2,
			hb.width,
			hb.height,
		);
		const ob = DRIVING.OBSTACLE_HITBOX;

		for (const obs of this.obstaclePool) {
			if (!obs.active) continue;
			const obsBounds = new Phaser.Geom.Rectangle(
				obs.sprite.x - ob.width / 2,
				obs.sprite.y - ob.height / 2,
				ob.width,
				ob.height,
			);

			if (Phaser.Geom.Rectangle.Overlaps(carBounds, obsBounds)) {
				this.hitObstacle(obs);
				break;
			}
		}
	}

	private hitObstacle(obs: Obstacle): void {
		obs.active = false;
		obs.sprite.setActive(false);
		obs.sprite.setVisible(false);

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
			duration: DRIVING.INVINCIBILITY_FLASH_DURATION,
			repeat: DRIVING.INVINCIBILITY_FLASH_REPEATS,
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
			this.cameras.main.fadeOut(FADE.FAST, 0, 0, 0);
			this.cameras.main.once("camerafadeoutcomplete", () => {
				this.scene.restart();
			});
		});
	}
}
