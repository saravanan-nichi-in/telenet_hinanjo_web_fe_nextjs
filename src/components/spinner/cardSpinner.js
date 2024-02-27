import React from "react";

export default function CardSpinner() {
    return (
        <div className='custom-card-info-with-spinner my-3 align-items-center'>
            <div className="overlay">
                <i className="pi-spin pi pi-spinner"></i>
            </div>
        </div>
    );
}