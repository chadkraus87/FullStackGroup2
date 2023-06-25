const router = require('express').Router();
const { Spot } = require('../../models');
const withAuth = require('../../utils/auth');

router.post('/', withAuth, async (req, res) => {
  try {
    const newSpot = await Spot.create({
      ...req.body,
      user_id: req.session.user_id,
    });

    res.status(200).json(newSpot);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.delete('/:id', withAuth, async (req, res) => {
  try {
    const spotData = await Spot.destroy({
      where: {
        id: req.params.id,
        user_id: req.session.user_id,
      },
    });

    if (!spotData) {
      res.status(404).json({ message: 'No spot found with this id!' });
      return;
    }

    res.status(200).json(spotData);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
