import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Product = sequelize.define(
  "Product",
  {
    index: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    modifications: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    saflaştırma: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    scale: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    totalPrice: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    oligoAdi: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    sekans: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    uzunluk: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 1,
    },
    isOrder: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    isApproved: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    isWorkingOn: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    isFinished: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    GroupId: {
      type: DataTypes.STRING, // Use STRING for the index-groupNumber format
      allowNull: true, // Allow null for ungrouped products
    },
    isFromControlGroup: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    iCount: { type: DataTypes.INTEGER, allowNull: true }, // Inosine count//
    dmt: {
      type: DataTypes.STRING,
      allowNull: true, // ✅ Allow saving DMT values
    },
    a260: { type: DataTypes.FLOAT, allowNull: true }, // A260 value
    tm: { type: DataTypes.FLOAT, allowNull: true }, // Melting temperature
    gcPercent: { type: DataTypes.FLOAT, allowNull: true }, // GC content percentage
    mw: { type: DataTypes.FLOAT, allowNull: true }, // Molecular weight
    extinctionCoefficient: { type: DataTypes.FLOAT, allowNull: true }, // Extinction coefficient
    concentration: { type: DataTypes.FLOAT, allowNull: true }, // Concentration (ng/µl)
    od: { type: DataTypes.FLOAT, allowNull: true },
    stok100M: { type: DataTypes.FLOAT, allowNull: true },
    stok50M: { type: DataTypes.FLOAT, allowNull: true },
    totalNg: { type: DataTypes.FLOAT, allowNull: true }, // Total ng
    totalNmol: { type: DataTypes.FLOAT, allowNull: true }, // Total nmol
    orderno: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "0000", // ✅ Default order number
    },
    
  },

  {
    timestamps: true,
  },
);

export default Product;
