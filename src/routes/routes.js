const path = require("path");
const multer = require("multer");
const User = require("../modules/user-model.js");
const router = require("express").Router();
const fs = require('fs');

// Cadastro
router.post('/adduser', async (req, res) => {
  const userData = req.body;

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
    return res.status(401).json({query:'Falha ao logar. Username ou senha incorretos.'});
  } else {
    const accessToken = user.accessToken();
    
    res.cookie(`refreshCookie`, `${await user.refreshToken()}`, {
      maxAge: 24 * 60 * 60 * 1000,
      secure: true,
      httpOnly: true,
      path: `/invisible_cookie`
    });

    res.status(200).json({accessToken}); 
  }

})

// invisible_cookie
router.post('/invisible_cookie', async (req, res) => {
  const invisibleCookie = req.cookies.refreshCookie;

  if (!invisibleCookie){
    return res.status(403).send("Not permited!");
  };
  const user = new User({invisibleCookie});
  const bol = await user.searchUserToken()
    .catch(err=>{
      res.status(403).send('Forbidden');
    });

  if(!bol){
    res.status(403).send('Forbidden');
  };
  const accessToken = user.accessToken();
  const refreshToken = await user.refreshToken();

  res.cookie(`refreshCookie`, refreshToken, {
    maxAge: 24 * 60 * 60 * 1000,
    secure: true,
    httpOnly: true,
    path: `/invisible_cookie`
  });

  res.json({accessToken}); 
  
});

// Logout

router.get('/logout', ((req, res) =>{
  res.clearCookie('refreshCookie');

  res.send("Logout");
}))

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, 'images');
  },
  filename: (req, file, cb) => {
      let pathName = (new Date).getTime() + photoinfo.originalname;
      cb(null, pathName);
  }
});

const upload = multer({storage : storage })

// Post Photo
router.post('/postphoto', upload.single('image'), (req, res) => {
  const photoinfo = req.file;
  const { description } = req.body;

  let user = new User({description, localImage: path.join( __dirname, "../../images/") + (new Date).getTime() + photoinfo.originalname});
  user.postImage();
  
  // Save photo

  res.send("done");
})


// Edit Profile
router.post('/editprofile', async (req, res) => {
  const newUserData = req.body;
  let accessToken = req.headers.authorization;
  accessToken = accessToken.split('bearer ')[1];
  
  const user = new User({newUserData, accessToken});

  if(await user.checkAutentication()){
    await user.editProfile()
      .then(response => {
        return res.send("Editado!");
      })
      .catch(error => {
        return res.send(`Erro no cadatro, código: ${error}`)
      });
  } else {
    return res.send("Falha na autenticação!");
  }

})

router.get('/getImages', async (req, res) => {
  const user = new User({});
  let arrPhotos = (await user.getImage());
  const response = [];
  arrPhotos.forEach(photoInfo => {
    let img64 = fs.readFileSync(photoInfo.local_image, 'base64')
    let tagImg = `<img src="data:image/jpeg;base64,${img64}" />`;
    response.push({ name: photoInfo.name, title: photoInfo.title, description: photoInfo.description, img: tagImg });
  })
  res.json(response)
});


module.exports = router;