type LoadingProps = {
    msg: string;
};
function Loading({ msg }: Readonly<LoadingProps>) {
    return (
        <div
            className="text-center text-preset-6 text-foreground/80"
            aria-live="polite"
        >
            <p>{msg}</p>
        </div>
    );
}

export default Loading;
