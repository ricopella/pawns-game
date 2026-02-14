export const DIALOGUES = {
	morning: {
		wakeUp: [
			"Good morning, Pawn! Happy Valentine's Day!",
			"...it's Saturday, but you still have to go in to work. Ugh.",
		],
		dogsWake: [
			"Cooper's already awake! He's barking at some noise outside.",
			"Lucky doesn't want to get up... she wants to sleep 15 more minutes.",
		],
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
			pawn: ["Hi Ploy! Happy Valentine's Day to you too!", "I'll see you later at the gym!"],
		},
		meetBestie: {
			bestie: ["Hey Pawn! Did you bring food today?"],
			pawn: [
				"Yeah! It's beef pad kra pao with vegetables.",
				"I made it myself last night!",
			],
			bestieReply: ["Let's see what kind of mood Mr. Boss is in today..."],
		},
		hallway: ["Walking through the office..."],
		seniorApproach: ["Oh no... Mr. Senior is coming this way..."],
		betweenBattles: [
			"Mr. Senior retreated to his desk!",
			"Phew! But wait...",
			"The Boss is moody again today...",
			"He's calling you over to his pod...",
		],
	},
	battle: {
		mrSenior: {
			intro: ["Mr. Senior is staring at you again...", "He's asking another stupid question..."],
			victory: ["Mr. Senior retreated to his desk!"],
			defeat: ["Mr. Senior wore you down... Try again!"],
		},
		theBoss: {
			intro: ["The Boss looms over your desk..."],
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
			"I'll always be there to support you.",
			"You're the strongest, most amazing person I know.",
			"Happy Valentine's Day, my Boo Boo. ❤️",
		],
		end: ["Made with love for Boo Boo"],
	},
} as const;
