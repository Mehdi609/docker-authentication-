




const { getUserByCardNumber, updateUserBalance , updateLoginAttempts} = require("../models/user.model");

const jwt = require('jsonwebtoken');


const login = async (req, res) => {
    try {
    const { cardNumber, pin } = req.body;
    

    // Vérifier si l'utilisateur existe via son numéro de carte
    const user = await getUserByCardNumber(cardNumber);
    
    if (!user) {
        return res.status(401).json({ message: 'Numéro de carte incorrect' });
    }

    console.log(user.user_count, user.user_count >= 3);
    if (user.user_count >= 3) {
        return res.status(403).json({ message: 'Compte bloqué après trop de tentatives. Veuillez contacter le support.' });
    }

    if (user.pin !== pin) {
        // Increment login attempts if PIN is incorrect
        await updateLoginAttempts(user.id, user.user_count + 1);


        return res.status(401).json({ message: 'Code PIN incorrect'});
    }

   
   

    // Générer un token JWT
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    

    // Renvoyer les infos de l'utilisateur (sans le PIN pour des raisons de sécurité)
    res.json({ 
        token, 
        user: { id: user.id, cardNumber: user.card_number, balance: user.balance }
    });
} catch (error) {
    console.error("Erreur lors de la connexion:", error);
    res.status(500).json({ message: "Erreur interne du serveur" });
}
};


const retrait = async (req, res) => {
    try {
        const { cardNumber, amount } = req.body;
        console.log(cardNumber, amount);

        // Vérifier si l'utilisateur existe via son numéro de carte
        const user = await getUserByCardNumber(cardNumber);
        console.log(user);


       

      

        // Vérifier si le solde est suffisant
        if (user.balance < amount) {
            return res.status(400).json({ message: "Fonds insuffisants" });
        }

        // Déduire le montant et mettre à jour le solde
        const newBalance = user.balance - amount;
        console.log(user.id, newBalance, user.cardNumber, amount);
        await updateUserBalance(user.id, newBalance, user.cardNumber, amount);

        //userId, newBalance, numberCard, montant

        // Réponse avec le nouveau solde
        res.json({ 
            message: "Retrait réussi",
            newBalance
        });

    } catch (error) {
        console.error("Erreur lors du retrait:", error);
        res.status(500).json({ message: "Erreur interne du serveur" });
    }
};

module.exports = { login, retrait };



