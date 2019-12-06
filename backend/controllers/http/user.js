const User = require('../../models/user');

module.exports.addToBlacklist = async (req,res)=>{
    try {
        let blacklistOwner = await User.findById(req.decoded.id);
        if(!blacklistOwner){
            throw new Error('Your account not found')
        }
        const blacklistedUser = await User.findById(req.body.blacklistedId);
        if(!blacklistedUser){
            throw new Error('User not found')
        }
        const isInBlacklist = !!blacklistOwner.blacklist.find(i=> String(i) === req.body.blacklistedId);
        if(isInBlacklist){
            throw new Error('User is already in blacklist')
        }
        blacklistOwner.blacklist.push(req.body.blacklistedId);
        blacklistOwner = await blacklistOwner.save();
        res.send(blacklistOwner.blacklist);
    }catch (e){
        console.log(e);
        res.status(500).send(e.message)
    }
};

module.exports.removeFromBlacklist = async (req,res)=> {
    try {
        let blacklistOwner = await User.findById(req.decoded.id);
        if (!blacklistOwner) {
            throw new Error('Your account not found')
        }
        const isInBlacklist = !!blacklistOwner.blacklist.find(i => String(i) === req.body.blacklistedId);
        if (!isInBlacklist) {
            throw new Error('User is not in blacklist')
        }
        blacklistOwner.blacklist.pull(req.body.blacklistedId);
        blacklistOwner = await blacklistOwner.save();
        res.send(blacklistOwner.blacklist);
    } catch (e) {
        console.log(e);
        res.status(500).send(e.message)
    }
};

module.exports.getBlacklist = async (req, res) => {
    let blacklistOwner = await User.findById(req.decoded.id);
    if (!blacklistOwner) {
        throw new Error('Your account not found')
    }
    res.send(blacklistOwner.blacklist)
}