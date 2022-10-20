import admin from "firebase-admin";

const serviceAccount = JSON.parse(process.env.FIREBASE_CONNECTION);

// if (admin.app.length == 0) {
// 	admin.initializeApp({
// 		credential: admin.credential.cert(serviceAccount),
// 	});
// }
admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
});

export const firestore = admin.firestore();
