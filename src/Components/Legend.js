import React from 'react';

const Legend = ({ items }) => {
    return (
      <div className="d-flex gap-4 mt-2">
        {items.map((item, index) => (
          <div key={index} className="d-flex gap-2 align-items-center">
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