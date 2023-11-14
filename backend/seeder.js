import mongoose from "mongoose";
import dotenv from "dotenv";
import colors from 'colors';
import users from "./data/users.js";
import products from "./data/products.js";
import User from "./models/userModel.js";
import Product from "./models/productModel.js";
import Order from "./models/orderModel.js";
import connectDB from "./config/db.js";

dotenv.config();
console.log("connecting".yellow.inverse);
await connectDB();
console.log("connection complete".green.inverse);

const importData = async () => {
    console.log("importing data...".yellow.inverse);
    try {
        await Order.deleteMany();
        await Product.deleteMany();
        await User.deleteMany();

        const createdUsers = await User.insertMany(users);
        const adminUser = createdUsers[0]._id;

        const sampleProducts = products.map((product) => {
            return {...product, user: adminUser};
        });

        await Product.insertMany(sampleProducts);

        console.log('Data Imported'.green.inverse);
        process.exit();
    } catch(error){
        console.error(`${error}`.red.inverse);
        process.exit(1);
    }
};

const destroyData = async () => {
    try {
        console.log("deleting data...".yellow.inverse);

        await Order.deleteMany();
        await Product.deleteMany();
        await User.deleteMany();

        console.log('Data Destroyed!'.yellow.inverse);
        process.exit();
    } catch (error){
        console.error(`${error}`.red.inverse);
        process.exit(1);
    }
};