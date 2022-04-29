import { Arbitrary } from '../check/arbitrary/definition/Arbitrary.ts';
import { buildCharacterArbitrary } from './_internals/builders/CharacterArbitraryBuilder.ts';
import { indexToPrintableIndexMapper, indexToPrintableIndexUnmapper } from './_internals/mappers/IndexToPrintableIndex.ts';

/**
 * For single ascii characters - char code between 0x00 (included) and 0x7f (included)
 * @remarks Since 0.0.1
 * @public
 */
export function ascii(): Arbitrary<string> {
  return buildCharacterArbitrary(0x00, 0x7f, indexToPrintableIndexMapper, indexToPrintableIndexUnmapper);
}
