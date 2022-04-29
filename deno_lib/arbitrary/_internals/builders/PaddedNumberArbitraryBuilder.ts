import { Arbitrary } from '../../../check/arbitrary/definition/Arbitrary.ts';
import { convertFromNext, convertToNext } from '../../../check/arbitrary/definition/Converters.ts';
import { integer } from '../../integer.ts';
import { numberToPaddedEightMapper, numberToPaddedEightUnmapper } from '../mappers/NumberToPaddedEight.ts';

/** @internal */
export function buildPaddedNumberArbitrary(min: number, max: number): Arbitrary<string> {
  return convertFromNext(
    convertToNext(integer({ min, max })).map(numberToPaddedEightMapper, numberToPaddedEightUnmapper)
  );
}
