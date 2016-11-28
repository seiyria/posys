
import { Logger } from './logger';

console.log('Starting server');

const kill = () => process.exit();

const config = require('./server.config.json');

if(!config) {
  Logger.error('Init', 'No server.config.json file exists.');
  kill();
}

export const start = () => {
  const express = require('express');

}
