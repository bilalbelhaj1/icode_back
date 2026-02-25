const crypto = require('crypto');

function Code(){
    let code = '';

    for(let i = 0;i < 4;i++){
        code += crypto.randomInt(0,10);
    }

    const expiresAt = new Date(Date.now() + 1000 * 60 * 10);

    return {code,expiresAt};
}

module.exports = {Code};