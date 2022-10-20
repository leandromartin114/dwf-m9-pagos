import methods from "micro-method-router";
import type { NextApiRequest, NextApiResponse } from "next";
import { sendCode } from "lib/controllers/auth";

module.exports = methods({
	async post(req: NextApiRequest, res: NextApiResponse) {
		const code = await sendCode(req.body.email);
		return res.status(200).send(code);
	},
});
