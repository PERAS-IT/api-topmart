const stripe = require("stripe")(
  "sk_test_51OpiV0C4T8NNH8UQMT1jloPQwi4dUYUnuybHMEKMTrjlslSykcpXipo2hl65XEHur0YK3pBgP9dzIaLnh82eV4eB0048F6kVL6"
);

// domain frontend
const YOUR_DOMAIN = "http://localhost:5173";

module.exports.payment = async (line_items) => {
  const session = await stripe.checkout.sessions.create({
    line_items,
    mode: "payment",
    success_url: `${YOUR_DOMAIN}?success=true`,
    cancel_url: `${YOUR_DOMAIN}?canceled=true`,
  });
  return session.url;
};

module.exports.paymentWithDiscount = async (line_items, amount_off) => {
  console.log(typeof amount_off);
  coupon = await stripe.coupons.create({
    currency: "thb",
    amount_off,
    duration: "once",
  });
  // console.log(coupon.id);
  const session = await stripe.checkout.sessions.create({
    line_items,
    discounts: [
      {
        coupon: coupon.id,
      },
    ],
    mode: "payment",
    success_url: `${YOUR_DOMAIN}?success=true`,
    cancel_url: `${YOUR_DOMAIN}?canceled=true`,
  });
  return session.url;
};
