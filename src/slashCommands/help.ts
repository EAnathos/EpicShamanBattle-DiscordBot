import { SlashCommand } from '@/types';
import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';

export const command: SlashCommand = {
  name: 'help',
  data: new SlashCommandBuilder().setName('help').setDescription('Displays information about available commands.'),
  execute: async (interaction) => {
    const embed = new EmbedBuilder()
      .setTitle('Available Commands')
      .setColor('#00AE86')
      .setDescription('Here are the available commands and their descriptions:')
      .addFields(
        {
          name: '/game',
          value:
            'Allows you to create a game and invite your friends.\n' +
            '- **code**: The 4-digit code for the game.\n' +
            '- **<server>**: Choose the server: Global (default) or Asia.\n' +
            '- **<player1>, <player2>, <player3>**: Optional players to invite',
          inline: false,
        },
        {
          name: '/beast',
          value:
            'Retrieves information about a beast.\n' + '- **name**: The name of the beast to retrieve information for.',
          inline: false,
        },
      )
      .setFooter({
        text: 'Note: Parameters inside <> are optional.',
        iconURL: interaction.client.user?.displayAvatarURL(),
      });

    await interaction.reply({ embeds: [embed] });
  },
};
