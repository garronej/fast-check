import { NextArbitrary } from '../../check/arbitrary/definition/NextArbitrary.ts';
import { NextValue } from '../../check/arbitrary/definition/NextValue.ts';
import { Random } from '../../random/generator/Random.ts';
import { Stream } from '../../stream/Stream.ts';

/** @internal */
export class LazyArbitrary<T> extends NextArbitrary<T> {
  underlying: NextArbitrary<T> | null = null;
  constructor(readonly name: string) {
    super();
  }
  generate(mrng: Random, biasFactor: number | undefined): NextValue<T> {
    if (!this.underlying) {
      throw new Error(`Lazy arbitrary ${JSON.stringify(this.name)} not correctly initialized`);
    }
    return this.underlying.generate(mrng, biasFactor);
  }
  canShrinkWithoutContext(value: unknown): value is T {
    if (!this.underlying) {
      throw new Error(`Lazy arbitrary ${JSON.stringify(this.name)} not correctly initialized`);
    }
    return this.underlying.canShrinkWithoutContext(value);
  }
  shrink(value: T, context?: unknown): Stream<NextValue<T>> {
    if (!this.underlying) {
      throw new Error(`Lazy arbitrary ${JSON.stringify(this.name)} not correctly initialized`);
    }
    return this.underlying.shrink(value, context);
  }
}
