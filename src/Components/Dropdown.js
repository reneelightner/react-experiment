import React from 'react';

function Dropdown({ items, selectedItems, onSelect}) {

    return (
        <div className="dropdown mt-2">
            <button className="btn btn-sm btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                Add/Remove Values
            </button>
            <ul className="dropdown-menu">
                {items.map((item) => {
                    return <li key={item.key}>
                        <a className="dropdown-item" href="#" onClick={(e) => {e.preventDefault(); onSelect(item.key)}}>
                            <input type="checkbox" checked={selectedItems.includes(item.key)} readOnly className="form-check-input me-2"/>
                            {item.label}
                        </a>
                    </li>
                })}
            </ul>
        </div>
    )
}

export default Dropdown