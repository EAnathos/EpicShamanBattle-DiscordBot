import { Collection, CommandInteraction, SlashCommandBuilder } from 'discord.js';

export interface BotEvent {
  name: string;
  once?: boolean | false;
  execute: (...args) => void;
}

export interface SlashCommand {
  name: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: SlashCommandBuilder | any;
  execute: (interaction: CommandInteraction | ChatInputCommandInteraction) => Promise<void>;
}

export interface Beast {
  name: string;
  image: string;
  prerequisite: string;
  skills?: { name: string; description: string }[];
  NewAbilities?: Record<string, string>;
  AttackDamage?: Record<string, number>;
  RecoveryRate?: Record<string, string>;
  SpellDamageIncrease?: Record<string, string>;
  GoldGains?: Record<string, string>;
  SoulGains?: Record<string, string>;
  PaydaySkillCooldown?: Record<string, string>;
  LeapThroughTimeSpellCooldownReduction?: Record<string, string>;
}

export interface Spell {
  name: string;
  image: string;
  cooldown: number;
  AttackDamage: Record<string, number>;
}

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      CLIENT_ID: string;
      TOKEN: string;
    }
  }
}

declare module 'discord.js' {
  export interface Client {
    slashCommands: Collection<string, SlashCommand>;
  }
}
