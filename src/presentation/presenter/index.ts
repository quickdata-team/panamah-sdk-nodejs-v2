import { Compressor } from '../../core/useCases/compressor.useCase';

export function send(nfeContent: string, fromPath = true) {
  return new Compressor().send(nfeContent, fromPath);
}
