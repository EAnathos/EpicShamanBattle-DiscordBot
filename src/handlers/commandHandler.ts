import { Client, RESTPostAPIApplicationCommandsJSONBody, REST, Routes } from 'discord.js';
import { readdirSync } from 'fs';
import { join } from 'path';
import { SlashCommand } from '@/types';

module.exports = async (client: Client) => {
  const slashCommandsDir = join(__dirname, '../slashCommands');
  const body: RESTPostAPIApplicationCommandsJSONBody[] = [];

  readdirSync(slashCommandsDir).forEach((file) => {
    if (!file.endsWith('.js')) return;

    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const command: SlashCommand = require(`${slashCommandsDir}/${file}`).command;

    client.slashCommands.set(command.name, command);
    body.push(command.data.toJSON());
  });

  const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

  try {
    await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), { body: body });
    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error);
  }
};
