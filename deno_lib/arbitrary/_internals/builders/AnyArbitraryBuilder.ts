import { Arbitrary } from '../../../check/arbitrary/definition/Arbitrary.ts';

import { stringify } from '../../../utils/stringify.ts';
import { array } from '../../array.ts';
import { frequency } from '../../frequency.ts';
import { oneof } from '../../oneof.ts';
import { tuple } from '../../tuple.ts';
import { bigInt } from '../../bigInt.ts';
import { date } from '../../date.ts';
import { float32Array } from '../../float32Array.ts';
import { float64Array } from '../../float64Array.ts';
import { int16Array } from '../../int16Array.ts';
import { int32Array } from '../../int32Array.ts';
import { int8Array } from '../../int8Array.ts';
import { uint16Array } from '../../uint16Array.ts';
import { uint32Array } from '../../uint32Array.ts';
import { uint8Array } from '../../uint8Array.ts';
import { uint8ClampedArray } from '../../uint8ClampedArray.ts';
import { sparseArray } from '../../sparseArray.ts';
import { keyValuePairsToObjectMapper, keyValuePairsToObjectUnmapper } from '../mappers/KeyValuePairsToObject.ts';
import { QualifiedObjectConstraints } from '../helpers/QualifiedObjectConstraints.ts';
import { convertFromNext, convertToNext } from '../../../check/arbitrary/definition/Converters.ts';
import { arrayToMapMapper, arrayToMapUnmapper } from '../mappers/ArrayToMap.ts';
import { arrayToSetMapper, arrayToSetUnmapper } from '../mappers/ArrayToSet.ts';
import { objectToPrototypeLessMapper, objectToPrototypeLessUnmapper } from '../mappers/ObjectToPrototypeLess.ts';
import { letrec } from '../../letrec.ts';
import { SizeForArbitrary } from '../helpers/MaxLengthFromMinLength.ts';
import { uniqueArray } from '../../uniqueArray.ts';
import { createDepthIdentifier, DepthIdentifier } from '../helpers/DepthContext.ts';

/** @internal */
function entriesOf<T, U>(
  keyArb: Arbitrary<T>,
  valueArb: Arbitrary<U>,
  maxKeys: number,
  size: SizeForArbitrary | undefined,
  depthIdentifier: DepthIdentifier
) {
  return convertToNext(
    uniqueArray(tuple(keyArb, valueArb), {
      maxLength: maxKeys,
      size,
      comparator: 'SameValueZero',
      selector: (t) => t[0],
      depthIdentifier,
    })
  );
}

/** @internal */
function mapOf<T, U>(
  ka: Arbitrary<T>,
  va: Arbitrary<U>,
  maxKeys: number,
  size: SizeForArbitrary | undefined,
  depthIdentifier: DepthIdentifier
) {
  return convertFromNext(entriesOf(ka, va, maxKeys, size, depthIdentifier).map(arrayToMapMapper, arrayToMapUnmapper));
}

/** @internal */
function dictOf<U>(
  ka: Arbitrary<string>,
  va: Arbitrary<U>,
  maxKeys: number,
  size: SizeForArbitrary | undefined,
  depthIdentifier: DepthIdentifier
) {
  return convertFromNext(
    entriesOf(ka, va, maxKeys, size, depthIdentifier).map(keyValuePairsToObjectMapper, keyValuePairsToObjectUnmapper)
  );
}

/** @internal */
function setOf<U>(
  va: Arbitrary<U>,
  maxKeys: number,
  size: SizeForArbitrary | undefined,
  depthIdentifier: DepthIdentifier
) {
  // TODO - The default compare function provided by the set is not appropriate (today) as it distintish NaN from NaN
  // While the Set does not and consider them to be the same values.
  return convertFromNext(
    convertToNext(uniqueArray(va, { maxLength: maxKeys, size, comparator: 'SameValueZero', depthIdentifier })).map(
      arrayToSetMapper,
      arrayToSetUnmapper
    )
  );
}

/** @internal */
// eslint-disable-next-line @typescript-eslint/ban-types
function prototypeLessOf(objectArb: Arbitrary<object>) {
  // TODO - The default compare function provided by the set is not appropriate (today) as it distintish NaN from NaN
  // While the Set does not and consider them to be the same values.
  return convertFromNext(convertToNext(objectArb).map(objectToPrototypeLessMapper, objectToPrototypeLessUnmapper));
}

/** @internal */
function typedArray(constraints: { maxLength: number; size: SizeForArbitrary }) {
  return oneof(
    int8Array(constraints),
    uint8Array(constraints),
    uint8ClampedArray(constraints),
    int16Array(constraints),
    uint16Array(constraints),
    int32Array(constraints),
    uint32Array(constraints),
    float32Array(constraints),
    float64Array(constraints)
  );
}

/** @internal */
export function anyArbitraryBuilder(constraints: QualifiedObjectConstraints): Arbitrary<unknown> {
  const arbitrariesForBase = constraints.values;
  const depthFactor = constraints.depthFactor;
  const depthIdentifier = createDepthIdentifier();
  const maxDepth = constraints.maxDepth;
  const maxKeys = constraints.maxKeys;
  const size = constraints.size;
  const baseArb = oneof(
    ...arbitrariesForBase,
    ...(constraints.withBigInt ? [bigInt()] : []),
    ...(constraints.withDate ? [date()] : [])
  );

  return letrec((tie) => ({
    anything: oneof(
      { maxDepth, depthFactor, depthIdentifier },
      baseArb, // Final recursion case
      tie('array'),
      tie('object'),
      ...(constraints.withMap ? [tie('map')] : []),
      ...(constraints.withSet ? [tie('set')] : []),
      ...(constraints.withObjectString ? [tie('anything').map((o) => stringify(o))] : []),
      // eslint-disable-next-line @typescript-eslint/ban-types
      ...(constraints.withNullPrototype ? [prototypeLessOf(tie('object') as Arbitrary<object>)] : []),
      ...(constraints.withTypedArray ? [typedArray({ maxLength: maxKeys, size })] : []),
      ...(constraints.withSparseArray
        ? [sparseArray(tie('anything'), { maxNumElements: maxKeys, size, depthIdentifier })]
        : [])
    ),
    // String keys
    keys: constraints.withObjectString
      ? frequency(
          { arbitrary: constraints.key, weight: 10 },
          { arbitrary: tie('anything').map((o) => stringify(o)), weight: 1 }
        )
      : constraints.key,
    // anything[]
    array: array(tie('anything'), { maxLength: maxKeys, size, depthIdentifier }),
    // Set<anything>
    set: setOf(tie('anything'), maxKeys, size, depthIdentifier),
    // Map<key, anything> | Map<anything, anything>
    map: oneof(
      mapOf(tie('keys') as Arbitrary<string>, tie('anything'), maxKeys, size, depthIdentifier),
      mapOf(tie('anything'), tie('anything'), maxKeys, size, depthIdentifier)
    ),
    // {[key:string]: anything}
    object: dictOf(tie('keys') as Arbitrary<string>, tie('anything'), maxKeys, size, depthIdentifier),
  })).anything;
}
