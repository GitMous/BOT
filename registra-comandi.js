const { SlashCommandBuilder, Routes } = require('discord.js');
const { REST } = require('@discordjs/rest');
const { token, clientId, guildId } = require('./config.js');

const comandi = [
    new SlashCommandBuilder().setName('porco').setDescription('Risponde con dio!'),
    new SlashCommandBuilder().setName('server').setDescription('visualizza le info sul server'),
    new SlashCommandBuilder().setName('user').setDescription('Visulizza le info sull\'utente'),
    new SlashCommandBuilder().setName('clear').setDescription('cancellare i messaggi'),
    new SlashCommandBuilder().setName('help').setDescription('vedere tutti i comandi'),
    new SlashCommandBuilder().setName('say').setDescription('fai dire quello che vuoi al bot').addStringOption(option => option.setName('text') .setDescription('srivi') .setRequired(true)),
    new SlashCommandBuilder().setName('play').setDescription('avvia una canzone da yt').addStringOption(option => option.setName('song-title') .setDescription('scrivi il titolo di una canzone o incolla un link da yt') .setRequired(true)),
    new SlashCommandBuilder().setName('stop').setDescription('stoppa la riproduzione'),
    new SlashCommandBuilder().setName('queque').setDescription('vedi la lista delle canzoni'),
    new SlashCommandBuilder().setName('skip').setDescription('passa alla traccia successiva'),
].map(comandi => comandi.toJSON());

const rest = new REST({ version: '10' }).setToken(token);

// Registrare guild commands
/*
 rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: comandi })
    .then(() => console.log('Comandi registrati con successo!'))
    .catch(console.error);
*/
// Registrare comandi globali
rest.put(Routes.applicationCommands(clientId,), { body: comandi })
.then(() => console.log('Comandi registrati con successo!'))
.catch(console.error);

// Cancellare guild command
/*
rest.delete(Routes.applicationGuildCommand(clientId, guildId, 'id_comando'))
    .then(() => console.log('Comando cancellato con successo!'))
    .catch(console.error);
*/
// Cangellare comando globale
rest.delete(Routes.applicationCommand(clientId))
    .then(() => console.log('Comando cancellato con successo!'))
    .catch(console.error);
