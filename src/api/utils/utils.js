const findMaxMinValue = async (model, criteria) => {
  return Promise.all([
    model.findOne().sort({ [criteria]: -1 }).exec(),
    model.findOne().sort({ [criteria]: 1 }).exec()
  ]).then(docs => {
    const max = docs[0][criteria];
    const min = docs[1][criteria];
    return { max, min };
  }).catch(err => {
    return { max: null, min: null };
  });
}

export default findMaxMinValue;
