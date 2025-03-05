import { createContext, useContext, useState, useEffect } from 'react';

interface MirrorContextProps {
    mirrorMode: number;
    setMirrorMode: (mode: number) => void;
    notification: string;
    setNotification: (message: string) => void;
}

// 0 = Default, 1 = Notification, 2 = Meal

const MirrorContext = createContext<MirrorContextProps | null> (null);

export const useMirror = () => {
    const context = useContext(MirrorContext);
    if (!context) throw new Error('useMirror must be used within a MirrorProvider');
    return context;
};

export const MirrorProvider = ( { children }: { children: React.ReactNode } ) => {
    const [mirrorMode, setMirrorMode] = useState<number>(0);
    const [notification, setNotification] = useState<string>('');

    return (
        <MirrorContext.Provider
            value={{
                mirrorMode,
                setMirrorMode,
                notification,
                setNotification
            }}
        >
            {children}
        </MirrorContext.Provider>
    )
}