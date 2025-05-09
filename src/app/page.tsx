"use client";

import Head from "next/head";
import styles from "@/styles/Home.module.css";
import Mirror from "@/app/components/mirror/page";
import Weather from "@/app/components/weather/page";
import Clock from "@/app/components/clock/page";
import Notification from "@/app/components/notification/page";
import Meal from "@/app/components/meal/page";
import { MirrorProvider } from "./context/MirrorContext";

export default function Home() {

  return (
    <>
      <Head>
        <title>스마트미러 - 메인</title>
      </Head>

      <div className={styles.container}>
        <header className={styles.header}>
          <div className={styles.headerLeft}>
            <Weather />
          </div>
          <div className={styles.headerRight}>
            <Clock />
          </div>
        </header>

        <MirrorProvider>
          <Notification />
          <Meal />
          <Mirror />
        </MirrorProvider>
      </div>
    </>
  );
}
