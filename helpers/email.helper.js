import nodemailer from "nodemailer";

const send = async infoObj => {
	try {
		// create reusable transporter object using the default SMTP transport
		const transporter = nodemailer.createTransport({
			host: process.env.EMAIL_SMTP,
			port: 587,
			auth: {
				user: process.env.EMAIL_USER,
				pass: process.env.EMAIL_PASS,
			},
		});

		// send mail with defined transport object
		let info = await transporter.sendMail(infoObj);

		console.log("Message sent: %s", info.messageId);
		// Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

		// Preview only available when sending through an Ethereal account
		console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
		// Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
	} catch (error) {
		console.log(error);
	}
};

const emailProcessor = ({ email, subject, text, html }) => {
	let info = {
		from: `"EShop " <${process.env.EMAIL_USER}>`,
		to: email,
		subject,
		text,
		html,
	};

	send(info);
};

export const sendEmailVerificationLink = emailObj => {
	const { fname, pin, email } = emailObj;

	const link = `http://localhost:3000/email-varification?pin=${pin}&email=${email}`;
	const obj = {
		...emailObj,
		subject: "Email confirmation required",
		text: `Hi ${fname}, please follow the link below to confirm your email. ${link}`,
		html: `
    Hello there,   <br/> 
    Please follow the link below to confirm your email. <br/><br/>
    ${link} 
    <br/><br/>
    Thank you<br/><br/>  
    Kind Regards,
    --some company information --- 
    `,
	};
	emailProcessor(obj);
};

// send the email confirm welcome message
export const sendEmailVerificationConfirmation = emailObj => {
	const { fname } = emailObj;

	const obj = {
		...emailObj,
		subject: "Email verification successful",
		text: `Hi ${fname}, You email has been verified, You may login now!`,
		html: `
    Hello ${fname},
    <br/> 
    You email has been verified now.You may login <br/><br/> 
    <br/><br/>
    Thank you<br/><br/>  
    Kind Regards,<br/> 
    --some company information --- 
    `,
	};
	emailProcessor(obj);
};
