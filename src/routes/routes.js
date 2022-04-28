const User = require("modules/user-model.js");
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
  const user = new User(userData);
  
  const response = await user.checkPassword();

  if (!response){
    return res.send("Not permited!");
  } else {
    const accessToken = user.accessToken();

    res.cookie(`refreshCookie`, `${user.refreshToken()}`, {
      maxAge: 24 * 60 * 60 * 1000,
      secure: true,
      httpOnly: true,
      path: `/invisible_cookie`
    })

    res.json({accessToken}); 
  }

})

// invisible_cookie
router.post('/invisible_cookie', ((req, res) => {
  const invisibleCookie = req.cookies.refreshCookie;

  if (!invisibleCookie){
    return res.status(403).send("Not permited!");
  } else {
    
  }
}))

// Logout

router.get('/logout', ((req, res) =>{
  res.clearCookie('refreshCookie');

  res.send("Logout");
}))

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