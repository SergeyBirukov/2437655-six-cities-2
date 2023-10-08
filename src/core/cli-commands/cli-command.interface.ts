export interface ICliCommand {
  readonly name: string;
  execute(...params: string[]): void;
}
