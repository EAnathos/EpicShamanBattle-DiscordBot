import { SlashCommand } from '@/types';
import { SlashCommandBuilder, User } from 'discord.js';

export const command: SlashCommand = {
  name: 'event',
  data: new SlashCommandBuilder()
    .setName('event')
    .setDescription('Send your answer to the event.')
    .addStringOption((option) => option.setName('answer').setDescription('Your answer to the event').setRequired(true)),
  execute: async (interaction) => {
    const targetUserId = '306816615650033664';
    const sender = interaction.user;
    const answer = interaction.options.get('answer')!.value as string;

    try {
      // Fetch the target user
      const targetUser: User = await interaction.client.users.fetch(targetUserId);

      // Send a direct message to the target user
      await targetUser.send(
        `📩 **New event answer!**\n👤 Sent by: ${sender.tag} (${sender.id})\n📝 **Answer:** ${answer}`,
      );

      // Reply to the sender to confirm the message was sent
      await interaction.reply({ content: 'Your response has been successfully sent!', ephemeral: true });
    } catch (error) {
      console.error('Error sending DM:', error);
      await interaction.reply({ content: '❌ An error occurred while sending the message.', ephemeral: true });
    }
  },
};
