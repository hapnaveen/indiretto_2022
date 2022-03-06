let userId;
let userDoc;
let config;
let questions = [];
let html = `<ol style="position: relative">`;
const metadata = {
	contentType: "image/jpeg",
};
const storage = firebase.storage().ref();
const submission_area = document.getElementById("sumbisson-enable");

firebase.auth().onAuthStateChanged(async () => {
	userId = await firebase.auth().currentUser.uid;
	userDoc = firebase.firestore().collection("teams").doc(userId);
	config = await firebase
		.firestore()
		.collection("config")
		.doc("config")
		.get()
		.then((config) => config.data());

	let userData = await userDoc.get();
	userData.data().que_numbers.forEach((item) => {
		questions.push(config.questions_lv5[item]);
	});

	questions.forEach((item, index) => {
		html += `<li style="margin-bottom:20px">
					<p>${item}</p>
					<form action="" id="form-${index}">
						<input
							type="file"
							class="submission-input"
							id="file-${index}"
							name="file"
							accept="image/png, image/jpeg"
						/>
					<button class="form-btn" type="submit" disabled >Upload</button>
					<span id="state-${index}" style="color: #ff220c ; margin-left:10px"></span>
					</form></li>`;
	});
	html += `
			<button id="g-next" class="form-btn" disabled style="position: absolute; bottom:0; right:0">Go Next ></button>	
			</ol>	
	`;
	submission_area.innerHTML = html;

	for (let i = 0; i < 4; i++) {
		let form = document.getElementById(`form-${i}`);
		let state = document.getElementById(`state-${i}`);
		let input = document.getElementById(`file-${i}`);
		let name = userData.data().teamname + "-" + questions[i];

		input.addEventListener("change", () => {
			form.querySelector("button").disabled = true;
			if (input.files[0]) {
				console.log(input.files[0].size);
				if (input.files[0].size < 3145728) {
					form.querySelector("button").disabled = false;
				} else {
					state.innerHTML = "Please select file under 3MB";
				}
			}
		});

		form.addEventListener("submit", async (e) => {
			e.preventDefault();

			const uploadTask = storage
				.child("images/" + name)
				.put(input.files[0], metadata);

			// Listen for state changes, errors, and completion of the upload.
			uploadTask.on(
				firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
				function (snapshot) {
					// Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
					var progress =
						(snapshot.bytesTransferred / snapshot.totalBytes) * 100;
					state.innerHTML = progress.toFixed(2) + "%";
					console.log("Upload is " + progress + "% done");
					switch (snapshot.state) {
						case firebase.storage.TaskState.PAUSED: // or 'paused'
							console.log("Upload is paused");
							break;
						case firebase.storage.TaskState.RUNNING: // or 'running'
							console.log("Upload is running");
							break;
					}
				},
				function (error) {
					// A full list of error codes is available at
					// https://firebase.google.com/docs/storage/web/handle-errors
					switch (error.code) {
						case "storage/unauthorized":
							// User doesn't have permission to access the object
							state.innerHTML = "user unathorized";

							break;

						case "storage/canceled":
							// User canceled the upload
							state.innerHTML = "upload canceld";

							break;

						case "storage/unknown":
							// Unknown error occurred, inspect error.serverResponse
							state.innerHTML = "unkown error occured";
							break;
					}
				},
				function () {
					// Upload completed successfully, now we can get the download URL
					uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
						userDoc.update({
							uploads: firebase.firestore.FieldValue.arrayUnion(downloadURL),
						});
						state.innerHTML = "uploaded succesfully";
						console.log("File available at", downloadURL);
					});
				}
			);
		});
	}

	userDoc.onSnapshot((doc) => {
		if (doc.data().uploads.length == 4 || doc.data().uploads.length > 4) {
			document.getElementById("g-next").disabled = false;
		}
	});

	document.getElementById("g-next").addEventListener("click", async () => {
		await userDoc.update({
			currentLevel: "waiting",
			"scores.level5.timeStamp": firebase.firestore.Timestamp.fromDate(
				new Date(Date.now() + 300000)
			),
		});

		// await userDoc.update({
		// 	currentlevel: "waiting",
		// });
		window.location.href = "/round5/waiting.html";
	});
});
