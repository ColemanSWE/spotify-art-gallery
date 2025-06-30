// express.d.ts
import { Request } from 'express';

declare module 'express' {
  interface Request {
    user?: {
      id: number;
    };
    file?: Express.Multer.File;
    files?: Express.Multer.File[] | { [fieldname: string]: Express.Multer.File[] };
  }
}
