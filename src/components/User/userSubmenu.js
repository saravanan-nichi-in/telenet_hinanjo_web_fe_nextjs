"use client"

import React, { useState,useEffect } from 'react';

const SubMenu = ({ onTextClick }) => {
  const texts = [
    "ユーザーの詳細", "サウンド・通知", "ワンタッチPTT", "PTALKの利用", "画面の設定", "PTTボタンの設定",
    "音声録音", "SOS", "通信環境エラー音 ", "PTTブースター", "低品質の設定", "リモートワイプ", "ログを見る"
  ];
  const [selectedTextIndex, setSelectedTextIndex] = useState(null);
  const [isResponsive, setIsResponsive] = useState(false);
  let [windowWidth,setWindowWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 0
  );

  const handleTextClick = (index) => {
    setSelectedTextIndex(index);
    onTextClick(index);
  };
  
  const handleWindowResize = () => {
    setWindowWidth(typeof window !== 'undefined' ? window.innerWidth : 0);
  }; 
  useEffect(() => {
    const checkWindowSize = () => {
      const screenWidth = windowWidth;
      setIsResponsive(screenWidth < 820);
    };
    checkWindowSize();
    window.addEventListener('resize', handleWindowResize);
    return () => {
      window.removeEventListener('resize', checkWindowSize);
    };
  }, [windowWidth]);

  return (
    <div className='py-3' style={{ width: '246px', minHeight: '500px', background: '#FFFFFF', boxShadow: '0px 0px 15px rgba(0, 0, 0, 0.1)', borderRadius: '9px' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
        {texts.map((text, index) => {
          const isTextSelected = selectedTextIndex === index;
          const buttonStyle = {
            display: 'flex',
            justifyContent: 'center',
            width: '324px',
            height: '52px',
            background: isTextSelected ? 'rgba(52, 101, 149, 0.17)' : '#FFFFFF',
            boxShadow: isResponsive?'0px 0px 4px rgba(0, 0, 0, 0.2)':"",
            borderRadius: '9px',
            margin: '10px',
            marginBottom:isResponsive?'5px':"0px",
            cursor: 'pointer',
            marginTop: (()=>{
              if(!isResponsive&&index==0){
                return '5px';
              }
              return isResponsive?"5px":"0px";
            })()
          };

          return (
            <div
              key={text}
              style={buttonStyle}
              onClick={() => handleTextClick(index)}

            >
              <p
                style={{
                  fontStyle: 'normal',
                  fontWeight: 500,
                  fontSize: '20px',
                  lineHeight: '29px',
                  color: '#848484',
                  textAlign: 'center',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                {text}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SubMenu;
