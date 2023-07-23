"use client";

import React from "react";

const DashboardActiveConnection = ({isMobile}) => {
  const width = isMobile ? 50 : 60;
  const height = isMobile ? 50 : 60;
  return (
    <svg
    width={width}
    height={height}
      viewBox="0 0 78 79"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="39" cy="39.6328" r="39" fill="#29AB91" />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M49.0027 24.0315H48.6869V14.626C48.6869 13.8519 48.0596 13.2246 47.2859 13.2246C46.5121 13.2246 45.8848 13.8519 45.8848 14.626V24.0315H45.569C45.3824 24.0315 45.2038 24.1058 45.072 24.2377C44.9402 24.3691 44.8662 24.5481 44.8662 24.7343V27.4111H49.7055V24.7343C49.7055 24.5481 49.6316 24.3691 49.4998 24.2377C49.3679 24.1058 49.1889 24.0315 49.0027 24.0315ZM49.6573 29.2116H34.0184V27.5151C34.0184 27.2668 33.9195 27.0284 33.7436 26.8525C33.5681 26.677 33.3297 26.5781 33.081 26.5781H31.1561C30.6384 26.5781 30.2187 26.9978 30.2187 27.5151V29.2113L29.2852 29.2116C28.6636 29.2116 28.0677 29.4584 27.6285 29.8976C27.1889 30.3372 26.9421 30.9331 26.9421 31.5543V45.7845C26.9421 46.388 27.0533 46.9867 27.2698 47.55L27.8749 49.1243C28.0918 49.6876 28.2026 50.2858 28.2026 50.8894V63.0407C28.2026 63.6623 28.4493 64.2582 28.8889 64.6974C29.3281 65.137 29.924 65.3838 30.5456 65.3838H48.3965C49.018 65.3838 49.6139 65.137 50.0532 64.6974C50.4927 64.2582 50.7395 63.6623 50.7395 63.0407V50.8894C50.7395 50.2858 50.8503 49.6876 51.0672 49.1243L51.6723 47.55C51.8888 46.9866 51.9999 46.388 51.9999 45.7845V31.5543C51.9999 30.9331 51.7531 30.3372 51.3136 29.8976C50.8744 29.4584 50.2785 29.2116 49.6569 29.2116L49.6573 29.2116ZM47.2863 33.7812L47.2867 43.6359C47.2867 44.0241 46.9721 44.3387 46.5839 44.3387H32.3586C31.9704 44.3387 31.6558 44.0241 31.6558 43.6359V33.7812C31.6558 33.393 31.9704 33.0784 32.3586 33.0784H46.5839C46.9721 33.0784 47.2867 33.393 47.2867 33.7812H47.2863ZM42.2715 50.0981C42.2715 50.8407 41.9764 51.5528 41.4514 52.0778C40.926 52.6032 40.214 52.8979 39.4712 52.8979C38.7285 52.8979 38.0165 52.6032 37.4911 52.0778C36.9661 51.5528 36.671 50.8408 36.671 50.0981C36.671 49.3553 36.9661 48.643 37.4911 48.1179C38.0165 47.5929 38.7285 47.2978 39.4712 47.2978C40.214 47.2978 40.9259 47.5929 41.4514 48.1179C41.9764 48.6429 42.2715 49.3553 42.2715 50.0981ZM46.3696 62.6928H32.5731C31.8879 62.6928 31.3326 62.1375 31.3326 61.452C31.3326 60.7668 31.8878 60.2114 32.5731 60.2114H46.3696C47.0548 60.2114 47.6102 60.7667 47.6102 61.452C47.6102 62.1376 47.0549 62.6928 46.3696 62.6928ZM46.3696 57.7956H32.5731C32.2435 57.7963 31.9274 57.6661 31.694 57.4331C31.461 57.2004 31.3299 56.8847 31.3299 56.5551C31.3299 56.2255 31.461 55.9094 31.694 55.6767C31.9274 55.4441 32.2435 55.3135 32.5731 55.3142H46.3696C46.6992 55.3134 47.0154 55.4441 47.2487 55.6767C47.4817 55.9094 47.6128 56.2255 47.6128 56.5551C47.6128 56.8847 47.4817 57.2004 47.2487 57.4331C47.0154 57.6661 46.6992 57.7963 46.3696 57.7956ZM45.0619 36.557C45.3028 36.3238 45.3059 35.9386 45.0689 35.7016L44.4192 35.0519C44.1869 34.8196 43.811 34.8173 43.5759 35.0467L38.7516 39.7536C38.512 39.9874 38.1273 39.9798 37.897 39.7368L36.1386 37.8806C35.9107 37.6401 35.5309 37.6298 35.2904 37.8577L34.7096 38.4079C34.4691 38.6358 34.4588 39.0156 34.6867 39.2561L37.8987 42.6466C38.1283 42.889 38.5117 42.8973 38.7516 42.665L45.0619 36.557Z"
        fill="white"
      />
    </svg>
  );
};

export default DashboardActiveConnection;