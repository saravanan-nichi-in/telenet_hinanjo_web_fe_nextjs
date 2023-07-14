"use client"

import React from 'react';

export default function DynamicLabel({ text, alignment, fontSize, fontWeight, textColor, disabled, htmlFor }) {
  const labelStyles = `${alignment ? alignment : ''} ${fontSize ? fontSize : ''} ${fontWeight ? fontWeight : ''}`;
  const styles = {
    color: textColor || 'initial',
    opacity: disabled ? 0.5 : 1,
    cursor: disabled ? 'not-allowed' : 'initial',
  };

  return (
    <main>
      {text && (
        <div>
          <label className={labelStyles} style={styles} htmlFor={htmlFor}>
            {text}
          </label>
        </div>
      )}
    </main>
  );
}
