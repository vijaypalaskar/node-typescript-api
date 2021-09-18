import { NextFunction } from 'express';
import faker from 'faker';
import fs from 'fs';
import path  from 'path';
// @ts-ignore
import { db } from '../db';

export const getOrders = (req: Request, res: Response, next: NextFunction) => {
    const orders = new Array(10).fill(null).map((value, index) => {
        const userDetails = {
            firstName: faker.name.firstName(),
            lastName: faker.name.lastName(),
        };
        const email = faker.internet.email(userDetails.firstName, userDetails.lastName);

        return {
            id: index + 1,
            orderId: faker.datatype.uuid(),
            ...userDetails,
            email: email.toLowerCase(),
            address: {
                streetAddress: faker.address.streetAddress(),
                city: faker.address.city(),
                state: faker.address.state(true),
                country: faker.address.country(),
                zipCode: faker.address.zipCode(),
            },
            image: faker.image.imageUrl(),
            phoneNumber: faker.phone.phoneNumber(),
            amount: faker.commerce.price(100, 1000),
            orderDetails: [
                {
                    productName: faker.commerce.productName(),
                    quantity: faker.datatype.number(5)
                },
                {
                    productName: faker.commerce.productName(),
                    quantity: faker.datatype.number(5)
                },
                {
                    productName: faker.commerce.productName(),
                    quantity: faker.datatype.number(5)
                }
            ]
        }
    });
    const fileName = `${path.join(__dirname, './orders.json')}`;
    fs.readFile(fileName, 'utf8', (err, data) => {
        if (err) {
            console.log(err);
        }
        if (data) {
            data = JSON.parse(data);
            // @ts-ignore
            data = [...orders, ...data];
        } else {
            // @ts-ignore
            data = orders;
        }
        fs.writeFile(fileName, JSON.stringify(data), 'utf8', (aerr) => {
            if (aerr) {
                console.log(aerr);
            }
            // @ts-ignore
            return res.json({ data: orders });
        });
    });
};

export const getProducts = (req: Request, res: Response, next: NextFunction) => {
    const products = new Array(50).fill(null).map((value, index) => {
        return {
            id: index + 1,
            productId: faker.datatype.uuid(),
            productName: faker.commerce.productName(),
            productDescription: faker.commerce.productDescription(),
            productAdjective: faker.commerce.productAdjective(),
            productMaterial: faker.commerce.productMaterial(),
            product: faker.commerce.product(),
            price: faker.commerce.price(10, 300)
        }
    });
    // @ts-ignore
    return res.json({ data: products });
};

export const getUsers_migration = async (req: Request, res: Response, next: NextFunction) => {
    const users = new Array(1).fill(null);
    Promise.all(users.map(async (value, index) => {
        const userDetails = {
            firstName: faker.name.firstName(),
            lastName: faker.name.lastName(),
        };
        const email = faker.internet.email(userDetails.firstName, userDetails.lastName);
        const userName = faker.internet.userName(userDetails.firstName, userDetails.lastName);

        const user = {
            ...userDetails,
            userName: userName.toLowerCase(),
            email: email.toLowerCase(),
            avatar: faker.image.imageUrl(),
            phoneNumber: faker.phone.phoneNumber(),
            userStatus: 1,
            createdOn: new Date(),
            updatedOn: null
        }
        let result
        try {
            result = await db.collection('users').insertOne(user);
        }catch(err) {
            console.log(err);
        }
        // @ts-ignore
        const address = {
            userId: result.insertedId,
            streetAddress: faker.address.streetAddress(),
            city: faker.address.city(),
            state: faker.address.state(true),
            country: faker.address.country(),
            zipCode: faker.address.zipCode(),
            isDeleted: 0
        }
        const addressResult = await db.collection('addressses').insertOne(address);
    })).then(result => {
        // @ts-ignore
        return res.json({ data: users });
    }).catch(err => {
        // @ts-ignore
        return res.json({ data: err });
    });
};
// @ts-ignore
export const getUsers = async (req, res, next) => {
    const users = await db.collection('users')
    .aggregate([
        {$match: {userStatus: 1}},
        {$limit: 20},
        {$lookup: {
            "from": "addresses",
            "localField": "userId",
            "foreignField": "_id",
            "as": "addressList"
        }},
        {$unwind: "$addressList"}
    ])
    .toArray();
    return res.json({ data: users });
};

export const getUserAddresses = async (req: Request, res: Response, next: NextFunction) => {
    // @ts-ignore
    const {userId} = req.params;
    const users = await db.collection('addresses')
    .find({isDeleted: 0, userId})
    .project({isDeleted: 0, userId: 0})
    .toArray();
    // @ts-ignore
    return res.json({ data: users });
};


