const router = require('express').Router();
const { validateIdCard, validateFormCard } = require('../middlewares/errorsValidation');

const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

router.get('/', getCards);
router.post('/', validateFormCard, createCard);
router.delete('/:cardId', validateIdCard, deleteCard);
router.put('/:cardId/likes', validateIdCard, likeCard);
router.delete('/:cardId/likes', validateIdCard, dislikeCard);

module.exports = router;
