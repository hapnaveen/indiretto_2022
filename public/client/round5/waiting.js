firebase.auth().onAuthStateChanged(async () => {
	const userId = await firebase.auth().currentUser.uid;
	const userData = await firebase
		.firestore()
		.collection("teams")
		.doc(userId)
		.get();
	console.log(userData.data());
	let timestamp = await userData.data().scores.level5.timeStamp;

	// firebase
	// 	.firestore()
	// 	.collection("teams")
	// 	.doc(userId)
	// 	.onSnapshot(async (Snapshot) => {
	// 		let timestamp = await Snapshot.data().scores.level5.timeStamp;
	// 		console.log(timestamp.toDate());
	// 	});

	// Set the date we're counting down to
	const countDownDate = new Date(timestamp.toDate()).getTime();
	console.log(countDownDate);

	// Update the count down every 1 second
	const x = setInterval(function () {
		// Get today's date and time
		const now = new Date().getTime();

		// Find the distance between now and the count down date
		const distance = countDownDate - now;

		// Time calculations for days, hours, minutes and seconds
		const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
		const seconds = Math.floor((distance % (1000 * 60)) / 1000);

		// Display the result in the element with id="demo"
		document.getElementById("minutes").innerHTML = minutes;
		document.getElementById("seconds").innerHTML = seconds;

		// If the count down is finished, write some text
		if (minutes == 0 && seconds < 1) {
			clearInterval(x);
			console.log("lets go");
		}
	}, 1000);
});
