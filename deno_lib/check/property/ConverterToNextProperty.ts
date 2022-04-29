import { Random } from '../../random/generator/Random.ts';
import { Stream } from '../../stream/Stream.ts';
import { fromShrinkableToNextValue } from '../arbitrary/definition/ConverterToNext.ts';
import { NextValue } from '../arbitrary/definition/NextValue.ts';
import { Shrinkable } from '../arbitrary/definition/Shrinkable.ts';
import { PreconditionFailure } from '../precondition/PreconditionFailure.ts';
import { INextRawProperty } from './INextRawProperty.ts';
import { IRawProperty } from './IRawProperty.ts';

const identifier = '__ConverterToNextProperty__';

/** @internal */
export class ConverterToNextProperty<Ts, IsAsync extends boolean> implements INextRawProperty<Ts, IsAsync> {
  [identifier] = true;
  static isConverterToNext<Ts, IsAsync extends boolean>(
    property: INextRawProperty<Ts, IsAsync>
  ): property is ConverterToNextProperty<Ts, IsAsync> {
    return identifier in property;
  }

  constructor(readonly property: IRawProperty<Ts, IsAsync>) {}

  isAsync(): IsAsync {
    return this.property.isAsync();
  }

  generate(mrng: Random, runId?: number): NextValue<Ts> {
    const shrinkable = this.property.generate(mrng, runId);
    return fromShrinkableToNextValue(shrinkable);
  }

  shrink(value: NextValue<Ts>): Stream<NextValue<Ts>> {
    if (this.isSafeContext(value.context)) {
      return value.context.shrink().map(fromShrinkableToNextValue);
    }
    return Stream.nil();
  }
  private isSafeContext(context: unknown): context is Shrinkable<Ts> {
    return (
      context != null && typeof context === 'object' && 'value' in (context as any) && 'shrink' in (context as any)
    );
  }

  run(
    v: Ts
  ):
    | (IsAsync extends true ? Promise<string | PreconditionFailure | null> : never)
    | (IsAsync extends false ? string | PreconditionFailure | null : never) {
    return this.property.run(v);
  }
}
