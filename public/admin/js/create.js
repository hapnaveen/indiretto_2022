const createTeam = document.querySelector("#create-team");
const createAdmin = document.querySelector("#create-admin");
const makeAdmin = firebase.functions().httpsCallable("addAdminRole");

function randomString(length, chars) {
	var result = "";
	for (var i = length; i > 0; --i)
		result += chars[Math.floor(Math.random() * chars.length)];
	return result;
}

function createGameKeys() {
	const keys = [];

	for (let i = 0; i < 4; i++) {
		keys.push(
			randomString(
				6,
				"0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
			)
		);
	}
	return keys;
}

const [gameKey1, gameKey2, gameKey3, gameKey4] = createGameKeys();

function getRandomInt(max) {
	return Math.floor(Math.random() * Math.floor(max));
}

function generateIndexs() {
	const numbers = [];

	while (numbers.length < 4) {
		let int = getRandomInt(9);

		if (numbers.indexOf(int) == -1) {
			numbers.push(int);
		}
	}

	return numbers;
}
const que_numbers = generateIndexs();

createTeam.addEventListener("submit", (e) => {
	e.preventDefault();

	const teamName = createTeam.name.value;

	const team =
		createTeam.name.value.replace(/\s+/g, "").toLowerCase() + "@indiretto.rota";
	const password = createTeam.password.value;

	firebase
		.auth()
		.createUserWithEmailAndPassword(team, password)
		.then((cred) => {
			return firebase
				.firestore()
				.collection("teams")
				.doc(cred.user.uid)
				.set({
					teamname: teamName,
					currentLevel: "1",
					gameKey1,
					gameKey2,
					gameKey3,
					gameKey4,
					que_numbers,
					scores: {
						level1: null,
						level3: {
							1: null,
							2: null,
							3: null,
							4: null,
						},
						level5: {
							timeStamp: null,
							approved: false,
						},
					},
					uploads: [],
					feedbacks: [
						"Welcome to indiretto , Some of the clues will be in here. So, make sure to check",
					],
				});
		})
		.then(() => {
			setMessage(createTeam, "user created");
		})
		.catch((err) => {
			setMessage(createTeam, err.message);
		});
});

createAdmin.addEventListener("submit", (e) => {
	e.preventDefault();

	const name =
		createAdmin.name.value.replace(/\s+/g, "").toLowerCase() +
		"@indiretto.rota";
	const password = createAdmin.password.value;
	console.log(name, password);
	firebase
		.auth()
		.createUserWithEmailAndPassword(name, password)
		.then(() => makeAdmin({ email: name }))
		.then((res) => {
			setMessage(createAdmin, res.message);
		})
		.catch((err) => {
			setMessage(createAdmin, err.message);
		});
});

const setMessage = (form, msg) => {
	form.querySelector(".msg").innerHTML = msg;

	setTimeout(() => {
		form.querySelector(".msg").innerHTML = "";
	}, 2000);
};
