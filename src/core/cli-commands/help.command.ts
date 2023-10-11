import { ICliCommand } from './cli-command.interface.js';

export class HelpCommand implements ICliCommand {
  readonly name = '--help';

  public async execute(): Promise<void> {
    console.log(`
    Программа для подготовки данных для REST API сервера.

    Пример: ts-node ./src/main.cli.ts --<command> [--arguments]

    Команды:
      --help:           #выводит этот текст
      --version:        #выводит информацию о версии приложения
      --import <path>   #импортирует данные из *.tsv файла и выводит результат в консоль
`);
  }

}
