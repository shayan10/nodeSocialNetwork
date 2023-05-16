const pool = require('./../pool');
const {toCamelCase} = require('./../utils');
const {UsernameDuplicateException, UserCreationError} = require('./../exceptions/users');


class UserRepo {
    properties = ['username', 'bio']

    async find() {
        try {
            const {rows} = await pool.query('SELECT * FROM users;');
            const parsedRows = toCamelCase(rows);
            return parsedRows;
        } catch (error) {
            console.log(error);
            throw Error(error.message);
        }
    }

    async checkUserExists(username) {
        const {rowCount} = await pool.query(`SELECT COUNT(*) FROM users WHERE username = $1 GROUP BY username`,
            [username]);
        return rowCount != 0;
    }

    async findById(id) {
        try {        
            const {rows} = await pool.query(`SELECT * FROM users WHERE id=$1;`,
                [id]);
            const parsedRows = toCamelCase(rows);
            return parsedRows[0];   
        } catch (error) {
            console.log(error);
            throw Error(error.message);
        }
    }

    async insert(username, bio) {
        // Raise error if user with provided username already exists
        const userExists = this.checkUserExists(username);
    
       if (userExists)
           throw UsernameDuplicateException;
    
        try {
            const {rows} = await pool.query(`INSERT INTO users (username, bio)
                VALUES ($1, $2) RETURNING *;`, [username, bio]);
            return toCamelCase(rows)[0];
        } catch (error) {
            console.log(error);
            throw UserCreationError;
        }
    }

    async updateAll(id, username, bio) {
        // Check if user name taken
        const canUpdateUsername = this.checkUserExists(username);
        
        if (!canUpdateUsername) {
            throw UsernameDuplicateException;
        }

        try {
            const {rows} = await pool.query(
                'UPDATE users SET username = $1, bio = $2 WHERE id = $3 RETURNING *',
                [username, bio, id]
            );

            return toCamelCase(rows)[0];
        } catch (error) {
            throw error;
        }
    }

    async partialUpdate(id, updates) {
        const sanitizedUpdates = {};
        this.properties.forEach(property => {
            if (property in updates) {
                sanitizedUpdates[property] = updates[property];
            }
        });

        if ('username' in sanitizedUpdates) {
            const canUpdateUsername = this.checkUserExists(updates.username);
            
            if (!canUpdateUsername) {
                throw UsernameDuplicateException;
            }
        }

        const queryUpdates = [];
        const updateFields = Object.keys(sanitizedUpdates);
        const updateValues = Object.values(sanitizedUpdates);
        for (let i = 0; i != updateFields.length; i++) {
            queryUpdates.push(`${updateFields[i]} = $${i+1}`);
        }
        const queryString = queryUpdates.join(', ');

        try {
            const {rows} = await pool.query(
                `UPDATE users SET ${queryString} WHERE id = $3 RETURNING *`,
                [...updateValues, id]
            );

            return toCamelCase(rows)[0];
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new UserRepo();