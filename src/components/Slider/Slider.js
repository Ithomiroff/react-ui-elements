import './index.scss';
import { SLIDES } from "./data/slides-items";
import IconButton from "./components/IconButton/IconButton";
import { useSlider } from "./hooks/useSlider";

const Slider = () => {

  const {
    initRef,
    slideParams,
    onNext,
    onPrev,
    slides,
    onBlur,
    onFocus,
  } = useSlider(SLIDES);

  return (
    <div
      className="slider"
      ref={ initRef }
      tabIndex={ 1 }
      onFocus={ onFocus }
      onBlur={ onBlur }
    >
      <div className="slider-inner">
        <ul
          className="slider-list"
          style={ {
            transform: `translateX(${ slideParams?.offset }px)`
          } }
        >
          { slides.map((slide, index) => (
            <li
              key={ slide.id }
              className="slider-list__item"
              style={ {
                background: slide.color,
                width: `${ slideParams?.width }px`,
                gap: `${ slideParams?.gap }px`,
              } }
            >{ index }</li>
          )) }
        </ul>
      </div>

      <div className="slider__control slider__control_next" onClick={ onNext }>
        <IconButton>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512">
            <path
              d="M174.54,508.94,420.1,263.39a10.74,10.74,0,0,0,0-14.75L174.53,3.06a10.43,10.43,0,0,0-14.75,0L92,70.8a10.43,10.43,0,0,0,0,14.75L262.47,256,92,426.46a10.73,10.73,0,0,0,0,14.75l67.75,67.73A10.43,10.43,0,0,0,174.54,508.94Z"/>
          </svg>
        </IconButton>
      </div>
      <div className="slider__control slider__control_prev" onClick={ onPrev }>
        <IconButton>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512">
            <path
              d="M174.54,508.94,420.1,263.39a10.74,10.74,0,0,0,0-14.75L174.53,3.06a10.43,10.43,0,0,0-14.75,0L92,70.8a10.43,10.43,0,0,0,0,14.75L262.47,256,92,426.46a10.73,10.73,0,0,0,0,14.75l67.75,67.73A10.43,10.43,0,0,0,174.54,508.94Z"/>
          </svg>
        </IconButton>
      </div>
    </div>
  )
};

export default Slider;
