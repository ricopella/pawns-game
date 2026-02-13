import Phaser from "phaser";
import { DIALOGUES } from "../data/dialogues";
import { DialogueBox } from "../systems/DialogueBox";

export class VictoryScene extends Phaser.Scene {
	private dialogueBox!: DialogueBox;

	constructor() {
		super("VictoryScene");
	}

	create(): void {
		this.cameras.main.fadeIn(800);

		const width = this.cameras.main.width;
		const height = this.cameras.main.height;

		// Dark romantic background
		const bg = this.add.graphics();
		bg.fillStyle(0x1a0a2e);
		bg.fillRect(0, 0, width, height);

		// Stars
		for (let i = 0; i < 80; i++) {
			bg.fillStyle(0xffffff, Math.random() * 0.6 + 0.2);
			bg.fillRect(Math.random() * width, Math.random() * height * 0.6, 1, 1);
		}

		// Floating hearts background
		this.createFloatingHearts(width, height);

		// "CONGRATULATIONS!" text
		const congratsText = this.add.text(width / 2, 60, "CONGRATULATIONS!", {
			fontFamily: "monospace",
			fontSize: "40px",
			color: "#ff69b4",
			stroke: "#ffffff",
			strokeThickness: 2,
		});
		congratsText.setOrigin(0.5);
		congratsText.setDepth(50);

		this.tweens.add({
			targets: congratsText,
			scaleX: { from: 0.9, to: 1.05 },
			scaleY: { from: 0.9, to: 1.05 },
			duration: 1000,
			yoyo: true,
			repeat: -1,
			ease: "Sine.easeInOut",
		});

		// Subtitle
		const subText = this.add.text(width / 2, 110, "Pawn survived another day at TTB Bank!", {
			fontFamily: "monospace",
			fontSize: "18px",
			color: "#ff99cc",
		});
		subText.setOrigin(0.5);
		subText.setDepth(50);

		// Pawn sprite (center)
		const pawn = this.add.sprite(width / 2, 280, "pawn").setScale(6);
		pawn.setDepth(20);

		// Dogs doing happy dances
		const lucky = this.add.sprite(width / 2 - 80, 310, "lucky").setScale(4);
		lucky.setDepth(20);
		this.tweens.add({
			targets: lucky,
			y: lucky.y - 15,
			x: lucky.x + 10,
			duration: 300,
			yoyo: true,
			repeat: -1,
		});

		const cooper = this.add.sprite(width / 2 + 80, 310, "cooper").setScale(4);
		cooper.setDepth(20);
		this.tweens.add({
			targets: cooper,
			y: cooper.y - 8,
			duration: 500,
			yoyo: true,
			repeat: -1,
		});

		// Dialogue box
		this.dialogueBox = new DialogueBox({ scene: this });

		// Show congrats dialogue, then boyfriend entrance
		this.time.delayedCall(1500, () => {
			this.dialogueBox.show(DIALOGUES.victory.congrats, () => {
				this.showBoyfriendEntrance(width, pawn, lucky, cooper);
			});
		});
	}

	private showBoyfriendEntrance(
		width: number,
		pawn: Phaser.GameObjects.Sprite,
		lucky: Phaser.GameObjects.Sprite,
		cooper: Phaser.GameObjects.Sprite,
	): void {
		// Boyfriend walks in from right
		const boyfriend = this.add.sprite(width + 50, 280, "boyfriend").setScale(6);
		boyfriend.setDepth(20);
		boyfriend.setFlipX(true);

		this.tweens.add({
			targets: boyfriend,
			x: width / 2 + 60,
			duration: 2000,
			ease: "Power2",
			onComplete: () => {
				// Boyfriend dialogue
				this.dialogueBox.show(DIALOGUES.victory.boyfriend, () => {
					this.showHugScene(pawn, boyfriend, lucky, cooper, width);
				});
			},
		});

		// Move dogs aside
		this.tweens.add({
			targets: lucky,
			x: width / 2 - 120,
			duration: 1500,
		});
		this.tweens.add({
			targets: cooper,
			x: width / 2 + 140,
			duration: 1500,
		});
	}

