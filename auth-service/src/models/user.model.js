

const db = require('../config/db');
const amqp = require("amqplib");


const RABBITMQ_URL = "amqp://guest:guest@localhost:5672"; // ✅ Correct
 
const QUEUE_NAME = "transactions"; // Queue name for transaction logs

const getUserByCardNumber = async (cardNumber) => {
    const query =     `SELECT users.id, users.user_count , users.card_number, users.pin, comptes.balance 
    FROM users 
    JOIN comptes ON users.id = comptes.user_id 
    WHERE users.card_number = ?`;
    const [rows] = await db.query(query, [cardNumber]);
    return rows.length > 0 ? rows[0] : null; 
};


const updateUserBalance = async (userId, newBalance, numberCard, montant) => {
    try {
    await db.query("UPDATE comptes SET balance = ? WHERE id = ?", [newBalance, userId]);
    // const message = {
    //     date_operation: new Date().toISOString(),
    //     numberCard: numberCard,
    //     montant: montant,
        
    // };

    // // Send the message to RabbitMQ
    // const connection = await amqp.connect(RABBITMQ_URL);
    // const channel = await connection.createChannel();

    // await channel.assertQueue(QUEUE_NAME, { durable: true });
    // channel.sendToQueue(QUEUE_NAME, Buffer.from(JSON.stringify(message)), { persistent: true });

    // console.log("📤 Message sent to RabbitMQ:", message);

    // Close the connection
    // setTimeout(() => {
    //     channel.close();
    //     connection.close();
    // }, 500);

} catch (error) {
    console.error("❌ Error updating balance or sending message to RabbitMQ:", error);
}
};


const updateLoginAttempts = async (userId, attempts) => {
    return db.query("UPDATE users SET user_count = ? WHERE id = ?", [attempts, userId]);
};

module.exports = { getUserByCardNumber , updateUserBalance, updateLoginAttempts};

