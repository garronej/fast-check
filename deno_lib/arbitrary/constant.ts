import { Arbitrary } from '../check/arbitrary/definition/Arbitrary.ts';
import { convertFromNext } from '../check/arbitrary/definition/Converters.ts';
import { ConstantArbitrary } from './_internals/ConstantArbitrary.ts';

/**
 * For `value`
 * @param value - The value to produce
 * @remarks Since 0.0.1
 * @public
 */
export function constant<T>(value: T): Arbitrary<T> {
  return convertFromNext(new ConstantArbitrary([value]));
}
