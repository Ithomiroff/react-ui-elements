import { memo } from "react";
import './index.scss';

const IconButton = ({ children }) => {
  return (
    <button type="button" className="btn btn_icon">
      <span className="btn__text">{ children }</span>
    </button>
  )
};

export default memo(IconButton);
