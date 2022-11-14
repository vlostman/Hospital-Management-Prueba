const router = require("express").Router();
const User = require("../../models/doctor/user");
const passport = require("passport");
const Patient = require("../../models/patients/patient");

router.post("/", (req, res) => {

  // el siguiente código es solo para registrar un nuevo correo electrónico como médico ...

  //User.register({ username: req.body.username }, req.body.password).then((user) => {
  //passport.authenticate("local")(req, res, () => {
  //res.redirect("/home")
  //})

  //}).catch((err) => {
  //console.log(err)
  //res.redirect("/")
  //})

  //------>>>

  // El siguiente código es solo para el correo electrónico de inicio de sesión como médico...


  const user = new User({
    username: req.body.username,
    password: req.body.password,
  });

  req.login(user, (err) => {
    if (err) {
      console.log(err);
    } else {
      passport.authenticate("local")(req, res, () => {
        res.redirect("/home");
      });
    }
  });
});
///--->

router.post("/home", (req, res) => { // Detalles del paciente - revisar
  const patientData = req.body.patientId && req.body.name && req.body.age && req.body.mobileNo && req.body.address && req.body.disease && req.body.fees;

  if (patientData) {
    const patinet = new Patient(req.body);
    patinet.save().then(() => {
      
      res.render("success", {
        subTitle: "Success",
        subject: "added",
      });
    });
  }
   else {
    res.render("failure", {
      title: "Please add patient detail's",
      url: "add",
    });
  }
});

router.post("/search", (req, res) => {
  // Busqueda del paciente mas detalles - incompleto
  Patient.findOne({ patientId: req.body.patientId }).then((userData) => {
    if (userData) {
      
      console.log(userData);
      
      res.render("searchResults", {
        patientId: userData.patientId,
        name: userData.name,
        age: userData.age,
        mobileNo: userData.mobileNo,
        email: userData.email,
        date: userData.date,
        address: userData.address,
        disease: userData.disease,
        fees: userData.fees,
      });
    } else { 
      res.render("failure", {
        title: "No existe",
        url: "search",
      });
    }
  });
});

router.post("/update", (req, res) => {
  // Actualizacion de detalles del paciente
  Patient.findOne({ patientId: req.body.patientId }).then((userData) => {
    if (userData) {
      res.render("update", {
        patientId: userData.patientId,
        name: userData.name,
        age: userData.age,
        mobileNo: userData.mobileNo,
        email: userData.email,
        date: userData.date,
        address: userData.address,
        disease: userData.disease,
        fees: userData.fees,
      });
    } else {
      res.render("failure", {
        title: "No existe",
        url: "update",
      });
    }
  });
});

router.post("/updateresults", (req, res) => {
  Patient.findOneAndUpdate({ patientId: req.body.patientId }, req.body).then(
    () => {
      res.render("success", {
        subTitle: "Updated",
        subject: "updated",
      });
    }
  );
});

router.post("/delete", (req, res) => {
  // Borrado de detalles de paciente
  if (req.body.patientId) {
    Patient.findOneAndDelete({ patientId: req.body.patientId }).then(() => {
      res.render("success", {
        subTitle: "Deleted",
        subject: "delete",
      });
    });
  } else {
    res.render("failure", {
      title: "No existe",
      url: "delete",
    });
  }
});

module.exports = router;
