module.exports.getUserSocketsRoom = user => {
    return `${String(user._id).split('').reverse().join('')}-${user.id}`
};