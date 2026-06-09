
import { create } from "zustand";

interface UiState {
    activeConversationId: string | null;
    sending:              boolean;

    setActiveConversation: (id: string | null) => void;
    setSending:            (v: boolean) => void;
}

export const useUiStore = create<UiState>((set) => ({
    activeConversationId: null,
    sending:              false,

    setActiveConversation: (id) => set({ activeConversationId: id }),
    setSending:            (v)  => set({ sending: v }),
}));