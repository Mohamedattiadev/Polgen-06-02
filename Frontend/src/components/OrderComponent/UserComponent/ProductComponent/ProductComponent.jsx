import React, { useState, useEffect } from "react";
import { primerData, propData } from "../../../../data/ProductData";
import styles from "./ProductComponent.module.css";

const ProductComponent = ({
  index,
  category,
  productData,
  onRemove,
  onUpdate,
}) => {
  const [data, setData] = useState({ ...productData });
  const [isFormValidState, setIsFormValidState] = useState(false); // Track form validity

  console.log(data);

  useEffect(() => {
    if (!data.scale) {
      setData((prev) => ({
        ...prev,
        scale: category === "prime" ? "50 nmol" : "200 nmol",
      }));
    }
  }, [category]); // Runs when category changes

  //
  //--------------------------
  // const [dataOfSekans, SetdataOfSekans] = useState({ sekans: "" });
  const [isFocused, setIsFocused] = useState(false); // State to track focus

  const handleChange = (e) => {
    const inputValue = e.target.value.toUpperCase(); // Convert to uppercase
    const validChars = /^[ACGTRYMKSWBDHNV]*$/; // Regular expression for allowed characters

    // Only update data if the input value is valid
    if (validChars.test(inputValue)) {
      const updatedData = { ...data, sekans: inputValue };
      setData(updatedData);
    }
  };
  //
  //-----------------------------
  const getPrice = (category, type, key) => {
    const productInfo = category === "prime" ? primerData : propData;
    if (type === "synthesisScales")
      return productInfo.synthesisScales[key]?.[data.scale] || 0;
    if (type === "fivePrimeModifications")
      return productInfo.fivePrimeModifications[key]?.price || 0;
    if (type === "threePrimeModifications")
      return productInfo.threePrimeModifications[key]?.price || 0;
    return 0;
  };

  const calculateTotalPrice = () => {
    let price = 0;
    if (category === "prime" && data.saflaştırma) {
      price += getPrice(category, "synthesisScales", data.saflaştırma);
    }
    if (data.modifications.fivePrime) {
      price += getPrice(
        category,
        "fivePrimeModifications",
        data.modifications.fivePrime
      );
    }
    if (data.modifications.threePrime) {
      price += getPrice(
        category,
        "threePrimeModifications",
        data.modifications.threePrime
      );
    }
    return price;
  };

  // useEffect(() => {
  //   const totalPrice = calculateTotalPrice();
  //   if (totalPrice !== data.totalPrice) {
  //     const updatedData = { ...data, totalPrice };
  //     setData(updatedData);
  //     onUpdate(updatedData, index);
  //   }
  // }, [
  //   data.modifications,
  //   data.saflaştırma,
  //   data.scale,
  //   data.oligoAdi,
  //   data.sekans,
  //   data.uzunluk,
  // ]);
  useEffect(() => {
    const totalPrice = calculateTotalPrice();
    if (totalPrice !== data.totalPrice) {
      const updatedData = { ...data, totalPrice };
      setData(updatedData);
      onUpdate(updatedData, index);
    }

    // Update form validation state whenever relevant data changes
    setIsFormValidState(isFormValid()); // Ensure form validation state is updated
  }, [
    data.modifications,
    data.saflaştırma,
    data.scale,
    data.oligoAdi,
    data.sekans,
    data.uzunluk,
  ]);

  const isFormValid = () => {
    return (
      data.oligoAdi?.trim() &&
      data.sekans?.trim() &&
      data.uzunluk > 0 &&
      data.scale !== "50 nmol" && // Adjust based on what you need
      data.modifications?.fivePrime &&
      data.modifications?.threePrime &&
      (category !== "prime" || data.saflaştırma) // Purification required for prime
    );
  };

  return (
    <div className={styles.productComponent}>
      <div className={styles.productHeader}>
        <div className={styles.header}>
          <input
            type="checkbox"
            checked={data.selected}
            onChange={(e) =>
              setData((prev) => ({
                ...prev,
                selected: e.target.checked,
              }))
            }
          />
          <label></label>
          <h4 style={{ paddingLeft: "10px" }}>
            {category === "prime" ? "   Prime Product" : "   Prop Product"}
          </h4>
        </div>

        <div className={styles.totalPrice}>
          Total Price: {data.totalPrice.toFixed(2)} €
        </div>
      </div>

      <div className={styles.productForm}>
        <div className={styles.formGroupUp}>
          <div className={styles.formGroup}>
            <label>5' Modification:</label>
            <select
              value={data.modifications.fivePrime}
              onChange={(e) =>
                setData((prev) => ({
                  ...prev,
                  modifications: {
                    ...prev.modifications,
                    fivePrime: e.target.value,
                  },
                }))
              }
            >
              <option value="">Select</option>
              {Object.keys(
                category === "prime"
                  ? primerData.fivePrimeModifications
                  : propData.fivePrimeModifications
              ).map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.formGroup}>
            <label>3' Modification:</label>
            <select
              value={data.modifications.threePrime}
              onChange={(e) =>
                setData((prev) => ({
                  ...prev,
                  modifications: {
                    ...prev.modifications,
                    threePrime: e.target.value,
                  },
                }))
              }
            >
              <option value="">Select</option>
              {Object.keys(
                category === "prime"
                  ? primerData.threePrimeModifications
                  : propData.threePrimeModifications
              ).map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          {category === "prime" && (
            <div className={styles.formGroup}>
              <label>Purification:</label>
              <select
                value={data.saflaştırma}
                onChange={(e) =>
                  setData((prev) => ({
                    ...prev,
                    saflaştırma: e.target.value,
                  }))
                }
              >
                {["DSLT", "OPC", "HPLC"].map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          )}
          <div className={styles.formGroup}>
            <label>Synthesis Scale:</label>
            <select
              value={data.scale || ""} // Ensures it does not default to 50 nmol
              onChange={(e) => {
                const newScale = e.target.value;
                console.log("Selected scale:", newScale); // Debugging
                setData((prev) => ({
                  ...prev,
                  scale: newScale, // Ensures the selected value updates
                }));
              }}
            >
              {(category === "prime"
                ? ["50 nmol", "100 nmol", "200 nmol"] // Prime allows all
                : ["200 nmol"]
              ) // Prop allows only 200 nmol
                .map((scale) => (
                  <option key={scale} value={scale}>
                    {scale}
                  </option>
                ))}
            </select>
          </div>
        </div>
        <div className={styles.formGroupDown}>
          <div className={styles.formGroup}>
            <label>Oligo Name:</label>
            <input
              type="text"
              value={data.oligoAdi || "oligoAdi"}
              onChange={(e) => {
                const updatedData = { ...data, oligoAdi: e.target.value };
                setData(updatedData);
                onUpdate(updatedData, index);
              }}
            />
          </div>

          <div className={styles.formGroup}>
            <label>Sekans:</label>
            <input
              type="text"
              value={data.sekans || ""}
              onChange={(e) => {
                const inputValue = e.target.value.toUpperCase(); // Convert to uppercase
                const validChars = /^[ACIGTRYMKSWBDHNV]*$/; // Regular expression for allowed characters

                // Only update data if the input value is valid
                if (validChars.test(inputValue)) {
                  const updatedData = {
                    ...data,
                    sekans: inputValue,
                    uzunluk: inputValue.length, // Update 'Uzunluk' to match the length of 'Sekans'
                  };
                  setData(updatedData);
                  onUpdate(updatedData, index); // Ensure data is updated
                }
              }}
              onFocus={() => setIsFocused(true)} // Set focus state to true when clicked
              onBlur={() => setIsFocused(false)} // Set focus state to false when the input loses focus
            />

            {/* Show the message only when the input is focused */}
            {isFocused && (
              <p
                style={{
                  fontSize: "11px",
                  color: "var(--color-text-secondary)",
                  position: "absolute",
                  top: "41%", // Adjust top to make sure it's visible below the input
                  left: "50%",
                  padding: "4px", // Adds space around the text for better clarity
                  borderRadius: "4px", // Rounded corners for smoother look
                  width: "50%", // Ensure the message width matches the input field width
                  boxSizing: "border-box", // Prevents overflow by including padding in width
                  textAlign: "left", // Align text to the left
                }}
              >
                Only the following characters are allowed: A, C, G, T, R, Y, M,
                K, I , S, W, H, B, D, N, V
              </p>
            )}
          </div>

          <div className={styles.formGroup}>
            <label>Uzunluk:</label>
            <input
              type="number"
              value={data.uzunluk || 0}
              readOnly // Make the 'Uzunluk' field read-only
              onChange={() => {}} // Disable manual changes
            />
          </div>
          <button
            type="button"
            className={styles.removeButton}
            onClick={() => onRemove(index)}
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductComponent;
