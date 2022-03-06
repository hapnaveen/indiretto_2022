const form = document.getElementById("submission-form");
const err = form.querySelector(".err");
const container = document.getElementById("gameKey-container");

firebase.auth().onAuthStateChanged(async () => {
	const userId = await firebase.auth().currentUser.uid;
	const userDoc = firebase.firestore().collection("teams").doc(userId);
	const userData = await userDoc.get();
	console.log(userData.data().gameKey1);
	const gameKeys = [
		userData.data().gameKey1,
		userData.data().gameKey2,
		userData.data().gameKey3,
		userData.data().gameKey4,
	];
	let html = "";

	gameKeys.forEach((item) => {
		html += `<li>${item}</li>`;
	});

	container.innerHTML = html;
});

form.addEventListener("submit", async (e) => {
	e.preventDefault();

	console.log("button clicked");

	// err.innerHTML = "";
	// const combination = form.combination.value;
	// const config = await firebase
	// 	.firestore()
	// 	.collection("config")
	// 	.doc("config")
	// 	.get()
	// 	.then((config) => config.data());
	// const userId = await firebase.auth().currentUser.uid;
	// const userDoc = firebase.firestore().collection("teams").doc(userId);

	// console.log(config.feedback);

	// if (!config.enable || !userId) {
	// 	err.innerHTML = "Authorization Error";
	// 	return;
	// }

	// if (combination == config.clues.level1) {
	// 	const result = await userDoc.update({
	// 		currentLevel: "2",
	// 		feedbacks: firebase.firestore.FieldValue.arrayUnion(
	// 			config.feedback.level1
	// 		),
	// 	});
	// 	console.log(result);
	// 	return;
	// }

	// err.innerHTML = "Combination is wrong";
	// return;
});
