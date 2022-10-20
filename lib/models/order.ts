import { firestore } from "lib/firebase";

const collection = firestore.collection("orders");
export class Order {
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
	static async createNewOrder(data) {
		const newOrderSnap = await collection.add(data);
		const newOrder = new Order(newOrderSnap.id);
		newOrder.data = data;
		return newOrder;
	}
}
