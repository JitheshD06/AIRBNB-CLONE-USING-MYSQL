const db = require("../utils/dbutil");

module.exports = class Favorite {
  constructor(userId, homeId) {
    this.userId = userId;
    this.homeId = homeId;
  }

  save() {
    if (this.id) {
      // update
      return db.execute("UPDATE favorites SET userId=?, homeId=? WHERE id=?", [
        this.userId,
        this.homeId,
        this.id,
      ]);
    } else {
      // insert
      return db.execute(
        "INSERT INTO favorites (userId, homeId) VALUES (?, ?)",
        [this.userId, this.homeId]
      );
    }
  }

  static fetchAll() {
    return db.execute("SELECT * FROM favorites");
  }

  static findById(id) {
    return db.execute("SELECT * FROM favorites WHERE id = ?", [id]);
  }

  static findByUserId(userId) {
    return db.execute("SELECT * FROM favorites WHERE userId = ?", [userId]);
  }

  static findByUserAndHome(userId, homeId) {
    return db.execute(
      "SELECT * FROM favorites WHERE userId = ? AND homeId = ?",
      [userId, homeId]
    );
  }

  static deleteById(id) {
    return db.execute("DELETE FROM favorites WHERE id = ?", [id]);
  }

  static deleteByUserAndHome(userId, homeId) {
    return db.execute("DELETE FROM favorites WHERE userId = ? AND homeId = ?", [
      userId,
      homeId,
    ]);
  }

  // Get all favorite homes for a user with home details
  static getFavoritesWithHomeDetails(userId) {
    return db.execute(
      `SELECT f.id as favoriteId, f.userId, f.homeId, 
              h.houseName, h.price, h.location, h.rating, h.photoUrl, h.description
       FROM favorites f
       JOIN homes h ON f.homeId = h.id
       WHERE f.userId = ?`,
      [userId]
    );
  }
};
