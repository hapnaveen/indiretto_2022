const form = document.getElementById("submission-form");
const err = form.querySelector(".err");

form.addEventListener("submit", async(e) => {
    e.preventDefault();
    err.innerHTML = "";
    const one = form.one.value;
    const two = form.two.value;
    const three = form.three.value;
    const four = form.four.value;
    const five = form.five.value;
    const six = form.six.value;
    const seven = form.seven.value;
    const eight = form.eight.value;
    const nine = form.nine.value;
    const ten = form.ten.value;

    const pin =
        one + two + three + four + five + six + seven + eight + nine + ten;
    console.log(pin);
    const config = await firebase
        .firestore()
        .collection("config")
        .doc("config")
        .get()
        .then((config) => config.data());
    const userId = await firebase.auth().currentUser.uid;
    const userDoc = firebase.firestore().collection("teams").doc(userId);

    console.log(config.clues.level4);

    if (!config.enable || !userId) {
        err.innerHTML = "Authorization Error";
        return;
    }

    var bcrypt = dcodeIO.bcrypt;
    if (bcrypt.compareSync(pin, config.clues.level4)) {
        const result = await userDoc.update({
            currentLevel: "5",
            feedbacks: firebase.firestore.FieldValue.arrayUnion(
                config.feedback.level4
            ),
        });
        window.location.href = "/congratulations.html";
        return;
    }

    err.innerHTML = "Pin is wrong";
    return;
});