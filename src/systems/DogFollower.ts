import type Phaser from "phaser";

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
		this.historyDelay = config.isEnergetic ? 8 : 12;

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
		const sideOffset = this.side === "left" ? -45 : 45;
		const yOffset = 5; // slightly behind but mostly beside

		// Add wander offset for Lucky (energetic)
		if (this.isEnergetic) {
			this.wanderTimer += delta;
			if (this.wanderTimer > 800) {
				this.wanderTimer = 0;
				this.wanderOffsetX = (Math.random() - 0.5) * 30;
				this.wanderOffsetY = (Math.random() - 0.5) * 20;
			}
		}

		const goalX = delayedPos.x + sideOffset + this.wanderOffsetX;
		const goalY = delayedPos.y + yOffset + this.wanderOffsetY;

		const dx = goalX - this.sprite.x;
		const dy = goalY - this.sprite.y;
		const dist = Math.sqrt(dx * dx + dy * dy);

		if (dist > 4) {
			const moveSpeed = this.speed * (delta / 1000);
			const ratio = Math.min(moveSpeed / dist, 1);
			this.sprite.x += dx * ratio;
			this.sprite.y += dy * ratio;
		}

		// Update name label position
		this.nameLabel.setPosition(this.sprite.x, this.sprite.y - this.sprite.displayHeight / 2 - 2);
		this.nameLabel.setDepth(this.sprite.depth + 1);

		// Flip sprite based on movement direction
		if (dx < -2) {
			this.sprite.setFlipX(true);
		} else if (dx > 2) {
			this.sprite.setFlipX(false);
		}

		// Small bounce for energetic dog
		if (this.isEnergetic) {
			this.sprite.y += Math.sin(Date.now() / 150) * 0.8;
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
