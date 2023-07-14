"use client";

import React from "react";

const DeleteIcon =(props) => {
  const width = props.isMobile ? 14 : 19;
  const height = props.isMobile ? 14 : 19;
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 19 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M17.8243 4.16472H14.4173C14.4112 2.25577 12.8763 0.700195 10.9805 0.700195H8.69918C6.80336 0.700195 5.26847 2.25577 5.26241 4.16472H1.85542C1.21401 4.16472 0.699951 4.69057 0.699951 5.33086C0.699951 5.96617 1.20607 6.48882 1.84051 6.49689V20.3437C1.84051 22.2578 3.37773 23.8195 5.2773 23.8195H14.4025C16.302 23.8195 17.8393 22.2578 17.8393 20.3437V6.49689C18.4737 6.48882 18.9798 5.96617 18.9798 5.33086C18.9798 4.69053 18.4656 4.16472 17.8243 4.16472ZM12.1066 4.16472H7.57368C7.57972 3.53641 8.08638 3.03246 8.69947 3.03246H10.9808C11.5939 3.03246 12.1005 3.53642 12.1066 4.16472ZM10.9808 2.73246C11.763 2.73246 12.4005 3.37417 12.4066 4.16472L12.4066 4.17608V4.46453H12.4067V4.17588C12.4067 3.38013 11.7668 2.73226 10.9808 2.73226H8.69952C8.05282 2.73226 7.50501 3.1709 7.33119 3.76963C7.50507 3.171 8.05284 2.73246 8.69947 2.73246H10.9808ZM15.5283 20.344C15.5283 20.9776 15.0193 21.4877 14.4025 21.4877H5.2773C4.66052 21.4877 4.15145 20.9776 4.15145 20.344L4.15164 6.49689H15.5282L15.5283 20.344ZM15.8283 20.344L15.8282 6.19689H3.85169V6.19669H15.8283L15.8284 20.3439C15.8284 20.4434 15.8183 20.5406 15.7993 20.6345C15.8183 20.5407 15.8283 20.4435 15.8283 20.344ZM18.6247 5.63724C18.5023 5.96418 18.19 6.19679 17.8244 6.19679H17.5393V6.19699H17.8244C18.1901 6.19699 18.5024 5.96428 18.6247 5.63724ZM17.4404 21.1366C17.0919 22.5058 15.8625 23.5195 14.4025 23.5195H5.2773C3.5469 23.5195 2.14051 22.0956 2.14051 20.3437V6.19699H1.85542C1.38319 6.19699 0.999951 5.80897 0.999951 5.33086C0.999951 5.25705 1.00908 5.18539 1.02627 5.11697C1.00912 5.18533 1 5.25693 1 5.33066C1 5.80878 1.38324 6.19679 1.85547 6.19679H2.14056V20.3435C2.14056 22.0954 3.54695 23.5193 5.27735 23.5193H14.4025C15.8625 23.5193 17.0918 22.5057 17.4404 21.1366ZM5.56239 4.46453H5.56244V4.17588C5.56244 3.90731 5.59549 3.64644 5.65769 3.39723C5.59546 3.6465 5.56239 3.90743 5.56239 4.17608V4.46453ZM6.71319 10.9722C6.70656 11.0156 6.70312 11.0601 6.70312 11.1054V16.8798C6.70312 17.3579 7.08637 17.7459 7.55859 17.7459C7.9364 17.7459 8.25725 17.4975 8.37045 17.1534C8.25731 17.4976 7.93643 17.7461 7.55855 17.7461C7.08632 17.7461 6.70308 17.3581 6.70308 16.88V11.1056C6.70308 11.0602 6.70654 11.0157 6.71319 10.9722ZM7.55855 9.93945C6.91714 9.93945 6.40308 10.4653 6.40308 11.1056V16.88C6.40308 17.5203 6.91714 18.0461 7.55855 18.0461C8.19995 18.0461 8.71402 17.5203 8.71402 16.88V11.1056C8.71402 10.4653 8.19995 9.93945 7.55855 9.93945ZM12.9219 10.8003C12.9572 10.8952 12.9766 10.998 12.9766 11.1054V16.8798C12.9766 17.3579 12.5933 17.7459 12.1211 17.7459C11.755 17.7459 11.4423 17.5127 11.3203 17.185C11.4423 17.5128 11.755 17.7461 12.1212 17.7461C12.5934 17.7461 12.9766 17.3581 12.9766 16.88V11.1056C12.9766 10.9982 12.9573 10.8953 12.9219 10.8003ZM12.1212 9.93945C11.4798 9.93945 10.9657 10.4653 10.9657 11.1056V16.88C10.9657 17.5203 11.4798 18.0461 12.1212 18.0461C12.7626 18.0461 13.2766 17.5203 13.2766 16.88V11.1056C13.2766 10.4653 12.7626 9.93945 12.1212 9.93945Z"
        fill="#346595"
      />
    </svg>
  );
};
export default DeleteIcon;
