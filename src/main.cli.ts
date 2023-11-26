#!/usr/bin/env node
import { CLIApplication } from './app/cli.js';
import { HelpCommand } from './core/cli-commands/help.command.js';
import { ImportCommand } from './core/cli-commands/import.command.js';
import { VersionCommand } from './core/cli-commands/version.command.js';
import { GenerateCommand } from './core/cli-commands/generate.command.js';

const cliApplication = new CLIApplication();
cliApplication.registerCommands([new HelpCommand, new VersionCommand, new ImportCommand, new GenerateCommand]);
cliApplication.processCommand(process.argv);
