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
Object.defineProperty(exports, "__esModule", { value: true });
exports.connect = exports.db = void 0;
const MONGODB_CONNECTION_URI = process.env.MONGODB_CONNECTION_URI;
const mongodb_1 = require("mongodb");
const client = new mongodb_1.MongoClient(MONGODB_CONNECTION_URI);
const connect = () => __awaiter(void 0, void 0, void 0, function* () {
    const conn = yield client.connect();
    console.log('successfully connected to database');
    exports.db = conn.db('testdb');
    return client;
});
exports.connect = connect;
