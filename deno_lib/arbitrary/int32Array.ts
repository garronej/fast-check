import { Arbitrary } from '../check/arbitrary/definition/Arbitrary.ts';
import { integer } from './integer.ts';
import {
  IntArrayConstraints,
  typedIntArrayArbitraryArbitraryBuilder,
} from './_internals/builders/TypedIntArrayArbitraryBuilder.ts';

/**
 * For Int32Array
 * @remarks Since 2.9.0
 * @public
 */
export function int32Array(constraints: IntArrayConstraints = {}): Arbitrary<Int32Array> {
  return typedIntArrayArbitraryArbitraryBuilder<Int32Array, number>(
    constraints,
    -0x80000000,
    0x7fffffff,
    Int32Array,
    integer
  );
}
export { IntArrayConstraints };
