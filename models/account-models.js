// Require database
const { changePassword } = require('../controllers/accountControllers')
const pool = require('../database/')

/* *****************************
*   Register new account
* *************************** */
async function registerAccount(account_firstname, account_lastname, account_email, account_password) {
    try{
        const sql = "INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type) VALUES ($1, $2, $3, $4, 'Client') RETURNING *"
        return await pool.query(sql, [account_firstname, account_lastname, account_email, account_password])
    } catch (error){
        throw error
    }
}

/* **********************
 *   Check for existing email
 * ********************* */
async function checkEmailExist(account_email) {
    try{
        const sql = "SELECT * FROM account WHERE account_email = $1"
        const email = await pool.query(sql, [account_email])
        return email.rowCount
    } catch(error){
        return error.message
    }
}

/* *****************************
* Return account data using email address
* ***************************** */
async function getAccountByEmail(account_email) {
    try{
        const result = await pool.query(
            'SELECT account_id, account_firstname, account_lastname, account_email, account_password, account_type FROM account WHERE account_email = $1',
            [account_email]
        )
        return result.rows[0]
    } catch (error){
        return new Error("No matching email found")
    }
}

// Get Account By Id
async function getAccountById(account_id) {
    const result = await pool.query(
        `SELECT account_id, account_firstname, account_lastname, account_email FROM account WHERE account_id = $1`,
        [account_id]
    );
    return result.rows[0];
}

// Update Account
async function updateAccount(account_id, data) {
    const result = await pool.query(
        `UPDATE account SET account_firstname = $1, account_lastname = $2, account_email = $3 WHERE account_id = $4 RETURNING *`,
        [data.account_firstname, data.account_lastname, data.account_email, account_id]
    );
    return result.rows;
}

// Update Password
async function updatePassword(account_id, hashedNewPassword) {
    const result = await pool.query(
        `UPDATE account SET account_password = $1 WHERE account_id = $2 RETURNING *`,
        [hashedNewPassword, account_id]
    )
    return result.rows[0]
}

module.exports = { registerAccount, checkEmailExist, getAccountByEmail, getAccountById, updateAccount, updatePassword }