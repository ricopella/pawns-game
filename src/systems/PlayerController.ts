import Phaser from "phaser";
import { PLAYER } from "../config/constants";

interface Bounds {
	minX: number;
	maxX: number;
	minY: number;
	maxY: number;
}

interface PlayerControllerConfig {
	scene: Phaser.Scene;
	sprite: Phaser.GameObjects.Sprite;
	speed?: number;
	bounds: Bounds;
	enableBob?: boolean;
}

export class PlayerController {
	private scene: Phaser.Scene;
	private sprite: Phaser.GameObjects.Sprite;
	private speed: number;
	private bounds: Bounds;
	private enableBob: boolean;
	private cursors: Phaser.Types.Input.Keyboard.CursorKeys | null = null;

	constructor(config: PlayerControllerConfig) {
		this.scene = config.scene;
		this.sprite = config.sprite;
		this.speed = config.speed ?? PLAYER.SPEED;
		this.bounds = config.bounds;
		this.enableBob = config.enableBob ?? false;

		if (this.scene.input.keyboard) {
			this.cursors = this.scene.input.keyboard.createCursorKeys();
		}
	}

	update(delta: number): void {
		if (!this.cursors) return;

		const moveAmount = this.speed * (delta / 1000);
		let moved = false;

		if (this.cursors.left.isDown) {
			this.sprite.x -= moveAmount;
			this.sprite.setFlipX(true);
			moved = true;
		} else if (this.cursors.right.isDown) {
			this.sprite.x += moveAmount;
			this.sprite.setFlipX(false);
			moved = true;
		}
		if (this.cursors.up.isDown) {
			this.sprite.y -= moveAmount;
			moved = true;
		} else if (this.cursors.down.isDown) {
			this.sprite.y += moveAmount;
			moved = true;
		}

		if (moved && this.enableBob) {
			this.sprite.y += Math.sin(Date.now() / PLAYER.BOB_FREQUENCY) * PLAYER.BOB_AMPLITUDE;
		}

		this.sprite.x = Phaser.Math.Clamp(this.sprite.x, this.bounds.minX, this.bounds.maxX);
		this.sprite.y = Phaser.Math.Clamp(this.sprite.y, this.bounds.minY, this.bounds.maxY);
	}

	getCursors(): Phaser.Types.Input.Keyboard.CursorKeys | null {
		return this.cursors;
	}
}
