import Phaser from "phaser";
import { BATTLE_UI } from "../config/constants";
import type { BattleConfig, Move } from "../data/battleConfig";

type BattlePhase =
	| "intro"
	| "playerTurn"
	| "playerAttack"
	| "enemyTurn"
	| "enemyAttack"
	| "victory"
	| "defeat";

interface BattleUI {
	playerHpBar: Phaser.GameObjects.Graphics;
	enemyHpBar: Phaser.GameObjects.Graphics;
	playerHpText: Phaser.GameObjects.Text;
	enemyHpText: Phaser.GameObjects.Text;
	playerSprite: Phaser.GameObjects.Sprite;
	enemySprite: Phaser.GameObjects.Sprite;
	moveTexts: Phaser.GameObjects.Text[];
	moveSelector: Phaser.GameObjects.Graphics;
	battleText: Phaser.GameObjects.Text;
	playerNameText: Phaser.GameObjects.Text;
	enemyNameText: Phaser.GameObjects.Text;
}

export class BattleSystem {
	private scene: Phaser.Scene;
	private config: BattleConfig;
	private playerHp: number;
	private enemyHp: number;
	private phase: BattlePhase = "intro";
	private selectedMove = 0;
	private ui!: BattleUI;
	private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
	private spaceKey!: Phaser.Input.Keyboard.Key;
	private onComplete: ((won: boolean) => void) | null = null;
	private introIndex = 0;
	private actionLocked = false;

	constructor(scene: Phaser.Scene, config: BattleConfig) {
		this.scene = scene;
		this.config = config;
		this.playerHp = config.playerHp;
		this.enemyHp = config.enemyHp;
	}

	start(onComplete: (won: boolean) => void): void {
		this.onComplete = onComplete;

		if (this.scene.input.keyboard) {
			this.cursors = this.scene.input.keyboard.createCursorKeys();
			this.spaceKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
		}

		this.createUI();
		this.phase = "intro";
		this.introIndex = 0;
		this.showIntroText();
	}

