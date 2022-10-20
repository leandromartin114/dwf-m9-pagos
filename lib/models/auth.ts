import { firestore } from "lib/firebase";
import { emailCleaner } from "lib/email-cleaner";
import isAfter from "date-fns/isAfter";

const collection = firestore.collection("auth");
export class Auth {
	ref: FirebaseFirestore.DocumentReference;
	data: any;
	id: string;
	constructor(id: string) {
		this.id = id;
		this.ref = collection.doc(id);
	}
	async pull() {
		const snap = await this.ref.get();
		this.data = snap.data();
	}
	async push() {
		this.ref.update(this.data);
	}
	isCodeExpired() {
		const now = new Date();
		const expires = this.data.expires.toDate();
		return isAfter(now, expires);
	}
	static async findByEmail(email: string) {
		const cleanEmail = emailCleaner(email);
		const snap = await collection.where("email", "==", cleanEmail).get();
		if (snap.docs.length) {
			const firstResult = snap.docs[0];
			const newAuth = new Auth(firstResult.id);
			newAuth.data = firstResult.data();
			return newAuth;
		} else {
			return null;
		}
	}
	static async createNewAuth(data) {
		const newAuthSnap = await collection.add(data);
		const newAuth = new Auth(newAuthSnap.id);
		newAuth.data = data;
		return newAuth;
	}
	static async findByEmailAndCode(email: string, code: number) {
		const cleanEmail = emailCleaner(email);
		const snap = await collection
			.where("email", "==", cleanEmail)
			.where("code", "==", code)
			.get();
		if (snap.empty) {
			console.error("Wrong email or code");
			return null;
		} else {
			const firstResult = snap.docs[0];
			const newAuth = new Auth(firstResult.id);
			newAuth.data = firstResult.data();
			return newAuth;
		}
	}
}
