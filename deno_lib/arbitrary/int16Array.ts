import { Arbitrary } from '../check/arbitrary/definition/Arbitrary.ts';
import { integer } from './integer.ts';
import {
  IntArrayConstraints,
  typedIntArrayArbitraryArbitraryBuilder,
} from './_internals/builders/TypedIntArrayArbitraryBuilder.ts';

/**
 * For Int16Array
 * @remarks Since 2.9.0
 * @public
 */
export function int16Array(constraints: IntArrayConstraints = {}): Arbitrary<Int16Array> {
  return typedIntArrayArbitraryArbitraryBuilder<Int16Array, number>(constraints, -32768, 32767, Int16Array, integer);
}
export { IntArrayConstraints };
