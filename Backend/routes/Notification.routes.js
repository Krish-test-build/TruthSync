const router = require('express').Router();
const authMiddleware = require('../middleware/auth.middleware');
const NotificationController = require('../controller/Notification.Controller');

router.get('/', authMiddleware.authUser, NotificationController.getNotifications);
router.patch('/:id/read', authMiddleware.authUser, NotificationController.markAsRead);
router.delete('/:id/delete', authMiddleware.authUser, NotificationController.deleteNotification);

module.exports = router;