const bcrypt = require('bcryptjs');

async function generatePasswordHashes() {
    const passwords = {
        admin: 'admin123',
        johndoe: 'password123',
        janedoe: 'password123'
    };

    console.log('Generating password hashes...\n');

    for (const [user, password] of Object.entries(passwords)) {
        const hash = await bcrypt.hash(password, 10);
        console.log(`User: ${user}`);
        console.log(`Password: ${password}`);
        console.log(`Hash: ${hash}`);
        console.log('-------------------');
    }

    console.log('\nYou can use these hashes in your init.sql file.');
}

generatePasswordHashes();