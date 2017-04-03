"use strict"
import log4js from "log4js";
import { logger as logConfig } from '../config';

console.log(logConfig);
log4js.configure(logConfig);

let logger = log4js.getLogger("normal");

export default logger;
