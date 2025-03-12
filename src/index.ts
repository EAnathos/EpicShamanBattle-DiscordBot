import * as dotenv from 'dotenv';
import { Client, Collection, GatewayIntentBits } from 'discord.js';
import { SlashCommand } from '@/types';
import { join } from 'path';
import { readdirSync } from 'fs';
import { loadData } from './utils/dataLoader';

loadData();

dotenv.config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.DirectMessages,
  ],
});

client.slashCommands = new Collection<string, SlashCommand>();

const handlersDir = join(__dirname, './handlers');

readdirSync(handlersDir).forEach((handler) => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  require(`${handlersDir}/${handler}`)(client);
});

client.login(process.env.TOKEN);
