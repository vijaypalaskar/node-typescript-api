import { NextFunction } from 'express';
export declare const getOrders: (req: Request, res: Response, next: NextFunction) => void;
export declare const getProducts: (req: Request, res: Response, next: NextFunction) => Promise<any>;
export declare const getUsers_migration: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const getUsers: (req: any, res: any, next: any) => Promise<any>;
export declare const getUserAddresses: (req: Request, res: Response, next: NextFunction) => Promise<any>;
