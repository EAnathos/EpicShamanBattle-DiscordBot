import { Client } from 'discord.js';
import { readdirSync } from 'fs';
import { join } from 'path';
import { BotEvent } from '@/types';

module.exports = (client: Client) => {
  const eventsDir = join(__dirname, '../events');

  readdirSync(eventsDir).forEach((file) => {
    if (!file.endsWith('.js')) return;

    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const event: BotEvent = require(`${eventsDir}/${file}`).default;

    if (event.once) {
      client.once(event.name, (...args) => event.execute(...args));
    } else {
      client.on(event.name, (...args) => event.execute(...args));
    }

    console.log(`🌠 Successfully loaded event ${event.name}`);
  });
};
