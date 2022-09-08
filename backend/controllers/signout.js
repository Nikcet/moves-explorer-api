// Удаляет jwt из куки
module.exports.loggedOut = (req, res) => {
  res.clearCookie('jwt');
  return res.send('Logged out');
};
