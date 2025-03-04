import { useState } from "react";

import styles from "@/styles/notification.module.css";
export default function Notification() {

  // 공지사항 내용
  const [notifications, setNotifications] = useState<string[]>(["📢 공지사항을 불러오는 중..."]);

  // 공지 보여주고 숨기는 역할
  const [isVisible, setIsVisible] = useState<boolean>(false);
  
    return(
        <main className={styles.middle}>
        <div className={styles.notificationContainer}>
          <div className={`${styles.notification} ${isVisible ? styles.show : styles.hide}`}>
            <p>{notifications}</p>
          </div>
        </div>
      </main>
    )
}