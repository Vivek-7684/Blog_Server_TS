
import jwt from "jsonwebtoken";

import type { Request, Response, NextFunction } from "express";

export const checkAuthandAdmin = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req?.cookies?.token;

    if (!token) {
      return res.status(401).json({ message: "Token not Found!" });
    }

    jwt.verify(token, "spiderman@123", (err:any, decoded:any) => {
      if (err) {
        res.status(401).json({ message: err.message });
      } else {
        console.log(decoded);
        next();
      }
    });
  } catch (err:any) {
    return res.status(500).json({ message: err.message });
  }
};

