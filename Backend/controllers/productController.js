import Product from "../models/Product.js";
import User from "../models/User.js"; // Ensure you have a User model to fetch user data
import transporter from "../services/email/transporter.js";
import submissionConfirmationTemplate from "../services/email/templates/submissionConfirmationTemplate.js";
import {
  sendApprovedEmail,
  sendWorkingOnEmail,
  sendFinishedEmail,
} from "../services/email/emailService.js";

import { sequelize } from "../models/index.js"; // Correct Sequelize instance import

import { Parser } from "json2csv"; // ✅ Ensure correct import

export const exportProductsCsv = async (req, res) => {
  try {
    const { products } = req.body; // ✅ Get filtered products from frontend
    if (!products || products.length === 0) {
      return res.status(400).json({ error: "No products provided." });
    }

    // Fetch user details for each product
    const userIds = [...new Set(products.map((p) => p.userId))]; // ✅ Get unique user IDs
    const users = await User.findAll({
      where: { id: userIds },
      attributes: ["id", "username"], // Fetch only necessary fields
    });

    // Create a map of userId -> username
    const userMap = {};
    users.forEach((user) => {
      userMap[user.id] = user.username;
    });

    // ✅ Format data for CSV with usernames
    const csvData = products.map((product) => ({
      sekans: product.sekans,
      dmt: product.dmt || "DMTOFF",
      productId: product.index || "N/A",
      oligoname: product.oligoAdi,
      username: userMap[product.userId] || "Unknown", // ✅ Assign username dynamically
    }));

    const { Parser } = await import("json2csv");
    const parser = new Parser({
      fields: ["sekans", "dmt", "productId", "oligoname", "username"],
      header: false,
    });
    const csv = parser.parse(csvData);

    res.header("Content-Type", "text/csv");
    res.attachment("filtered_products.csv");
    res.send(csv);
  } catch (error) {
    console.error("Error exporting CSV:", error);
    res.status(500).json({ error: "Failed to export CSV." });
  }
};

export const addProduct = async (req, res) => {
  const { products } = req.body;
  const userId = req.user?.id;

  try {
    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ error: "No products provided." });
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    // ✅ Begin transaction for atomic operations
    const createdProducts = await sequelize.transaction(async (t) => {
      const productsToCreate = await Promise.all(
        products.map(async (product) => {
          return await Product.create(
            {
              index: product.index, // ✅ Save the assigned index
              category: product.category,
              GroupId: product.GroupId,
              modifications: product.modifications,
              saflaştırma: product.saflaştırma,
              scale: product.scale,
              totalPrice: product.totalPrice,
              oligoAdi: product.oligoAdi,
              userId,
              sekans: product.sekans,
              uzunluk: product.uzunluk,
              quantity: product.quantity || 1,
              isOrder: true,
              isFromControlGroup: product.isFromControlGroup || false,
              isApproved: product.isApproved || false,
              dmt: product.dmt, // ✅ Save the assigned DMT value
            },
            { transaction: t },
          );
        }),
      );

      return productsToCreate;
    });

    res.status(201).json({
      message: "Products added successfully.",
      products: createdProducts,
    });
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({ error: "Failed to add product." });
  }
};

//
//
//
// Get All Products
export const getProducts = async (req, res) => {
  const userRole = req.user?.role; // Authenticated user's role
  const userId = req.query.userId || req.user?.id; // Query param or authenticated user's ID
  const isSpecificUser = req.query.isSpecificUser === "true"; // Query flag to determine the data to fetch

  try {
    let products;

    if (userRole === "admin") {
      // Admin requesting all or specific user products
      if (isSpecificUser && userId) {
        products = await Product.findAll({
          where: { userId },
          order: [["createdAt", "DESC"]],
        });
      } else {
        products = await Product.findAll({
          order: [["createdAt", "DESC"]],
        });
      }
    } else if (userRole === "user") {
      // Regular user requesting their own products
      products = await Product.findAll({
        where: { userId },
        order: [["createdAt", "DESC"]],
      });
    } else {
      return res.status(403).json({ error: "Unauthorized access." });
    }

    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Failed to fetch products." });
  }
};

// Get Product by ID
export const getProductById = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ error: "Product not found." });
    }
    res.status(200).json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ error: "Failed to fetch product." });
  }
};

