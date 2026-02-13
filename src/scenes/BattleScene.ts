import Phaser from "phaser";
import { MR_SENIOR_BATTLE, THE_BOSS_BATTLE } from "../data/battleConfig";
import { BattleSystem } from "../systems/BattleSystem";

export class BattleScene extends Phaser.Scene {
	private battleSystem!: BattleSystem;
	private battleKey = "mrSenior";

	constructor() {
		super("BattleScene");
	}

	init(data: { battle?: string }): void {
		this.battleKey = data.battle ?? "mrSenior";
	}

	create(): void {
		this.cameras.main.fadeIn(300);

		const config = this.battleKey === "theBoss" ? THE_BOSS_BATTLE : MR_SENIOR_BATTLE;

		this.battleSystem = new BattleSystem(this, config);
		this.battleSystem.start((won) => {
			if (won) {
				this.cameras.main.fadeOut(500, 0, 0, 0);
				this.cameras.main.once("camerafadeoutcomplete", () => {
					this.scene.start(config.nextScene, config.nextSceneData);
				});
			} else {
				// Defeat — restart the battle
				this.cameras.main.fadeOut(500, 0, 0, 0);
				this.cameras.main.once("camerafadeoutcomplete", () => {
					this.scene.restart({ battle: this.battleKey });
				});
			}
		});
	}

	update(): void {
		this.battleSystem.update();
	}
}
