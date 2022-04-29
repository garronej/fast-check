import { Arbitrary } from '../check/arbitrary/definition/Arbitrary.ts';
import { integer } from './integer.ts';
import {
  IntArrayConstraints,
  typedIntArrayArbitraryArbitraryBuilder,
} from './_internals/builders/TypedIntArrayArbitraryBuilder.ts';

/**
 * For Uint8ClampedArray
 * @remarks Since 2.9.0
 * @public
 */
export function uint8ClampedArray(constraints: IntArrayConstraints = {}): Arbitrary<Uint8ClampedArray> {
  return typedIntArrayArbitraryArbitraryBuilder<Uint8ClampedArray, number>(
    constraints,
    0,
    255,
    Uint8ClampedArray,
    integer
  );
}
export { IntArrayConstraints };
