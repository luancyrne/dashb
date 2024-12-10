const formatDateForMySQL = (date) => {
    return new Date(date).toISOString().slice(0, 19).replace('T', ' ');
};

const formatDateToBR = (date) => {
    return date ? new Date(date).toLocaleString('pt-BR') : null;
};

module.exports = {
    formatDateForMySQL,
    formatDateToBR
};