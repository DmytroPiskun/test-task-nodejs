import { Strategy } from "passport-jwt";
import { env } from "../../utils/env/env";
import userModel from "../models/user.model";
import { Request } from "express";
const tokenExtractor = function (req: Request) {
  try {
    if (typeof req.headers["authorization"] === "string") {
      const authHeader = req.headers["authorization"];
      const token = authHeader.split(" ")[1];
      return token;
    } else {
      const token = null;
      return token;
    }
  } catch {
    const token = null;
    return token;
  }
};
const opts = {
  secretOrKey: env.tokenSecret,
  jwtFromRequest: tokenExtractor,
};

export const myPassort = (passport: { use: (arg0: Strategy) => void }) => {
  passport.use(
    new Strategy(opts, async (payload, done) => {
      try {
        const user = await userModel.findOne({ email: payload.email });
        return done(null, user || false);
      } catch (e) {
        return false;
      }
    })
  );
};
