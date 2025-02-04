import { Random } from '../../../random/generator/Random.ts';
import { Shrinkable } from './Shrinkable.ts';

/**
 * Abstract class able to generate values on type `T`
 *
 * The values generated by an instance of Arbitrary can be previewed - with {@link sample}
 * - or classified - with {@link statistics}.
 *
 * @remarks Since 0.0.7
 * @public
 */
export abstract class Arbitrary<T> {
  /**
   * Generate a value of type `T` along with its shrink method
   * based on the provided random number generator
   *
   * @param mrng - Random number generator
   * @returns Random value of type `T` and its shrinker
   *
   * @remarks Since 0.0.1
   */
  abstract generate(mrng: Random): Shrinkable<T>;

  /**
   * Create another arbitrary by filtering values against `predicate`
   *
   * All the values produced by the resulting arbitrary
   * satisfy `predicate(value) == true`
   *
   * Be aware that using filter may highly impact the time required to generate a valid entry
   *
   * @example
   * ```typescript
   * const integerGenerator: Arbitrary<number> = ...;
   * const evenIntegerGenerator: Arbitrary<number> = integerGenerator.filter(e => e % 2 === 0);
   * // new Arbitrary only keeps even values
   * ```
   *
   * @param refinement - Predicate, to test each produced element. Return true to keep the element, false otherwise
   * @returns New arbitrary filtered using predicate
   *
   * @remarks Since 1.23.0
   */
  filter<U extends T>(refinement: (t: T) => t is U): Arbitrary<U>;
  /**
   * Create another arbitrary by filtering values against `predicate`
   *
   * All the values produced by the resulting arbitrary
   * satisfy `predicate(value) == true`
   *
   * Be aware that using filter may highly impact the time required to generate a valid entry
   *
   * @example
   * ```typescript
   * const integerGenerator: Arbitrary<number> = ...;
   * const evenIntegerGenerator: Arbitrary<number> = integerGenerator.filter(e => e % 2 === 0);
   * // new Arbitrary only keeps even values
   * ```
   *
   * @param predicate - Predicate, to test each produced element. Return true to keep the element, false otherwise
   * @returns New arbitrary filtered using predicate
   *
   * @remarks Since 0.0.1
   */
  filter(predicate: (t: T) => boolean): Arbitrary<T>;
  filter<U extends T>(refinement: (t: T) => t is U): Arbitrary<U> {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    return new FilterArbitrary(this, refinement);
  }

  /**
   * Create another arbitrary by mapping all produced values using the provided `mapper`
   * Values produced by the new arbitrary are the result of applying `mapper` value by value
   *
   * @example
   * ```typescript
   * const rgbChannels: Arbitrary<{r:number,g:number,b:number}> = ...;
   * const color: Arbitrary<string> = rgbChannels.map(ch => `#${(ch.r*65536 + ch.g*256 + ch.b).toString(16).padStart(6, '0')}`);
   * // transform an Arbitrary producing {r,g,b} integers into an Arbitrary of '#rrggbb'
   * ```
   *
   * @param mapper - Map function, to produce a new element based on an old one
   * @returns New arbitrary with mapped elements
   *
   * @remarks Since 0.0.1
   */
  map<U>(mapper: (t: T) => U): Arbitrary<U> {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    return new MapArbitrary(this, mapper);
  }

  /**
   * Create another arbitrary by mapping a value from a base Arbirary using the provided `fmapper`
   * Values produced by the new arbitrary are the result of the arbitrary generated by applying `fmapper` to a value
   * @example
   * ```typescript
   * const arrayAndLimitArbitrary = fc.nat().chain((c: number) => fc.tuple( fc.array(fc.nat(c)), fc.constant(c)));
   * ```
   *
   * @param fmapper - Chain function, to produce a new Arbitrary using a value from another Arbitrary
   * @returns New arbitrary of new type
   *
   * @remarks Since 1.2.0
   */
  chain<U>(fmapper: (t: T) => Arbitrary<U>): Arbitrary<U> {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    return new ChainArbitrary(this, fmapper);
  }

