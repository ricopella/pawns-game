/**
 * Music manager using YouTube IFrame API to play background music.
 * Provides a toggle button overlay for the game.
 */

// YouTube IFrame API types
declare global {
	interface Window {
		onYouTubeIframeAPIReady: () => void;
		YT: {
			Player: new (
				elementId: string,
				config: {
					height: string;
					width: string;
					videoId: string;
					playerVars: Record<string, number | string>;
					events: {
						onReady: (event: { target: YTPlayer }) => void;
						onStateChange?: (event: { data: number }) => void;
					};
				},
			) => YTPlayer;
			PlayerState: {
				ENDED: number;
			};
		};
	}
}

interface YTPlayer {
	playVideo: () => void;
	pauseVideo: () => void;
	setVolume: (volume: number) => void;
	getPlayerState: () => number;
	destroy: () => void;
}

let ytPlayer: YTPlayer | null = null;
let ytReady = false;
let isPlaying = false;
let pendingPlay = false;

function loadYouTubeAPI(): void {
	if (document.getElementById("yt-api-script")) return;

	const tag = document.createElement("script");
	tag.id = "yt-api-script";
	tag.src = "https://www.youtube.com/iframe_api";
	document.head.appendChild(tag);

	// Create hidden container for the player
	let container = document.getElementById("yt-player-container");
	if (!container) {
		container = document.createElement("div");
		container.id = "yt-player-container";
		container.style.position = "fixed";
		container.style.top = "-9999px";
		container.style.left = "-9999px";
		container.style.width = "1px";
		container.style.height = "1px";
		container.style.overflow = "hidden";
		document.body.appendChild(container);

		const playerDiv = document.createElement("div");
		playerDiv.id = "yt-music-player";
		container.appendChild(playerDiv);
	}

	window.onYouTubeIframeAPIReady = () => {
		// Olivia Dean
		ytPlayer = new window.YT.Player("yt-music-player", {
			height: "1",
			width: "1",
			videoId: "oIv_Y2RPQ_A", // Olivia Dean
			playerVars: {
				autoplay: 0,
				loop: 1,
				playlist: "oIv_Y2RPQ_A", // Required for loop to work
				controls: 0,
				disablekb: 1,
				fs: 0,
				modestbranding: 1,
			},
			events: {
				onReady: (event) => {
					ytReady = true;
					event.target.setVolume(40);
					if (pendingPlay) {
						pendingPlay = false;
						event.target.playVideo();
						isPlaying = true;
					}
				},
				onStateChange: (event) => {
					// Loop when ended
					if (event.data === window.YT.PlayerState.ENDED && isPlaying) {
						ytPlayer?.playVideo();
					}
				},
			},
		});
	};
}

export function initMusic(): void {
	loadYouTubeAPI();
}

export function toggleMusic(): boolean {
	if (!ytReady) {
		// API not ready yet, queue the play
		pendingPlay = !pendingPlay;
		return pendingPlay;
	}

	if (isPlaying) {
		ytPlayer?.pauseVideo();
		isPlaying = false;
	} else {
		ytPlayer?.playVideo();
		isPlaying = true;
	}
	return isPlaying;
}

export function isMusicPlaying(): boolean {
	return isPlaying || pendingPlay;
}

/**
 * Creates a music toggle button as a Phaser text object in the given scene.
 * Returns the text object so the scene can manage its lifecycle.
 */
export function createMusicToggle(scene: Phaser.Scene): Phaser.GameObjects.Text {
	const btn = scene.add.text(760, 570, isMusicPlaying() ? "♪ ON" : "♪ OFF", {
		fontFamily: "monospace",
		fontSize: "14px",
		color: isMusicPlaying() ? "#ff69b4" : "#666666",
		stroke: "#000000",
		strokeThickness: 3,
		backgroundColor: "#1a1a2e",
		padding: { x: 6, y: 4 },
	});
	btn.setOrigin(0.5);
	btn.setDepth(999);
	btn.setInteractive({ useHandCursor: true });
	btn.setScrollFactor(0);

	btn.on("pointerdown", () => {
		const playing = toggleMusic();
		btn.setText(playing ? "♪ ON" : "♪ OFF");
		btn.setColor(playing ? "#ff69b4" : "#666666");
	});

	btn.on("pointerover", () => {
		btn.setAlpha(0.8);
	});
	btn.on("pointerout", () => {
		btn.setAlpha(1);
	});

	return btn;
}
