import { useEffect } from "react";
import { useAppSelector, useAppDispatch } from "../../hooks/hooks.ts";
import { removeNotification } from "../../store/notificationSlice.ts";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./NotificationCenter.module.css";

export const NotificationCenter = () => {
    const notifications = useAppSelector((state) => state.notificationsSlice.notifications);
    const dispatch = useAppDispatch();

    useEffect(() => {
        const timers = notifications.map((notification) =>
            setTimeout(() => dispatch(removeNotification(notification.id)), 1000)
        );

        return () => timers.forEach(clearTimeout);
    }, [notifications, dispatch]);

    return (
        <div className={styles.notificationContainer}>
            <AnimatePresence>
                {notifications.map(({ id, type, message }) => (
                    <motion.div
                        key={id}
                        layout="position" // Гладкое движение без скачков
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -10 }}
                        transition={{
                            type: "spring",
                            stiffness: 120,
                            damping: 15,
                        }}
                        className={`${styles.notification} ${styles[type]}`}
                        onClick={() => dispatch(removeNotification(id))}
                    >
                        {message}
                        <button className={styles.closeButton} onClick={() => dispatch(removeNotification(id))}>
                            ✖
                        </button>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
};