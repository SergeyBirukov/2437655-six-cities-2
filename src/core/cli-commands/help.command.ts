import { ICliCommand } from './cli-command.interface';

export class HelpCommand implements ICliCommand {
  readonly name = '--help';

  public async execute(): Promise<void> {
    console.log(`
    Программа для подготовки данных для REST API сервера.

    Пример: cli.js --<command> [--arguments]

    Команды:
      --help:           #выводит этот текст
      --version:        #выводит информацию о версии приложения
      --import <path>   #импортирует данные из *.tsv файла и выводит результат в консоль`)
  }

}
