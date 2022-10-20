import { User } from "lib/models/user";
import { Order } from "lib/models/order";
import { createPreference, getMerchantOrder } from "lib/mercadopago";
import { sgMail } from "lib/sendgrid";

export async function generateOrderAndPreference(
	userId: string,
	productId: string,
	data
) {
	const user = new User(userId);
	await user.pull();
	const orderData = {
		userId: userId,
		email: user.data.email,
		items: [
			{
				productId: productId,
				title: data.title,
				quantity: data.quantity,
				currency_id: "ARS",
				unit_price: data.unit_price,
			},
		],
		status: "pending",
		merchant_order: "",
	};
	const newOrder = await Order.createNewOrder(orderData);
	const newPreference = await createPreference(productId, newOrder.id, data);
	return newPreference;
}

export async function getAndUpdateOrder(data) {
	const { id, topic } = data;
	if (topic == "merchant_order") {
		const merchantOrder = await getMerchantOrder(id);
		const order = new Order(merchantOrder.external_reference);
		await order.pull();
		order.data.status = "closed";
		order.data.merchant_order = merchantOrder.id;
		await order.push();
		const msg = {
			to: order.data.email,
			from: "leandrom.roldan@gmail.com",
			subject: "Confirmación de pago",
			html: `<h1>Tu pago fue exitoso</h1>
			<p>En los próximos días recibirás tu producto</p>
			`,
		};
		await sgMail.send(msg);
		return order;
	}
}
