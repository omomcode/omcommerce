"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-ignore
const schema_json_1 = __importDefault(require("./schema.json"));
const lifecycle_1 = __importDefault(require("./lifecycle"));
exports.default = {
    schema: schema_json_1.default,
    lifecycle: lifecycle_1.default
};
