import { IRawProperty } from '../property/IRawProperty.ts';
import { SkipAfterProperty } from '../property/SkipAfterProperty.ts';
import { TimeoutProperty } from '../property/TimeoutProperty.ts';
import { UnbiasedProperty } from '../property/UnbiasedProperty.ts';
import { QualifiedParameters } from './configuration/QualifiedParameters.ts';
import { IgnoreEqualValuesProperty } from '../property/IgnoreEqualValuesProperty.ts';
import { convertToNextProperty } from '../property/ConvertersProperty.ts';
import { INextRawProperty } from '../property/INextRawProperty.ts';

/** @internal */
type MinimalQualifiedParameters<Ts> = Pick<
  QualifiedParameters<Ts>,
  'unbiased' | 'timeout' | 'skipAllAfterTimeLimit' | 'interruptAfterTimeLimit' | 'skipEqualValues' | 'ignoreEqualValues'
>;

/** @internal */
export function decorateProperty<Ts>(
  rawProperty: IRawProperty<Ts>,
  qParams: MinimalQualifiedParameters<Ts>
): INextRawProperty<Ts> {
  let prop = convertToNextProperty(rawProperty);
  if (rawProperty.isAsync() && qParams.timeout != null) {
    prop = new TimeoutProperty(prop, qParams.timeout);
  }
  if (qParams.unbiased) {
    prop = new UnbiasedProperty(prop);
  }
  if (qParams.skipAllAfterTimeLimit != null) {
    prop = new SkipAfterProperty(prop, Date.now, qParams.skipAllAfterTimeLimit, false);
  }
  if (qParams.interruptAfterTimeLimit != null) {
    prop = new SkipAfterProperty(prop, Date.now, qParams.interruptAfterTimeLimit, true);
  }
  if (qParams.skipEqualValues) {
    prop = new IgnoreEqualValuesProperty(prop, true);
  }
  if (qParams.ignoreEqualValues) {
    prop = new IgnoreEqualValuesProperty(prop, false);
  }
  return prop;
}
