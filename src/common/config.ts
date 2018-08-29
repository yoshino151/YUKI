import * as fs from "fs";
import * as yaml from "js-yaml";
import logger from "./logger";

export default class Config {
  private _filename: string;
  private _config: any;

  constructor(filename: string, defaultObject?: any) {
    this._filename = filename;
    if (!fs.existsSync(filename)) {
      // check & make ./config folder
      if (!fs.existsSync("config")) {
        fs.mkdirSync("config");
        logger.debug("created ./config folder");
      }
      this._config = defaultObject;
      this.save();
    } else {
      this.load();
    }
  }

  load() {
    try {
      this._config = yaml.safeLoad(fs.readFileSync(this._filename, "utf8"));
      logger.debug(`config ${this._filename} loaded: `);
      logger.debug(this._config);
    } catch (e) {
      let err = new Error(`config file ${this._filename} load failed`);
      logger.error(err);
    }
  }

  save() {
    try {
      fs.writeFileSync(this._filename, yaml.safeDump(this._config), "utf8");
      logger.debug(`config saved: `);
      logger.debug(this._config);
    } catch (e) {
      logger.error(`config file ${this._filename} save failed`);
      logger.error(e);
    }
  }

  get() {
    return this._config;
  }

  set(cfg: any) {
    this._config = cfg;
    this.save();
  }

  fileName() {
    return this._filename;
  }
}
