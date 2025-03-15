import { SlashCommand } from '@/types';
import { spellData } from '../utils/dataLoader';
import { SlashCommandBuilder, EmbedBuilder, ColorResolvable } from 'discord.js';

export const command: SlashCommand = {
  name: 'spell',
  data: new SlashCommandBuilder()
    .setName('spell')
    .setDescription('Retrieve information about a spell.')
    .addSubcommand((subcommand) =>
      subcommand
        .setName('fire')
        .setDescription('Retrieve information about a fire spell.')
        .addStringOption((option) =>
          option
            .setName('name')
            .setDescription('The name of the fire spell to retrieve information for.')
            .setRequired(true)
            .addChoices({ name: 'Meteor', value: 'Meteor' }),
        ),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('water')
        .setDescription('Retrieve information about a water spell.')
        .addStringOption((option) =>
          option
            .setName('name')
            .setDescription('The name of the water spell to retrieve information for.')
            .setRequired(true)
            .addChoices({ name: 'Tidal Wave', value: 'TidalWave' })
            .addChoices({ name: 'Ice Lightning', value: 'IceLightning' })
            .addChoices({ name: 'Ice Age', value: 'IceAge' })
            .addChoices({ name: 'Icicle', value: 'Icicle' })
            .addChoices({ name: 'Heavy Rain', value: 'HeavyRain' })
            .addChoices({ name: 'Drizzle', value: 'Drizzle' }),
        ),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('earth')
        .setDescription('Retrieve information about an earth spell.')
        .addStringOption((option) =>
          option
            .setName('name')
            .setDescription('The name of the earth spell to retrieve information for.')
            .setRequired(true)
            .addChoices({ name: 'Earthquake', value: 'Earthquake' }),
        ),
    ),
  execute: async (interaction) => {
    const subcommand = interaction.options.getSubcommand();
    const spellName = interaction.options.getString('name', true);
    const spell = spellData[spellName];

    if (!spell) {
      await interaction.reply({ content: 'Spell not found.', ephemeral: true });
      return;
    }

    let spellColor: ColorResolvable = '#000000';

    switch (subcommand) {
      case 'fire':
        spellColor = '#803C3E';
        break;
      case 'water':
        spellColor = '#357575';
        break;
      case 'earth':
        spellColor = '#858272';
        break;
    }

    const embed = new EmbedBuilder()
      .setTitle(`${spell.name}`)
      .setColor(spellColor)
      .setThumbnail(spell.image)
      .setDescription(spell.description)
      .setFooter({ text: `Cooldown: ${spell.cooldown} sec ⏳` }); // Cooldown ajouté en footer

    // Display attack damage per level (5 levels per line)
    if (spell.AttackDamage) {
      const attackLevels = Object.entries(spell.AttackDamage).map(([level, value]) => `**${level}:** ${value}`);

      for (let i = 0; i < attackLevels.length; i += 5) {
        embed.addFields({
          name: i === 0 ? 'Attack Damage :crossed_swords:' : '\u200B',
          value: attackLevels.slice(i, i + 5).join('\n'),
          inline: true,
        });
      }
    } else {
      embed.addFields({ name: 'Attack Damage :crossed_swords:', value: 'No attack data available' });
    }

    await interaction.reply({ embeds: [embed] });
  },
};
