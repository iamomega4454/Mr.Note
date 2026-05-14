const OWNER_PIN = process.env.OWNER_PIN || "004454";

export default function ownerPin(req, res, next) {
  const pin = req.headers["x-owner-pin"] || req.body.pin;

  if (pin !== OWNER_PIN) {
    return res.status(403).json({ message: "Invalid security pin" });
  }

  next();
}

