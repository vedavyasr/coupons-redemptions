# Coupons and Redemptions

This project provides an API for coupons and their redemptions using Node.js and PostgreSQL

## Setup Instructions

### 1. Clone the Repository
Clone the project repository and navigate to the project directory
```bash
git clone git@github.com:vedavyasr/coupons-redemptions.git
cd coupons-redemptions 
```


### 2. Install Dependencies and Set Up Database
Install the required Node.js packages and migrate the models to PostgreSQL and seeding sample data

```bash
npm install
```

### 3. Access API Documentation
View the Swagger API documentation at
```bash
http://localhost:7000/api-docs/
```

### 4. Get All Coupons
Retrieve a list of all coupons by accessing
```bash
http://localhost:7000/coupons
```

### 5. Redeem a Coupon
Redeem a coupon by sending a request with userId and couponCode in the request body
```bash
http://localhost:7000/redeem-coupon
```