	private createUI(): void {
		const scene = this.scene;

		// Battle background
		const bg = scene.add.graphics();
		const bgColor = this.config.bgColor ?? 0x1a1a2e;
		const groundColor = this.config.groundColor ?? 0x2a2a4e;
		const lineColor = this.config.lineColor ?? 0x444466;
		bg.fillStyle(bgColor, 1);
		bg.fillRect(0, 0, 800, 600);
		bg.fillStyle(groundColor, 1);
		bg.fillRect(0, BATTLE_UI.GROUND_LINE_Y, 800, 300);

		// Ground line
		bg.lineStyle(2, lineColor);
		bg.lineBetween(0, BATTLE_UI.GROUND_LINE_Y, 800, BATTLE_UI.GROUND_LINE_Y);

		// Scary red particles for boss fights
		if (this.config.bgColor) {
			for (let i = 0; i < 30; i++) {
				const px = Math.random() * 800;
				const py = Math.random() * BATTLE_UI.GROUND_LINE_Y;
				bg.fillStyle(0xff2222, Math.random() * 0.15 + 0.05);
				bg.fillCircle(px, py, Math.random() * 3 + 1);
			}
			// Red vignette edges
			bg.fillStyle(0x440000, 0.3);
			bg.fillRect(0, 0, 40, 600);
			bg.fillRect(760, 0, 40, 600);
			bg.fillRect(0, 0, 800, 20);
		}

		// Player sprite (left side)
		const playerSprite = scene.add
			.sprite(BATTLE_UI.PLAYER_X, BATTLE_UI.PLAYER_Y, "pawn")
			.setScale(BATTLE_UI.PLAYER_SCALE);

		// Cheering dogs
		scene.add.sprite(BATTLE_UI.LUCKY_X, BATTLE_UI.LUCKY_Y, "lucky").setScale(BATTLE_UI.DOG_SCALE);
		scene.add
			.sprite(BATTLE_UI.COOPER_X, BATTLE_UI.COOPER_Y, "cooper")
			.setScale(BATTLE_UI.DOG_SCALE);

		// Enemy sprite (right side)
		const enemySprite = scene.add
			.sprite(BATTLE_UI.ENEMY_X, BATTLE_UI.ENEMY_Y, this.config.enemyTexture)
			.setScale(BATTLE_UI.ENEMY_SCALE);

		// Player HP bar
		const playerNameText = scene.add.text(
			BATTLE_UI.PLAYER_NAME_POS.x,
			BATTLE_UI.PLAYER_NAME_POS.y,
			"Pawn",
			{
				fontFamily: "monospace",
				fontSize: "18px",
				color: "#ffffff",
			},
		);

		const playerHpText = scene.add.text(
			BATTLE_UI.PLAYER_HP_TEXT_POS.x,
			BATTLE_UI.PLAYER_HP_TEXT_POS.y,
			`HP: ${this.playerHp}/${this.config.playerHp}`,
			{
				fontFamily: "monospace",
				fontSize: "14px",
				color: "#aaaaaa",
			},
		);

		const playerHpBar = scene.add.graphics();
		this.drawHpBar(
			playerHpBar,
			BATTLE_UI.PLAYER_HP_BAR.x,
			BATTLE_UI.PLAYER_HP_BAR.y,
			this.playerHp,
			this.config.playerHp,
		);

		// Enemy HP bar
		const enemyNameText = scene.add.text(
			BATTLE_UI.ENEMY_NAME_POS.x,
			BATTLE_UI.ENEMY_NAME_POS.y,
			this.config.enemyName,
			{
				fontFamily: "monospace",
				fontSize: "18px",
				color: "#ffffff",
			},
		);

		const enemyHpText = scene.add.text(
			BATTLE_UI.ENEMY_HP_TEXT_POS.x,
			BATTLE_UI.ENEMY_HP_TEXT_POS.y,
			`HP: ${this.enemyHp}/${this.config.enemyHp}`,
			{
				fontFamily: "monospace",
				fontSize: "14px",
				color: "#aaaaaa",
			},
		);

		const enemyHpBar = scene.add.graphics();
		this.drawHpBar(
			enemyHpBar,
			BATTLE_UI.ENEMY_HP_BAR.x,
			BATTLE_UI.ENEMY_HP_BAR.y,
			this.enemyHp,
			this.config.enemyHp,
		);

		// Move menu
		const menuBg = scene.add.graphics();
		menuBg.fillStyle(0x1a1a2e, 0.95);
		menuBg.fillRect(
			BATTLE_UI.MENU.x,
			BATTLE_UI.MENU.y,
			BATTLE_UI.MENU.width,
			BATTLE_UI.MENU.height,
		);
		menuBg.lineStyle(2, 0xff69b4);
		menuBg.strokeRect(
			BATTLE_UI.MENU.x,
			BATTLE_UI.MENU.y,
			BATTLE_UI.MENU.width,
			BATTLE_UI.MENU.height,
		);

		const moveTexts: Phaser.GameObjects.Text[] = [];
		for (let i = 0; i < this.config.playerMoves.length; i++) {
			const move = this.config.playerMoves[i];
			if (!move) continue;
			const col = i % 2;
			const row = Math.floor(i / 2);
			const text = scene.add.text(
				BATTLE_UI.MOVE_START_X + col * BATTLE_UI.MOVE_COL_OFFSET,
				BATTLE_UI.MOVE_START_Y + row * BATTLE_UI.MOVE_ROW_OFFSET,
				move.name,
				{
					fontFamily: "monospace",
					fontSize: "18px",
					color: "#ffffff",
				},
			);
			moveTexts.push(text);
		}

		const moveSelector = scene.add.graphics();
		this.updateMoveSelector(moveSelector);

		// Battle text
		const battleText = scene.add.text(BATTLE_UI.BATTLE_TEXT.x, BATTLE_UI.BATTLE_TEXT.y, "", {
			fontFamily: "monospace",
			fontSize: "18px",
			color: "#ffffff",
			wordWrap: { width: BATTLE_UI.BATTLE_TEXT.wrapWidth },
			lineSpacing: 4,
		});

		this.ui = {
			playerHpBar,
			enemyHpBar,
			playerHpText,
			enemyHpText,
			playerSprite,
			enemySprite,
			moveTexts,
			moveSelector,
			battleText,
			playerNameText,
			enemyNameText,
		};

		this.setMoveMenuVisible(false);
	}

