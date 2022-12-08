const bcrypt = require('bcryptjs');
const helpers = {};

helpers.encryptPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    console.log("Contraseña Original --> " + password);
    const final = await bcrypt.hash(password, salt);
    console.log("Contraseña Cifrada --> " + final);
    return final;
};

helpers.matchPassword = async (password, savePassword) => {
    try {
        await bcrypt.compare(password, savePassword);
    } catch (error) {
        console.log(error);
        //flash de contraseña incorrecta
    }
};

module.exports = helpers;