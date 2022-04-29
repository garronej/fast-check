import { Stream } from '../stream/Stream.ts';
import { Arbitrary } from '../check/arbitrary/definition/Arbitrary.ts';
import { convertFromNext, convertToNext } from '../check/arbitrary/definition/Converters.ts';
import { StreamArbitrary } from './_internals/StreamArbitrary.ts';

/**
 * Produce an infinite stream of values
 *
 * WARNING: Requires Object.assign
 *
 * @param arb - Arbitrary used to generate the values
 *
 * @remarks Since 1.8.0
 * @public
 */
function infiniteStream<T>(arb: Arbitrary<T>): Arbitrary<Stream<T>> {
  return convertFromNext(new StreamArbitrary(convertToNext(arb)));
}

export { infiniteStream };
