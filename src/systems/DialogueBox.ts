import Phaser from "phaser";

interface DialogueBoxConfig {
	scene: Phaser.Scene;
	x?: number;
	y?: number;
	width?: number;
	height?: number;
}

export class DialogueBox {
	private scene: Phaser.Scene;
	private container: Phaser.GameObjects.Container;
	private background: Phaser.GameObjects.Graphics;
	private textObject: Phaser.GameObjects.Text;
	private promptText: Phaser.GameObjects.Text;
	private messages: string[] = [];
	private currentMessageIndex = 0;
	private currentCharIndex = 0;
	private fullText = "";
	private isTyping = false;
	private typeTimer: Phaser.Time.TimerEvent | null = null;
	private onComplete: (() => void) | null = null;
	private visible = false;
	private spaceKey: Phaser.Input.Keyboard.Key | null = null;
	private spaceJustPressed = false;

	constructor(config: DialogueBoxConfig) {
		this.scene = config.scene;
		const x = config.x ?? 0;
		const y = config.y ?? 450;
		const width = config.width ?? 800;
		const height = config.height ?? 150;

		this.container = this.scene.add.container(x, y);
		this.container.setDepth(1000);
		this.container.setVisible(false);

		// Background
		this.background = this.scene.add.graphics();
		this.background.fillStyle(0x1a1a2e, 0.95);
		this.background.fillRect(0, 0, width, height);
		this.background.lineStyle(3, 0xff69b4, 1);
		this.background.strokeRect(0, 0, width, height);
		// Inner border
		this.background.lineStyle(1, 0xff69b4, 0.5);
		this.background.strokeRect(4, 4, width - 8, height - 8);
		this.container.add(this.background);

		// Text
		this.textObject = this.scene.add.text(20, 20, "", {
			fontFamily: "monospace",
			fontSize: "20px",
			color: "#ffffff",
			wordWrap: { width: width - 40 },
			lineSpacing: 6,
		});
		this.container.add(this.textObject);

		// Prompt arrow
		this.promptText = this.scene.add.text(width - 40, height - 30, "▼", {
			fontFamily: "monospace",
			fontSize: "16px",
			color: "#ff69b4",
		});
		this.promptText.setVisible(false);
		this.container.add(this.promptText);

		// Blinking prompt
		this.scene.tweens.add({
			targets: this.promptText,
			alpha: { from: 1, to: 0 },
			duration: 500,
			yoyo: true,
			repeat: -1,
		});

		if (this.scene.input.keyboard) {
			this.spaceKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
		}
	}

	show(messages: string[] | readonly string[], onComplete?: () => void): void {
		this.messages = [...messages];
		this.currentMessageIndex = 0;
		this.onComplete = onComplete ?? null;
		this.visible = true;
		this.container.setVisible(true);
		this.promptText.setVisible(false);
		this.showCurrentMessage();
	}

	private showCurrentMessage(): void {
		const msg = this.messages[this.currentMessageIndex];
		if (!msg) return;

		this.fullText = msg;
		this.currentCharIndex = 0;
		this.textObject.setText("");
		this.isTyping = true;
		this.promptText.setVisible(false);

		if (this.typeTimer) {
			this.typeTimer.destroy();
		}

		this.typeTimer = this.scene.time.addEvent({
			delay: 30,
			callback: this.typeNextChar,
			callbackScope: this,
			loop: true,
		});
	}

	private typeNextChar(): void {
		if (this.currentCharIndex < this.fullText.length) {
			this.currentCharIndex++;
			this.textObject.setText(this.fullText.substring(0, this.currentCharIndex));
		} else {
			this.isTyping = false;
			if (this.typeTimer) {
				this.typeTimer.destroy();
				this.typeTimer = null;
			}
			this.promptText.setVisible(true);
		}
	}

	private completeCurrentMessage(): void {
		this.isTyping = false;
		if (this.typeTimer) {
			this.typeTimer.destroy();
			this.typeTimer = null;
		}
		this.currentCharIndex = this.fullText.length;
		this.textObject.setText(this.fullText);
		this.promptText.setVisible(true);
	}

	update(): void {
		if (!this.visible || !this.spaceKey) return;

		const justDown = Phaser.Input.Keyboard.JustDown(this.spaceKey);

		if (justDown && !this.spaceJustPressed) {
			this.spaceJustPressed = true;
			this.advance();
		} else if (!justDown) {
			this.spaceJustPressed = false;
		}
	}

	advance(): void {
		if (!this.visible) return;

		if (this.isTyping) {
			this.completeCurrentMessage();
			return;
		}

		this.currentMessageIndex++;
		if (this.currentMessageIndex < this.messages.length) {
			this.showCurrentMessage();
		} else {
			this.hide();
			if (this.onComplete) {
				this.onComplete();
			}
		}
	}

	hide(): void {
		this.visible = false;
		this.container.setVisible(false);
		if (this.typeTimer) {
			this.typeTimer.destroy();
			this.typeTimer = null;
		}
	}

	isActive(): boolean {
		return this.visible;
	}

	destroy(): void {
		if (this.typeTimer) {
			this.typeTimer.destroy();
		}
		this.container.destroy();
	}
}