// Update Product
export const updateProduct = async (req, res) => {
  const { id } = req.params;
  const {
    category,
    modifications,
    saflaştırma,
    scale,
    totalPrice,
    oligoAdi,
    quantity,
    sekans,
    uzunluk,
    isOrder,
    isApproved,
    isWorkingOn,
    isFinished,
    GroupId,
    createdAt,
  } = req.body;

  try {
    if (id === "all") {
      const { productIds } = req.body;
      if (!Array.isArray(productIds) || productIds.length === 0) {
        return res
          .status(400)
          .json({ error: "No product IDs provided for bulk update." });
      }

      const updatedProducts = [];
      let currentIndex = 1;
      for (const productId of productIds) {
        const product = await Product.findByPk(productId);
        if (!product) continue;

        await product.update({
          category: category || product.category,
          modifications: modifications || product.modifications,
          saflaştırma: saflaştırma || product.saflaştırma,
          scale: scale || product.scale,
          totalPrice: totalPrice || product.totalPrice,
          oligoAdi: oligoAdi || product.oligoAdi,
          quantity: quantity !== undefined ? quantity : product.quantity,
          sekans: sekans || product.sekans,
          uzunluk: uzunluk || product.uzunluk,
          index: currentIndex++,
          GroupId: GroupId || product.GroupId,
          createdAt: createdAt || product.createdAt,
          isOrder: isOrder !== undefined ? isOrder : product.isOrder,
          isApproved:
            isApproved !== undefined ? isApproved : product.isApproved,
          isWorkingOn:
            isWorkingOn !== undefined ? isWorkingOn : product.isWorkingOn,
          isFinished:
            isFinished !== undefined ? isFinished : product.isFinished,
        });
        updatedProducts.push(product.toJSON());
      }

      return res
        .status(200)
        .json({ message: "Products updated successfully.", updatedProducts });
    } else {
      const product = await Product.findByPk(id);
      if (!product) {
        return res.status(404).json({ error: "Product not found." });
      }

      await product.update({
        category: category || product.category,
        modifications: modifications || product.modifications,
        saflaştırma: saflaştırma || product.saflaştırma,
        scale: scale || product.scale,
        totalPrice: totalPrice || product.totalPrice,
        oligoAdi: oligoAdi || product.oligoAdi,
        quantity: quantity !== undefined ? quantity : product.quantity,
        sekans: sekans || product.sekans,
        uzunluk: uzunluk || product.uzunluk,
        GroupId: GroupId || product.GroupId,
        index: index || product.index,
        createdAt: createdAt || product.createdAt,
        isOrder: isOrder !== undefined ? isOrder : product.isOrder,
        isApproved: isApproved !== undefined ? isApproved : product.isApproved,
        isWorkingOn:
          isWorkingOn !== undefined ? isWorkingOn : product.isWorkingOn,
        isFinished: isFinished !== undefined ? isFinished : product.isFinished,
      });

      return res
        .status(200)
        .json({ message: "Product updated successfully.", product });
    }
  } catch (error) {
    console.error("Error updating product:", error);
    res
      .status(500)
      .json({ error: "Failed to update product.", details: error.message });
  }
};

//
//
//
// Delete Product
export const deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ error: "Product not found." });
    }

    await product.destroy();
    res.status(200).json({ message: "Product deleted successfully." });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ error: "Failed to delete product." });
    // Update Product
  }
};

export const getGroupById = async (req, res) => {
  const groupId = req.params.groupId.trim(); // Handle string IDs with whitespace

  try {
    const products = await Product.findAll({
      where: {
        GroupId: groupId, // Match string-based GroupId
      },
      order: [["createdAt", "DESC"]],
    });

    if (!products.length) {
      return res
        .status(404)
        .json({ error: `No products found in group ${groupId}` });
    }

    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching group:", error);
    res.status(500).json({ error: "Server error" });
  }
};

