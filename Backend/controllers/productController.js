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






import { Parser } from "json2csv";

// ✅ Get today's date in YYMMDD format
function getFormattedDate() {
  return new Date().toISOString().slice(2, 10).replace(/-/g, ""); // Convert to "YYMMDD"
}

export const exportProductsCsv = async (req, res) => {
  try {
    const { products } = req.body;
    if (!products || products.length === 0) {
      return res.status(400).json({ error: "No products provided." });
    }

    // ✅ Only fetch products **sent from the frontend**
   // const productIndexes = products.map((p) => p.GroupId );

    // ✅ Fetch only **selected products** from the database
    const dbProducts = products;

    // ✅ Fetch users
    const userIds = [...new Set(dbProducts.map((p) => p.userId))];
    const users = await User.findAll({
      where: { id: userIds },
      attributes: ["id", "username"],
    });

    const userMap = Object.fromEntries(users.map((user) => [user.id, user.username]));

    // ✅ Generate CSV data
    const csvData = dbProducts.map((product) => {
      const isFiveModified = product.modifications?.fivePrime?.trim(); // Check if fivePrime has value
      const formattedSekans = isFiveModified ? `5${product.sekans}` : product.sekans;

      const sentezNo = `${getFormattedDate()}-${product.GroupId || "N/A"}-${product.index || "N/A"}`;

      return [
        formattedSekans,
        product.dmt || "DMTOFF",
        sentezNo,
        product.oligoAdi || "Unnamed",
        userMap[product.userId] || "Unknown",
      ].join(","); // ✅ No quotes, just separated by commas
    });

    // ✅ Join rows into CSV format
    const csv = csvData.join("\n");

    res.header("Content-Type", "text/csv");
    res.attachment("filtered_products.csv");
    res.send(csv);
  } catch (error) {
    console.error("❌ Error exporting CSV:", error);
    res.status(500).json({ error: "Failed to export CSV." });
  }
};



import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Function to shorten the sequence if it exceeds 25 characters
const shortenSekans = (sekans, maxLength = 25) => {
  if (sekans.length <= maxLength) return sekans;
  const partLength = Math.floor((maxLength - 3) / 2); // Keep both sides, replace middle with "..."
  return sekans.slice(0, partLength) + "..." + sekans.slice(-partLength);
};
// ZPL dosyası oluşturma fonksiyonu (Daha kompakt hale getirildi)
const generateZPL = (data) => {
  const isFiveModified = data.modifications?.fivePrime?.trim(); // Check if fivePrime has value
  const isThreeModified = data.modifications?.threePrime?.trim(); // Check if threePrime has value
  let formattedSekans = isFiveModified ? `5'${data.sekans}` : data.sekans;
  formattedSekans = isThreeModified ? `${formattedSekans}3'` : formattedSekans;
  formattedSekans = shortenSekans(formattedSekans); // Apply length limit
  
  const sentezNo = `${getFormattedDate()}-${data.GroupId || "N/A"}-${data.index || "N/A"}`;

  return `
^XA
^CI28  ; UTF-8 desteği

^FO30,10^A0N,20,20^FD${data.oligoAdi}^FS  ; Oligo Adı
^FO30,50^A0N,18,18^FD${sentezNo}   ${data.uzunluk}bp^FS  ; GroupID ve Uzunluk
^FO30,75^A0N,18,18^FD${formattedSekans}^FS  ; Sekans
^FO30,100^A0N,18,18^FDTM:${data.tm}°C    MW:${data.mw}^FS  ; TM ve MW değerleri


^FO30,120^GFA,714,714,17,,::005,00A,00B,00DV02002I04001,015R08I02004I05001,00DR0CI02002I04001,015Q01CI028K04001,02AQ01EI02L0A0014,02S0CI02L04001,0AK03E0782D1F05C34K050018,34K0FF1FEFFDFCFF55821F0A7D17A,581CI0FF5FF7FDFAFF5AA125A40A5AA,683C001F53EKF5FFAA8A324AA5495,301E001C278FF2FE3C3E06490A401282,B83E001E0387E0FC183D052405A01A828,281E001E0707E0FC3C7C02AA05402901,141DI0FC79FE0FC397A82AA02A095028,0406I0FEBFF70FE3FF502480542EA81,02828007F7FDE0FC3FF202A502AB2A01,0281I01IF460FC3F820554055415814,02A0EI07FC0E0FC1E05024A02AA1402,01C1F8003F80F0FE3802052405540B014,02A0F8007F80E0FC3E2284AA85542943,01C0FC0D7BFEE0FF9FAA2A422A541514,0080F81FF5FEE0FFEFF5AA23A8ABDAEB,J0FC0FF2FF60F7AFF2D450DA45515A,I01F80FD0FCD0A785F02I02I0J4,I01F4004M041008,0025A8,00B68,00FC,01FC,00FC,01F8,:00F8,01F,005,002,^FS

^XZ
    `;
};

