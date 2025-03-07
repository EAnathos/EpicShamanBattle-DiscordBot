import { SlashCommand } from '@/types';
import { beastData } from '../utils/dataLoader';
import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';

export const command: SlashCommand = {
  name: 'beast',
  data: new SlashCommandBuilder()
    .setName('beast')
    .setDescription('Retrieves information about a beast.')
    .addStringOption((option) =>
      option
        .setName('name')
        .setDescription('The name of the beast to retrieve information for.')
        .setRequired(true)
        .addChoices({ name: 'Archmage [One]', value: 'ArchmageOne' })
        .addChoices({ name: 'General Tremen', value: 'GeneralTremen' })
        .addChoices({ name: 'Grim Reaper Profy', value: 'GrimReaperProfy' })
        .addChoices({ name: 'Guard Captain Toji', value: 'GuardCaptainToji' })
        .addChoices({ name: 'High Priest Fuzzy', value: 'HighPriestFuzzy' })
        .addChoices({ name: 'Icicle III', value: 'IcicleIII' })
        .addChoices({ name: 'Jar. Meow', value: 'JarMeow' })
        .addChoices({ name: 'Mouse Tyson', value: 'MouseTyson' })
        .addChoices({ name: 'Muscle Beauty Bibi', value: 'MuscleBeautyBibi' })
        .addChoices({ name: 'Nice Skin Burber', value: 'NiceSkinBurber' })
        .addChoices({ name: 'Old Man Scrow', value: 'OldManScrow' })
        .addChoices({ name: 'Racoon  Man', value: 'RacoonMan' })
        .addChoices({ name: 'Rock Keeper Boboo', value: 'RockKeeperBoboo' })
        .addChoices({ name: 'Sage Roly-Poly Chu', value: 'SageRolyPolyChu' }),
    ),
  execute: async (interaction) => {
    const beastName = interaction.options.get('name', true)!.value as string;
    const beast = beastData[beastName];

    if (!beast) {
      await interaction.reply({ content: 'Beast not found.', ephemeral: true });
      return;
    }

    const embed = new EmbedBuilder()
      .setTitle(`${beast.name}`)
      .setColor('#00AE86')
      .setThumbnail(beast.image)
      .addFields({
        name: ':scroll: New Abilities',
        value: beast.NewAbilities
          ? `- **Lv 3:** ${beast.NewAbilities.Lv3}\n` +
            `- **Lv 6:** ${beast.NewAbilities.Lv6}\n` +
            `- **Lv 9:** ${beast.NewAbilities.Lv9}\n` +
            `- **Lv 12:** ${beast.NewAbilities.Lv12}\n` +
            `- **Lv 15:** ${beast.NewAbilities.Lv15}`
          : 'No abilities available',
      });

    if (beast.AttackDamage) {
      const attackDamageLines = Object.entries(beast.AttackDamage).map(([level, damage]) => `**${level}:** ${damage}`);

      if (attackDamageLines.length > 0) {
        embed.addFields({
          name: ':crossed_swords: Attack Damage',
          value: attackDamageLines.slice(0, 5).join('\n'),
          inline: true,
        });

        for (let i = 5; i < attackDamageLines.length; i += 5) {
          embed.addFields({
            name: '\u200B\u200B\u200B\u200B\u200B\u200B\u200B',
            value: attackDamageLines.slice(i, i + 5).join('\n'),
            inline: true,
          });
        }
      }
    }

    await interaction.reply({ embeds: [embed] });
  },
};
