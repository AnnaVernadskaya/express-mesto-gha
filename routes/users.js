const router = require('express').Router();
const { validateIdUser, validateProfile, validateAvatar } = require('../middlewares/errorsValidation');

const {
  getUsers,
  getUserInfo,
  getUserById,
  updateUser,
  updateAvatar,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/me', getUserInfo);
router.get('/:userId', validateIdUser, getUserById);
router.patch('/me', validateProfile, updateUser);
router.patch('/me/avatar', validateAvatar, updateAvatar);

module.exports = router;
