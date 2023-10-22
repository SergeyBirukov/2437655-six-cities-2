import { ICliCommand } from './cli-command.interface.js';
import path from 'node:path';
import { readFileSync } from 'node:fs';

export class VersionCommand implements ICliCommand {
  readonly name = '--version';
  private version?: string;

  public async execute(): Promise<void> {
    if(this.version){
      console.log(this.version);
      return;
    }
    const contentPageJSON = readFileSync(path.resolve('./package.json'), 'utf-8');
    const content = JSON.parse(contentPageJSON);
    this.version = content.version;
    console.log(this.version);
  }
}
