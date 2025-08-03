const Home = require("../models/home");
const Favorite = require("../models/favourites");

exports.getHome = (req, res, next) => {
  Home.fetchAll()
    .then(([homearr]) => {
      console.log("Homes available:", homearr);
      res.render("store/home", {
        homearr,
        pageTitle: "HOME_PAGE",
      });
    })
    .catch((error) => {
      console.log("Error occurred:", error);
    });
};

exports.bookings = (req, res, next) => {
  res.render("store/bookings", {
    pageTitle: "BOOKING-PAGE",
  });
};

exports.getHomeList = (req, res, next) => {
  Home.fetchAll()
    .then(([homearr]) => {
      res.render("store/home-list", {
        homearr,
        pageTitle: "HOME-LIST",
      });
    })
    .catch((error) => {
      console.log("Error fetching home list:", error);
    });
};

exports.getHomeDetails = (req, res, next) => {
  const homeId = req.params.homeId;

  Home.findById(homeId)
    .then(([rows]) => {
      const home = rows[0];
      if (!home) {
        console.log("Home not found");
        return res.redirect("/homes");
      }

      res.render("store/home-detail", {
        home,
        pageTitle: "Home Detail",
      });
    })
    .catch((error) => {
      console.log("Error fetching home detail:", error);
    });
};

exports.getFavouriteList = (req, res, next) => {
  // Temporarily hard-code userId to 1 for testing
  const userId = 1;

  Favorite.getFavoritesWithHomeDetails(userId)
    .then(([favouriteHomes]) => {
      res.render("store/favourite", {
        favouriteHomes: favouriteHomes,
        pageTitle: "My Favourites",
        currentPage: "favourites",
      });
    })
    .catch((error) => {
      console.log("Error fetching favourite list:", error);
      res.render("store/favourite", {
        favouriteHomes: [],
        pageTitle: "My Favourites",
        currentPage: "favourites",
      });
    });
};

exports.postAddToFavourite = async (req, res, next) => {
  try {
    const homeId = req.body.id;
    const userId = 1; // Hard-coded for now

    // Check if already favorited
    const [existing] = await Favorite.findByUserAndHome(userId, homeId);

    if (existing.length > 0) {
      console.log("Home already in favourites");
      return res.redirect("/favourites");
    }

    // Add to favorites
    const favorite = new Favorite(userId, homeId);
    await favorite.save();

    console.log("Home added to favourites successfully");
    res.redirect("/favourites");
  } catch (error) {
    console.log("Error while marking favourite: ", error);
    res.redirect("/favourites");
  }
};

exports.postRemoveFromFavourite = (req, res, next) => {
  const homeId = req.params.homeId;
  // Temporarily hard-code userId to 1 for testing
  const userId = 1;

  Favorite.deleteByUserAndHome(userId, homeId)
    .then(([result]) => {
      if (result.affectedRows === 0) {
        console.log("Favourite not found");
      } else {
        console.log("Home removed from favourites successfully");
      }
      res.redirect("/favourites");
    })
    .catch((error) => {
      console.log("Error while removing from Favourite", error);
      res.redirect("/favourites");
    });
};

exports.favourite = (req, res, next) => {
  res.render("store/favourite", {
    pageTitle: "FAVORITE-PAGE",
  });
};

exports.checkFavoriteStatus = (req, res, next) => {
  const homeId = req.params.homeId;
  const userId = req.session.userId || 1;

  Favorite.findByUserAndHome(userId, homeId)
    .then(([favorite]) => {
      res.json({
        isFavorited: favorite.length > 0,
      });
    })
    .catch((error) => {
      console.log("Error checking favorite status:", error);
      res.json({ isFavorited: false });
    });
};
