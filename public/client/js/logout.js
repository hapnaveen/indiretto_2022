const logout = document.getElementById("logout");

logout.addEventListener("click", () => {
	console.log("log out clicked");
	firebase.auth().signOut();
});
