import Head from "next/head";
import styles from "@/styles/Home.module.css";
import Weather from "../components/weather/page";
import Clock from "../components/clock/page";
import { MirrorProvider } from "../context/MirrorContext";
import Notification from "../components/notification/page";

export default function SecondPage() {
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
                </MirrorProvider>
            </div>
        </>
    );
}