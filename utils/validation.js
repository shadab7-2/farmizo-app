// Address form validation (moved from checkout page)
export const validateAddressForm = (values = {}) => {
  const errors = {};
  const requiredFields = [
    "fullName",
    "phone",
    "street",
    "city",
    "state",
    "pincode",
    "country",
  ];

  requiredFields.forEach((field) => {
    if (!String(values[field] || "").trim()) {
      errors[field] = "This field is required";
    }
  });

  if (values.phone && !/^\d{10}$/.test(values.phone.trim())) {
    errors.phone = "Phone number must be exactly 10 digits";
  }

  if (values.pincode && !/^\d{6}$/.test(values.pincode.trim())) {
    errors.pincode = "Pincode must be exactly 6 digits";
  }

  return errors;
};
