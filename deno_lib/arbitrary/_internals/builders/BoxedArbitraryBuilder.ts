import { Arbitrary } from '../../../check/arbitrary/definition/Arbitrary.ts';
import { convertFromNext, convertToNext } from '../../../check/arbitrary/definition/Converters.ts';
import { unboxedToBoxedMapper, unboxedToBoxedUnmapper } from '../mappers/UnboxedToBoxed.ts';

/** @internal */
export function boxedArbitraryBuilder(arb: Arbitrary<unknown>): Arbitrary<unknown> {
  return convertFromNext(convertToNext(arb).map(unboxedToBoxedMapper, unboxedToBoxedUnmapper));
}
