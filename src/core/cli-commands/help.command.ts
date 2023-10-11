import chalk from 'chalk';
import { ICliCommand } from './cli-command.interface.js';

export class HelpCommand implements ICliCommand {
  readonly name = '--help';

  public async execute(): Promise<void> {
    console.log(chalk.green('Программа для подготовки данных для REST API сервера.'))
    console.log(chalk.green('Пример: ')
      + chalk.blue('ts-node ./src/main.cli.ts ')
      + chalk.yellow('--<command> [--arguments]'));
    console.log(chalk.green('\tКоманды: '));
    console.log(chalk.green('\t--')
      + chalk.red('h')
      + chalk.yellow('e')
      + chalk.green('l')
      + chalk.blue('p')
      + chalk.bgBlackBright.whiteBright('\t\t\t#выводит этот текст'));
    console.log(chalk.green('\t--version:')
      + chalk.bgBlackBright.whiteBright('\t\t#выводит информацию о версии приложения'));
    console.log(chalk.green('\t--import ')
      + chalk.yellow('<path>')
      + chalk.bgBlackBright.whiteBright('\t\t#импортирует данные из *.tsv файла и выводит результат в консоль'))
  }
}
