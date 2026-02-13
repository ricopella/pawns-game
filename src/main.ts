import Phaser from "phaser";
import { BattleScene } from "./scenes/BattleScene";
import { BootScene } from "./scenes/BootScene";
import { DrivingScene } from "./scenes/DrivingScene";
import { LeaveHouseScene } from "./scenes/LeaveHouseScene";
import { MorningScene } from "./scenes/MorningScene";
import { OfficeArrivalScene } from "./scenes/OfficeArrivalScene";
import { TitleScene } from "./scenes/TitleScene";
import { VictoryScene } from "./scenes/VictoryScene";

const config: Phaser.Types.Core.GameConfig = {
	type: Phaser.AUTO,
	width: 800,
	height: 600,
	parent: "game-container",
	backgroundColor: "#1a0a2e",
	pixelArt: true,
	scale: {
		mode: Phaser.Scale.FIT,
		autoCenter: Phaser.Scale.CENTER_BOTH,
	},
	scene: [
		BootScene,
		TitleScene,
		MorningScene,
		LeaveHouseScene,
		DrivingScene,
		OfficeArrivalScene,
		BattleScene,
		VictoryScene,
	],
};

new Phaser.Game(config);