//////aliyev
//
//
const calculateProductValues = (sekans, modifications, a260) => {
  const modificationCoefficients = {
    FAM: 20960,
    HEX: 31580,
    JOE: 12000,
    TAMRA: 31980,
    Amino: 8400,
    "Biotin/Thiol/Phosphate": 0,
    "FAM-BHQ1": 28900,
    "FAM-TAMRA": 52880,
    "HEX-BHQ1": 39580,
    "CY5-BHQ2": 18000,
    "TAMRA-BHQ2": 40300,
  };

  const modArray = Array.isArray(modifications) ? modifications : [];

  const aCount = (sekans.match(/A/g) || []).length;
  const tCount = (sekans.match(/T/g) || []).length;
  const gCount = (sekans.match(/G/g) || []).length;
  const cCount = (sekans.match(/C/g) || []).length;
  const iCount = (sekans.match(/I/g) || []).length;
  const totalBases = aCount + tCount + gCount + cCount + iCount;

  if (totalBases === 0) throw new Error("Sekans must contain valid bases.");

  const tm = 2 * (aCount + tCount) + 4 * (gCount + cCount);
  const gcPercent = parseFloat(
    (((gCount + cCount) / totalBases) * 100).toFixed(2),
  );
  const mw = parseFloat(
    (
      335.2 * aCount +
      311.2 * cCount +
      326.2 * tCount +
      351 * gCount +
      330 * iCount -
      101
    ).toFixed(2),
  );

  const extinctionCoefficient = parseFloat(
    (
      modArray.reduce(
        (acc, mod) => acc + (modificationCoefficients[mod] || 0),
        0,
      ) +
      15400 * aCount +
      7400 * cCount +
      11500 * gCount +
      8700 * tCount
    ).toFixed(2),
  );

  const concentration = parseFloat(
    ((a260 * mw * 1000) / extinctionCoefficient).toFixed(2),
  );
  const totalNg = parseFloat((concentration * 280).toFixed(2));
  const od = parseFloat((totalNg / 33000).toFixed(2));
  const totalNmol = parseFloat((totalNg / mw).toFixed(2));
  const stok100M = parseFloat((totalNmol * 10).toFixed(2));
  const stok50M = parseFloat((stok100M * 2).toFixed(2));

  return {
    tm,
    gcPercent,
    mw,
    extinctionCoefficient,
    totalBases,
    concentration,
    totalNg,
    od,
    totalNmol,
    stok100M,
    stok50M,
    iCount,
  };
};

// ✅ Fix updateA260Values function
export const updateA260Values = async (req, res) => {
  try {
    console.log("✅ Received A260 update request", req.body);

    const { updatedProducts } = req.body;
    if (!Array.isArray(updatedProducts) || updatedProducts.length === 0) {
      return res.status(400).json({ error: "No products provided." });
    }

    const updatedProductsList = [];

    for (const { id, a260 } of updatedProducts) {
      console.log(`🔍 Processing ID: ${id}, A260: ${a260}`);

      // ✅ Ensure ID is a valid number
      if (!id || isNaN(Number(id))) {
        console.error(`❌ Invalid ID received: ${id}`);
        continue;
      }

      const product = await Product.findByPk(id);
      if (!product) {
        console.warn(`⚠️ Product not found for ID: ${id}`);
        continue;
      }

      const calculatedValues = calculateProductValues(
        product.sekans,
        product.modifications,
        a260,
      );

      await product.update({ a260, ...calculatedValues });

      updatedProductsList.push({ ...product.toJSON(), ...calculatedValues });
    }

    return res.status(200).json({
      message: "A260 values updated successfully.",
      updatedProducts: updatedProductsList,
    });
  } catch (error) {
    console.error("❌ Error updating A260 values:", error);
    res.status(500).json({ error: "Failed to update A260 values." });
  }
};

// Function 1: Iptal Sentez
export const cancelSynthesis = async (req, res) => {
  try {
    console.log("Received cancel request:", req.body); // ✅ Log received data

    const { products } = req.body;
    if (!products || !Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ error: "Invalid product data received" });
    }

    await Product.update(
      { isWorkingOn: false, isApproved: true, GroupId: null },
      { where: { id: products.map((p) => p.id) } },
    );

    res.json({ message: "Synthesis cancelled successfully" });
  } catch (error) {
    console.error("Error cancelling synthesis:", error);
    res.status(500).json({ error: "Failed to cancel synthesis" });
  }
};

// Function 2: Garanti Tekrar
export const retryGuarantee = async (req, res) => {
  try {
    console.log("Received retry guarantee request:", req.body); // ✅ Log received data

    const { products } = req.body;
    if (!products || !Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ error: "Invalid product data received" });
    }

    // Update the selected products (remove from group, reset status, add "gt" to oligoAdi)
    for (const productData of products) {
      const product = await Product.findByPk(productData.id);
      if (!product) continue;

      await product.update({
        isWorkingOn: false,
        isApproved: true,
        GroupId: null,
        oligoAdi: `gt${product.oligoAdi}`, // ✅ Prefix "gt" to oligoAdi
      });
    }

    res.json({ message: "Retry guarantee applied successfully" });
  } catch (error) {
    console.error("❌ Error applying retry guarantee:", error);
    res.status(500).json({ error: "Failed to apply retry guarantee" });
  }
};
