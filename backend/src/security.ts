import { createHash, createHmac, randomBytes, timingSafeEqual } from 'node:crypto';
import argon2 from 'argon2';
import { ZxcvbnFactory } from '@zxcvbn-ts/core';
import { dictionary, adjacencyGraphs } from '@zxcvbn-ts/language-common';
import { env } from './config/env.js';

export const randomToken = () => randomBytes(32).toString('base64url');
export const digest = (value: string) => createHash('sha256').update(value).digest('hex');
export const normalizeEmail = (email: string) => email.trim().normalize('NFC').toLowerCase();
const passwordChecker = new ZxcvbnFactory({ dictionary, graphs: adjacencyGraphs });
export function secureEqual(left: string, right: string): boolean {
  const a = Buffer.from(left);
  const b = Buffer.from(right);
  return a.length === b.length && timingSafeEqual(a, b);
}
export function validatePassword(password: string, inputs: string[] = []): boolean {
  const lower = password.toLowerCase();
  return password.length >= 12 && password.length <= 128 && Buffer.byteLength(password) <= 1024 &&
    !['password', 'qwerty', '123456', 'letmein', 'admin', 'estateos'].some((weak) => lower.includes(weak)) &&
    !inputs.some((input) => input.length >= 3 && lower.includes(input.toLowerCase())) &&
    passwordChecker.check(password, inputs).score >= 3;
}
export const hashPassword = (password: string) => argon2.hash(password, {
  type: argon2.argon2id, memoryCost: 65536, timeCost: 3, parallelism: 1,
});
export const verifyPassword = (hash: string, password: string) => argon2.verify(hash, password);
function csrfKey(): string {
  if (!env.csrfSigningKey || env.csrfSigningKey.length < 32) throw new Error('AUTH_UNAVAILABLE');
  return env.csrfSigningKey;
}
export function preAuthCsrf(portal: string, nonce: string): string {
  return createHmac('sha256', csrfKey()).update(`${portal}:${nonce}`).digest('base64url');
}
export function sessionCsrf(secret: string, tokenDigest: string): string {
  return createHmac('sha256', secret).update(tokenDigest).digest('base64url');
}
