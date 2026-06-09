import AuthPage from "./pages/AuthPage.tsx";
import ChatMainPage from "./pages/ChatMainPage";
import {useEffect, useState} from "react";
import {useAuthStore} from "@/features/auth/stores/authStores";

export default function App() {
    const status = useAuthStore(s => s.status)
    const restoreSession = useAuthStore(s => s.restoreSession)
    const [booting, setBooting] = useState(true)

    useEffect(() => {
        restoreSession().finally(() => setBooting(false))
    }, [])

    if (booting) return null

    if (status === 'authenticated') {
        return <ChatMainPage></ChatMainPage>
    }

    return <AuthPage />
}