import { Random } from '../../../random/generator/Random.ts';
import { Arbitrary } from './Arbitrary.ts';

/** @internal */
class BiasedArbitraryWrapper<T, TSourceArbitrary extends Arbitrary<T>> extends Arbitrary<T> {
  constructor(
    readonly freq: number,
    readonly arb: TSourceArbitrary,
    readonly biasedArbBuilder: (unbiased: TSourceArbitrary) => Arbitrary<T>
  ) {
    super();
  }
  generate(mrng: Random) {
    return mrng.nextInt(1, this.freq) === 1 ? this.biasedArbBuilder(this.arb).generate(mrng) : this.arb.generate(mrng);
  }
}

/**
 * Helper function automatically choosing between the biased and unbiased versions of an Arbitrary.
 * This helper has been introduced in order to provide higher performances when building custom biased arbitraries
 * @internal
 */
export function biasWrapper<T, TSourceArbitrary extends Arbitrary<T>>(
  freq: number,
  arb: TSourceArbitrary,
  biasedArbBuilder: (unbiased: TSourceArbitrary) => Arbitrary<T>
): Arbitrary<T> {
  return new BiasedArbitraryWrapper(freq, arb, biasedArbBuilder);
}
