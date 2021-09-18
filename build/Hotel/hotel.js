"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserAddresses = exports.getUsers = exports.getUsers_migration = exports.getProducts = exports.getOrders = void 0;
const faker_1 = __importDefault(require("faker"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
// @ts-ignore
const db_1 = require("../db");
const getOrders = (req, res, next) => {
    const orders = new Array(10).fill(null).map((value, index) => {
        const userDetails = {
            firstName: faker_1.default.name.firstName(),
            lastName: faker_1.default.name.lastName(),
        };
        const email = faker_1.default.internet.email(userDetails.firstName, userDetails.lastName);
        return Object.assign(Object.assign({ id: index + 1, orderId: faker_1.default.datatype.uuid() }, userDetails), { email: email.toLowerCase(), address: {
                streetAddress: faker_1.default.address.streetAddress(),
                city: faker_1.default.address.city(),
                state: faker_1.default.address.state(true),
                country: faker_1.default.address.country(),
                zipCode: faker_1.default.address.zipCode(),
            }, image: faker_1.default.image.imageUrl(), phoneNumber: faker_1.default.phone.phoneNumber(), amount: faker_1.default.commerce.price(100, 1000), orderDetails: [
                {
                    productName: faker_1.default.commerce.productName(),
                    quantity: faker_1.default.datatype.number(5)
                },
                {
                    productName: faker_1.default.commerce.productName(),
                    quantity: faker_1.default.datatype.number(5)
                },
                {
                    productName: faker_1.default.commerce.productName(),
                    quantity: faker_1.default.datatype.number(5)
                }
            ] });
    });
    const fileName = `${path_1.default.join(__dirname, './orders.json')}`;
    fs_1.default.readFile(fileName, 'utf8', (err, data) => {
        if (err) {
            console.log(err);
        }
        if (data) {
            data = JSON.parse(data);
            // @ts-ignore
            data = [...orders, ...data];
        }
        else {
            // @ts-ignore
            data = orders;
        }
        fs_1.default.writeFile(fileName, JSON.stringify(data), 'utf8', (aerr) => {
            if (aerr) {
                console.log(aerr);
            }
            // @ts-ignore
            return res.json({ data: orders });
        });
    });
};
exports.getOrders = getOrders;
const getProducts = (req, res, next) => {
    const products = new Array(50).fill(null).map((value, index) => {
        return {
            id: index + 1,
            productId: faker_1.default.datatype.uuid(),
            productName: faker_1.default.commerce.productName(),
            productDescription: faker_1.default.commerce.productDescription(),
            productAdjective: faker_1.default.commerce.productAdjective(),
            productMaterial: faker_1.default.commerce.productMaterial(),
            product: faker_1.default.commerce.product(),
            price: faker_1.default.commerce.price(10, 300)
        };
    });
    // @ts-ignore
    return res.json({ data: products });
};
exports.getProducts = getProducts;
const getUsers_migration = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const users = new Array(1).fill(null);
    Promise.all(users.map((value, index) => __awaiter(void 0, void 0, void 0, function* () {
        const userDetails = {
            firstName: faker_1.default.name.firstName(),
            lastName: faker_1.default.name.lastName(),
        };
        const email = faker_1.default.internet.email(userDetails.firstName, userDetails.lastName);
        const userName = faker_1.default.internet.userName(userDetails.firstName, userDetails.lastName);
        const user = Object.assign(Object.assign({}, userDetails), { userName: userName.toLowerCase(), email: email.toLowerCase(), avatar: faker_1.default.image.imageUrl(), phoneNumber: faker_1.default.phone.phoneNumber(), userStatus: 1, createdOn: new Date(), updatedOn: null });
        let result;
        try {
            result = yield db_1.db.collection('users').insertOne(user);
        }
        catch (err) {
            console.log(err);
        }
        // @ts-ignore
        const address = {
            userId: result.insertedId,
            streetAddress: faker_1.default.address.streetAddress(),
            city: faker_1.default.address.city(),
            state: faker_1.default.address.state(true),
            country: faker_1.default.address.country(),
            zipCode: faker_1.default.address.zipCode(),
            isDeleted: 0
        };
        const addressResult = yield db_1.db.collection('addressses').insertOne(address);
    }))).then(result => {
        // @ts-ignore
        return res.json({ data: users });
    }).catch(err => {
        // @ts-ignore
        return res.json({ data: err });
    });
});
exports.getUsers_migration = getUsers_migration;
// @ts-ignore
const getUsers = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield db_1.db.collection('users')
        .aggregate([
        { $match: { userStatus: 1 } },
        { $limit: 20 },
        { $lookup: {
                "from": "addresses",
                "localField": "userId",
                "foreignField": "_id",
                "as": "addressList"
            } },
        { $unwind: "$addressList" }
    ])
        .toArray();
    return res.json({ data: users });
});
exports.getUsers = getUsers;
const getUserAddresses = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // @ts-ignore
    const { userId } = req.params;
    const users = yield db_1.db.collection('addresses')
        .find({ isDeleted: 0, userId })
        .project({ isDeleted: 0, userId: 0 })
        .toArray();
    // @ts-ignore
    return res.json({ data: users });
});
exports.getUserAddresses = getUserAddresses;
