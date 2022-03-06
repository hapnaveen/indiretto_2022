const loginForm = document.querySelector("#admin-login");

loginForm.addEventListener("submit", (e) => {
	e.preventDefault();

	const name =
		loginForm.name.value.replace(/\s+/g, "").toLowerCase() + "@indiretto.rota";
	const password = loginForm.password.value;

	firebase
		.auth()
		.signInWithEmailAndPassword(name, password)
		.catch((err) => {
			setMessage(loginForm, err.message);
		});

	firebase.auth().onAuthStateChanged((user) => {
		if (user) {
			firebase
				.auth()
				.currentUser.getIdTokenResult()
				.then((result) => {
					console.log(result.claims.admin);
					if (result.claims.admin) {
						window.location.replace("/dashboard.html");
					}
				})
				.catch((err) => {
					setMessage(loginForm, err.message);
				});
		}
	});
});

const setMessage = (form, msg) => {
	form.querySelector(".msg").innerHTML = msg;

	setTimeout(() => {
		form.querySelector(".msg").innerHTML = "";
	}, 2000);
};
