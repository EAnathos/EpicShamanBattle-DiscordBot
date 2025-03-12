import { BotEvent } from '@/types';
import { Events, GuildMember } from 'discord.js';

const event: BotEvent = {
  name: Events.GuildMemberAdd,
  once: false,
  execute(member: GuildMember) {
    console.log(`👤 New member: ${member.user.tag}`);

    member
      .send(
        `👋 Welcome to the server, ${member.user.username}!\n\n` +
          `To access the rest of the server, please accept the rules in the channel <#1347142241365266493>.\n` +
          `Once you've accepted the rules, you can select your roles in <#1347621597581807616> based on the notifications you want to receive or your progress in the game.\n\n` +
          `For discussions about the game, join <#1342582088292892672> and <#1347585742234321018>.\n` +
          `We provide guides in <#1347146103212212294> to help you.\n\n` +
          `If you're looking for a match, use <@1347578952486748180> with the command \`/game\` in one of these channels:\n` +
          `- <#1344328702569222144>\n- <#1344328767426002996>\n\n` +
          `For more information about the bot commands, type \`/help\` in <#1347614821763256432>.`,
      )
      .catch((err) => console.error(`❌ Failed to send a DM to ${member.user.tag}:`, err));
  },
};

export default event;
