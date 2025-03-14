import { BotEvent } from '@/types';
import { Events, Interaction, EmbedBuilder, CategoryChannel, PermissionFlagsBits } from 'discord.js';
import { games } from '../slashCommands/game';

const INACTIVITY_LIMIT = 60 * 60 * 1000;

const event: BotEvent = {
  name: Events.InteractionCreate,
  once: false,
  async execute(interaction: Interaction) {
    if (!interaction.isButton()) return;
    await interaction.deferUpdate();

    const [action, , code] = interaction.customId.split('_');
    if (!games.has(code)) {
      await interaction.followUp({ content: 'Game not found.', ephemeral: true });
      return;
    }

    const game = games.get(code);
    const guild = interaction.guild;

    if (action === 'join') {
      if (game.players.includes(interaction.user.id)) {
        await interaction.followUp({ content: 'You have already joined this game.', ephemeral: true });
        return;
      }

      if (game.players.length >= 4) {
        await interaction.followUp({ content: 'This game is full.', ephemeral: true });
        return;
      }

      game.players.push(interaction.user.id);
      const joinMessage = `You have joined the game! Your game code is: **\`${code}\`**`;
      await interaction.user.send(joinMessage);
      await interaction.followUp({ content: joinMessage, ephemeral: true });
    }

    if (action === 'leave') {
      const index = game.players.indexOf(interaction.user.id);
      if (index === -1) {
        await interaction.followUp({ content: 'You are not in this game.', ephemeral: true });
        return;
      }

      game.players.splice(index, 1);
      await interaction.user.send('You have left the game.');

      if (interaction.user.id === game.creator) {
        clearTimeout(game.timeout);
        games.delete(code);
        if (game.voiceChannel) await game.voiceChannel.delete();
        if (game.textChannel) await game.textChannel.delete();
        if (game.message) {
          try {
            await game.message.delete();
          } catch (error) {
            console.error('Failed to delete game message:', error);
          }
        }
        await interaction.followUp({ content: 'The game has been deleted as the creator left.', ephemeral: true });
        return;
      }
    }

    if (action === 'launch') {
      if (interaction.user.id !== game.creator) {
        await interaction.followUp({ content: 'Only the game creator can launch the game.', ephemeral: true });
        return;
      }

      if (game.voiceChannel || game.textChannel) {
        await interaction.followUp({ content: 'The game is already launched.', ephemeral: true });
        return;
      }

      const category = guild!.channels.cache.get('1344331471560769668') as CategoryChannel;

      const voiceChannel = await guild!.channels.create({
        name: `「🎮🔊」game-${code}`,
        type: 2,
        parent: category,
        permissionOverwrites: [
          {
            id: guild!.roles.everyone.id,
            deny: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.Connect],
          },
          ...game.players.map((playerId: string) => ({
            id: playerId,
            allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.Connect, PermissionFlagsBits.Speak],
          })),
        ],
      });
      game.voiceChannel = voiceChannel;

      const textChannel = await guild!.channels.create({
        name: `「🎮💬」game-${code}`,
        type: 0,
        parent: category,
        permissionOverwrites: [
          {
            id: guild!.roles.everyone.id,
            deny: [PermissionFlagsBits.ViewChannel],
          },
          ...game.players.map((playerId: string) => ({
            id: playerId,
            allow: [
              PermissionFlagsBits.ViewChannel,
              PermissionFlagsBits.SendMessages,
              PermissionFlagsBits.ReadMessageHistory,
            ],
          })),
        ],
      });
      game.textChannel = textChannel;

      await textChannel.send('🎮 The game has started! Use this channel to communicate.');

      for (const playerId of game.players) {
        const user = await interaction.client.users.fetch(playerId);
        await user
          .send(
            `The game has started! Here are your channels:\n- Voice Channel: <#${voiceChannel.id}>\n- Text Channel: <#${textChannel.id}>`,
          )
          .catch(() => console.log(`Failed to send DM to ${user.tag}`));
      }

      game.inactivityTimeout = setTimeout(async () => {
        if (textChannel && voiceChannel) {
          await textChannel.delete().catch(console.error);
          await voiceChannel.delete().catch(console.error);
        }
        games.delete(code);
      }, INACTIVITY_LIMIT);
    }

    const updatedEmbed = new EmbedBuilder()
      .setTitle(`Game created by ${interaction.guild!.members.cache.get(game.creator)?.user.username || 'Unknown'}`)
      .setDescription('To join this game, click the `Join Game` button below.')
      .addFields(
        {
          name: '**Players**',
          value: game.players.length ? game.players.map((id: string) => `<@${id}>`).join('\n') : 'No players yet.',
          inline: true,
        },
        {
          name: '**Difficulty**',
          value: game.difficulty,
          inline: true,
        },
        { name: 'Server', value: game.server, inline: true },
      )
      .setColor('#00AE86');

    await interaction.editReply({ embeds: [updatedEmbed] });
  },
};

export default event;
