"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const profile_1 = __importDefault(require("./profile"));
const zone_1 = __importDefault(require("./zone"));
const billing_1 = __importDefault(require("./billing"));
const currency_1 = __importDefault(require("./currency"));
const shippingzone_1 = __importDefault(require("./shippingzone"));
const shippingrate_1 = __importDefault(require("./shippingrate"));
const shippingpackage_1 = __importDefault(require("./shippingpackage"));
const tax_1 = __importDefault(require("./tax"));
const product_1 = __importDefault(require("./product"));
const order_1 = __importDefault(require("./order"));
const legal_1 = __importDefault(require("./legal"));
const setup_1 = __importDefault(require("./setup"));
const paypalsetup_1 = __importDefault(require("./paypalsetup"));
const category_1 = __importDefault(require("./category"));
const social_1 = __importDefault(require("./social"));
const subcategory_1 = __importDefault(require("./subcategory"));
const conversionrate_1 = __importDefault(require("./conversionrate"));
const gmail_1 = __importDefault(require("./gmail"));
exports.default = {
    profile: profile_1.default,
    zone: zone_1.default,
    billing: billing_1.default,
    currency: currency_1.default,
    shippingzone: shippingzone_1.default,
    shippingrate: shippingrate_1.default,
    shippingpackage: shippingpackage_1.default,
    tax: tax_1.default,
    product: product_1.default,
    order: order_1.default,
    legal: legal_1.default,
    setup: setup_1.default,
    paypalsetup: paypalsetup_1.default,
    category: category_1.default,
    subcategory: subcategory_1.default,
    social: social_1.default,
    conversionrate: conversionrate_1.default,
    gmail: gmail_1.default
};
