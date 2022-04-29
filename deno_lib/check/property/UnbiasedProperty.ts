import { Random } from '../../random/generator/Random.ts';
import { Stream } from '../../stream/Stream.ts';
import { NextValue } from '../arbitrary/definition/NextValue.ts';
import { INextRawProperty } from './INextRawProperty.ts';

/** @internal */
export class UnbiasedProperty<Ts, IsAsync extends boolean> implements INextRawProperty<Ts, IsAsync> {
  constructor(readonly property: INextRawProperty<Ts, IsAsync>) {}

  isAsync(): IsAsync {
    return this.property.isAsync();
  }

  generate(mrng: Random, _runId?: number): NextValue<Ts> {
    return this.property.generate(mrng, undefined);
  }

  shrink(value: NextValue<Ts>): Stream<NextValue<Ts>> {
    return this.property.shrink(value);
  }

  run(v: Ts): ReturnType<INextRawProperty<Ts, IsAsync>['run']> {
    return this.property.run(v);
  }
}