import { Arbitrary } from '../check/arbitrary/definition/Arbitrary.ts';
import { convertFromNext, convertToNext } from '../check/arbitrary/definition/Converters.ts';
import { array } from './array.ts';
import { hexa } from './hexa.ts';
import {
  extractStringConstraints,
  StringFullConstraintsDefinition,
  StringSharedConstraints,
} from './_internals/helpers/StringConstraintsExtractor.ts';
import { codePointsToStringMapper, codePointsToStringUnmapper } from './_internals/mappers/CodePointsToString.ts';
export { StringSharedConstraints } from './_internals/helpers/StringConstraintsExtractor.ts';

/**
 * For strings of {@link hexa}
 * @remarks Since 0.0.1
 * @public
 */
function hexaString(): Arbitrary<string>;
/**
 * For strings of {@link hexa}
 *
 * @param maxLength - Upper bound of the generated string length
 *
 * @deprecated
 * Superceded by `fc.hexaString({maxLength})` - see {@link https://github.com/dubzzz/fast-check/issues/992 | #992}.
 * Ease the migration with {@link https://github.com/dubzzz/fast-check/tree/main/codemods/unify-signatures | our codemod script}.
 *
 * @remarks Since 0.0.1
 * @public
 */
function hexaString(maxLength: number): Arbitrary<string>;
/**
 * For strings of {@link hexa}
 *
 * @param minLength - Lower bound of the generated string length
 * @param maxLength - Upper bound of the generated string length
 *
 * @deprecated
 * Superceded by `fc.hexaString({minLength, maxLength})` - see {@link https://github.com/dubzzz/fast-check/issues/992 | #992}.
 * Ease the migration with {@link https://github.com/dubzzz/fast-check/tree/main/codemods/unify-signatures | our codemod script}.
 *
 * @remarks Since 0.0.11
 * @public
 */
function hexaString(minLength: number, maxLength: number): Arbitrary<string>;
/**
 * For strings of {@link hexa}
 *
 * @param constraints - Constraints to apply when building instances
 *
 * @remarks Since 2.4.0
 * @public
 */
function hexaString(constraints: StringSharedConstraints): Arbitrary<string>;
function hexaString(...args: StringFullConstraintsDefinition): Arbitrary<string> {
  const constraints = extractStringConstraints(args);
  return convertFromNext(
    convertToNext(array(hexa(), constraints)).map(codePointsToStringMapper, codePointsToStringUnmapper)
  );
}
export { hexaString };
