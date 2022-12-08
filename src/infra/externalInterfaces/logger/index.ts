import fs from 'fs';
import { Console } from 'console';

const logger = new Console({
  stdout: fs.createWriteStream('./stdout'),
  stderr: fs.createWriteStream('./stderr'),
});

export default {
  log(value: any) {
    logger.log(`[${new Date().toLocaleString()}] :`, value);
  },
  error(value: any) {
    logger.error(`[${new Date().toLocaleString()}] :`, value);
  },
};
