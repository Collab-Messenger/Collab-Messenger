import { IoMoonOutline } from "react-icons/io5";
import { FaRegSun } from "react-icons/fa6";

export const ToggleMode = () => {
  

    return (
        <div className="">
        <label className="swap swap-rotate">
        {/* this hidden checkbox controls the state */}
        <input type="checkbox" className="theme-controller" value="synthwave" />
      
        {/* sun icon */}
        <FaRegSun className="swap-off" size={30}/>
      
        {/* moon icon */}
        <IoMoonOutline className="swap-on" size={30}/>
      </label>
      </div>
    );
  }