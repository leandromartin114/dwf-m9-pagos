import mercadopago from "mercadopago";

mercadopago.configure({
	access_token: process.env.MP_TOKEN,
});

export async function getMerchantOrder(id) {
	const res = await mercadopago.merchant_orders.get(id);
	return res.body;
}

export async function createPreference(productId, ref, data) {
	const preference = {
		items: [
			{
				productId: productId,
				title: data.title,
				quantity: data.quantity,
				currency_id: "ARS",
				unit_price: data.unit_price,
			},
		],
		external_reference: ref,
		notification_url:
			"https://dwf-m9-pagos-pi.vercel.app/api/webhooks/mercadopago",
	};
	const newPreference = await mercadopago.preferences.create(preference);
	return newPreference;
}
