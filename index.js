const { Client, Intents, WebhookClient } = require('discord.js');
require('dotenv').config();

const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS],
  partials: ['USER', 'REACTION', 'MESSAGE'],
});

const PREFIX = '$';

// const webhookClient = new WebhookClient(process.env.WEBHOOK_ID, process.env.WEBHOOK_TOKEN);
const webhookClient = new WebhookClient({
  id: process.env.WEBHOOK_ID,
  token: process.env.WEBHOOK_TOKEN,
});
client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  client.user.setActivity('with the power of the universe');
});

client.on('messageCreate', async message => {
  console.log(message.content);
  // 1) If the message is from a bot, ignore it
  if (message.author.bot) return;
  // 2) If the message doesn't start with the prefix, ignore it

  if (message.content.startsWith(PREFIX)) {
    console.log(message.content);
    const [CMD_NAME, ...args] = message.content.trim().substring(PREFIX.length).split(/\s+/);
    // console.log(CMD_NAME);
    // 2.1 If the command is 'kick' and the user has the 'kick' permission, kick the user
    if (CMD_NAME === 'kick') {
      console.log(CMD_NAME);
      if (!message.member.permissions.has('KICK_MEMBERS')) return message.channel.send('You do not have the permission to kick members!');
      if (args.length === 0) return message.reply('You need to specify a user to kick!');
      const member = message.guild.members.cache.get(args[0]);
      if (member) {
        member
          .kick()
          .then(member => message.channel.send(`${member.user.tag} has been kicked!`))
          .catch(err => message.channel.send(`You don't have permission to kick that user!`));
      } else {
        message.channel.send('That user does not exist!');
      }
    } else if (CMD_NAME === 'ban') {
      if (!message.member.permissions.has('BAN_MEMBERS')) return message.channel.send('You do not have the permission to ban members!');
      if (args.length === 0) return message.reply('You need to specify a user to ban!');
      try {
        const user = await message.guild.members.ban(args[0]);
        message.channel.send(`${user.user.tag} has been banned!`);
        console.log(user);
      } catch (err) {
        console.log(err);
        message.channel.send("You don't have permission to ban that user! or user not found");
      }
    } else if (CMD_NAME === 'announce') {
      console.log(args);
      const msg = args.join(' ');
      console.log(msg);
      webhookClient.send(msg);
    }
  }
  //If the message is hello from user then reply with hello from bot
  if (message.content === 'hello') {
    // message.reply('Hello from bot');
    message.channel.send('hello');
  }
});

client.on('messageReactionAdd', (reaction, user) => {
  const { name } = reaction.emoji;
  const member = reaction.message.guild.members.cache.get(user.id);
  if (reaction.message.id === '973548828223492139') {
    switch (name) {
      case '🍎':
        member.roles.add('973545077374865428');

        break;
      case '🍌':
        member.roles.add('973480480248836146');
        break;

      case '🟠':
        member.roles.add('973545195385794570');
        break;
    }
  }
});

client.on('messageReactionRemove', (reaction, user) => {
  const { name } = reaction.emoji;
  const member = reaction.message.guild.members.cache.get(user.id);
  if (reaction.message.id === '973548828223492139') {
    switch (name) {
      case '🍎':
        member.roles.remove('973545077374865428');

        break;
      case '🍌':
        member.roles.remove('973480480248836146');
        break;

      case '🟠':
        member.roles.remove('973545195385794570');
        break;
    }
  }
});

//connection to discord
client.login(process.env.DISCORD_TOKEN);
