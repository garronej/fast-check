import { Arbitrary } from '../check/arbitrary/definition/Arbitrary.ts';
import { convertFromNext, convertToNext } from '../check/arbitrary/definition/Converters.ts';
import { tuple } from './tuple.ts';
import { buildPaddedNumberArbitrary } from './_internals/builders/PaddedNumberArbitraryBuilder.ts';
import { paddedEightsToUuidMapper, paddedEightsToUuidUnmapper } from './_internals/mappers/PaddedEightsToUuid.ts';

/**
 * For UUID of a given version (in v1 to v5)
 *
 * According to {@link https://tools.ietf.org/html/rfc4122 | RFC 4122}
 *
 * No mixed case, only lower case digits (0-9a-f)
 *
 * @remarks Since 1.17.0
 * @public
 */
export function uuidV(versionNumber: 1 | 2 | 3 | 4 | 5): Arbitrary<string> {
  const padded = buildPaddedNumberArbitrary(0, 0xffffffff);
  const offsetSecond = versionNumber * 0x10000000;
  const secondPadded = buildPaddedNumberArbitrary(offsetSecond, offsetSecond + 0x0fffffff);
  const thirdPadded = buildPaddedNumberArbitrary(0x80000000, 0xbfffffff);
  return convertFromNext(
    convertToNext(tuple(padded, secondPadded, thirdPadded, padded)).map(
      paddedEightsToUuidMapper,
      paddedEightsToUuidUnmapper
    )
  );
}