// ZPL dosyası oluştur ve indir
export const generateZPLFile = async (req, res) => {
    try {
        const { products } = req.body;
        if (!products || !Array.isArray(products) || products.length === 0) {
            return res.status(400).json({ error: "Geçerli bir ürün listesi gönderin." });
        }
        
        let zplData = products.map(generateZPL).join("\n");
        const filePath = path.join(__dirname, "etiket.zpl");
        
        fs.writeFileSync(filePath, zplData, "utf8");
        res.download(filePath, "etiket.zpl", () => {
            fs.unlinkSync(filePath); // Dosyayı indirdikten sonra sil
        });
    } catch (error) {
        console.error("❌ Error generating ZPL file:", error);
        res.status(500).json({ error: "Failed to generate ZPL file." });
    }
};


// Kutu Etiketi fonksiyonu - User bazlı sayfa oluşturur
// Kutu Etiketi fonksiyonu - User bazlı sayfa oluşturur
const generateKutuEtiketi = async (products) => {
  const users = {};
  
  // Kullanıcıları grupla
  products.forEach(product => {
      if (!users[product.userId]) users[product.userId] = [];
      users[product.userId].push(product);
  });
  
  let zplData = "";
  for (const userId of Object.keys(users)) {
      const user = await User.findByPk(userId);
      const username = user ? user.username : "Unknown";
      const userProducts = users[userId];
      for (let i = 0; i < userProducts.length; i += 6) {
          const pageProducts = userProducts.slice(i, i + 6);
          
          zplData += `^XA
^CI28  ; UTF-8 desteği
^FO30,20^A0N,22,22^FD ${username}^FS
^FO30,50^GB500,3,3^FS
`;
          
          let yOffset = 80;
          pageProducts.forEach(product => {
              zplData += `^FO30,${yOffset}^A0N,18,18^FD${getFormattedDate()}-${product.GroupId || 'N/A'}-${product.index || 'N/A'}       ${product.oligoAdi}^FS\n`;
              yOffset += 30;
          });
          
          zplData += "^XZ\n";
      }
  };
  return zplData;
};

