import React from 'react';

const Legend = ({ items }) => {
    return (
      <div className="d-flex gap-4 align-items-center mb-3">
        {items.map((item, index) => (
          <div key={index} className="d-flex align-items-center gap-2">
            <div
              className="rounded"
              style={{
                width: "16px",
                height: "16px",
                backgroundColor: item.color,
              }}
            ></div>
            <span>{item.label}</span>
          </div>
        ))}
      </div>
    )
  }

export default Legend