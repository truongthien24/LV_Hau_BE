const JwtStrategy = require("passport-jwt").Strategy;
const { ExtractJwt } = require("passport-jwt");
const TaiKhoan = require("../models/TaiKhoan");

const jwtOptions = {
  secretOrKey:
    "9359AF90D36CEC62F9522CE3394E8E2E335DF77983E8F9D9AC77C10D09D3074C",
  jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme("Bearer"),
};

const jwt = async (payload, done) => {
  try {
    const user = await TaiKhoan.findById(payload.sub);
    if (user) return done(null, user);
    return done(null, false);
  } catch (error) {
    return done(error, false);
  }
};

exports.jwt = new JwtStrategy(jwtOptions, jwt);
