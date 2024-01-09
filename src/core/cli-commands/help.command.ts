import chalk from 'chalk';
import { CliCommandInterface } from './cli-command.interface.js';

export class HelpCommand implements CliCommandInterface {
  readonly name = '--help';

  public async execute(): Promise<void> {
    console.log(chalk.green('Программа для подготовки данных для REST API сервера.'));
    console.log(chalk.green('Пример: ')
      + chalk.blue('ts-node ./src/main.cli.ts ')
      + chalk.yellow('--<command> [--arguments]'));
    console.log(chalk.green('\tКоманды: '));
    console.log(chalk.green('\t--')
      + chalk.red('h')
      + chalk.yellow('e')
      + chalk.green('l')
      + chalk.blue('p')
      + chalk.bgBlackBright.whiteBright('\t\t\t\t\t#выводит этот текст'));
    console.log(chalk.green('\t--version:')
      + chalk.bgBlackBright.whiteBright('\t\t\t\t#выводит информацию о версии приложения'));
    console.log(chalk.green('\t--import ')
      + chalk.yellow('<path>')
      + chalk.bgBlackBright.whiteBright('\t\t\t\tt#импортирует данные из *.tsv файла и выводит результат в консоль'));
    console.log(chalk.green('\t--generate ')
      + chalk.yellow('<count> ')
      + chalk.yellow('<path> ')
      + chalk.yellow('<url>')
      + chalk.bgBlackBright.whiteBright('\t\t#генерирует случайные предложения из готового набора данных.\n' +
        '\t\t\t\t\t\tcount -- количество генерируемых предложений\n' +
        '\t\t\t\t\t\tpath -- путь до файла, в который нужно сохранить сгенерированные предложения\n' +
        '\t\t\t\t\t\turl -- url сервера, предоставляющего данные для генерации'));
  }
}
