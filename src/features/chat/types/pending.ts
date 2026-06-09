export type PendingSend = {
    text:         string
    targetConvId: string | null
    error:        'create' | 'send' | null
}

export type PendingMap = Record<string, PendingSend>

export function matchesActiveDialog(pending: PendingSend, activeId: string | null): boolean {
    if (pending.targetConvId === null) return activeId === null;
    return pending.targetConvId === activeId;
}