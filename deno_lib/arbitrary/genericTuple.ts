import { Arbitrary } from '../check/arbitrary/definition/Arbitrary.ts';
import { convertFromNext, convertToNext } from '../check/arbitrary/definition/Converters.ts';
import { NextArbitrary } from '../check/arbitrary/definition/NextArbitrary.ts';
import { TupleArbitrary } from './_internals/TupleArbitrary.ts';

/**
 * For tuples produced by the provided `arbs`
 *
 * @param arbs - Ordered list of arbitraries
 *
 * @deprecated Switch to {@link tuple} instead
 * @remarks Since 1.0.0
 * @public
 */
export function genericTuple<Ts extends unknown[]>(arbs: { [K in keyof Ts]: Arbitrary<Ts[K]> }): Arbitrary<Ts> {
  const nextArbs = arbs.map((arb) => convertToNext(arb)) as { [K in keyof Ts]: NextArbitrary<Ts[K]> };
  return convertFromNext(new TupleArbitrary<Ts>(nextArbs));
}
