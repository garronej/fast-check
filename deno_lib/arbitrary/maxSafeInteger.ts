import { ArbitraryWithContextualShrink } from '../check/arbitrary/definition/ArbitraryWithContextualShrink.ts';
import { convertFromNextWithShrunkOnce } from '../check/arbitrary/definition/Converters.ts';
import { IntegerArbitrary } from './_internals/IntegerArbitrary.ts';

/**
 * For integers between Number.MIN_SAFE_INTEGER (included) and Number.MAX_SAFE_INTEGER (included)
 * @remarks Since 1.11.0
 * @public
 */
export function maxSafeInteger(): ArbitraryWithContextualShrink<number> {
  const arb = new IntegerArbitrary(Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER);
  return convertFromNextWithShrunkOnce(arb, arb.defaultTarget());
}
