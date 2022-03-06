const overlay = document.getElementById("overlay");
const pageContent = document.getElementById("page-content");
const feedbackContainer = document.getElementById("feedbacks");
const configRef = firebase.firestore().collection("config").doc("config");

async function updateFeedback() {
    const userId = await firebase.auth().currentUser.uid;
    const userDoc = firebase.firestore().collection("teams").doc(userId);
    let injectHtml = "";

    userDoc.onSnapshot((snapShot) => {
        injectHtml = "";
        snapShot.data().feedbacks.forEach((item) => {
            injectHtml += `<li style="margin-bottom:10px;">${item}</li>`;
        });
        feedbackContainer.innerHTML = injectHtml;
    });
}

firebase.auth().onAuthStateChanged(async(user) => {
    if (!user) {
        window.location.replace("/login.html");
        return;
    }

    const config = await configRef.get().then((config) => config.data());

    if (!config.enable) {
        console.log("hi");
        await firebase.auth().signOut();
        return;
    }

    configRef.onSnapshot((doc) => {
        if (!doc.data().enable) {
            firebase.auth().signOut();
        }
    });

    const userId = await firebase.auth().currentUser.uid;
    await firebase
        .firestore()
        .collection("teams")
        .doc(userId)
        .onSnapshot((data) => {
            const currentLevel = data.data().currentLevel;

            const roundRequested = window.location.pathname.split("/")[1];

            if (currentLevel == "1") {
                if (roundRequested != "round1") {
                    window.location.href = "/round1";
                }
            } else if (currentLevel == "2") {
                if (roundRequested != "round2") {
                    window.location.href = "/round2";
                }
            } else if (currentLevel == "3") {
                if (roundRequested != "round3") {
                    window.location.href = "/round3";
                }
            } else if (currentLevel == "4") {
                if (roundRequested != "round4") {
                    window.location.href = "/round4";
                }
            } else if (currentLevel == "5") {
                if (roundRequested != "round5") {
                    window.location.href = "/round5";
                }
            } else if (currentLevel == "waiting") {
                if (window.location.pathname != "/round5/waiting.html") {
                    window.location.href = "/round5/waiting.html";
                }
                // } else {
                //     window.location.href = "/";
            }
        });

    // switch (currentLevel) {
    // 		case "1":
    // 			if (roundRequested != "round1") {
    // 				window.location.replace("/round1");
    // 				break;
    // 			}
    // 		case "2":
    // 			if (roundRequested != "round2") {
    // 				window.location.replace("/round2");
    // 				break;
    // 			}
    // 		case "3":
    // 			if (roundRequested != "round3") {
    // 				window.location.replace("/round3");
    // 				break;
    // 			}
    // 		case "4":
    // 			if (roundRequested != "round4") {
    // 				window.location.replace("/round4");
    // 				break;
    // 			}
    // 		case "5":
    // 			if (roundRequested != "round5") {
    // 				window.location.replace("/round5");
    // 				break;
    // 			}

    // 		default:
    // 			window.location.replace("/");
    // 	}

    overlay.style.display = "none";
    pageContent.style.display = "block";

    updateFeedback();
});