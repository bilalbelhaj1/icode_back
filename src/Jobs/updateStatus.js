const cron = require('node-cron');
const User = require('../modules/db');

cron.schedule('0 */3 * * *', async () => {
    try{
        console.log('Job executed : reset isActive');

        await User.updateMany(
            {isActive:false},
            {$set:{isActive:true}}
        );
    }catch(err){
        console.error('Error Cron Job',err);
    }
});