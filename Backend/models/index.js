// models/index.js
import sequelize from "../config/database.js";
import User from "./User.js";
import Product from "./Product.js";

// Define relationships
User.hasMany(Product, { foreignKey: "userId", as: "products" });
Product.belongsTo(User, { foreignKey: "userId", as: "user" });

// Synchronize models with the database
sequelize
  .sync({ force: false }) // Updates tables without dropping data
  .then(() => console.log("Database synchronized successfully"))
  .catch((err) => console.error("Sequelize sync error:", err));

// Export models and sequelize instance
export { sequelize, User, Product };
