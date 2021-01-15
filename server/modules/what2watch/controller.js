import What2Watch from './model';

export const createWhat2Watch = async (req, res) => {
  const { title, description } = req.body;
  const newWhat2Watch = new What2Watch({ title, description });

  try {
    return res.status(201).json({ what2watch: await newWhat2Watch.save() });
  } catch (e) {
    return res
      .status(e.status)
      .json({ error: true, message: 'error with What2Watch' });
  }
};

export const getAllWhat2Watches = async (req, res) => {
  try {
    return res.status(200).json({ what2watches: await What2Watch.find({}) });
  } catch (e) {
    return res
      .status(e.status)
      .json({ error: true, message: 'error with What2Watch' });
  }
};
