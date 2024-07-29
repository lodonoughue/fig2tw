import React, { h } from "preact";
import { PropsWithClassName } from "../utils/types";

export default function GitHub({ className }: PropsWithClassName) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg">
      <path
        d="M15.8213 2.40293C13.6375 1.88451 11.3625 1.88451 9.17869 2.40293C7.92181 1.60755 6.95265 1.23618 6.23797 1.07752C5.84469 0.990208 5.52982 0.96767 5.28951 0.974284C5.16963 0.977583 5.06945 0.98811 4.98854 1.00101C4.94813 1.00746 4.83614 1.03434 4.80563 1.04128C4.52061 1.12582 4.28798 1.3328 4.17086 1.60605C3.63637 2.85309 3.5373 4.23744 3.87892 5.5386C2.98257 6.67763 2.49284 8.09144 2.49999 9.55259C2.50053 12.4806 3.4037 14.4444 4.89891 15.7016C5.907 16.5493 7.11236 17.012 8.29943 17.2827C8.28433 17.3207 8.26976 17.3591 8.25572 17.3976C8.04998 17.9623 7.96297 18.5632 7.99999 19.1628V19.2233C7.23563 19.3789 6.68806 19.3536 6.2857 19.2558C5.78846 19.1351 5.41807 18.881 5.07294 18.5337C4.89497 18.3546 4.72795 18.1551 4.55002 17.9319C4.50533 17.8759 4.45818 17.8161 4.40936 17.7541C4.27664 17.5856 4.13159 17.4015 3.99031 17.2359C3.60017 16.7789 3.05504 16.233 2.24253 16.0299C1.70673 15.8959 1.1638 16.2217 1.02985 16.7575C0.895901 17.2933 1.22166 17.8362 1.75746 17.9701C1.94062 18.0159 2.14332 18.1527 2.4691 18.5344C2.58329 18.6682 2.69026 18.804 2.81274 18.9595C2.86691 19.0282 2.92411 19.1009 2.98632 19.1789C3.17737 19.4185 3.39835 19.686 3.65439 19.9436C4.17726 20.4697 4.85887 20.9674 5.81358 21.1993C6.45686 21.3556 7.17814 21.38 7.99999 21.2543V23C7.99999 23.5523 8.44771 24 8.99999 24C9.55228 24 9.99999 23.5523 9.99999 23V19.13C9.99999 19.1066 9.99917 19.0832 9.99753 19.0598C9.97419 18.7279 10.021 18.3949 10.1349 18.0822C10.2488 17.7696 10.4272 17.4845 10.6586 17.2454C10.9222 16.973 11.0092 16.5749 10.883 16.2174C10.7569 15.8598 10.4395 15.6044 10.0632 15.5576C8.54444 15.369 7.17557 15.0029 6.18607 14.1709C5.24673 13.381 4.50001 12.0405 4.50001 9.55L4.49998 9.54468C4.49388 8.3967 4.93266 7.29097 5.72424 6.45954C5.98813 6.18237 6.07068 5.7789 5.93688 5.42036C5.64952 4.65036 5.60376 3.81668 5.79701 3.02832L5.80452 3.02998C6.29225 3.13826 7.15564 3.44756 8.44319 4.31064C8.68365 4.47183 8.98217 4.52091 9.26158 4.44518C11.3823 3.87043 13.6177 3.87043 15.7384 4.44518C16.0178 4.52091 16.3163 4.47183 16.5568 4.31064C17.8443 3.44756 18.7152 3.1366 19.203 3.02832C19.3962 3.81668 19.3505 4.65036 19.0631 5.42036C18.9293 5.77889 19.0119 6.18235 19.2757 6.45952C20.0505 7.27332 20.4877 8.3978 20.5 9.52018C20.5 12.0338 19.7512 13.3827 18.8139 14.1709C17.8279 14.9999 16.463 15.3574 14.9492 15.5262C14.57 15.5684 14.2479 15.8228 14.1189 16.1818C13.9899 16.5409 14.0764 16.9421 14.342 17.2161C14.5761 17.4576 14.7562 17.7462 14.8702 18.0626C14.9841 18.3791 15.0295 18.7162 15.0031 19.0516C15.001 19.0777 15 19.1038 15 19.13V23C15 23.5523 15.4477 24 16 24C16.5523 24 17 23.5523 17 23V19.1667C17.0417 18.5622 16.9573 17.9554 16.7518 17.3849C16.7375 17.3452 16.7227 17.3058 16.7073 17.2666C17.8926 17.0053 19.0947 16.5478 20.1011 15.7016C21.5987 14.4423 22.5 12.4661 22.5 9.51982C22.4997 8.06996 22.0105 6.66888 21.1211 5.53862C21.4627 4.23746 21.3636 2.8531 20.8291 1.60605C20.712 1.3328 20.4794 1.12582 20.1944 1.04128C20.1816 1.03794 20.133 1.02487 20.1178 1.0214C20.0873 1.01447 20.0519 1.00746 20.0114 1.00101C19.9305 0.98811 19.8304 0.977583 19.7105 0.974284C19.4702 0.96767 19.1553 0.990208 18.762 1.07752C18.0473 1.23618 17.0782 1.60755 15.8213 2.40293Z"
        fill="currentColor"
      />
    </svg>
  );
}
