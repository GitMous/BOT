const { Client, GatewayIntentBits, EmbedBuilder, WebhookClient, Guild, ActivityType } = require('discord.js');
const { token } = require('./config.js');
const config = require('./config.js')

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildVoiceStates] });
const langs  = require('./langs.js');

client.once('ready', () => {
    console.log('Sono Online!')
});
const { QueryType } = require('discord-player');

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;
    
    const { commandName } = interaction;

    if (commandName === 'porco') {
        await interaction.reply(langs.porco[interaction.locale] ?? 'God !');
    } else if (commandName === 'botInfo') {
        const Embed2 = new EmbedBuilder()
        .setTitle(langs.server[interaction.locale] ?? 'Info Bot')
        .setFields([
            {
                name : "🏷️BotName",
                value: "BOTschool"
            },
            {
                name : "🆔Server",
                value: interaction.guild.id
            },
            {
                name : "👑Owner",
                value: `<@${interaction.guild.ownerId}>`
            }
        ])
        await interaction.reply({
            embeds : [Embed2]
        })
    }else if (commandName === 'server') {
        const Embed = new EmbedBuilder()
        .setTitle(langs.server[interaction.locale] ?? 'Info Server')
        .setThumbnail(interaction.guild.iconURL())
        .setFields([
            {
                name : "🏷️ServerName",
                value: interaction.guild.name
            },
            {
                name : "🆔Server",
                value: interaction.guild.id
            },
            {
                name : "👑Owner",
                value: `<@${interaction.guild.ownerId}>`
            },
            {
                name : "👥 Member",
                value: `${interaction.guild.memberCount}`
            }
        ])
        await interaction.reply({
            embeds : [Embed]
        });
    } else if (commandName === 'user') {
        await interaction.reply(langs.user[interaction.locale] ?? 'Info sull\'utente');
        
    } else if (commandName === 'clear') {
        interaction.channel.clone().then((ch) => {
            ch.setParent(interaction.channel.parent.id);
            ch.setPosition(interaction.channel.position);
            interaction.channel.delete();
    
        })
    } else if (commandName === 'say'){
        const text = interaction.options.getString('text')
        interaction.reply({ content: 'eseguito', ephemeral: true})
        interaction.channel.send(text)
    } else if (commandName === 'help'){
        const Embed1 = new EmbedBuilder()
        .setTitle(langs.server[interaction.locale] ?? 'Help')
        .setFields([
            {
                name : "`          Server          `",
                value: "ㅤㅤㅤㅤInfo del server   "
            },
            {
                name : "`            User          `",
                value: "ㅤㅤㅤㅤInfo sull'utente   "
            },
            {
                name : "`           clear          `",
                value: "ㅤㅤㅤㅤcancella la chat     "
            },
            {
                name : "`            say           `",
                value: "ㅤㅤFa dire qualcosa al bot"
            },
            {
                name : "`            play          `",
                value: "ㅤㅤavvia una canzone da yt"
            },
            {
                name : "`            stop           `",
                value: "ㅤㅤstoppa la riproduzione"
            },
            {
                name : "`            queque          `",
                value: "ㅤvedi la lista delle canzoni"
            },
            {
                name : "`           skip            `",
                value: "ㅤpassa alla traccia successiva"
            }
        ])
        interaction.reply({ embeds: [Embed1] })
    } else if (commandName === 'play') {
        const titleSong = interaction.options.getString('song-title')

        const voiceChannel = interaction.member.voice.channel
        if (!voiceChannel) {
            return interaction.reply("Devi essere in un canale vocale")
        }

        const voiceChannelBot = interaction.guild.channels.cache.find(x => x.type == "GUILD_VOICE" && x.members.has(client.user.id))
        if (voiceChannelBot && voiceChannel.id != voiceChannelBot.id) {
            return interaction.reply("Qualun'altro sta già ascoltando della musica")
        }

        const res = await client.player.search(titleSong, {
            requestedBy: interaction.user,
            searchEngine: QueryType.AUTO
        });

        if (!res || !res.tracks.length) return interaction.reply(`${interaction.user}, No results found! ❌`);

        const queue = await client.player.createQueue(interaction.guild, {
            metadata: interaction.channel
        });

        try {
            if (!queue.connection) await queue.connect(interaction.member.voice.channel);
        } catch {
            await client.player.deleteQueue(interaction.guild.id);
            return interaction.reply(`${interaction.user}, I can't join audio channel. ❌`);
        }

        await interaction.reply(`Your ${res.playlist ? 'Your Playlist' : 'Your Track'} Loading... 🎧`);

        res.playlist ? queue.addTracks(res.tracks) : queue.addTrack(res.tracks[0]);

        if (!queue.playing) await queue.play();
    } else if (commandName === 'stop') {
        const voiceChannel = interaction.member.voice.channel
        if (!voiceChannel) {
            return interaction.reply("Devi essere in un canale vocale")
        }

        const voiceChannelBot = interaction.guild.channels.cache.find(x => x.type == "GUILD_VOICE" && x.members.has(client.user.id))
        if (voiceChannelBot && voiceChannel.id != voiceChannelBot.id) {
            return interaction.reply("Qualun'altro sta già ascoltando della musica")
        }
  
    const queue = client.player.getQueue(interaction.guild.id);

    if (!queue || !queue.playing) return interaction.reply(`${interaction.user}, There is no music currently playing!. ❌`);

    queue.destroy();

    interaction.reply(`The music playing on this server has been turned off, see you next time ✅`);
    } else if (commandName === 'queque') {
        const queue = client.player.getQueue(interaction.guild.id);

 
        if (!queue || !queue.playing) return interaction.reply(`${interaction.user}, There is no music currently playing!. ❌`);

        if (!queue.tracks[0]) return interaction.reply(`${interaction.user}, No music in queue after current. ❌`);

        const embed = new EmbedBuilder();

        embed.setColor('Red');
        embed.setThumbnail(interaction.guild.iconURL({ size: 2048, dynamic: true }));
        embed.setTitle(`Server Music List - ${interaction.guild.name}`);

        const tracks = queue.tracks.map((track, i) => `**${i + 1}** - ${track.title} | ${track.author} (Started by <@${track. requestedBy.id}>)`);

        const songs = queue.tracks.length;
        const nextSongs = songs > 5 ? `And **${songs - 5}** Other Song...` : `There are **${songs}** Songs in the List.`;

        embed.setDescription(`Currently Playing: \`${queue.current.title}\`\n\n${tracks.slice(0, 5).join('\n')}\n\n${nextSongs }`);

        embed.setTimestamp();

        interaction.reply({ embeds: [embed] });
    } else if (commandName === 'skip') {
        const queue = client.player.getQueue(interaction.guild.id);
 
    if (!queue || !queue.playing) return interaction.reply(`${interaction.user}, There is no music currently playing!. ❌`);

    const success = queue.skip();

    return interaction.reply(success ? `**${queue.current.title}**, Skipped song ✅` : `${interaction.user}, Something went wrong ❌`);
    }

})

