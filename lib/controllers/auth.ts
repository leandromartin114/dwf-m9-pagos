import { Auth } from "lib/models/auth";
import { User } from "lib/models/user";
import gen from "random-seed";
import addMinutes from "date-fns/addMinutes";
import { generateToken } from "lib/jwt";
import { emailCleaner } from "lib/email-cleaner";
import { sgMail } from "lib/sendgrid";

const seed = process.env.RANDOM_SEED;
const random = gen.create(seed);

export async function findOrCreateAuth(email: string) {
	const cleanEmail = emailCleaner(email);
	const auth = await Auth.findByEmail(cleanEmail);
	if (auth) {
		console.log("Auth encontrado");
		return auth;
	} else {
		const newUser = await User.createNewUser({ email: cleanEmail });
		const newAuth = await Auth.createNewAuth({
			email: cleanEmail,
			userId: newUser.id,
			code: "",
			expires: new Date(),
		});
		console.log("new Auth creado");
		return newAuth;
	}
}

export async function sendCode(email: string) {
	const cleanEmail = emailCleaner(email);
	const auth = await findOrCreateAuth(cleanEmail);
	const code = random.intBetween(10000, 99999);
	const now = new Date();
	const tenMinutesExpDate = addMinutes(now, 10);
	auth.data.code = code;
	auth.data.expires = tenMinutesExpDate;
	await auth.push();
	const msg = {
		to: cleanEmail,
		from: "leandrom.roldan@gmail.com",
		subject: "Código de validación",
		html: `<h1>${code}</h1>
		<p>Con este código podés loguearte. Recordá que el mismo es válido durante 10 minutos</p>
		`,
	};
	await sgMail.send(msg);
	console.log("Email enviado a " + cleanEmail);
	return true;
}

export async function sendToken(email: string, code: number) {
	const cleanEmail = emailCleaner(email);
	const auth = await Auth.findByEmailAndCode(cleanEmail, code);
	if (!auth) {
		return null;
	}
	const expired = auth.isCodeExpired();
	if (expired) {
		console.error("Expired code");
		return expired;
	}
	const token = generateToken({ userId: auth.data.userId });
	return token;
}
