import { Arbitrary } from '../check/arbitrary/definition/Arbitrary.ts';
import { convertFromNext, convertToNext } from '../check/arbitrary/definition/Converters.ts';
import { array } from './array.ts';
import { unicode } from './unicode.ts';
import {
  extractStringConstraints,
  StringFullConstraintsDefinition,
  StringSharedConstraints,
} from './_internals/helpers/StringConstraintsExtractor.ts';
import { codePointsToStringMapper, codePointsToStringUnmapper } from './_internals/mappers/CodePointsToString.ts';
export { StringSharedConstraints } from './_internals/helpers/StringConstraintsExtractor.ts';

/**
 * For strings of {@link unicode}
 * @remarks Since 0.0.11
 * @public
 */
function unicodeString(): Arbitrary<string>;
/**
 * For strings of {@link unicode}
 *
 * @param maxLength - Upper bound of the generated string length
 *
 * @deprecated
 * Superceded by `fc.unicodeString({maxLength})` - see {@link https://github.com/dubzzz/fast-check/issues/992 | #992}.
 * Ease the migration with {@link https://github.com/dubzzz/fast-check/tree/main/codemods/unify-signatures | our codemod script}.
 *
 * @remarks Since 0.0.11
 * @public
 */
function unicodeString(maxLength: number): Arbitrary<string>;
/**
 * For strings of {@link unicode}
 *
 * @param minLength - Lower bound of the generated string length
 * @param maxLength - Upper bound of the generated string length
 *
 * @deprecated
 * Superceded by `fc.unicodeString({minLength, maxLength})` - see {@link https://github.com/dubzzz/fast-check/issues/992 | #992}.
 * Ease the migration with {@link https://github.com/dubzzz/fast-check/tree/main/codemods/unify-signatures | our codemod script}.
 *
 * @remarks Since 0.0.11
 * @public
 */
function unicodeString(minLength: number, maxLength: number): Arbitrary<string>;
/**
 * For strings of {@link unicode}
 *
 * @param constraints - Constraints to apply when building instances
 *
 * @remarks Since 2.4.0
 * @public
 */
function unicodeString(constraints: StringSharedConstraints): Arbitrary<string>;
function unicodeString(...args: StringFullConstraintsDefinition): Arbitrary<string> {
  const constraints = extractStringConstraints(args);
  return convertFromNext(
    convertToNext(array(unicode(), constraints)).map(codePointsToStringMapper, codePointsToStringUnmapper)
  );
}
export { unicodeString };
