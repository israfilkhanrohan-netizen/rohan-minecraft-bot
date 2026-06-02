const mineflayer = require('mineflayer');
// রাস্তা চিনে ফলো করার জন্য নতুন প্লাগইন ইম্পোর্ট করা হলো
const { pathfinder, Movements, goals } = require('mineflayer-pathfinder');
const GoalFollow = goals.GoalFollow;

const botOptions = {
    host: 'play.voidcraftbd.online',         // আপনার সার্ভার আইপি
    username: 'rohan_helper',                // বটের নাম
    version: '1.21.11'                        // সার্ভার ভার্সন
};

const botPassword = 'RohanBot@123';          // বটের লগইন পাসওয়ার্ড

let bot;

function createBot() {
    bot = mineflayer.createBot(botOptions);

    // পাথফাইন্ডার প্লাগইন বটের সাথে লোড করা
    bot.loadPlugin(pathfinder);

    // বট সফলভাবে জয়েন করলে অটো-লগইন
    bot.on('spawn', () => {
        console.log(`${bot.username} সফলভাবে voidcraftbd সার্ভারে জয়েন করেছে!`);
        setTimeout(() => {
            bot.chat(`/login ${botPassword}`);
            bot.chat(`/register ${botPassword} ${botPassword}`);
        }, 2000);
    });

    // সার্ভারের চ্যাট মেসেজ রিড করে অটোমেটিক রেজিস্টার/লগইন এবং TP Accept করা
    bot.on('message', (jsonMsg) => {
        const message = jsonMsg.toString();
        
        // অটো-লগইন সিস্টেম
        if (message.includes('/register') || message.includes('register') || message.includes('reg')) {
            bot.chat(`/register ${botPassword} ${botPassword}`);
        }
        if (message.includes('/login') || message.includes('login') || message.includes('log')) {
            bot.chat(`/login ${botPassword}`);
        }

        // 🌟 টিপি এক্সেপ্ট (TP Accept) করার সিস্টেম
        // কেউ টিপি রিকোয়েস্ট পাঠালে সার্ভার চ্যাটে সাধারণত 'has requested to teleport' বা 'tpa' লেখা আসে
        if (message.includes('requested to teleport') || message.includes('tpa') || message.includes('request')) {
            console.log('টিপি রিকোয়েস্ট পাওয়া গেছে! এক্সেপ্ট করা হচ্ছে...');
            setTimeout(() => {
                bot.chat('/tpaccept');
            }, 1500); // ১.৫ সেকেন্ড পর অটোমেটিক এক্সেপ্ট করবে
        }
    });

    // 🌟 চ্যাট কমান্ডের মাধ্যমে ফলো (Follow) করার এআই সিস্টেম
    bot.on('chat', (username, message) => {
        if (username === bot.username) return;

        const msg = message.toLowerCase();

        // সাধারণ চ্যাট রিপ্লাই
        if (msg === 'hello' || msg === 'hi' || msg === 'hlw') {
            bot.chat(`Hello ${username}! আমি Rohan ভাইয়ের ২৪/৭ বট।`);
        } 

        // বটের পেছনে ঘুরে বেড়ানোর কমান্ড (follow)
        else if (msg === 'follow' || msg === 'amar piche ay') {
            const target = bot.players[username]?.entity;
            if (!target) {
                bot.chat(`দুঃখিত ${username}, আপনাকে তো আমি দেখতে পাচ্ছি না! আগে আমার কাছে টিপি (TP) করুন।`);
                return;
            }

            bot.chat(`ঠিক আছে ${username}, আমি আপনাকে ফলো করছি!`);
            
            // বটের হাঁটার মুভমেন্ট সেটআপ
            const defaultMove = new Movements(bot);
            bot.pathfinder.setMovements(defaultMove);
            
            // প্লেয়ারের পেছনে ৩ ব্লক দূরত্ব বজায় রেখে ফলো করবে
            bot.pathfinder.setGoal(new GoalFollow(target, 3), true);
        }

        // ফলো করা বন্ধ করার কমান্ড (stop)
        else if (msg === 'stop' || msg === 'thak r asa lagbe nah') {
            bot.chat('আমি এখানে দাঁড়িয়ে গেলাম ভাই!');
            bot.pathfinder.setGoal(null); // ফলো করা অফ করে দেবে
        }
    });

    // ডিসকানেক্ট হলে অটো-রিলগইন
    bot.on('end', () => {
        console.log('সার্ভার থেকে ডিসকানেক্ট হয়েছে। ৫ সেকেন্ড পর আবার জয়েন করছে...');
        setTimeout(() => {
            createBot();
        }, 5000);
    });

    bot.on('error', (err) => console.log('Error:', err));
}

createBot();