import React from 'react';

const CurrencyIcon = ({ className = '' }) => {
    return (
        <img
            src="/currency-symbol.png"
            alt="UAE Dirham Symbol"
            className={className}
            style={{
                display: 'inline',
                width: '1em',
                height: '1em',
                verticalAlign: 'text-bottom',
                objectFit: 'contain',
                marginRight: '0.1em'
            }}
            aria-hidden="true"
        />
    );
};

export default CurrencyIcon;