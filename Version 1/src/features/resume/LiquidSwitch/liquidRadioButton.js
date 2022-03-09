import './liquiRadioButton.scss'
export function LiquidRadioButton() {
  return (
    <div>
      <label>
        <input type="checkbox" />
        <div class="circle">
          <div class="circle--inner circle--inner__1"></div>
          <div class="circle--inner circle--inner__2"></div>
          <div class="circle--inner circle--inner__3"></div>
          <div class="circle--inner circle--inner__4"></div>
          <div class="circle--inner circle--inner__5"></div>
          <div class="circle--outer"></div>
        </div>
        <svg>
          <defs>
            <filter id="gooey">
              <feGaussianBlur
                in="SourceGraphic"
                result="blur"
                stdDeviation="3"
              />
              <feColorMatrix
                in="blur"
                mode="matrix"
                values="
            1 0 0 0 0
            0 1 0 0 0
            0 0 1 0 0
            0 0 0 18 -7
          "
                result="gooey"
              />
              <feBlend in2="gooey" in="SourceGraphic" result="mix" />
            </filter>
          </defs>
        </svg>
      </label>
    </div>
  );
}
