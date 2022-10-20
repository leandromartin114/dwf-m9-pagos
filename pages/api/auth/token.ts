import methods from "micro-method-router";
import type { NextApiRequest, NextApiResponse } from "next";
import { sendToken } from "lib/controllers/auth";

module.exports = methods({
	async post(req: NextApiRequest, res: NextApiResponse) {
		const token = await sendToken(req.body.email, req.body.code);
		if (!token) {
			res.status(401).send({ message: "Wrong email or code" });
		}
		if (token === true) {
			res.status(401).send({ message: "Expired code" });
		}
		res.status(200).send({ token });
	},
});
