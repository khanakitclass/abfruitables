const  pool  = require("../db/mySql");


const getAllSalsePersons = async () => {
    try {
        const [result,failed] = await pool.query('SELECT * FROM salespeople');
        return result;
    } catch (error) {
        console.error('Error executing query:', error.message);
        throw new Error('Database query failed');
    }
};

const addSalsePersons = async (sname, city, comm) => {
    try {
        const [result] = await pool.execute('INSERT INTO salespeople (sname, city, comm) VALUES (?, ?, ?)', [sname, city, comm]);
        console.log(result);
        return result;
    } catch (error) {
        console.error('Error executing query:', error.message);
        throw new Error('Database query failed');
    }
};

const deleteSalsePersonById = async (snum) => {
    try {
        const [result] = await pool.execute('DELETE FROM salespeople WHERE snum = ?', [snum]);
        return result;
    } catch (error) {
        console.error('Error executing query:', error.message);
        throw new Error('Database query failed');
    }
};


const updateSalsePerson = async (snum, sname, city, comm) => {
    try {
        const [result] = await pool.execute('UPDATE salespeople SET sname = ?, city = ?, comm = ? WHERE snum = ?', [sname, city, comm, snum]);
        console.log(result);
        return result;
    } catch (error) {
        console.error('Error executing query:', error.message);
        throw new Error('Database query failed');
    }
};


module.exports = {
    getAllSalsePersons,
    addSalsePersons,
    deleteSalsePersonById,
    updateSalsePerson
};