// Kutu Etiketi ZPL dosyası oluştur ve indir
export const generateKutuEtiketiFile = async (req, res) => {
  try {
      const { products } = req.body;
      if (!products || !Array.isArray(products) || products.length === 0) {
          return res.status(400).json({ error: "Geçerli bir ürün listesi gönderin." });
      }
      
      const zplData = await generateKutuEtiketi(products);
      const filePath = path.join(__dirname, "kutu_etiketi.zpl");
      
      fs.writeFileSync(filePath, zplData, "utf8");
      res.download(filePath, "kutu_etiketi.zpl", () => {
          fs.unlinkSync(filePath); // Dosyayı indirdikten sonra sil
      });
  } catch (error) {
      console.error("❌ Error generating Kutu Etiketi ZPL file:", error);
      res.status(500).json({ error: "Failed to generate Kutu Etiketi ZPL file." });
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

    // ✅ Ensure orderno exists; Default to "0000" if missing
    const currentOrderNo = user.orderno || "0000";
    const newOrderNo = (parseInt(currentOrderNo, 10) + 1).toString().padStart(4, "0");

    // ✅ Update user's orderno
    await user.update({ orderno: newOrderNo });

    // ✅ Begin transaction for atomic operations
    const createdProducts = await sequelize.transaction(async (t) => {
      return Promise.all(
        products.map(async (product) => {
          return await Product.create(
            {
              index: product.index, 
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
              dmt: product.saflaştırma=== "OPC" ? "DMTOFF" : "DMTON",
              orderno: newOrderNo, // ✅ Assign the same orderno to all products
            },
            { transaction: t }
          );
        })
      );
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
    index,
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
      const userMap = {}; // Store user email mapping for bulk emails
      let currentIndex = 1;

      for (const productId of productIds) {
        const product = await Product.findByPk(productId);
        if (!product) continue;

        const user = await User.findByPk(product.userId);
        if (!user) continue;

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

        if (!userMap[user.email]) {
          userMap[user.email] = { username: user.username, products: [] };
        }
        userMap[user.email].products.push(product.toJSON());
      }

      const finishedProducts = {}; // Store users who have finished products

      for (const [userEmail, { username, products }] of Object.entries(
        userMap
      )) {
        if (isApproved) {
          await sendApprovedEmail(userEmail, username, products);
        }
        if (isWorkingOn) {
          await sendWorkingOnEmail(userEmail, username, products);
        }
        if (isFinished) {
          if (!finishedProducts[userEmail]) {
            finishedProducts[userEmail] = { username, products: [] };
          }
          finishedProducts[userEmail].products.push(...products); // Collect all finished products
        }
      }

      // Send all finished emails together
      for (const [userEmail, { username, products }] of Object.entries(
        finishedProducts
      )) {
        await sendFinishedEmail(userEmail, username, products);
      }

      return res
        .status(200)
        .json({ message: "Products updated successfully.", updatedProducts });
    } else {
      const product = await Product.findByPk(id);
      if (!product) {
        return res.status(404).json({ error: "Product not found." });
      }

      const user = await User.findByPk(product.userId);
      if (!user) {
        return res.status(404).json({ error: "User not found." });
      }

      const previousStatus = {
        isApproved: product.isApproved,
        isWorkingOn: product.isWorkingOn,
        isFinished: product.isFinished,
      };

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

      const productDetails = [product.toJSON()];

      // Send email notifications if status changed
      if (isApproved && !previousStatus.isApproved) {
        await sendApprovedEmail(user.email, user.username, productDetails);
      }
      if (isWorkingOn && !previousStatus.isWorkingOn) {
        await sendWorkingOnEmail(user.email, user.username, productDetails);
      }
      if (isFinished && !previousStatus.isFinished) {
        await sendFinishedEmail(user.email, user.username, productDetails);
      }

      return res
        .status(200)
        .json({ message: "Product updated successfully.", product });
    }
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ error: "Failed to update product." });
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
    (((gCount + cCount) / totalBases) * 100).toFixed(2)
  );
  const mw = parseFloat(
    (
      335.2 * aCount +
      311.2 * cCount +
      326.2 * tCount +
      351 * gCount +
      330 * iCount -
      101
    ).toFixed(2)
  );

  const extinctionCoefficient = parseFloat(
    (
      modArray.reduce(
        (acc, mod) => acc + (modificationCoefficients[mod] || 0),
        0
      ) +
      15400 * aCount +
      7400 * cCount +
      11500 * gCount +
      8700 * tCount
    ).toFixed(2)
  );

  const concentration = parseFloat(
    ((a260 * mw * 1000) / extinctionCoefficient).toFixed(2)
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
        a260
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
      { where: { id: products.map((p) => p.id) } }
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
