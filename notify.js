const steamUser = require('steam-user');
const steamTotp = require('steam-totp');
const Discord = require('discord.js');
const keep_alive = require('./keep_alive.js');

const client = new Discord.Client();

client.login('https://discord.com/api/webhooks/1208464244157452288/UBvD0KTfIqysVKgSJWtETNSpLcoxNkEF3wb0IJwxeymFhEE1ulljoxFAjRKcNY2keoxx');

// Função para enviar uma mensagem para o webhook do Discord
function sendDiscordMessage(message) {
  const webhook = new Discord.WebhookClient({ id: '1208464244157452288', token: 'UBvD0KTfIqysVKgSJWtETNSpLcoxNkEF3wb0IJwxeymFhEE1ulljoxFAjRKcNY2keoxx' });
  webhook.send(message);
}

// Função para logar no Steam e notificar no Discord
function logOnAndNotify(username, password, shared_secret, games, status) {
  const user = new steamUser();
  user.logOn({
    "accountName": username,
    "password": password,
    "twoFactorCode": steamTotp.generateAuthCode(shared_secret)
  });

  user.on('loggedOn', () => {
    if (user.steamID != null) {
      console.log(user.steamID + ' - Successfully logged on');
      sendDiscordMessage(`Usuário ${username} está online no Steam.`);
    }

    user.setPersona(status);
    user.gamesPlayed(games);
  });
}

// Usuário 1
logOnAndNotify(process.env.username, process.env.password, process.env.shared, [730, 440, 304930], 1);

// Usuário 2
logOnAndNotify(process.env.username2, process.env.password2, process.env.shared2, [730, 440, 304930], 1);

// Agendar notificação a cada 12 horas
setInterval(() => {
  sendDiscordMessage('Script está online.');
}, 12 * 60 * 60 * 1000); // 12 horas em milissegundos