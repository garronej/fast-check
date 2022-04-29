import { Arbitrary } from '../../../check/arbitrary/definition/Arbitrary.ts';
import { buildAlphaNumericPercentArbitrary } from './CharacterRangeArbitraryBuilder.ts';
import { stringOf } from '../../stringOf.ts';
import { SizeForArbitrary } from '../helpers/MaxLengthFromMinLength.ts';

/** @internal */
export function buildUriQueryOrFragmentArbitrary(size: Exclude<SizeForArbitrary, 'max'>): Arbitrary<string> {
  // query         = *( pchar / "/" / "?" )
  // fragment      = *( pchar / "/" / "?" )
  const others = ['-', '.', '_', '~', '!', '$', '&', "'", '(', ')', '*', '+', ',', ';', '=', ':', '@', '/', '?'];
  return stringOf(buildAlphaNumericPercentArbitrary(others), { size });
}
