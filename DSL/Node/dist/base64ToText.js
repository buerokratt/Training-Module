"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function base64ToText(base64String) {
    const buffer = Buffer.from(base64String, 'base64');
    return buffer.toString('utf-8');
}
exports.default = base64ToText;
