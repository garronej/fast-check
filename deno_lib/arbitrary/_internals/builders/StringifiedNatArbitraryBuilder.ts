import { Arbitrary } from '../../../check/arbitrary/definition/Arbitrary.ts';
import { convertFromNext, convertToNext } from '../../../check/arbitrary/definition/Converters.ts';
import { constantFrom } from '../../constantFrom.ts';
import { nat } from '../../nat.ts';
import { tuple } from '../../tuple.ts';
import { natToStringifiedNatMapper, natToStringifiedNatUnmapper } from '../mappers/NatToStringifiedNat.ts';

/** @internal */
export function buildStringifiedNatArbitrary(maxValue: number): Arbitrary<string> {
  return convertFromNext(
    convertToNext(tuple(constantFrom<('dec' | 'oct' | 'hex')[]>('dec', 'oct', 'hex'), nat(maxValue))).map(
      natToStringifiedNatMapper,
      natToStringifiedNatUnmapper
    )
  );
}
