const router = require("express").Router();


// Cadastro
router.post('/adduser', async (req, res) => {
  const userData = req.body;

  console.log(userData);

  const user = new User(userData);
  await user.createUser()
  .then(() => {
    return res.send("loginPage")
})
  .catch(error => {
    console.log(error);
    return res.send(error);
  });  

})


// Login
router.post('/checkuser', async (req, res) => {
  const userData = req.body;

  console.log(userData);

  // Comparar dados com o DB

  res.send("done");

})

// Post Photo
router.post('/postphoto', async (req, res) => {
  const photoinfo = req.body;

  // Save photo

  res.send("done");
})


// Edit Profile
router.post('/editprofile', async (req, res) => {
  const newUserData = req.body;

  // data update

  res.send("done");
})



module.exports = router;