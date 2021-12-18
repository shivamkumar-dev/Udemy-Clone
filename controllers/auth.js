exports.register = (req, res, next) => {
  console.log(req.body);
  res.json('Register Route!');
};
