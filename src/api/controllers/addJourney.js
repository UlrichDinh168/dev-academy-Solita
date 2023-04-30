const addJourney = (model) => {
  return async (req, res) => {
    const { data } = req.body;
    const newJourney = new model(data);
    try {
      await newJourney.save()
      return res.status(201).json({
        message: "Journey created succesfully",
      });
    } catch (error) {
      console.log(error, 'error at AddJourney');
      res.status(500).json({ message: error.message });
    }
  }
}

export default addJourney