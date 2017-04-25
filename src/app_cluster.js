'use strict';
import os from 'os';
import cluster from 'cluster';
import logger from './libs/logger';
import startServer from './app';

function startWorker() {
  let worker = cluster.fork();
  logger.info(`CLUSTER: Worker ${worker.id} started`);
}

if (cluster.isMaster) {
  os.cpus().forEach(() => { startWorker(); });

  // 记录所有的断开线程，如果工作线程断开类，应该退出
  // 因此我们可以等待exit事件然后重启一个新进程替代
  //
  cluster.on('disconnect', (worker) => {
    logger.info(`CLUSTER: Worker ${worker.id} disconnected from the cluster`);
  });

  // 当一个工作进程退出时，创建一个新的
  //
  cluster.on('exit', (worker, code, signal) => {
    logger.info(`CLUSTER: Worker ${worker.id} died with exit code ${code}(${signal})`);
    startWorker();
  });

} else {
  startServer();
}
