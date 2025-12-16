import { certificates } from './certificates-data';
import type { Certificate } from './types';

export function getAllCertificates(): Certificate[] {
  return certificates;
}
