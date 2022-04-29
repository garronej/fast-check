import { RandomGenerator as PureRandRandomGenerator } from 'https://raw.githubusercontent.com/garronej/pure-rand/main/deno_lib/mod.ts';

/**
 * Interface for `RandomGenerator` as declared in pure-rand for versions strictly lower than 5.x.x
 *
 * @deprecated
 * Temporary helper that will disappear and not be supported anymore in next major release.
 *
 * @remarks Since 2.17.0
 * @public
 */
export interface LegacyPureRandRandomGenerator {
  /** Minimal value (included) that could be generated by this generator */
  min(): number;
  /** Maximal value (included) that could be generated by this generator */
  max(): number;
  /** Generate next random value along with the next generator (does not impact current instance) */
  next(): [number, LegacyPureRandRandomGenerator];
  /** Compute the jumped generator (does not impact current instance) */
  jump?(): LegacyPureRandRandomGenerator;
}

/**
 * The minimal API for a random generator as requested by fast-check.
 * The most important point being that the generator HAS TO BE pure.
 * In other words, it has to expose methods to compute a random value while not impacting itself (see next/jump).
 *
 * @deprecated
 * Temporary helper that will disappear in next major release.
 * Prefer referencing directly RandomGenerator from RandomGenerator.
 *
 * @remarks Since 2.17.0
 * @public
 */
export type PureRandom = PureRandRandomGenerator | LegacyPureRandRandomGenerator;

/** @internal */
class ConvertedRandomGenerator implements PureRandRandomGenerator {
  jump?: PureRandRandomGenerator['jump'];
  unsafeJump?: PureRandRandomGenerator['unsafeJump'];
  constructor(private rng: PureRandom) {
    if (typeof this.rng.jump === 'function') {
      this.jump = function jump() {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const out = this.jump!();
        return new ConvertedRandomGenerator(out);
      };
      this.unsafeJump = function unsafeJump() {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const out = this.jump!();
        this.rng = out;
      };
    }
  }
  min(): number {
    return this.rng.min();
  }
  max(): number {
    return this.rng.max();
  }
  clone(): PureRandRandomGenerator {
    return new ConvertedRandomGenerator(this.rng);
  }
  next(): [number, PureRandRandomGenerator] {
    const out = this.rng.next();
    return [out[0], new ConvertedRandomGenerator(out[1])];
  }
  unsafeNext(): number {
    const out = this.rng.next();
    this.rng = out[1];
    return out[0];
  }
}

/**
 * Internal helper to convert a potentially legacy version of generator to the new API
 * @internal
 */
export function convertToRandomGenerator(rng: PureRandom): PureRandRandomGenerator {
  if ('clone' in rng && 'unsafeNext' in rng) {
    return rng;
  }
  return new ConvertedRandomGenerator(rng);
}
