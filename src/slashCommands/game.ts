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
    )
    .addUserOption((option) => option.setName('player1').setDescription('First player to invite').setRequired(false))
    .addUserOption((option) => option.setName('player2').setDescription('Second player to invite').setRequired(false))
    .addUserOption((option) => option.setName('player3').setDescription('Third player to invite').setRequired(false)),
  execute: async (interaction) => {
    const code = interaction.options.get('code', true)!.value as string;
    const invitedPlayers = [
      interaction.options.get('player1'),
      interaction.options.get('player2'),
      interaction.options.get('player3'),
    ].filter(Boolean);

    if (!/^[0-9]{4}$/.test(code)) {
      await interaction.reply({ content: 'Invalid code. Please provide a 4-digit code.', ephemeral: true });
      return;
    }

    if (games.has(code)) {
      await interaction.reply({ content: 'A game with this code already exists.', ephemeral: true });
      return;
    }

    const players = [interaction.user.id, ...invitedPlayers.map((player) => player!.user!.id)];

    games.set(code, {
      creator: interaction.user.id,
      players,
      timeout: setTimeout(() => games.delete(code), 15 * 60 * 1000),
      voiceChannel: null,
    });

    await interaction.user.send(`You have created a new game with the code: **${code}**.`).catch(() => {
      interaction.reply({
        content: 'I cannot send you a private message. Please make sure your DMs are enabled.',
        ephemeral: true,
      });
      return;
    });

    for (const player of invitedPlayers) {
      const user = player!.user;
      await user!
        .send(`You have been invited to a game! Your game code is: **\`${code}\`**.`)
        .catch(() => console.log(`Failed to send DM to ${user!.tag}`));
    }

    const embed = new EmbedBuilder()
      .setTitle(`New game created by ${interaction.user.username}`)
      .setDescription('To join this game, click the `Join Game` button below.')
      .addFields({ name: 'Players', value: players.map((id) => `<@${id}>`).join('\n'), inline: true })
      .setColor('#00AE86');

    const buttons = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder().setCustomId(`join_game_${code}`).setLabel('Join Game').setStyle(ButtonStyle.Primary),
      new ButtonBuilder().setCustomId(`leave_game_${code}`).setLabel('Leave Game').setStyle(ButtonStyle.Danger),
      new ButtonBuilder().setCustomId(`launch_game_${code}`).setLabel('Launch Game').setStyle(ButtonStyle.Success),
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
      players,
      timeout: setTimeout(() => games.delete(code), 15 * 60 * 1000),
      message,
      voiceChannel: null,
    });
  },
};
