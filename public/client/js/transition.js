const counterEl = document.getElementById("counter");

async function counter() {
	let x = 5;
	let currentLevel;

	currentLevel = firebase.auth().onAuthStateChanged(async (user) => {
		console.log(user);
		if (!user) {
			window.location.replace("/login.html");
		}
		const userId = await firebase.auth().currentUser.uid;
		currentLevel = await firebase
			.firestore()
			.collection("teams")
			.doc(userId)
			.get()
			.then((data) => data.data().currentLevel);
	});

	const y = setInterval(() => {
		counterEl.innerHTML = x;
		x--;

		if (x < 0) {
			if (currentLevel == "1") {
				window.location.href = "/round1";
			} else if (currentLevel == "2") {
				window.location.href = "/round2";
			} else if (currentLevel == "3") {
				window.location.href = "/round3";
			} else if (currentLevel == "4") {
				window.location.href = "/round4";
			} else if (currentLevel == "5") {
				window.location.href = "/round5";
			} else {
				window.location.href = "/login";
			}
			clearInterval(y);
		}
	}, 1000);
}

(async () => {
	await counter();
})();
