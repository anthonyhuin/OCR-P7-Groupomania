module.exports.uploadErrors = (err) => {
  let errors;

  if (err.message.includes("max size")) errors = "Le fichier dépasse 500ko";

  if (err.message.includes("invalid file")) errors = "Format incompatabile";
  return errors;
};
