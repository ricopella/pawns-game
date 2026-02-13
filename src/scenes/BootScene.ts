import Phaser from "phaser";
import { generateAllTextures } from "../systems/SpriteFactory";

export class BootScene extends Phaser.Scene {
	constructor() {
		super("BootScene");
	}

	create(): void {
		const width = this.cameras.main.width;
		const height = this.cameras.main.height;

		// Loading text
		const loadingText = this.add.text(width / 2, height / 2 - 40, "Loading...", {
			fontFamily: "monospace",
			fontSize: "24px",
			color: "#ff69b4",
		});
		loadingText.setOrigin(0.5);

		// Progress bar background
		const progressBox = this.add.graphics();
		progressBox.fillStyle(0x222222, 0.8);
		progressBox.fillRect(width / 2 - 160, height / 2, 320, 30);

		const progressBar = this.add.graphics();

		// Simulate loading progress while generating textures
		let progress = 0;
		const progressTimer = this.time.addEvent({
			delay: 30,
			callback: () => {
				progress = Math.min(progress + 0.05, 0.9);
				progressBar.clear();
				progressBar.fillStyle(0xff69b4, 1);
				progressBar.fillRect(width / 2 - 155, height / 2 + 5, 310 * progress, 20);
			},
			loop: true,
		});

		// Generate all textures
		this.time.delayedCall(100, () => {
			generateAllTextures(this);

			// Complete progress bar
			progressTimer.destroy();
			progressBar.clear();
			progressBar.fillStyle(0xff69b4, 1);
			progressBar.fillRect(width / 2 - 155, height / 2 + 5, 310, 20);

			loadingText.setText("Ready!");

			this.time.delayedCall(500, () => {
				this.scene.start("TitleScene");
			});
		});
	}
}
