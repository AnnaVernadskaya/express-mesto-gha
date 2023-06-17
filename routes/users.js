const router = require('express').Router();
const { validateIdUser, validateProfile, validateAvatar } = require('../middlewares/errorsValidation');

const {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  updateAvatar,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/:userId', validateIdUser, getUserById);
router.get('/me', createUser);
router.patch('/me', validateProfile, updateUser);
router.patch('/me/avatar', validateAvatar, updateAvatar);

module.exports = router;
