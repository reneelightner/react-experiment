import React, {useState} from 'react';

function Buttonset (props) {
    const [btnSelected, setbtnSelected] = useState(props.defaultSelection)

    const handleClick = (btn) => {
        setbtnSelected(btn)
        props.onSelect(btn)
    }

    return (
        <div>
            {props.btnData.map((btn) => {
                return <button key={btn.key} className={btn.key === btnSelected ? "btn btn-info btn-sm" : "btn btn-light btn-sm"} onClick={() => handleClick(btn.key)} >{btn.label}</button>
            })}
        </div>
    )
}

export default Buttonset;