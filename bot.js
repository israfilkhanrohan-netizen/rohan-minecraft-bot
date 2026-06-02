const mineflayer = require('mineflayer');
const { pathfinder, Movements, goals } = require('mineflayer-pathfinder');
const GoalFollow = goals.GoalFollow;

const botOptions = {
    host: 'play.voidcraftbd.online',
    username: 'rohan_helper',
    version: '1.21.11',
    viewDistance: 'tiny',
    checkTimeoutInterval: 90000,
    colorsEnabled: false
};

const botPassword = 'RohanBot@123';

let bot;

function createBot() {
    bot = mineflayer.createBot(botOptions);

    bot.loadPlugin(pathfinder);

    // ইন্টারনাল ক্লায়েন্ট লেভেলে প্যাকেট এরর হ্যান্ডেল করা (যাতে ক্র্যাশ না করে)
    bot.on('client', (client) => {
        client.on('packet_error', (err) => {
            return;
        });
    });

    bot.on('spawn', () => {
        console.log(`${bot.username} সফলভাবে voidcraftbd সার্ভারে জয়েন করেছে!`);
        setTimeout(() => {
            bot.chat(`/login ${botPassword}`);
            bot.chat(`/register ${botPassword} ${botPassword}`);
        }, 2000);
    });

    bot.on('message', (jsonMsg) => {
        const message = jsonMsg.toString();
        
        if (message.includes('/register') || message.includes('register') || message.includes('reg')) {
            bot.chat(`/register ${botPassword} ${botPassword}`);
        }
        if (message.includes('/login') || message.includes('login') || message.includes('log')) {
            bot.chat(`/login ${botPassword}`);
        }

        if (message.includes('requested to teleport') || message.includes('tpa') || message.includes('request')) {
            console.log('টিপি রিকোয়েস্ট পাওয়া গেছে! এক্সেপ্ট করা হচ্ছে...');
            setTimeout(() => {
                bot.chat('/tpaccept');
            }, 1500);
        }
    });

    bot.on('chat', (username, message) => {
        if (username === bot.username) return;
        const msg = message.toLowerCase();

        if (msg === 'hello' || msg === 'hi' || msg === 'hlw') {
            bot.chat(`Hello ${username}! আমি Rohan ভাইয়ের ২৪/৭ বট।`);
        } 
        else if (msg === 'follow' || msg === 'amar piche ay') {
            const target = bot.players[username]?.entity;
            if (!target) {
                bot.chat(`দুঃখিত ${username}, আগে আমার কাছে টিপি (TP) করুন।`);
                return;
            }
            bot.chat(`ঠিক আছে ${username}, আমি আপনাকে ফলো করছি!`);
            const defaultMove = new Movements(bot);
            bot.pathfinder.setMovements(defaultMove);
            bot.pathfinder.setGoal(new GoalFollow(target, 3), true);
        }
        else if (msg === 'stop' || msg === 'thak r asa lagbe nah') {
            bot.chat('আমি এখানে দাঁড়িয়ে গেলাম ভাই!');
            bot.pathfinder.setGoal(null);
        }
    });

    bot.on('end', () => {
        console.log('সার্ভার থেকে ডিসকানেক্ট হয়েছে। ৫秒 পর আবার জয়েন করছে...');
        setTimeout(() => {
            createBot();
        }, 5000);
    });

    bot.on('error', (err) => {
        return;
    });
}

// 🌟 [নতুন ফিচার] আপনার কনসোলের ইনপুট রিড করে বটের মাধ্যমে সার্ভারে পাঠানো
process.stdin.setEncoding('utf8');
process.stdin.on('data', (data) => {
    const text = data.trim();
    if (text && bot && bot.say) {
        // আপনি কনসোলে যা লিখবেন, বট সেটা সার্ভার চ্যাটে পাঠিয়ে দেবে
        bot.chat(text); 
        console.log(`[বটের মুখ দিয়ে পাঠানো হলো]: ${text}`);
    }
});

// গ্লোবাল ক্র্যাশ প্রটেকশন
process.on('uncaughtException', (err) => {
    if (err.message.includes('Chunk size') || err.message.includes('packet')) return;
});

createBot();