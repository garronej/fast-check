import { ArbitraryWithContextualShrink } from '../check/arbitrary/definition/ArbitraryWithContextualShrink.ts';
import { convertFromNextWithShrunkOnce } from '../check/arbitrary/definition/Converters.ts';
import { IntegerArbitrary } from './_internals/IntegerArbitrary.ts';

/**
 * For positive integers between 0 (included) and Number.MAX_SAFE_INTEGER (included)
 * @remarks Since 1.11.0
 * @public
 */
export function maxSafeNat(): ArbitraryWithContextualShrink<number> {
  const arb = new IntegerArbitrary(0, Number.MAX_SAFE_INTEGER);
  return convertFromNextWithShrunkOnce(arb, arb.defaultTarget());
}
