const prisma = require("../../config/prisma");
const { sendEmail } = require("../../utils/send-mail");

const sendAllMail = async () => {
  try {
    const result = await prisma.$transaction(async (prisma) => {
      const user = prisma.userSubscribe.findMany({
        where: { isSubscribe: true },
      });
      if (user.length == 0) return;
      let userId = [];
      user.map((el) => userId.push(el.id));
      const email = prisma.user.findMany({ where: { id: userId } });
      //   let mail = [];
      const mail = email.map((user) => {
        sendEmail;
        mail.push(user.email, "New Product", "New Product is available now");
      });
      await Promise.all();
    });
  } catch (err) {
    console.log(err);
    throw err;
  }
};
