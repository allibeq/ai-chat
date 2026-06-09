type Props = {
    message:  string
    onRetry?: () => void
}

export function ErrorMessage({ message, onRetry }: Props) {
    return (
        <div className="flex justify-center pb-2 gap-2 items-center">
            <span className="text-red-400 text-xs bg-red-400/10 px-3 py-1 rounded-full">
                {message}
            </span>
            {onRetry && (
                <button
                    onClick={onRetry}
                    className="text-amber-400 text-xs underline cursor-pointer"
                >
                    Retry
                </button>
            )}
        </div>
    )
}