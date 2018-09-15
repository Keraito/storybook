import { sync as spawnSync } from 'cross-spawn';
import hasYarn from './has_yarn';
import latestVersion from './latest_version';
import { commandLog } from './helpers';

const logger = console;
const storybookAddonScope = '@storybook/addon-';

const isStorybookAddon = async (name, npmOptions) => {
  try {
    await latestVersion(npmOptions, `${storybookAddonScope}${name}`);
    return true;
  } catch (e) {
    return false;
  }
};

const installAddon = (addonName, npmOptions) => {
  const prepareDone = commandLog(`Preparing to install the ${addonName} Storybook addon`);
  prepareDone();
  logger.log();

  let result;
  if (npmOptions.useYarn) {
    result = spawnSync('yarn', ['add', `${storybookAddonScope}${addonName}`, '--dev'], {
      stdio: 'inherit',
    });
  } else {
    result = spawnSync('npm', ['install', `${storybookAddonScope}${addonName}`, '--save-dev'], {
      stdio: 'inherit',
    });
  }

  logger.log();
  const installDone = commandLog(`Installing the ${addonName} Storybook addon`);
  if (result.status !== 0) {
    installDone(`Something went wrong installing the addon: "${storybookAddonScope}${addonName}"`);
    logger.log();
    process.exit(1);
  }
  installDone();
  logger.log();
};

export default async function add(addonName, options) {
  const useYarn = Boolean(options.useNpm !== true) && hasYarn();
  const npmOptions = {
    useYarn,
  };
  const storybookCheckDone = commandLog(`Verifying that ${addonName} is a Storybook addon`);
  if (await isStorybookAddon(addonName, npmOptions)) {
    storybookCheckDone();
    installAddon(addonName, npmOptions);
  } else {
    storybookCheckDone(`The provided package was not a Storybook addon: ${addonName}.`);
  }
}