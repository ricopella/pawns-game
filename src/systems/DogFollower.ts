import type Phaser from "phaser";
import { DOG_FOLLOWER } from "../config/constants";

interface DogFollowerConfig {
	scene: Phaser.Scene;
	texture: string;
	scale?: number;
	followDistance: number;
	speed: number;
	isEnergetic: boolean; // Lucky = true (wanders), Cooper = false (stays close)
	side: "left" | "right"; // Which side of Pawn to follow on
}

export class DogFollower {
	public sprite: Phaser.GameObjects.Sprite;
	public nameLabel: Phaser.GameObjects.Text;
	private scene: Phaser.Scene;
	private speed: number;
	private isEnergetic: boolean;
	private side: "left" | "right";
	private wanderTimer = 0;
	private wanderOffsetX = 0;
	private wanderOffsetY = 0;
	private positionHistory: Array<{ x: number; y: number }> = [];
	private historyDelay: number;

	constructor(config: DogFollowerConfig) {
		this.scene = config.scene;
		this.sprite = this.scene.add.sprite(0, 0, config.texture);
		this.sprite.setScale(config.scale ?? 4);
		this.speed = config.speed;
		this.isEnergetic = config.isEnergetic;
		this.side = config.side;
		this.historyDelay = config.isEnergetic
			? DOG_FOLLOWER.ENERGETIC_HISTORY_DELAY
			: DOG_FOLLOWER.CALM_HISTORY_DELAY;

		// Name label above the dog
		const name = config.texture === "lucky" ? "Lucky" : "Cooper";
		this.nameLabel = this.scene.add.text(0, 0, name, {
			fontFamily: "monospace",
			fontSize: "10px",
			color: "#ffffff",
			stroke: "#000000",
			strokeThickness: 2,
		});
		this.nameLabel.setOrigin(0.5, 1);
	}

	setPosition(x: number, y: number): void {
		this.sprite.setPosition(x, y);
		this.nameLabel.setPosition(x, y - this.sprite.displayHeight / 2 - 2);
		this.positionHistory = [];
		for (let i = 0; i < this.historyDelay; i++) {
			this.positionHistory.push({ x, y });
		}
	}

	update(targetX: number, targetY: number, delta: number): void {
		// Record target position history (for follow delay)
		this.positionHistory.push({ x: targetX, y: targetY });
		if (this.positionHistory.length > this.historyDelay) {
			this.positionHistory.shift();
		}

		const delayedPos = this.positionHistory[0] ?? { x: targetX, y: targetY };

		// Base offset: dogs walk beside Pawn, not behind
		const sideOffset = this.side === "left" ? -DOG_FOLLOWER.SIDE_OFFSET : DOG_FOLLOWER.SIDE_OFFSET;
		const yOffset = DOG_FOLLOWER.Y_OFFSET;

		// Add wander offset for Lucky (energetic)
		if (this.isEnergetic) {
			this.wanderTimer += delta;
			if (this.wanderTimer > DOG_FOLLOWER.WANDER_INTERVAL) {
				this.wanderTimer = 0;
				this.wanderOffsetX = (Math.random() - 0.5) * DOG_FOLLOWER.WANDER_X_RANGE;
				this.wanderOffsetY = (Math.random() - 0.5) * DOG_FOLLOWER.WANDER_Y_RANGE;
			}
		}

		const goalX = delayedPos.x + sideOffset + this.wanderOffsetX;
		const goalY = delayedPos.y + yOffset + this.wanderOffsetY;

		const dx = goalX - this.sprite.x;
		const dy = goalY - this.sprite.y;
		const dist = Math.sqrt(dx * dx + dy * dy);

		if (dist > DOG_FOLLOWER.MIN_MOVE_DIST) {
			const moveSpeed = this.speed * (delta / 1000);
			const ratio = Math.min(moveSpeed / dist, 1);
			this.sprite.x += dx * ratio;
			this.sprite.y += dy * ratio;
		}

		// Update name label position
		this.nameLabel.setPosition(this.sprite.x, this.sprite.y - this.sprite.displayHeight / 2 - 2);
		this.nameLabel.setDepth(this.sprite.depth + 1);

		// Flip sprite based on movement direction
		if (dx < -DOG_FOLLOWER.FLIP_THRESHOLD) {
			this.sprite.setFlipX(true);
		} else if (dx > DOG_FOLLOWER.FLIP_THRESHOLD) {
			this.sprite.setFlipX(false);
		}

		// Small bounce for energetic dog
		if (this.isEnergetic) {
			this.sprite.y +=
				Math.sin(Date.now() / DOG_FOLLOWER.ENERGETIC_BOB_FREQUENCY) *
				DOG_FOLLOWER.ENERGETIC_BOB_AMPLITUDE;
		}
	}

	setDepth(depth: number): void {
		this.sprite.setDepth(depth);
		this.nameLabel.setDepth(depth + 1);
	}

	destroy(): void {
		this.sprite.destroy();
		this.nameLabel.destroy();
	}
}
