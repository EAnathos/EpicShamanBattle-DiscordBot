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
        .addChoices(
          { name: 'Archmage [One]', value: 'ArchmageOne' },
          { name: 'General Tremen', value: 'GeneralTremen' },
          { name: 'Grim Reaper Profy', value: 'GrimReaperProfy' },
          { name: 'Guard Captain Toji', value: 'GuardCaptainToji' },
          { name: 'High Priest Fuzzy', value: 'HighPriestFuzzy' },
          { name: 'Icicle III', value: 'IcicleIII' },
          { name: 'Jar. Meow', value: 'JarMeow' },
          { name: 'Mouse Tyson', value: 'MouseTyson' },
          { name: 'Muscle Beauty Bibi', value: 'MuscleBeautyBibi' },
          { name: 'Nice Skin Burber', value: 'NiceSkinBurber' },
          { name: 'Old Man Scrow', value: 'OldManScrow' },
          { name: 'Racoon Man', value: 'RacoonMan' },
          { name: 'Rock Keeper Boboo', value: 'RockKeeperBoboo' },
          { name: 'Sage Roly-Poly Chu', value: 'SageRolyPolyChu' },
        ),
    ),
  execute: async (interaction) => {
    const beastName = interaction.options.get('name', true)!.value as string;
    const beast = beastData[beastName];

    if (!beast) {
      await interaction.reply({ content: 'Beast not found.', ephemeral: true });
      return;
    }

    const embed = new EmbedBuilder().setTitle(`${beast.name}`).setColor('#00AE86').setThumbnail(beast.image);

    if (beast.skills) {
      const skillsValue = beast.skills
        .map((skill: { name: string; description: string }) => `- **${skill.name}**: ${skill.description}`)
        .join('\n');
      embed.addFields({ name: ':magic_wand: Skills', value: skillsValue });
    }

    embed.addFields({
      name: ':scroll: New Abilities',
      value: beast.NewAbilities
        ? `- **Lv 3:** ${beast.NewAbilities.Lv3}\n` +
          `- **Lv 6:** ${beast.NewAbilities.Lv6}\n` +
          `- **Lv 9:** ${beast.NewAbilities.Lv9}\n` +
          `- **Lv 12:** ${beast.NewAbilities.Lv12}\n` +
          `- **Lv 15:** ${beast.NewAbilities.Lv15}`
        : 'No abilities available',
    });

    const addStatField = (
      statName: string,
      statData: { [s: string]: unknown } | ArrayLike<unknown> | undefined,
      icon: string,
    ) => {
      if (statData) {
        const statLines = Object.entries(statData).map(([level, value]) => `**${level}:** ${value}`);
        if (statLines.length > 0) {
          embed.addFields({
            name: `${icon} ${statName}`,
            value: statLines.slice(0, 5).join('\n'),
            inline: true,
          });
          for (let i = 5; i < statLines.length; i += 5) {
            embed.addFields({
              name: '\u200B',
              value: statLines.slice(i, i + 5).join('\n'),
              inline: true,
            });
          }
        }
      }
    };

    addStatField('Attack Damage', beast.AttackDamage, ':crossed_swords:');
    addStatField('Recovery Rate', beast.RecoveryRate, ':green_heart:');
    addStatField('Spell Damage Increase', beast.SpellDamageIncrease, ':sparkles:');
    addStatField('Gold Gains', beast.GoldGains, '<:I_Coin:1347137020413083690>');
    addStatField('Soul Gains', beast.SoulGains, '<:I_Soul:1347137053241905205>');
    addStatField('Payday Skill Cooldown', beast.PaydaySkillCooldown, ':hourglass_flowing_sand:');
    addStatField(
      'Leap Through Time CD Reduction',
      beast.LeapThroughTimeSpellCooldownReduction,
      ':hourglass_flowing_sand:',
    );

    await interaction.reply({ embeds: [embed] });
  },
};