	private drawHpBar(
		g: Phaser.GameObjects.Graphics,
		x: number,
		y: number,
		current: number,
		max: number,
	): void {
		g.clear();
		// Background
		g.fillStyle(0x333333);
		g.fillRect(x, y, BATTLE_UI.HP_BAR_WIDTH, BATTLE_UI.HP_BAR_HEIGHT);
		// Health
		const ratio = Math.max(0, current / max);
		const color = ratio > 0.5 ? 0x4caf50 : ratio > 0.25 ? 0xff9800 : 0xe74c3c;
		g.fillStyle(color);
		g.fillRect(x, y, BATTLE_UI.HP_BAR_WIDTH * ratio, BATTLE_UI.HP_BAR_HEIGHT);
		// Border
		g.lineStyle(1, 0xffffff, 0.5);
		g.strokeRect(x, y, BATTLE_UI.HP_BAR_WIDTH, BATTLE_UI.HP_BAR_HEIGHT);
	}

	private updateMoveSelector(g?: Phaser.GameObjects.Graphics): void {
		const selector = g ?? this.ui.moveSelector;
		selector.clear();
		selector.lineStyle(2, 0xff69b4);
		const col = this.selectedMove % 2;
		const row = Math.floor(this.selectedMove / 2);
		selector.strokeRect(
			BATTLE_UI.SELECTOR_X + col * BATTLE_UI.MOVE_COL_OFFSET,
			BATTLE_UI.SELECTOR_Y + row * BATTLE_UI.MOVE_ROW_OFFSET,
			BATTLE_UI.SELECTOR_WIDTH,
			BATTLE_UI.SELECTOR_HEIGHT,
		);
	}

	private setMoveMenuVisible(visible: boolean): void {
		for (const t of this.ui.moveTexts) {
			t.setVisible(visible);
		}
		this.ui.moveSelector.setVisible(visible);
	}

	private showIntroText(): void {
		const text = this.config.introPhrases[this.introIndex];
		if (text) {
			this.ui.battleText.setText(text);
		}
	}

	update(): void {
		if (this.actionLocked) return;

		switch (this.phase) {
			case "intro":
				this.handleIntro();
				break;
			case "playerTurn":
				this.handlePlayerTurn();
				break;
			case "victory":
			case "defeat":
				this.handleEndPhase();
				break;
		}
	}

	private handleIntro(): void {
		if (Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
			this.introIndex++;
			if (this.introIndex < this.config.introPhrases.length) {
				this.showIntroText();
			} else {
				this.phase = "playerTurn";
				this.ui.battleText.setText("What will Pawn do?");
				this.setMoveMenuVisible(true);
			}
		}
	}

	private handlePlayerTurn(): void {
		if (Phaser.Input.Keyboard.JustDown(this.cursors.left)) {
			this.selectedMove =
				this.selectedMove % 2 === 0 ? this.selectedMove + 1 : this.selectedMove - 1;
			this.selectedMove = Math.min(this.selectedMove, this.config.playerMoves.length - 1);
			this.updateMoveSelector();
		} else if (Phaser.Input.Keyboard.JustDown(this.cursors.right)) {
			this.selectedMove =
				this.selectedMove % 2 === 0 ? this.selectedMove + 1 : this.selectedMove - 1;
			this.selectedMove = Math.min(this.selectedMove, this.config.playerMoves.length - 1);
			this.updateMoveSelector();
		} else if (Phaser.Input.Keyboard.JustDown(this.cursors.up)) {
			this.selectedMove = this.selectedMove >= 2 ? this.selectedMove - 2 : this.selectedMove;
			this.updateMoveSelector();
		} else if (Phaser.Input.Keyboard.JustDown(this.cursors.down)) {
			this.selectedMove = this.selectedMove < 2 ? this.selectedMove + 2 : this.selectedMove;
			this.selectedMove = Math.min(this.selectedMove, this.config.playerMoves.length - 1);
			this.updateMoveSelector();
		}

		if (Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
			this.executePlayerMove();
		}
	}

