const form = document.getElementById("submission-form");
const err = form.querySelector(".err");

form.addEventListener("submit", async(e) => {
    e.preventDefault();
    err.innerHTML = "";
    const combination = form.combination.value;
    const config = await firebase
        .firestore()
        .collection("config")
        .doc("config")
        .get()
        .then((config) => config.data());
    const userId = await firebase.auth().currentUser.uid;
    const userDoc = firebase.firestore().collection("teams").doc(userId);

    var bcrypt = dcodeIO.bcrypt;
    if (true) {
        const result = await userDoc.update({
            currentLevel: "2",
            feedbacks: firebase.firestore.FieldValue.arrayUnion(
                config.feedback.level1
            ),
        });
        window.location.href = "/congratulations.html";
        return;
    }

    err.innerHTML = "Combination is wrong";
    return;
});