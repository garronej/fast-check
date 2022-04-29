import { Arbitrary } from '../../../check/arbitrary/definition/Arbitrary.ts';
import { convertFromNext, convertToNext } from '../../../check/arbitrary/definition/Converters.ts';
import { integer } from '../../integer.ts';
import { WithShrinkFromOtherArbitrary } from '../WithShrinkFromOtherArbitrary.ts';

/** @internal */
export function restrictedIntegerArbitraryBuilder(min: number, maxGenerated: number, max: number): Arbitrary<number> {
  const generatorArbitrary = convertToNext(integer({ min, max: maxGenerated }));
  if (maxGenerated === max) {
    return convertFromNext(generatorArbitrary);
  }
  const shrinkerArbitrary = convertToNext(integer({ min, max }));
  return convertFromNext(new WithShrinkFromOtherArbitrary(generatorArbitrary, shrinkerArbitrary));
}