	private executePlayerMove(): void {
		const move = this.config.playerMoves[this.selectedMove];
		if (!move) return;

		this.setMoveMenuVisible(false);
		this.actionLocked = true;
		this.phase = "playerAttack";

		if (move.isHeal) {
			this.playerHp = Math.min(this.playerHp + move.minDamage, this.config.playerHp);
			this.ui.battleText.setText(move.flavorText);
			this.updatePlayerHpDisplay();
			this.flashSprite(this.ui.playerSprite, 0x00ff00, () => {
				this.actionLocked = false;
				this.startEnemyTurn();
			});
			return;
		}

		// Check accuracy
		if (Math.random() > move.accuracy) {
			this.ui.battleText.setText(`Pawn used ${move.name}... but it missed!`);
			this.scene.time.delayedCall(1200, () => {
				this.actionLocked = false;
				this.startEnemyTurn();
			});
			return;
		}

		const damage = this.calcDamage(move);
		this.enemyHp = Math.max(0, this.enemyHp - damage);

		this.ui.battleText.setText(`${move.flavorText}\nDealt ${damage} damage!`);
		this.updateEnemyHpDisplay();

		this.flashSprite(this.ui.enemySprite, 0xff0000, () => {
			if (this.enemyHp <= 0) {
				this.actionLocked = false;
				this.handleVictory();
			} else {
				this.actionLocked = false;
				this.startEnemyTurn();
			}
		});
	}

	private startEnemyTurn(): void {
		this.phase = "enemyTurn";
		this.scene.time.delayedCall(1000, () => {
			this.executeEnemyMove();
		});
	}

	private executeEnemyMove(): void {
		const moves = this.config.enemyMoves;
		const move = moves[Math.floor(Math.random() * moves.length)];
		if (!move) return;

		this.phase = "enemyAttack";
		this.actionLocked = true;

		if (Math.random() > move.accuracy) {
			this.ui.battleText.setText(`${this.config.enemyName} used ${move.name}... but it missed!`);
			this.scene.time.delayedCall(1200, () => {
				this.actionLocked = false;
				this.phase = "playerTurn";
				this.ui.battleText.setText("What will Pawn do?");
				this.setMoveMenuVisible(true);
			});
			return;
		}

		const damage = this.calcDamage(move);
		this.playerHp = Math.max(0, this.playerHp - damage);

		this.ui.battleText.setText(
			`${this.config.enemyName} used ${move.name}!\n${move.flavorText}\nDealt ${damage} damage!`,
		);
		this.updatePlayerHpDisplay();

		this.flashSprite(this.ui.playerSprite, 0xff0000, () => {
			if (this.playerHp <= 0) {
				this.actionLocked = false;
				this.handleDefeat();
			} else {
				this.actionLocked = false;
				this.phase = "playerTurn";
				this.ui.battleText.setText("What will Pawn do?");
				this.setMoveMenuVisible(true);
			}
		});
	}

	private calcDamage(move: Move): number {
		return Math.floor(move.minDamage + Math.random() * (move.maxDamage - move.minDamage));
	}

	private flashSprite(sprite: Phaser.GameObjects.Sprite, color: number, onDone: () => void): void {
		sprite.setTint(color);
		this.scene.tweens.add({
			targets: sprite,
			x: sprite.x + 10,
			duration: 50,
			yoyo: true,
			repeat: 3,
			onComplete: () => {
				sprite.clearTint();
				this.scene.time.delayedCall(400, onDone);
			},
		});
	}

	private updatePlayerHpDisplay(): void {
		this.drawHpBar(this.ui.playerHpBar, 30, 385, this.playerHp, this.config.playerHp);
		this.ui.playerHpText.setText(`HP: ${this.playerHp}/${this.config.playerHp}`);
	}

	private updateEnemyHpDisplay(): void {
		this.drawHpBar(this.ui.enemyHpBar, 520, 75, this.enemyHp, this.config.enemyHp);
		this.ui.enemyHpText.setText(`HP: ${this.enemyHp}/${this.config.enemyHp}`);
	}

	private handleVictory(): void {
		this.phase = "victory";
		this.ui.battleText.setText(this.config.victoryText);
		this.setMoveMenuVisible(false);

		// Enemy fade out
		this.scene.tweens.add({
			targets: this.ui.enemySprite,
			alpha: 0,
			duration: 1000,
		});
	}

	private handleDefeat(): void {
		this.phase = "defeat";
		this.ui.battleText.setText(this.config.defeatText);
		this.setMoveMenuVisible(false);

		// Player fade
		this.scene.tweens.add({
			targets: this.ui.playerSprite,
			alpha: 0,
			duration: 1000,
		});
	}

	private handleEndPhase(): void {
		if (Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
			if (this.onComplete) {
				this.onComplete(this.phase === "victory");
			}
		}
	}
}
