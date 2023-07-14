"use client";

import React from "react";

const MenuDashboard = ({color}) => {
  return (
    <svg
      width="16"
      height="17"
      viewBox="0 0 16 17"
      fill="none"
      stroke={color}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M0.00269494 5.1186V5.89307C0.00205251 6.46958 0.00141008 7.04609 0.00269494 7.62324C0.00590712 8.66571 0.733143 9.39647 1.77132 9.39904C2.84547 9.40226 4.01855 9.40226 5.46339 9.39904C6.53304 9.39711 7.25257 8.67985 7.2545 7.61424C7.25707 5.84036 7.25707 4.21238 7.2545 2.63711C7.25257 1.59463 6.52533 0.864517 5.48652 0.861946C4.83509 0.860018 4.20679 0.859375 3.59455 0.859375C2.98231 0.859375 2.36364 0.860018 1.76297 0.861946C0.731858 0.865159 0.00847685 1.58564 0.00397981 2.61525C0.00141007 3.19305 0.00205251 3.78113 0.00269494 4.34928C0.00269494 4.60572 0.00269494 4.86216 0.00269494 5.11925V5.1186ZM0.828223 2.65639C0.828866 2.03168 1.17964 1.68654 1.81565 1.68526C3.04912 1.68333 4.26975 1.68333 5.44412 1.68526C6.08784 1.68654 6.42897 2.0336 6.43025 2.68981C6.43154 3.26825 6.43154 3.84604 6.4309 4.42448V5.16295V5.88535C6.4309 6.44772 6.4309 7.00945 6.43025 7.57182C6.42897 8.22674 6.08719 8.5738 5.44219 8.57509C4.84023 8.57637 4.23377 8.57702 3.62795 8.57702C3.02214 8.57702 2.41568 8.57702 1.81372 8.57509C1.17899 8.5738 0.828866 8.22867 0.828223 7.60203C0.825654 5.93356 0.825654 4.26959 0.828223 2.65703V2.65639Z"
        fill="#817E78"
      />
      <path
        d="M15.9972 12.6007V11.8243C15.9979 11.2484 15.9985 10.6719 15.9972 10.0961C15.994 9.05231 15.2674 8.32091 14.2312 8.31833C13.6369 8.31641 13.0433 8.31641 12.4786 8.31641C11.7687 8.31641 11.1038 8.31705 10.5391 8.31833C9.46816 8.32026 8.74735 9.03624 8.74607 10.1006C8.7435 11.7915 8.7435 13.4658 8.74607 15.0777C8.748 16.1215 9.47395 16.8529 10.5121 16.8554C11.7719 16.8586 13.0253 16.8593 14.2357 16.8554C15.2674 16.8522 15.9921 16.1324 15.9972 15.1047C15.9998 14.5275 15.9992 13.9401 15.9985 13.372C15.9985 13.1149 15.9985 12.8578 15.9985 12.6007H15.9972ZM15.1736 11.8339C15.1736 12.0763 15.1736 12.3192 15.1736 12.5615V13.28C15.1743 13.8649 15.1749 14.4498 15.1736 15.0346C15.1717 15.6953 14.8376 16.0308 14.1798 16.0321C13.5367 16.0334 12.9264 16.034 12.3398 16.034C11.7199 16.034 11.1269 16.034 10.5513 16.0321C9.92044 16.0308 9.57224 15.6831 9.5716 15.0533C9.56903 13.2961 9.56903 11.6784 9.5716 10.1083C9.57224 9.49706 9.92237 9.1455 10.532 9.14357C11.858 9.14036 13.0664 9.14036 14.2254 9.14357C14.8151 9.1455 15.1691 9.49835 15.173 10.0884C15.1762 10.6706 15.1756 11.2619 15.1749 11.8339H15.1736Z"
        fill="#817E78"
      />
      <path
        d="M10.4809 6.8269C10.9069 6.83011 11.3399 6.82947 11.7588 6.82818C11.9528 6.82818 12.1481 6.8269 12.3414 6.82754C12.538 6.82754 12.7346 6.82754 12.9312 6.82754C13.3655 6.82754 13.8004 6.82883 14.2347 6.82625C15.2671 6.82111 15.9918 6.10128 15.9969 5.07616C16.0014 4.23678 16.0014 3.40576 15.9969 2.60623C15.9918 1.59911 15.2626 0.865777 14.263 0.861278C13.6276 0.858707 12.9935 0.857422 12.3646 0.857422C11.7356 0.857422 11.097 0.858707 10.4765 0.861278C9.49738 0.865777 8.75409 1.60425 8.74702 2.57924C8.74188 3.30871 8.74188 4.0806 8.74702 5.0813C8.75216 6.08585 9.48132 6.81983 10.4822 6.8269H10.4809ZM9.57126 2.62101C9.57512 2.04708 9.9291 1.68909 10.4951 1.68652C11.744 1.68137 13.0083 1.68137 14.2514 1.68652C14.8052 1.68844 15.1656 2.04386 15.1707 2.59209C15.1784 3.44047 15.1784 4.2837 15.1707 5.09994C15.1656 5.64239 14.8039 5.99652 14.2495 6.00166C13.9989 6.00423 13.7464 6.00487 13.4959 6.00487C13.3096 6.00487 13.1239 6.00487 12.9415 6.00423C12.574 6.00359 12.2072 6.00359 11.8397 6.00423C11.408 6.00487 10.9621 6.00552 10.5227 6.0023C9.93038 5.99845 9.57512 5.64688 9.57126 5.06266C9.56612 4.24578 9.56612 3.42376 9.57126 2.62037V2.62101Z"
        fill="#817E78"
      />
      <path
        d="M5.51723 10.8906C4.2073 10.8854 2.93336 10.8854 1.73072 10.8906C0.752933 10.8951 0.010279 11.6342 0.00385461 12.6105C-0.00128487 13.3592 -0.00128487 14.1542 0.00385461 15.1125C0.00899408 16.1158 0.739442 16.8491 1.741 16.8556C2.17464 16.8588 2.61599 16.8575 3.04321 16.8568C3.2398 16.8568 3.43703 16.8562 3.63361 16.8562C3.8302 16.8562 4.02614 16.8562 4.22272 16.8568C4.65058 16.8575 5.09258 16.8588 5.52622 16.8549C6.50401 16.8472 7.24666 16.1074 7.25373 15.1337C7.25887 14.3908 7.25951 13.5964 7.25373 12.6323C7.24859 11.6265 6.51814 10.8938 5.51723 10.8899V10.8906ZM6.42884 15.0952C6.42499 15.6698 6.07165 16.0277 5.50566 16.0303C4.87801 16.0329 4.25035 16.0342 3.62783 16.0342C3.00531 16.0342 2.36737 16.0329 1.74935 16.0303C1.18529 16.0277 0.832595 15.6685 0.828741 15.0926C0.823601 14.2603 0.823601 13.4389 0.828741 12.6503C0.832595 12.068 1.18915 11.7184 1.7834 11.7145C2.21833 11.712 2.65968 11.7126 3.0869 11.7132C3.45694 11.7132 3.82698 11.7132 4.19703 11.7132C4.61654 11.7132 5.05018 11.712 5.4774 11.7145C6.06972 11.7184 6.42627 12.0693 6.42949 12.6529C6.43463 13.4633 6.43463 14.2847 6.42949 15.0952H6.42884Z"
        fill="#817E78"
      />
    </svg>
  );
};

export default MenuDashboard;
