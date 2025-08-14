const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  // add sample users

  await prisma.user.createMany({
    data: [
      { email: "veda@gmail.com", name: "veda" },
      { email: "vedavyas@gmail.com", name: "vedavyas" },
    ],
    skipDuplicates: true,
  });

  //coupons
  await prisma.coupon.createMany({
    data: [
      {
        code: "DISCOUNT_50",
        discountType: "%",
        discountValue: 50,
        usageLimit: 1,
        startDate: new Date(),
        endDate: new Date(new Date().setDate(new Date().getDate() + 7)),
      },
      {
        code: "FLAT_100",
        discountType: "amount",
        discountValue: 100,
        usageLimit: 2,
        startDate: new Date(),
        endDate: new Date(new Date().setDate(new Date().getDate() + 7)),
      },
    ],
    skipDuplicates: true,
  });

  const users = await prisma.user.findMany();
  const coupons = await prisma.coupon.findMany();

  // usercoupons

  await prisma.userCoupon.createMany({
    data: [
      { userId: users[0].id, couponId: coupons[0].id },
      { userId: users[1].id, couponId: coupons[1].id },
    ],
    skipDuplicates: true,
  });
}

main();
