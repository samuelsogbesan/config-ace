import React from "react";

export function NavigationContainer({ children }) {
    return (
        <div className='flex flex-row p-5 shadow-low'>
            { children }
        </div>
    );
}
