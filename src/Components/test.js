import React, {useState} from 'react'

function Test({selections, setSelections}) {

    const handleSelections = (selection) => {
        let selectionsOrig = [...selections]
        selectionsOrig = selectionsOrig.filter((d) => {return d != selection}) 
        setSelections(selectionsOrig)
    }

    return (
        <ul>
            {selections.map((d,i) => {
                return <li key={d.split(" ").join("").toLowerCase()} onClick={() => handleSelections(d)}>{d}</li>
            })}
        </ul>
    )
}

export default Test