export const DIALOGUES = {
	morning: {
		wakeUp: ["Good morning, Pawn! Happy Valentine's Day!", "...but it's a work day. Ugh."],
		dogsWake: ["Lucky is already bouncing around!", "Cooper yawns and stretches slowly..."],
		feedDogs: ["Yum yum! Lucky and Cooper are so happy!"],
		timeToGo: ["Alright, time to head to work!"],
	},
	leaveHouse: {
		walkOut: ["Let's go babies! Down the stairs to the car."],
		getInCar: ["Everyone in! Time to brave Lat Prao traffic..."],
	},
	driving: {
		start: ["Here we go... rush hour in Bangkok."],
		redLight: ["Red light... again..."],
		greenLight: ["Finally! Green light!"],
		arrival: ["There's TTB Bank! Made it in one piece!"],
		crash: ["Ouch! Be careful!"],
		gameOver: ["Oh no! Try again!"],
	},
	office: {
		enterBuilding: ["Another day at TTB Bank..."],
		meetPloy: {
			ploy: ["Hi Pawn! Happy Valentine's Day! 💕"],
			pawn: ["Hi Ploy! Happy Valentine's Day to you too!"],
		},
		meetBestie: {
			bestie: ["Hey Pawn! Did you bring lunch today?"],
			pawn: ["Nope, let's order something later!"],
		},
		hallway: ["Walking through the office..."],
		seniorApproach: ["Oh no... Mr. Senior is coming this way..."],
		betweenBattles: [
			"Mr. Senior retreated to his desk!",
			"Phew! But wait...",
			"The Boss walks over from his pod...",
		],
	},
	battle: {
		mrSenior: {
			intro: ["Mr. Senior is staring at you again...", "He's asking another stupid question..."],
			victory: ["Mr. Senior retreated to his desk!"],
			defeat: ["Mr. Senior wore you down... Try again!"],
		},
		theBoss: {
			intro: [
				"The Boss appears!",
				'"You need to hold your pee more!"',
				'"You should stay late AND come in early!"',
				'"Finish those proposals faster or I won\'t hit MY KPIs!"',
			],
			victory: ["The Boss has been defeated! Pawn is FREE!"],
			defeat: ["The Boss overwhelmed you... Try again!"],
		},
	},
	victory: {
		congrats: ["CONGRATULATIONS!", "Pawn survived another day at TTB Bank!"],
		boyfriend: [
			"Happy Valentine's Day, Boo Boo!",
			"I love you so much!",
			"No matter how tough the day is...",
			"I'll always be here waiting for you.",
			"You're the strongest, most amazing person I know.",
			"Happy Valentine's Day, my Boo Boo. ❤️",
		],
		end: ["Made with love for Boo Boo"],
	},
} as const;
