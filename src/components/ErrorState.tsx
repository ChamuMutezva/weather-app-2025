type ErrorStateProps = {
    msg: string;
};

function ErrorState({ msg }: Readonly<ErrorStateProps>) {
    return (
        <div
            className="text-center text-preset-6 text-red-500"
            aria-live="assertive"
        >
            <p>{msg}</p>
        </div>
    );
}

export default ErrorState;
