const mineflayer = require('mineflayer');
const { pathfinder, Movements, goals } = require('mineflayer-pathfinder');
const GoalFollow = goals.GoalFollow;

const botOptions = {
    host: 'play.voidcraftbd.online',
    username: 'rohan_helper', // আপনার পরিবর্তিত নাম
    version: '1.21.11',
    // 🌟 প্যাকেট এরর ও ক্র্যাশ বন্ধ করার জন্য এই ৩টি সিক্রেট অপশন যোগ করা হলো
    viewDistance: 'tiny',          // সার্ভার থেকে কম ডেটা টানবে, ফলে প্যাকেট ফাটবে না
    checkTimeoutInterval: 60000,   // সার্ভার ল্যাগ দিলেও বট সহজে ডিসকানেক্ট হবে না
    colorsEnabled: false           // বাড়তি চ্যাট কোড হ্যান্ডেল করার চাপ কমাবে
};

const botPassword = 'RohanBot@123';

let bot;

function createBot() {
    bot = mineflayer.createBot(botOptions);

    bot.loadPlugin(pathfinder);

    bot.on('spawn', () => {
        console.log(`${bot.username} সফলভাবে voidcraftbd সার্ভারে জয়েন করেছে!`);
        setTimeout(() => {
            bot.chat(`/login ${botPassword}`);
            bot.chat(`/register ${botPassword} ${botPassword}`);
        }, 2000);
    });

    // 🌟 কোনো আংশিক বা ভাঙা প্যাকেট (Partial Packet) আসলে যেন বট ক্র্যাশ না করে ইগনোর করে
    bot._client.on('packet_error', (err) => {
        // এই এররগুলো কনসোলে প্রিন্ট না করে ব্যাকগ্রাউন্ডে ইগনোর করা হবে
        if (err.message.includes('Chunk size') || err.message.includes('packet')) return;
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
        console.log('সার্ভার থেকে ডিসকানেক্ট হয়েছে। ৫ সেকেন্ড পর আবার জয়েন করছে...');
        setTimeout(() => {
            createBot();
        }, 5000);
    });

    bot.on('error', (err) => {
        // সাধারণ প্যাকেট ওয়ার্নিংগুলো স্ক্রিন ক্লিয়ার রাখার জন্য ফিল্টার করা হলো
        if (err.message.includes('ECONNRESET')) {
            console.log('কানেকশন ড্রপ হয়েছে, পুনরায় চেষ্টা করা হচ্ছে...');
        } else {
            console.log('Error:', err.message);
        }
    });
}

createBot();