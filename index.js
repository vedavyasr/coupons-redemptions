const express = require("express");
const { PrismaClient } = require("@prisma/client");
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");
const app = express();

const prisma = new PrismaClient();

app.use(express.json());

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "coupons api's",
      version: "1.0.0",
      description: "coupon redemption",
    },
    servers: [{ url: "http://localhost:3000" }],
  },
  apis: ["./index.js"],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));



/**
 * @swagger
 * /coupons:
 *  get:
 *      summary: fetches all coupons allocated and redemptions to a user
 *      responses: 
 *          200:
 *              description: lists all coupons and redemptions of a user
 */
app.get("/coupons", async (req, res) => {
  try {
    const coupons = await prisma.coupon.findMany({
      include: {
        users: { include: { user: true } },
        redemptions: { include: { user: true } },
      },
    });
    res.status(200).json(coupons);
  } catch (err) {
    res.status(500).json(err);
  }
});


/**
 * @swagger
 * /redeem-coupon:
 *  post:
 *      summary: redeem a coupon 
 *      requestBody:
 *          required: true
 *          content: 
 *              application/json: 
 *                  schema: 
 *                      type: object
 *                      properties:
 *                          userId:
 *                              type: integer
 *                          couponCode:
 *                              type: string  
 *      response:
 *          200:
 *              description: returns succesfull redeemed
 *          400:
 *              description: throws based on coupon error
 */
app.post("/redeem-coupon", async (req, res) => {
  try {
    console.log(req.body,"body")
    const { userId, couponCode } = req.body;
    const coupon = await prisma.coupon.findUnique({
      where: { code: couponCode },
      include: {
        redemptions: true,
        users: {
          where: { userId },
        },
      },
    });
console.log(coupon,"coo")
    if (!coupon) {
      return res
        .status(404)
        .json({ error: { message: "invalid coupon code",code: "INVALID_COUPON" } });
    }

    if (coupon.users.length === 0) {
      return res.status(403).json({ error: { message: "invalid user", code:"IVNALID_USER" } });
    }
    let currentTime = new Date();
    if (currentTime < coupon.startDate || currentTime >= coupon.endDate) {
      return res
        .status(400)
        .json({ error: { message: "coupon is not active", code: "INACTIVE" } });
    }
console.log("yeyeyey12")
    const couponLimit = await prisma.couponRedemption.count({
      where: { couponId: coupon.id },
    });
console.log("yeyeyey123")

    if (couponLimit >= coupon.usageLimit) {
      return res
        .status(400)
        .json({ error: { message: "coupon limit reached" , code: "LIMIT_REACHED"} });
    }
console.log("yeyeyey1234")

    const alreadyRedeemed = await prisma.couponRedemption.findFirst({
      where: { couponId: coupon.id, userId },
    });
console.log("yeyeyey12345")

    if (alreadyRedeemed) {
      return res
        .status(400)
        .json({ error: { message: "already redeemed coupon for this user", code: "REDEEMED" } });
    }

    await prisma.couponRedemption.create({
      data: { couponId: coupon.id, userId },
    });
console.log("yeyeyey")
    res.status(200).json({ message: "coupon reedemed successfully" });
  } catch (err) {
    res.status(500).json(err);
  }
});

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Active on ${PORT}`));
