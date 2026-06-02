const mineflayer = require('mineflayer');

// আপনার সার্ভারের ইনফরমেশন এবং নতুন বটের নাম সেট করা হয়েছে
const botOptions = {
    host: 'play.voidcraftbd.online',         // আপনার সার্ভার আইপি
    username: 'rohan_er_bot',                // বটের নতুন নাম
    version: '1.21.11'                        // আপনার সার্ভার ভার্সন
};

let bot;

function createBot() {
    bot = mineflayer.createBot(botOptions);

    // বট সাকসেসফুলি সার্ভারে জয়েন করলে
    bot.on('spawn', () => {
        console.log(`${bot.username} সফলভাবে voidcraftbd সার্ভারে জয়েন করেছে!`);
    });

    // কেউ চ্যাটে কিছু লিখলে বটের এআই রিপ্লাই সিস্টেম
    bot.on('chat', (username, message) => {
        // বট নিজে কিছু লিখলে যেন লুপে না পড়ে
        if (username === bot.username) return;

        const msg = message.toLowerCase();

        // কাস্টম চ্যাট রেসপন্স
        if (msg.includes('hello') || msg.includes('hlw') || msg.includes('hi')) {
            bot.chat(`Hello ${username}! আমি rohan_er_bot, এই সার্ভারের ২৪/৭ এআই অ্যাসিস্ট্যান্ট।`);
        } 
        else if (msg.includes('help')) {
            bot.chat('আমি সার্ভার পাহারা দিচ্ছি। যেকোনো সমস্যায় এডমিন Rohan ভাইকে নক দিন।');
        }
        else if (msg.includes('rules')) {
            bot.chat('নিয়মকানুন মেনে চলুন: হ্যাক বা ল্যাগ করা যাবে না, শান্তিতে খেলুন!');
        }
    });

    // সার্ভার রিস্টার্ট বা কিক খেলে অটোমেটিক ৫ সেকেন্ড পর রিলগইন হবে
    bot.on('end', () => {
        console.log('সার্ভার থেকে ডিসকানেক্ট হয়েছে। ৫ সেকেন্ড পর আবার জয়েন করছে...');
        setTimeout(() => {
            createBot();
        }, 5000);
    });

    // কোনো এরর আসলে যেন স্ক্রিপ্ট ক্র্যাশ না করে
    bot.on('error', (err) => console.log('Error:', err));
}

createBot();