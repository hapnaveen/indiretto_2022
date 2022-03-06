const inputFile = document.getElementById("upload-csv");
const btn = document.getElementById("btn-upload-csv");
const addKahootScore = firebase.functions().httpsCallable("addKahootScore");
const container = document.getElementById("img-eval-container");
const configRef = firebase.firestore().collection("config").doc("config");

btn.addEventListener("click", () => {
	Papa.parse(inputFile.files[0], {
		header: false,
		complete: (results) => {
			results.data.pop();
			results.data.shift();
			results.data.forEach((item) => {
				item.shift();
				item[0] = item[0].replace(/\s+/g, "").toLowerCase() + "@indiretto.rota";
			});
			console.log(results.data);
			addKahootScore({ scores: results.data });
		},
	});
});

const getData = async () => {
	const info = [];

	const docs = await firebase
		.firestore()
		.collection("teams")
		.where("currentLevel", "==", "waiting")
		.where("scores.level5.approved", "==", null)
		.get();

	docs.forEach((doc) => {
		info.push({
			id: doc.id,
			name: doc.data().teamname,
			uploads: doc.data().uploads,
			img: [],
		});
	});

	info.forEach((item) => {
		item.uploads.forEach(async (url) => {
			const httpsReference = await firebase.storage().refFromURL(url);
			item.img.push({ name: httpsReference.name, url });
		});
	});
	return info;
};

const updateView = (teamid, teamname, imgs) => {
	let inject_html = `<div " style="margin-top:50px;width:100% ; padding : 10px "><p style="font-weight:bold; font-size:1.5rem;">${teamname}</p>
    <div style="display:grid; grid-template-columns: 90% 10% ; margin:0px; "><div>`;
	imgs.forEach((item) => {
		inject_html += `<div style="display:inline-block; width: 20%; margin:0 10px">
          <p>${item.name}</p>
          <img src="${item.url}" width="100%"  />
          </div>
        `;
	});

	inject_html += `</div><div style="display:flex; flex-direction:column; justify-content: center;padding:0.1rem ">
    <button class="form-btn" style="width:100% ; margin:10px 0" id="${teamid}">Approve</button>
    <button class="form-btn" id="${teamid}-disapprove"  style="background-color:transparent; color:black;width:100% ; margin:10px 0;padding:0.1rem">Disapprove</button>
    </div>
    </div>
    </div><hr>`;
	return inject_html;
};

let html = "";

const approve = (id) => {
	console.log(id);
};

(async () => {
	const input = await getData();
	console.log(input);
	input.forEach((item) => {
		html += updateView(item.id, item.name, item.img);
	});
	container.innerHTML = html;

	input.forEach((item) => {
		document.getElementById(item.id).addEventListener("click", async () => {
			const config = await configRef.get();
			if (config.data().winner) {
				let confirmation = confirm("are you approving this team?");
				if (confirmation) {
					await firebase
						.firestore()
						.collection("teams")
						.doc(item.id)
						.update({
							"scores.level5.approved": true,
							currentLevel: firebase.firestore.Timestamp.fromDate(
								new Date(Date.now())
							),
						});
					location.reload();
				} else {
					console.log(false);
				}
			} else {
				let confirmation = confirm("you are deciding the winner?");
				if (confirmation) {
					await firebase.firestore().collection("teams").doc(item.id).update({
						"scores.level5.approved": true,
						currentLevel: "winner",
					});
					const res = await configRef.update({
						winner: item.id,
					});
					location.reload();
				} else {
					console.log(false);
				}
			}
		});

		document
			.getElementById(`${item.id}-disapprove`)
			.addEventListener("click", async () => {
				let confirmation = confirm("are you disapproving this team?");
				if (confirmation) {
					await firebase.firestore().collection("teams").doc(item.id).update({
						"scores.level5.approved": false,
					});
					location.reload();
				} else {
					console.log(false);
				}
			});
	});

	firebase
		.firestore()
		.collection("teams")
		.where("currentLevel", "==", "waiting")
		.onSnapshot((snapshot) => {
			snapshot.docChanges().forEach((change) => {
				if (change.type === "modified") {
					console.log("modified");
					location.reload();
				}
			});
		});
	// firebase
	// 	.firestore()
	// 	.collection("teams")
	// 	.where("currentLevel", "==", "5")
	// 	.onSnapshot((snapshot) => {
	// 		snapshot.docChanges().forEach((change) => {
	// 			if (change.type === "modified") {
	// 				location.reload();
	// 			}
	// 		});
	// 	});
})();
