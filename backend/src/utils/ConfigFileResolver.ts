/**
 * The purpose of this class is to wrap the logic to resolve a config file.
 * The steps to resolve work as follow:
 *  1. First, it will try to read the first argument passed to the program.
 *  2. If it doesn't find anything, it will read from the environment variable
 *     DIFFY_CONFIG_FILE.
 *  3. If none of the above resolves a file name, it will read NODE_ENV from the environment
 *     and will use './config' if on production, './confid_dev' otherwise.
 */
export class ConfigFileResolver {
  static resolve(argv: string[], env: NodeJS.ProcessEnv) {
    var config_file = argv[2];
    if (config_file) {
      console.info(`Using config file provided: ${config_file}`)
    } else {
      if (env["NODE_ENV"] == "production") {
        config_file = './config';
      } else {
        config_file = './config_dev';
      }
    }
    return config_file;
  }

}