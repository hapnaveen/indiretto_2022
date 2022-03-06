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

    console.log(config.feedback);

    if (!config.enable || !userId) {
        err.innerHTML = "Authorization Error";
        return;
    }

    var bcrypt = dcodeIO.bcrypt;
    if (bcrypt.compareSync(combination, config.clues.level2)) {
        const result = await userDoc.update({
            currentLevel: "3",
            feedbacks: firebase.firestore.FieldValue.arrayUnion(
                config.feedback.level2
            ),
        });
        window.location.href = "/congratulations.html";
        return;
    }

    err.innerHTML = "Combination is wrong";
    return;
});