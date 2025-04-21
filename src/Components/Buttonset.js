import React from 'react';

function Buttonset (props) {

    return (
        <div>
            {props.btnData.map((btn) => {
                return <button key={btn.key} className={btn.key === props.selection ? "btn btn-info btn-sm" : "btn btn-light btn-sm"} onClick={() => props.onSelect(btn.key)} >{btn.label}</button>
            })}
        </div>
    )
}

export default Buttonset;