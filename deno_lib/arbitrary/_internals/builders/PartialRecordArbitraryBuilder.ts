import { Arbitrary } from '../../../check/arbitrary/definition/Arbitrary.ts';
import { convertFromNext, convertToNext } from '../../../check/arbitrary/definition/Converters.ts';
import { option } from '../../option.ts';
import { tuple } from '../../tuple.ts';
import { EnumerableKeyOf, extractEnumerableKeys } from '../helpers/EnumerableKeysExtractor.ts';
import {
  buildValuesAndSeparateKeysToObjectMapper,
  buildValuesAndSeparateKeysToObjectUnmapper,
} from '../mappers/ValuesAndSeparateKeysToObject.ts';

const noKeyValue: unique symbol = Symbol('no-key');
type NoKeyType = typeof noKeyValue;

/** @internal */
export function buildPartialRecordArbitrary<T, TKeys extends EnumerableKeyOf<T>>(
  recordModel: { [K in keyof T]: Arbitrary<T[K]> },
  requiredKeys: TKeys[] | undefined
): Arbitrary<Partial<T> & Pick<T, TKeys>> {
  const keys = extractEnumerableKeys(recordModel);
  const arbs: Arbitrary<T[keyof T] | NoKeyType>[] = [];
  for (let index = 0; index !== keys.length; ++index) {
    const k: EnumerableKeyOf<T> = keys[index];
    const requiredArbitrary = recordModel[k];
    if (requiredKeys === undefined || requiredKeys.indexOf(k as TKeys) !== -1) arbs.push(requiredArbitrary);
    else arbs.push(option(requiredArbitrary, { nil: noKeyValue }));
  }
  return convertFromNext(
    convertToNext(tuple(...arbs)).map(
      buildValuesAndSeparateKeysToObjectMapper<T, NoKeyType>(keys, noKeyValue),
      buildValuesAndSeparateKeysToObjectUnmapper<T, NoKeyType>(keys, noKeyValue)
    )
  );
}