process.on('unhandledRejection', error => {
    console.log(error);
  })
    process.on("uncaughtException", (err, origin) => {
      console.log("Caught exception: " + err)
      console.log("Origin: " + origin)
    })
    process.on('uncaughtExceptionMonitor', (err, origin) => {
      console.log(err);
      console.log("Origin: " + origin)
    });
    process.on('beforeExit', (code) => {
      console.log('Process beforeExit event with code: ', code);
    });
    process.on('exit', (code) => {
      console.log('Process exit event with code: ', code);
    });
    process.on('multipleResolves', (type, promise, reason) => {
      console.log(type, promise, reason);
});



client.on("guildMemberAdd", async member => {
    const embedWelc = new EmbedBuilder()
    .setTitle(member.user.tag)
    .setDescription("🎉Benvenuto🎉")
    .setThumbnail(member.displayAvatarURL())
    .setFooter({ text: member.guild.name, iconURL: member.guild.iconURL() })
    .setColor('Random')
  client.channels.cache.get('1046865356599332957').send({ embeds: [embedWelc] })
})


client.on('ready', () => {
	client.user.setActivity({ name: `VisualStudioCode`, type: ActivityType.Playing })
})

// Musica

const { Player } = require('discord-player');
client.player = new Player(client, config.opt.discordPlayer);
const player = client.player

player.on('error', (queue, error) => {
  console.log(`There was a problem with the song queue => ${error.message}`);
});

player.on('connectionError', (queue, error) => {
  console.log(`I'm having trouble connecting => ${error.message}`);
});

player.on('trackStart', (queue, track) => {
  if (!config.opt.loopMessage && queue.repeatMode !== 0) return;
  queue.metadata.send(`🎵 Music started: **${track.title}** -> Channel: **${queue.connection.channel.name}** 🎧 || Current Volume: **${queue.volume}**🔊`);
});

player.on('trackAdd', (queue, track) => {
  queue.metadata.send(`**${track.title}** added to playlist!. ✅`);
});

player.on('botDisconnect', (queue) => {
  queue.metadata.send('Someone from the audio channel Im connected to kicked me out, the whole playlist has been cleared! ❌');
});

player.on('channelEmpty', (queue) => {
  queue.metadata.send('I left the audio channel because there is no one on my audio channel. ❌');
});

player.on('queueEnd', (queue) => {
  queue.metadata.send('All play queue finished, I think you can listen to some more music. ✅');
});



client.login(token);

/* CODE BY DARK ONE TAKE*/
/* dark one take#7012 */