  /**
   * Create another Arbitrary with no shrink values
   *
   * @example
   * ```typescript
   * const dataGenerator: Arbitrary<string> = ...;
   * const unshrinkableDataGenerator: Arbitrary<string> = dataGenerator.noShrink();
   * // same values no shrink
   * ```
   *
   * @returns Create another arbitrary with no shrink values
   * @remarks Since 0.0.9
   */
  noShrink(): Arbitrary<T> {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    return new NoShrinkArbitrary(this);
  }

  /**
   * Create another Arbitrary having bias - by default return itself
   *
   * @param freq - The biased version will be used one time over freq - if it exists - freq must be superior or equal to 2 to avoid any lock
   * @remarks Since 1.1.0
   */
  withBias(_freq: number): Arbitrary<T> {
    return this;
  }

  /**
   * Create another Arbitrary that cannot be biased
   *
   * @param freq - The biased version will be used one time over freq - if it exists
   * @remarks Since 1.1.0
   */
  noBias(): Arbitrary<T> {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    return new NoBiasArbitrary(this);
  }
}

/** @internal */
class ChainArbitrary<T, U> extends Arbitrary<U> {
  constructor(readonly arb: Arbitrary<T>, readonly fmapper: (t: T) => Arbitrary<U>) {
    super();
  }
  generate(mrng: Random): Shrinkable<U> {
    const clonedMrng = mrng.clone();
    const src = this.arb.generate(mrng);
    const dst = this.fmapper(src.value).generate(mrng);
    return ChainArbitrary.shrinkChain(clonedMrng, src, dst, this.fmapper);
  }
  withBias(freq: number): Arbitrary<U> {
    return this.arb.withBias(freq).chain((t: T) => this.fmapper(t).withBias(freq));
  }
  private static shrinkChain<T, U>(
    mrng: Random,
    src: Shrinkable<T>,
    dst: Shrinkable<U>,
    fmapper: (t: T) => Arbitrary<U>
  ): Shrinkable<U> {
    return new Shrinkable(dst.value, () =>
      src
        .shrink()
        .map((v: Shrinkable<T>) =>
          ChainArbitrary.shrinkChain(mrng.clone(), v, fmapper(v.value).generate(mrng.clone()), fmapper)
        )
        .join(dst.shrink())
    );
  }
}

/** @internal */
class MapArbitrary<T, U> extends Arbitrary<U> {
  constructor(readonly arb: Arbitrary<T>, readonly mapper: (t: T) => U) {
    super();
  }
  generate(mrng: Random): Shrinkable<U> {
    return this.arb.generate(mrng).map(this.mapper);
  }
  withBias(freq: number): Arbitrary<U> {
    return this.arb.withBias(freq).map(this.mapper);
  }
}

/** @internal */
class FilterArbitrary<T, U extends T> extends Arbitrary<U> {
  constructor(readonly arb: Arbitrary<T>, readonly refinement: (t: T) => t is U) {
    super();
  }
  generate(mrng: Random): Shrinkable<U> {
    let g = this.arb.generate(mrng);
    while (!this.refinementOnShrinkable(g)) {
      g = this.arb.generate(mrng);
    }
    return g.filter(this.refinement);
  }
  withBias(freq: number) {
    return this.arb.withBias(freq).filter(this.refinement);
  }
  private refinementOnShrinkable(s: Shrinkable<T>): s is Shrinkable<U> {
    return this.refinement(s.value);
  }
}

/** @internal */
class NoShrinkArbitrary<T> extends Arbitrary<T> {
  constructor(readonly arb: Arbitrary<T>) {
    super();
  }
  generate(mrng: Random): Shrinkable<T> {
    return new Shrinkable(this.arb.generate(mrng).value);
  }
  withBias(freq: number) {
    return this.arb.withBias(freq).noShrink();
  }
}

/** @internal */
class NoBiasArbitrary<T> extends Arbitrary<T> {
  constructor(readonly arb: Arbitrary<T>) {
    super();
  }
  generate(mrng: Random): Shrinkable<T> {
    return this.arb.generate(mrng);
  }
}

/**
 * Ensure an instance is an instance of Arbitrary
 * @param instance - The instance to be checked
 * @internal
 */
export function assertIsArbitrary(instance: Arbitrary<unknown>): void {
  // TODO - Ideally `: asserts instance is Arbitrary<unknown>` but requires TS 3.7
  if (typeof instance !== 'object' || instance === null || !('generate' in instance)) {
    throw new Error('Unexpected value received: not an instance of Arbitrary');
  }
}
