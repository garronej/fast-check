import { Arbitrary } from '../check/arbitrary/definition/Arbitrary.ts';
import { convertFromNext, convertToNext } from '../check/arbitrary/definition/Converters.ts';
import { array } from './array.ts';
import { char16bits } from './char16bits.ts';
import {
  extractStringConstraints,
  StringFullConstraintsDefinition,
  StringSharedConstraints,
} from './_internals/helpers/StringConstraintsExtractor.ts';
import { charsToStringMapper, charsToStringUnmapper } from './_internals/mappers/CharsToString.ts';
export { StringSharedConstraints } from './_internals/helpers/StringConstraintsExtractor.ts';

/**
 * For strings of {@link char16bits}
 * @remarks Since 0.0.11
 * @public
 */
function string16bits(): Arbitrary<string>;
/**
 * For strings of {@link char16bits}
 *
 * @param maxLength - Upper bound of the generated string length
 *
 * @deprecated
 * Superceded by `fc.string16bits({maxLength})` - see {@link https://github.com/dubzzz/fast-check/issues/992 | #992}.
 * Ease the migration with {@link https://github.com/dubzzz/fast-check/tree/main/codemods/unify-signatures | our codemod script}.
 *
 * @remarks Since 0.0.11
 * @public
 */
function string16bits(maxLength: number): Arbitrary<string>;
/**
 * For strings of {@link char16bits}
 *
 * @param minLength - Lower bound of the generated string length
 * @param maxLength - Upper bound of the generated string length
 *
 * @deprecated
 * Superceded by `fc.string16bits({minLength, maxLength})` - see {@link https://github.com/dubzzz/fast-check/issues/992 | #992}.
 * Ease the migration with {@link https://github.com/dubzzz/fast-check/tree/main/codemods/unify-signatures | our codemod script}.
 *
 * @remarks Since 0.0.11
 * @public
 */
function string16bits(minLength: number, maxLength: number): Arbitrary<string>;
/**
 * For strings of {@link char16bits}
 *
 * @param constraints - Constraints to apply when building instances
 *
 * @remarks Since 2.4.0
 * @public
 */
function string16bits(constraints: StringSharedConstraints): Arbitrary<string>;
function string16bits(...args: StringFullConstraintsDefinition): Arbitrary<string> {
  const constraints = extractStringConstraints(args);
  return convertFromNext(
    convertToNext(array(char16bits(), constraints)).map(charsToStringMapper, charsToStringUnmapper)
  );
}
export { string16bits };
