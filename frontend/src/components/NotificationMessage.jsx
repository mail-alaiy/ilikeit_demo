// components/NotificationMessage.js
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { hideNotification } from '../store/slice/uiSlice';
import styles from './NotificationMessage.module.css';
import { X } from 'lucide-react';

const NotificationMessage = () => {
  const dispatch = useDispatch();
  const { message, type, show } = useSelector((state) => state.ui.notification);
  useEffect(() => {
    let timer;
    if (show && type !== 'firstLook') { 
      timer = setTimeout(() => {
        dispatch(hideNotification());
      }, 3000); 
    }
    return () => clearTimeout(timer);
  }, [show, dispatch, type]);

  if (!show) {
    return null;
  }

  const isFirstLook = (message === 'See your first look!' || type === 'firstLook');

  const notificationClasses = [
    styles.notificationBubble,
    styles[type],
    show ? styles.show : ''
  ].filter(Boolean).join(' ');

  return (
    <div className={notificationClasses}>
      <span>{message}</span>
       {!isFirstLook && (
        <button
          onClick={() => dispatch(hideNotification())}
          style={{
            background: 'none',
            border: 'none',
            color:'white',
            cursor: 'pointer',
            fontSize: '18px',
            padding: '0',
            lineHeight: '1',
            marginLeft: 'auto'
          }}
          aria-label="Close notification"
        >
          <X size={15} />
        </button>
      )}
    </div>
  );
};

export default NotificationMessage;