import { useEffect, useState } from "react";

import styles from "@/styles/notification.module.css";
import { useMirror } from "@/app/context/MirrorContext";

export default function Notification() {
  const { mirrorMode, setMirrorMode, notification } = useMirror();
  const [isVisible, setIsVisible] = useState<boolean>(false);

  useEffect(() => {
    if (mirrorMode === 1) setIsVisible(true);
    else setIsVisible(false);
  }, [mirrorMode]);
  
    return(
        <main className={styles.middle}>
        <div className={styles.notificationContainer}>
          <div className={`${styles.notification} ${isVisible ? styles.show : styles.hide}`}>
            <p>{notification}</p>
          </div>
        </div>
      </main>
    )
}