import React, {useState} from 'react'
import Buttonset from './Components/Buttonset';
import Component1 from './Components/Component1';
import Component2 from './Components/Component2';
import Component3 from './Components/Component3';

function App() {
  // BUTTON
  // map of btn key to component
  const componentBtnMap = {
    "option1" : "Component 1",
    "option2" : "Component 2",
    "option3" : "Component 3"
  }
  const defaultBtnSelected = "option1"

  const [componentSelected, setcomponentSelected] = useState(componentBtnMap[defaultBtnSelected])

  const btnData = [
    {label: "Option 1", key: "option1"},
    {label: "Option 2", key: "option2"},
    {label: "Option 3", key: "option3"}
  ]

  const handleBtnSelection = (btnSelectedKey) => {
    setcomponentSelected(componentBtnMap[btnSelectedKey])
  }
  // END BUTTON

  return (
    <div className="container">
      <p className={"label"}>Choose an option:</p>
      <Buttonset btnData={btnData} defaultSelection={defaultBtnSelected} onSelect={handleBtnSelection} /> 
      <div className="componentWrapper">
        {componentSelected === "Component 1" && <Component1 />}
        {componentSelected === "Component 2" && <Component2 />}
        {componentSelected === "Component 3" && <Component3 />}
      </div>
    </div>
  );
}

export default App;
