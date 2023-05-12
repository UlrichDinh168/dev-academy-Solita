// const { digitransitAPI } = require("../constant");
import { digitransitAPI } from '../constant.js';

const getAddressLookup = async (req, res) => {
  const position = req?.body?.data

  try {
    const resp = await digitransitAPI.get(
      `/geocoding/v1/reverse?point.lat=${position?.lat}&point.lon=${position?.lng}&lang=fi&size=1&layers=address`,
    );

    if (resp.data?.features.length === 0)
      return res.status(404).json({ message: "No results found." });

    const { geometry: { coordinates },
      properties: { name: label, postalcode, label: Name, region }
    } = resp?.data?.features[0]

    return res.status(200).json({
      message: "Location fetched successfully",
      data: { coordinates, Name, postalcode, label, region }
    });

  } catch (error) {
    console.log("err", error);
    return res.status(400).json({ message: "Invalid coordinates!" });
  }
};

export default getAddressLookup
// module.exports = getAddressLookup