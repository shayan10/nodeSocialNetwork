const pool = require('./pool');

async function connect() {
    try {
        await pool.connect({
            host: 'localhost',
            port: 5432,
            database: 'social_network',
            user: 'postgres',
            password: 'austin3:16'
        });
    } catch (error) {
        throw new Error(error.message);
    }
}
const toCamelCase = rows => {
   return rows.map(row => {
        const replaced = {};
        for (let key in row) {
            const camelCase = key.replace(/([-_][a-z])/gi, ($1) => 
                $1.toUpperCase().replace('_', '')
            );

            replaced[camelCase] = row[key];
        }
        return replaced;
    });

}

module.exports = {
    connect,
    toCamelCase
};