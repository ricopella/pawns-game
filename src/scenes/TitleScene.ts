import Phaser from "phaser";

export class TitleScene extends Phaser.Scene {
	private canStart = false;

	constructor() {
		super("TitleScene");
	}

	create(): void {
		const width = this.cameras.main.width;
		const height = this.cameras.main.height;

		// Background gradient effect
		const bg = this.add.graphics();
		bg.fillStyle(0x1a0a2e);
		bg.fillRect(0, 0, width, height);

		// Subtle stars
		for (let i = 0; i < 50; i++) {
			bg.fillStyle(0xffffff, Math.random() * 0.5 + 0.2);
			bg.fillRect(Math.random() * width, Math.random() * height, 1, 1);
		}

		// Title text
		const title = this.add.text(width / 2, height / 2 - 100, "PAWN'S DAY", {
			fontFamily: "monospace",
			fontSize: "64px",
			color: "#ff69b4",
			stroke: "#ffffff",
			strokeThickness: 2,
		});
		title.setOrigin(0.5);

		// Subtitle
		const subtitle = this.add.text(width / 2, height / 2 - 30, "A Valentine's Day Adventure", {
			fontFamily: "monospace",
			fontSize: "20px",
			color: "#ff99cc",
		});
		subtitle.setOrigin(0.5);

		// Pawn sprite preview
		this.add.sprite(width / 2, height / 2 + 60, "pawn").setScale(5);

		// Dogs on either side
		this.add.sprite(width / 2 - 60, height / 2 + 70, "lucky").setScale(4);
		this.add.sprite(width / 2 + 60, height / 2 + 70, "cooper").setScale(4);

		// "Press SPACE to start" with blink
		const startText = this.add.text(width / 2, height / 2 + 160, "Press SPACE to start", {
			fontFamily: "monospace",
			fontSize: "20px",
			color: "#ffffff",
		});
		startText.setOrigin(0.5);

		this.tweens.add({
			targets: startText,
			alpha: { from: 1, to: 0.3 },
			duration: 800,
			yoyo: true,
			repeat: -1,
		});

		// Floating hearts
		this.createFloatingHearts(width, height);

		// Title bounce
		this.tweens.add({
			targets: title,
			y: title.y - 5,
			duration: 1500,
			yoyo: true,
			repeat: -1,
			ease: "Sine.easeInOut",
		});

		// Delay before allowing start (prevent accidental skip)
		this.time.delayedCall(500, () => {
			this.canStart = true;
		});

		if (this.input.keyboard) {
			this.input.keyboard.on("keydown-SPACE", () => {
				if (this.canStart) {
					this.cameras.main.fadeOut(500, 0, 0, 0);
					this.cameras.main.once("camerafadeoutcomplete", () => {
						this.scene.start("MorningScene");
					});
				}
			});
		}
	}

	private createFloatingHearts(width: number, height: number): void {
		for (let i = 0; i < 12; i++) {
			const heart = this.add.sprite(
				Math.random() * width,
				height + 20 + Math.random() * 100,
				"heart",
			);
			heart.setScale(2 + Math.random() * 2);
			heart.setAlpha(0.4 + Math.random() * 0.4);

			this.tweens.add({
				targets: heart,
				y: -20,
				x: heart.x + (Math.random() - 0.5) * 100,
				duration: 4000 + Math.random() * 4000,
				delay: Math.random() * 3000,
				repeat: -1,
				onRepeat: () => {
					heart.x = Math.random() * width;
					heart.y = height + 20;
				},
			});
		}
	}
}
