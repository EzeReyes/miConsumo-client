

const ErrorMessage = ({children}) => {

    return (
        <>
            <div className={children.class}>
                {children.msg}
            </div>
        </>
    )
}

export default ErrorMessage;