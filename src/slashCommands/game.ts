import { SlashCommand } from '@/types';
import { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } from 'discord.js';

export const games = new Map();

export const command: SlashCommand = {
  name: 'game',
  data: new SlashCommandBuilder()
    .setName('game')
    .setDescription('Allows you to create a game and invite your friends.')
    .addStringOption((option) =>
      option.setName('code').setDescription('The 4-digit code for the game you created.').setRequired(true),
    ),
  execute: async (interaction) => {
    const code = interaction.options.get('code', true)!.value as string;

    if (!/^[0-9]{4}$/.test(code)) {
      await interaction.reply({ content: 'Invalid code. Please provide a 4-digit code.', ephemeral: true });
      return;
    }

    if (games.has(code)) {
      await interaction.reply({ content: 'A game with this code already exists.', ephemeral: true });
      return;
    }

    games.set(code, {
      creator: interaction.user.id,
      players: [interaction.user.id], // Add the creator to the players list
      timeout: setTimeout(() => games.delete(code), 15 * 60 * 1000),
    });

    await interaction.user.send(`You have created a new game with the code: **${code}**.`).catch(() => {
      interaction.reply({
        content: 'I cannot send you a private message. Please make sure your DMs are enabled.',
        ephemeral: true,
      });
      return;
    });

    const embed = new EmbedBuilder()
      .setTitle(`New game created by ${interaction.user.username}`)
      .setDescription('To join this game, click the `Join Game` button below.')
      .addFields({ name: 'Players', value: `<@${interaction.user.id}>`, inline: true })
      .setColor('#00AE86');

    const buttons = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder().setCustomId(`join_game_${code}`).setLabel('Join Game').setStyle(ButtonStyle.Primary),
      new ButtonBuilder().setCustomId(`leave_game_${code}`).setLabel('Leave Game').setStyle(ButtonStyle.Danger),
    );

    const message = await interaction.reply({
      content: '<@&1347622250026766356>',
      embeds: [embed],
      components: [buttons],
      allowedMentions: { roles: ['1347622250026766356'] },
      fetchReply: true,
    });

    games.set(code, {
      creator: interaction.user.id,
      players: [interaction.user.id],
      timeout: setTimeout(() => games.delete(code), 15 * 60 * 1000),
      message,
    });
  },
};
