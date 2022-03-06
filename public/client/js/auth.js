const loginForm = document.querySelector("#login");
const enable = document.getElementById("enable");
const disable = document.getElementById("disable");

firebase.auth().onAuthStateChanged((user) => {
	console.log(user);
	if (user) {
		window.location.href = "/round1";
	}
});

async function controlView() {
	const config = await firebase
		.firestore()
		.collection("config")
		.doc("config")
		.get()
		.then((config) => config.data());

	if (config.enable) {
		enable.style.display = "block";
	} else {
		disable.style.display = "block";
	}
}

loginForm.addEventListener("submit", (e) => {
	e.preventDefault();

	const team =
		loginForm.name.value.replace(/\s+/g, "").toLowerCase() + "@indiretto.rota";
	const password = loginForm.password.value;

	firebase
		.auth()
		.signInWithEmailAndPassword(team, password)
		.catch((err) => {
			setMessage(loginForm, err.message);
		});
});

const setMessage = (form, msg) => {
	form.querySelector(".msg").innerHTML = msg;

	setTimeout(() => {
		form.querySelector(".msg").innerHTML = "";
	}, 2000);
};
controlView();

// firebase.auth().onAuthStateChanged((user) => {
// 	if (user) {
// 		console.log(user);
// 		firebase
// 			.auth()
// 			.currentUser.getIdTokenResult()
// 			.then((result) => {
// 				console.log(result.claims.admin);
// 			});
// 	}
// });
