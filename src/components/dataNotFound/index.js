export const NotFound = (props) => {
    const { message } = props;
console.log(props);
    return (
        <div className="not-found-container">
            <div className="not-found-message">
                {message}
            </div>
        </div>
    );
};
