import methods from "micro-method-router";
import type { NextApiRequest, NextApiResponse } from "next";
import { getAndUpdateOrder } from "lib/controllers/order";

module.exports = methods({
	async post(req: NextApiRequest, res: NextApiResponse) {
		const order = getAndUpdateOrder(req.query);
		res.status(200).send(order);
	},
});
