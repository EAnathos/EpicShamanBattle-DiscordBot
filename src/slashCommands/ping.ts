import { SlashCommand } from '@/types';
import { SlashCommandBuilder } from 'discord.js';

export const command: SlashCommand = {
  name: 'ping',
  data: new SlashCommandBuilder().setName('ping').setDescription('Affiche le ping du bot'),
  execute: async (interaction) => {
    await interaction.reply({
      content: `🏓 Pong! \n 📡 Ping: ${interaction.client.ws.ping}`,
      ephemeral: true,
    });
  },
};
