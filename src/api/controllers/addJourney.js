const addJourney = (model) => {
  return async (req, res) => {

    console.log(req?.body, 'body');

    const { data } = req.body;
    const newEntry = new model(data);
    console.log(newEntry, 'newEntry');

    try {
      const results = await newEntry.save()

      console.log(results, 'results')
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