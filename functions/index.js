const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

exports.addAdminRole = functions.https.onCall((data, context) => {
	// check request is made by an admin
	// if (context.auth.token.admin !== true) {
	// 	return { error: "Only admins can add other admins" };
	// }
	// get user and add admin custom claim
	return admin
		.auth()
		.getUserByEmail(data.email)
		.then((user) => {
			return admin.auth().setCustomUserClaims(user.uid, {
				admin: true,
			});
		})
		.then(() => {
			return {
				message: `Success! ${data.email} has been made an admin.`,
			};
		})
		.catch((err) => {
			return err;
		});
});

exports.addKahootScore = functions.https.onCall((data, context) => {
	console.log("function runing");
	data.scores.forEach((item) => {
		admin
			.auth()
			.getUserByEmail(item[0])
			.then((userRecord) => {
				// See the UserRecord reference doc for the contents of userRecord.
				console.log(userRecord.uid);
				admin.firestore().collection("teams").doc(userRecord.uid).update({
					"scores.level1": item[1],
				});

				return userRecord.uid;
			})
			.catch((error) => {
				console.log("Error fetching user data:", error);
				return error;
			});
	});
	return "done";
});
