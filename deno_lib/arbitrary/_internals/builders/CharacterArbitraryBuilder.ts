import { Arbitrary } from '../../../check/arbitrary/definition/Arbitrary.ts';
import { convertFromNext, convertToNext } from '../../../check/arbitrary/definition/Converters.ts';
import { integer } from '../../integer.ts';
import { indexToCharStringMapper, indexToCharStringUnmapper } from '../mappers/IndexToCharString.ts';

/** @internal */
export function buildCharacterArbitrary(
  min: number,
  max: number,
  mapToCode: (v: number) => number,
  unmapFromCode: (v: number) => number
): Arbitrary<string> {
  return convertFromNext(
    convertToNext(integer(min, max)).map(
      (n) => indexToCharStringMapper(mapToCode(n)),
      (c) => unmapFromCode(indexToCharStringUnmapper(c))
    )
  );
}