	private showHugScene(
		pawn: Phaser.GameObjects.Sprite,
		boyfriend: Phaser.GameObjects.Sprite,
		lucky: Phaser.GameObjects.Sprite,
		cooper: Phaser.GameObjects.Sprite,
		width: number,
	): void {
		// Move together
		this.tweens.add({
			targets: pawn,
			x: width / 2 - 10,
			duration: 500,
		});
		this.tweens.add({
			targets: boyfriend,
			x: width / 2 + 10,
			duration: 500,
			onComplete: () => {
				// Heart particles burst
				this.createHeartBurst(width / 2, 260);

				// Dogs run back and celebrate
				this.tweens.add({
					targets: lucky,
					x: width / 2 - 50,
					y: 320,
					duration: 800,
				});
				this.tweens.add({
					targets: cooper,
					x: width / 2 + 50,
					y: 320,
					duration: 800,
				});

				// Show THE END after a moment
				this.time.delayedCall(2000, () => {
					this.showEndScreen(width);
				});
			},
		});
	}

	private createHeartBurst(x: number, y: number): void {
		for (let i = 0; i < 20; i++) {
			const heart = this.add.sprite(x, y, "heart").setScale(2 + Math.random() * 2);
			heart.setDepth(30);
			heart.setAlpha(0.8);

			const angle = (Math.PI * 2 * i) / 20;
			const dist = 50 + Math.random() * 100;

			this.tweens.add({
				targets: heart,
				x: x + Math.cos(angle) * dist,
				y: y + Math.sin(angle) * dist - 50,
				alpha: 0,
				scale: 0.5,
				duration: 1500 + Math.random() * 1000,
				ease: "Power2",
				onComplete: () => heart.destroy(),
			});
		}

		// Continuous smaller hearts
		this.time.addEvent({
			delay: 200,
			repeat: 30,
			callback: () => {
				const heart = this.add.sprite(x + (Math.random() - 0.5) * 60, y, "heart").setScale(1.5);
				heart.setDepth(30);

				this.tweens.add({
					targets: heart,
					y: y - 100 - Math.random() * 80,
					alpha: 0,
					duration: 1000,
					onComplete: () => heart.destroy(),
				});
			},
		});
	}

	private showEndScreen(width: number): void {
		// THE END text
		const endText = this.add.text(width / 2, 430, "THE END", {
			fontFamily: "monospace",
			fontSize: "48px",
			color: "#ff69b4",
			stroke: "#ffffff",
			strokeThickness: 3,
		});
		endText.setOrigin(0.5);
		endText.setDepth(100);
		endText.setAlpha(0);

		this.tweens.add({
			targets: endText,
			alpha: 1,
			duration: 1500,
		});

		// "Made with love" credit
		const creditText = this.add.text(width / 2, 490, "Made with love for Boo Boo", {
			fontFamily: "monospace",
			fontSize: "16px",
			color: "#ff99cc",
		});
		creditText.setOrigin(0.5);
		creditText.setDepth(100);
		creditText.setAlpha(0);

		this.tweens.add({
			targets: creditText,
			alpha: 1,
			duration: 1500,
			delay: 500,
		});

		// Heart emoji
		const heartEmoji = this.add.text(width / 2, 530, "❤️", {
			fontSize: "32px",
		});
		heartEmoji.setOrigin(0.5);
		heartEmoji.setDepth(100);
		heartEmoji.setAlpha(0);

		this.tweens.add({
			targets: heartEmoji,
			alpha: 1,
			duration: 1500,
			delay: 1000,
		});

		// Restart option
		this.time.delayedCall(4000, () => {
			const restartText = this.add.text(width / 2, 570, "Press SPACE to play again", {
				fontFamily: "monospace",
				fontSize: "14px",
				color: "#ffffff",
			});
			restartText.setOrigin(0.5);
			restartText.setDepth(100);

			this.tweens.add({
				targets: restartText,
				alpha: { from: 1, to: 0.3 },
				duration: 800,
				yoyo: true,
				repeat: -1,
			});

			if (this.input.keyboard) {
				this.input.keyboard.on("keydown-SPACE", () => {
					this.cameras.main.fadeOut(1000, 0, 0, 0);
					this.cameras.main.once("camerafadeoutcomplete", () => {
						this.scene.start("TitleScene");
					});
				});
			}
		});
	}

	private createFloatingHearts(width: number, height: number): void {
		for (let i = 0; i < 15; i++) {
			const heart = this.add.sprite(
				Math.random() * width,
				height + 20 + Math.random() * 100,
				"heart",
			);
			heart.setScale(1.5 + Math.random() * 2);
			heart.setAlpha(0.3 + Math.random() * 0.3);
			heart.setDepth(1);

			this.tweens.add({
				targets: heart,
				y: -20,
				x: heart.x + (Math.random() - 0.5) * 80,
				duration: 5000 + Math.random() * 5000,
				delay: Math.random() * 4000,
				repeat: -1,
				onRepeat: () => {
					heart.x = Math.random() * width;
					heart.y = height + 20;
				},
			});
		}
	}

	update(): void {
		this.dialogueBox.update();
	}
}
