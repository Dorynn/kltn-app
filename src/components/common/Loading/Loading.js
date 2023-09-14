import React from 'react';

const Loading = props => {
    const { isLoading } = props;
    return (
        isLoading ? <div class="loader"></div> : <></>
    )
};

export default Loading;


