import { Random } from '../../../random/generator/Random.ts';
import { Stream } from '../../../stream/Stream.ts';
import { Arbitrary } from './Arbitrary.ts';
import { ConverterFromNext } from './ConverterFromNext.ts';
import { NextArbitrary } from './NextArbitrary.ts';
import { NextValue } from './NextValue.ts';
import { Shrinkable } from './Shrinkable.ts';

const identifier = '__ConverterToNext__';

/** @internal */
export function fromShrinkableToNextValue<T>(g: Shrinkable<T>): NextValue<T> {
  if (!g.hasToBeCloned) {
    return new NextValue(g.value_, g);
  }
  return new NextValue(g.value_, g, () => g.value);
}

/** @internal */
export class ConverterToNext<T> extends NextArbitrary<T> {
  [identifier] = true;
  static isConverterToNext<T>(arb: NextArbitrary<T>): arb is ConverterToNext<T> {
    return identifier in arb;
  }
  private static convertIfNeeded<T>(arb: Arbitrary<T>): NextArbitrary<T> {
    if (ConverterFromNext.isConverterFromNext(arb)) return arb.arb;
    else return new ConverterToNext(arb);
  }

  constructor(readonly arb: Arbitrary<T>) {
    super();
  }

  generate(mrng: Random, biasFactor: number | undefined): NextValue<T> {
    const g = biasFactor !== undefined ? this.arb.withBias(biasFactor).generate(mrng) : this.arb.generate(mrng);
    return fromShrinkableToNextValue(g);
  }

  canShrinkWithoutContext(_value: unknown): _value is T {
    return false;
  }

  shrink(_value: T, context?: unknown): Stream<NextValue<T>> {
    if (this.isSafeContext(context)) {
      return context.shrink().map(fromShrinkableToNextValue);
    }
    return Stream.nil();
  }
  private isSafeContext(context: unknown): context is Shrinkable<T> {
    return (
      context != null && typeof context === 'object' && 'value' in (context as any) && 'shrink' in (context as any)
    );
  }

  filter<U extends T>(refinement: (t: T) => t is U): NextArbitrary<U>;
  filter(predicate: (t: T) => boolean): NextArbitrary<T>;
  filter<U extends T>(refinement: (t: T) => t is U): NextArbitrary<U> {
    return ConverterToNext.convertIfNeeded(this.arb.filter(refinement));
  }

  map<U>(mapper: (t: T) => U): NextArbitrary<U> {
    return ConverterToNext.convertIfNeeded(this.arb.map(mapper));
  }

  chain<U>(fmapper: (t: T) => NextArbitrary<U>): NextArbitrary<U> {
    return ConverterToNext.convertIfNeeded(
      this.arb.chain((t) => {
        const fmapped = fmapper(t);
        if (ConverterToNext.isConverterToNext(fmapped)) return fmapped.arb;
        else return new ConverterFromNext(fmapped);
      })
    );
  }

  noShrink(): NextArbitrary<T> {
    return ConverterToNext.convertIfNeeded(this.arb.noShrink());
  }

  noBias(): NextArbitrary<T> {
    return ConverterToNext.convertIfNeeded(this.arb.noBias());
  }
}
