import nodemailer from "nodemailer"
import config from "./../config/config"
import CustomError from "./custom-error"

const {SMTPHost, SMTPPort, SMTPUser, SMTPPass} = config

interface Options {
	from?: string,
	email: string,
	subject?: string,
	message: string,
}

const sendEmail = async (options: Options) => {
	const transporter = nodemailer.createTransport({
		service: "gmail",
		host: SMTPHost,
		port: SMTPPort,
		secure: false,
		auth: {
			user: SMTPUser,
			pass: SMTPPass,
		},
	})

	const mailOptions = {
		from: SMTPUser,
		to: options.email,
		subject: options.subject,
		text: options.message,
	}


	try {
		const info = await transporter.sendMail(mailOptions)
		console.log('Email sent: %s', info.response)
    return info;
	} catch (error: any) {
		console.error('Email error: ', error)
			return new CustomError(500, `Email could not be sent${error?.message ? ": " + error.message : "" }`)
	}
}

export default sendEmail