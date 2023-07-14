import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import "@testing-library/jest-dom";
import SubMenu from '../../components/User/userSubmenu';


describe("SubMenu", () => {
test('handles text click correctly', () => {
  const onTextClickMock = jest.fn();
  const { getByText } = render(<SubMenu onTextClick={onTextClickMock} />);

  // Click on the first text
  fireEvent.click(getByText('ユーザーの詳細'));
  expect(onTextClickMock).toHaveBeenCalledWith(0);

  // Click on the fourth text
  fireEvent.click(getByText('PTALKの利用'));
  expect(onTextClickMock).toHaveBeenCalledWith(3);

  // Click on the last text
  fireEvent.click(getByText('ログを見る'));
  expect(onTextClickMock).toHaveBeenCalledWith(12);
});

test('renders without errors', () => {
  render(<SubMenu onTextClick={() => {}} />);
  // Add your assertions here
});
    
  test('displays correct text', () => {
    const onTextClickMock = jest.fn();
    const { getByText } = render(<SubMenu onTextClick={onTextClickMock} />);
  
    // Check if the first text is displayed
    expect(getByText('ユーザーの詳細')).toBeInTheDocument();
  
    // Check if the last text is displayed
    expect(getByText('ログを見る')).toBeInTheDocument();
  });

  test('displays the provided texts', () => {
    const texts = [
      'ユーザーの詳細', 'サウンド・通知', 'ワンタッチPTT', 'PTALKの利用', '画面の設定', 'PTTボタンの設定',
      '音声録音', 'SOS', '通信環境エラー音', 'PTTブースター', '低品質の設定', 'リモートワイプ', 'ログを見る',
    ];
    render(<SubMenu onTextClick={() => {}} />);
    for (const text of texts) {
      const buttonText = screen.getByText(text);
      expect(buttonText).toBeInTheDocument();
    }
  });

  test('invokes onTextClick callback when a text is clicked', () => {
    const onTextClickMock = jest.fn();
    render(<SubMenu onTextClick={onTextClickMock} />);
    const textIndex = 2; // Assuming the third text is clicked
    const textButton = screen.getByText('ワンタッチPTT');
    fireEvent.click(textButton);
    expect(onTextClickMock).toHaveBeenCalledWith(textIndex);
  });
  
});

