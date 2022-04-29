import { Arbitrary } from '../check/arbitrary/definition/Arbitrary.ts';
import { integer } from './integer.ts';
import {
  IntArrayConstraints,
  typedIntArrayArbitraryArbitraryBuilder,
} from './_internals/builders/TypedIntArrayArbitraryBuilder.ts';

/**
 * For Int8Array
 * @remarks Since 2.9.0
 * @public
 */
export function int8Array(constraints: IntArrayConstraints = {}): Arbitrary<Int8Array> {
  return typedIntArrayArbitraryArbitraryBuilder<Int8Array, number>(constraints, -128, 127, Int8Array, integer);
}
export { IntArrayConstraints };
