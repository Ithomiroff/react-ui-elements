import {
  useCallback,
  useRef,
  useState
} from "react";

const GAP = 10;

export const useSlider = (slides, params = {}) => {

  const {
    visibleSlidesCount = 3,
    offsetSlidesCount = 2,
  } = params;

  const [slideParams, setSlideParams] = useState();

  const refRoot = useRef();

  const refMaxOffset = useRef();

  const initRef = useCallback((ref) => {
    refRoot.current = ref;

    const width = ref.clientWidth;
    const slideWidth = Math.floor(width / visibleSlidesCount) - (GAP);

    refMaxOffset.current = -((slideWidth + GAP) * (slides.length - visibleSlidesCount));

    setSlideParams({
      width: slideWidth,
      gap: GAP,
      offset: 0,
    });
  }, []);

  const onNavigate = useCallback((direction) => {
    refRoot.current.focus();

    setSlideParams((prev) => {
      let offset = prev.offset;

      if (direction === '+') {
        if (offset === refMaxOffset.current) {
          return prev;
        }

        offset = offset
          ? offset - (offsetSlidesCount * (prev.width + GAP))
          : -(offsetSlidesCount * (prev.width + GAP))
      } else {
        if (offset === 0) {
          return prev;
        }

        offset = offset
          ? offset + (offsetSlidesCount * (prev.width + GAP))
          : (offsetSlidesCount * (prev.width + GAP))
      }

      return {
        ...prev,
        offset,
      }
    })
  }, [slideParams]);

  const onNext = () => {
    onNavigate('+');
  };

  const onPrev = () => {
    onNavigate('-');
  };

  const listenKeyEvent = ({ keyCode }) => {
    if (keyCode === 39) {
      onNext();
    }

    if (keyCode === 37) {
      onPrev();
    }
  }

  const onFocus = useCallback(() => {
    document.addEventListener('keyup', listenKeyEvent, false);
  }, []);

  const onBlur = useCallback(() => {
    document.removeEventListener('keyup', listenKeyEvent, false);
  }, []);

  return {
    initRef,
    slideParams,
    onNext,
    onPrev,
    slides,
    onFocus,
    onBlur,
  };
};
