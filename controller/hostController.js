const Home = require("../models/home");

exports.getAddHome = (req, res, next) => {
  res.render("host/edit-home", {
    pageTitle: "ADD-HOME",
    editing: false,
    home: {},
  });
};

exports.postAddHome = (req, res, next) => {
  const { houseName, price, location, rating, photoUrl, description } =
    req.body;

  const home = new Home(
    houseName,
    price,
    location,
    rating,
    photoUrl,
    description
  );
  home
    .save()
    .then(() => {
      res.render("host/home_added", {
        pageTitle: "Home Added Successfully",
      });
    })
    .catch((err) => {
      console.log("Error while saving:", err);
    });
};

// Shows the list of all homes
exports.getHostHomeList = (req, res, next) => {
  Home.fetchAll()
    .then(([homearr]) => {
      res.render("host/host_list", {
        homearr,
        pageTitle: "HOSTS-HOMELIST",
      });
    })
    .catch((error) => {
      console.log("Error while fetching homes:", error);
    });
};

// Renders the edit-home form with existing values
exports.getEditHomeList = (req, res, next) => {
  const homeId = req.params.homeId;
  const editing = req.query.editing === "true";

  Home.findById(homeId)
    .then(([rows]) => {
      const home = rows[0];
      if (!home) {
        console.log("Home not found");
        return res.redirect("/host/hostlist");
      }
      res.render("host/edit-home", {
        pageTitle: "Edit Home",
        editing,
        home,
      });
    })
    .catch((err) => {
      console.log("Error finding home:", err);
    });
};

// Updates a home in the DB
exports.postEditHome = (req, res, next) => {
  const { id, houseName, price, location, rating, photoUrl, description } =
    req.body;

  const home = new Home(
    houseName,
    price,
    location,
    rating,
    photoUrl,
    description
  );

  home.id = id; // This is what triggers UPDATE logic inside save()

  home
    .save()
    .then(() => {
      res.redirect("/host/hostlist");
    })
    .catch((err) => {
      console.log("Error while updating home:", err);
    });
};

// Deletes a home by ID
exports.postDeleteHome = (req, res, next) => {
  const homeId = req.params.homeId;

  Home.deleteById(homeId)
    .then(() => {
      res.redirect("/host/hostlist");
    })
    .catch((err) => {
      console.log("Error while deleting home:", err);
    });
};

// exports.gethomeadded = (req, res, next) => {
//   homearr.push({ HOUSENAME: req.body.Housename }),
//     console.log(req.body),
//     res.render("home_added", { Pagetitle: "HOME ADDED" });
// };

//Replaced code
