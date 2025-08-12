import crypto from "crypto";
import { InvalidHeaderError, InvalidSignatureError } from "../errors.js";

const loadKeys = () => {
    const raw = process.env.ADMIN_API_KEYS || "";
    const map = new Map();
    raw.split(",")
        .map((s) => s.trim())
        .filter(Boolean)
        .forEach((pair) => {
            const [id, secret] = pair.split(":");
            if (id && secret) map.set(id, secret);
        });
    return map;
};

const timingSafeEqualHex = (a, b) => {
    const abuf = Buffer.from(a || "", "hex");
    const bbuf = Buffer.from(b || "", "hex");
    if (abuf.length !== bbuf.length) return false;
    return crypto.timingSafeEqual(abuf, bbuf);
};

export const requireSignedApiKey = (req, res, next) => {
    try {
        const keyId = req.header("x-api-key-id");
        const ts = req.header("x-timestamp");
        const sig = req.header("x-signature");

        if (!keyId || !ts || !sig) {
            throw new InvalidHeaderError("API key id가 유효하지 않습니다.");
        }

        const keys = loadKeys();
        const secret = keys.get(keyId);
        if (!secret) throw new InvalidHeaderError("API key id가 유효하지 않습니다.");

        const t = Date.parse(ts);
        if (Number.isNaN(t)) {
            throw new InvalidHeaderError("timestamp가 유효하지 않습니다.");
        }

        const skewSec = Number(process.env.ADMIN_API_SKEW || 300);
        const now = Date.now();
        if (Math.abs(now - t) > skewSec * 1000) {
            throw new InvalidHeaderError("요청 타임스탬프가 허용 범위를 초과했습니다.");
        }

        const method = req.method.toUpperCase();
        const path = (req.originalUrl || "").split("?")[0];
        const rawBody = req.rawBody || "";

        const msg = `${method}\n${path}\n${ts}\n${rawBody}`;
        const expected = crypto.createHmac("sha256", secret).update(msg).digest("hex");

        if (!timingSafeEqualHex(expected, sig)) {
            throw new InvalidSignatureError("요청 서명이 유효하지 않습니다.");
        }
        next();
    } catch (e) {
        console.error("[requireSignedApiKey]", e);
        throw new InvalidHeaderError("API key가 유효하지 않습니다.");
    }
};
