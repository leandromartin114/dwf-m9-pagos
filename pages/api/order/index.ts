import type { NextApiRequest, NextApiResponse } from "next";
import method from "micro-method-router";
import { authMiddleware } from "lib/middlewares";
import { generateOrderAndPreference } from "lib/controllers/order";

async function postHandler(req: NextApiRequest, res: NextApiResponse, token) {
	const productId: any = req.query.productId;
	const response = await generateOrderAndPreference(
		token.userId,
		productId,
		req.body
	);
	res.send(response.body.init_point);
}

const handler = method({
	post: postHandler,
});

export default authMiddleware(handler);
