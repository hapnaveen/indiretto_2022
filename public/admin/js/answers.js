const l1Ans = document.getElementById('l1').value;
const l2Ans = document.getElementById('l2').value;
const l4Ans = document.getElementById('l4').value;
const configRef = firebase.firestore().collection("config").doc("config");

document.getElementById('submit-ans').addEventListener('click', async() => {
    var bcrypt = dcodeIO.bcrypt;
    await configRef.update({
        clues: {
            level1: bcrypt.hashSync(l1Ans, 7),
            level2: bcrypt.hashSync(l2Ans, 10),
            level4: bcrypt.hashSync(l4Ans, 9)
        }
    });
    document.getElementById('result').innerHTML = '<i>Data saved</i>';
    setTimeout(() => {
        document.getElementById('result').innerHTML = '';
    }, 2000);
})