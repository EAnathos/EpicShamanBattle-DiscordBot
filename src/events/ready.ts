import { BotEvent } from '@/types';
import { Client, Events, TextChannel } from 'discord.js';
import cron from 'node-cron';

const event: BotEvent = {
  name: Events.ClientReady,
  once: true,
  execute(client: Client) {
    console.log(`💪 Logged in as ${client.user?.tag}`);

    // Tâche planifiée pour envoyer le message tous les jours à 16h heure française (UTC+1 ou UTC+2 en été)
    cron.schedule(
      '0 16 * * *',
      () => {
        const channel = client.channels.cache.get('1342582088292892672') as TextChannel;
        if (channel) {
          channel.send(
            "<@&1349032788459786251>\nIt's time to reset, here we go again to farm, as a reminder, you can:\n- Do the daily quests\n- Watch videos for the meat/shop/relic chest",
          );
          console.log('📢 Message quotidien envoyé.');
        } else {
          console.error('❌ Impossible de trouver le salon.');
        }
      },
      {
        timezone: 'Europe/Paris',
      },
    );
  },
};

export default event;
