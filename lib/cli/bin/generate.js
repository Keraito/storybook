import program from 'commander';
import chalk from 'chalk';
import pkg from '../package.json';
import initiate from '../lib/initiate';
import yarnSpawnSync from '../lib/yarn_spawn_sync';
import { codeLog } from '../lib/helpers';
import add from '../lib/add';

const logger = console;

if (process.argv[1].includes('getstorybook')) {
  logger.log(chalk.yellow('WARNING: getstorybook is deprecated.'));
  logger.log(chalk.yellow('The official command to install Storybook from now on is:\n'));
  codeLog(['storybook init']);
  logger.log();
  initiate({}, pkg);
  process.exit(0);
}

program
  .command('init')
  .description('Initialize Storybook into your project.')
  .option('-f --force', 'Forcely add storybook')
  .option('-s --skip-install', 'Skip installing deps')
  .option('-N --use-npm', 'Use npm to install deps')
  .option('-p --parser <babel | babylon | flow>', 'jscodeshift parser')
  .option('-t --type <type>', 'Add Storybook for a specific project type')
  .action(options => initiate(options, pkg));

program
  .command('start')
  .description('Start the local Storybook server')
  .option('-N --use-npm', 'Use NPM to start the Storybook server')
  .action(options => yarnSpawnSync(options, ['run', 'storybook']));

program
  .command('build')
  .description('Build the Storybook static application')
  .option('-N --use-npm', 'Use NPM to build the Storybook server')
  .action(options => yarnSpawnSync(options, ['build', 'storybook']));

program
  .command('add <addon>')
  .description('Add an addon to your Storybook')
  .option('-N --use-npm', 'Use NPM to build the Storybook server')
  .action((addonName, options) => add(addonName, options));

program.command('*', { noHelp: true }).action(cmd => {
  logger.error('Invalid command: %s.\nSee --help for a list of available commands.', cmd);
  process.exit(1);
});

program.version(pkg.version).parse(process.argv);

if (!program.args.length) {
  program.help();
}
