import { cloneMethod } from '../../symbols.ts';
import { CommandWrapper } from './CommandWrapper.ts';

/**
 * Iterable datastructure accepted as input for asyncModelRun and modelRun
 */
// eslint-disable-next-line @typescript-eslint/ban-types
export class CommandsIterable<Model extends object, Real, RunResult, CheckAsync extends boolean = false>
  implements Iterable<CommandWrapper<Model, Real, RunResult, CheckAsync>>
{
  constructor(
    readonly commands: CommandWrapper<Model, Real, RunResult, CheckAsync>[],
    readonly metadataForReplay: () => string
  ) {}
  [Symbol.iterator](): Iterator<CommandWrapper<Model, Real, RunResult, CheckAsync>> {
    return this.commands[Symbol.iterator]();
  }
  [cloneMethod](): CommandsIterable<Model, Real, RunResult, CheckAsync> {
    return new CommandsIterable(
      this.commands.map((c) => c.clone()),
      this.metadataForReplay
    );
  }
  toString(): string {
    const serializedCommands = this.commands
      .filter((c) => c.hasRan)
      .map((c) => c.toString())
      .join(',');
    const metadata = this.metadataForReplay();
    return metadata.length !== 0 ? `${serializedCommands} /*${metadata}*/` : serializedCommands;
  }
}
