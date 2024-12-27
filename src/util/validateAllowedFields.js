const validateEditFields = (req) => {
  const allowedEditFields = [
    'firstName',
    'lastName',
    'emailId',
    'age',
    'gender',
    'photoURL',
    'about',
    'skills',
  ];

  const isEditAllowed = Object.keys(req.body).every((key) =>
    allowedEditFields.includes(key)
  );

  return isEditAllowed;
};

module.exports = validateEditFields;
