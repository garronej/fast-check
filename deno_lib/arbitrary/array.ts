import { Arbitrary } from '../check/arbitrary/definition/Arbitrary.ts';
import { NextArbitrary } from '../check/arbitrary/definition/NextArbitrary.ts';
import { convertFromNext, convertToNext } from '../check/arbitrary/definition/Converters.ts';
import { ArrayArbitrary } from './_internals/ArrayArbitrary.ts';
import {
  MaxLengthUpperBound,
  SizeForArbitrary,
  maxGeneratedLengthFromSizeForArbitrary,
} from './_internals/helpers/MaxLengthFromMinLength.ts';
import { DepthIdentifier } from './_internals/helpers/DepthContext.ts';

/**
 * Constraints to be applied on {@link array}
 * @remarks Since 2.4.0
 * @public
 */
export interface ArrayConstraints {
  /**
   * Lower bound of the generated array size
   * @remarks Since 2.4.0
   */
  minLength?: number;
  /**
   * Upper bound of the generated array size
   * @remarks Since 2.4.0
   */
  maxLength?: number;
  /**
   * Define how large the generated values should be (at max)
   *
   * When used in conjonction with `maxLength`, `size` will be used to define
   * the upper bound of the generated array size while `maxLength` will be used
   * to define and document the general maximal length allowed for this case.
   *
   * @remarks Since 2.22.0
   */
  size?: SizeForArbitrary;
  /**
   * When receiving a depth identifier, the arbitrary will impact the depthFactor
   * attached to it to avoid going too deep if it already generated lots of items.
   *
   * In other words, if the number of generated values within the collection is large
   * then the generated items will tend to be less deep to avoid creating structures a lot
   * larger than expected.
   *
   * For the moment, the depth is not taken into account to compute the number of items to
   * define for a precise generate call of the array. Just applied onto eligible items.
   *
   * @remarks Since 2.25.0
   */
  depthIdentifier?: DepthIdentifier | string;
}

/** @internal */
function createArrayArbitrary<T>(
  nextArb: NextArbitrary<T>,
  size: SizeForArbitrary | undefined,
  minLength: number,
  maxLengthOrUnset: number | undefined,
  depthIdentifier: DepthIdentifier | string | undefined
): Arbitrary<T[]> {
  const maxLength = maxLengthOrUnset !== undefined ? maxLengthOrUnset : MaxLengthUpperBound;
  const specifiedMaxLength = maxLengthOrUnset !== undefined;
  const maxGeneratedLength = maxGeneratedLengthFromSizeForArbitrary(size, minLength, maxLength, specifiedMaxLength);
  return convertFromNext(new ArrayArbitrary<T>(nextArb, minLength, maxGeneratedLength, maxLength, depthIdentifier));
}

/**
 * For arrays of values coming from `arb`
 * @param arb - Arbitrary used to generate the values inside the array
 * @remarks Since 0.0.1
 * @public
 */
function array<T>(arb: Arbitrary<T>): Arbitrary<T[]>;
/**
 * For arrays of values coming from `arb` having an upper bound size
 *
 * @param arb - Arbitrary used to generate the values inside the array
 * @param maxLength - Upper bound of the generated array size
 *
 * @deprecated
 * Superceded by `fc.array(arb, {maxLength})` - see {@link https://github.com/dubzzz/fast-check/issues/992 | #992}.
 * Ease the migration with {@link https://github.com/dubzzz/fast-check/tree/main/codemods/unify-signatures | our codemod script}.
 *
 * @remarks Since 0.0.1
 * @public
 */
function array<T>(arb: Arbitrary<T>, maxLength: number): Arbitrary<T[]>;
/**
 * For arrays of values coming from `arb` having lower and upper bound size
 *
 * @param arb - Arbitrary used to generate the values inside the array
 * @param minLength - Lower bound of the generated array size
 * @param maxLength - Upper bound of the generated array size
 *
 * @deprecated
 * Superceded by `fc.array(arb, {minLength, maxLength})` - see {@link https://github.com/dubzzz/fast-check/issues/992 | #992}.
 * Ease the migration with {@link https://github.com/dubzzz/fast-check/tree/main/codemods/unify-signatures | our codemod script}.
 *
 * @remarks Since 0.0.7
 * @public
 */
function array<T>(arb: Arbitrary<T>, minLength: number, maxLength: number): Arbitrary<T[]>;
/**
 * For arrays of values coming from `arb` having lower and upper bound size
 *
 * @param arb - Arbitrary used to generate the values inside the array
 * @param constraints - Constraints to apply when building instances
 *
 * @remarks Since 2.4.0
 * @public
 */
function array<T>(arb: Arbitrary<T>, constraints: ArrayConstraints): Arbitrary<T[]>;
function array<T>(arb: Arbitrary<T>, ...args: [] | [number] | [number, number] | [ArrayConstraints]): Arbitrary<T[]> {
  const nextArb = convertToNext(arb);
  // fc.array(arb)
  if (args[0] === undefined) {
    return createArrayArbitrary(nextArb, undefined, 0, undefined, undefined); // no size, no maxLength, no depthIdentifier
  }
  // fc.array(arb, constraints)
  if (typeof args[0] === 'object') {
    return createArrayArbitrary(
      nextArb,
      args[0].size,
      args[0].minLength || 0,
      args[0].maxLength,
      args[0].depthIdentifier
    );
  }
  // fc.array(arb, minLength, maxLength)
  if (args[1] !== undefined) {
    return createArrayArbitrary(nextArb, undefined, args[0], args[1], undefined); // no size, no depthIdentifier
  }
  // fc.array(arb, maxLength)
  return createArrayArbitrary(nextArb, undefined, 0, args[0], undefined); // no size, no depthIdentifier
}
export { array };
