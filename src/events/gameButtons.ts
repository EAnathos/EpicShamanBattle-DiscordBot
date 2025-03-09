import { BotEvent } from '@/types';
import { Events, Interaction, EmbedBuilder } from 'discord.js';
import { games } from '../slashCommands/game';

const event: BotEvent = {
  name: Events.InteractionCreate,
  once: false,
  async execute(interaction: Interaction) {
    if (!interaction.isButton()) return;

    const [action, , code] = interaction.customId.split('_');
    if (!games.has(code)) {
      await interaction.reply({ content: 'Game not found.', ephemeral: true });
      return;
    }

    const game = games.get(code);

    if (action === 'join') {
      if (game.players.includes(interaction.user.id)) {
        await interaction.reply({ content: 'You have already joined this game.', ephemeral: true });
        return;
      }
      game.players.push(interaction.user.id);
      await interaction.user.send(`You have joined the game! Your game code is: **${code}**`);
    }

    if (action === 'leave') {
      const index = game.players.indexOf(interaction.user.id);
      if (index === -1) {
        await interaction.reply({ content: 'You are not in this game.', ephemeral: true });
        return;
      }

      game.players.splice(index, 1);
      await interaction.user.send('You have left the game.');

      if (interaction.user.id === game.creator) {
        clearTimeout(game.timeout);
        games.delete(code);

        if (game.message) {
          try {
            await game.message.delete();
          } catch (error) {
            console.error('Failed to delete game message:', error);
          }
        }

        await interaction.reply({ content: 'The game has been deleted as the creator left.', ephemeral: true });
        return;
      }
    }

    const updatedEmbed = new EmbedBuilder()
      .setTitle(`Game created by ${interaction.guild!.members.cache.get(game.creator)?.user.username || 'Unknown'}`)
      .setDescription('To join this game, click the `Join Game` button below.')
      .addFields({
        name: '**Players**',
        value: game.players.length ? game.players.map((id: string) => `<@${id}>`).join('\n') : 'No players yet.',
        inline: true,
      })
      .setColor('#00AE86');

    await interaction.update({ embeds: [updatedEmbed] });
  },
};

export default event;
