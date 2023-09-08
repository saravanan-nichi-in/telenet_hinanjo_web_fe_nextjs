import { Divider } from 'primereact/divider';

export default function DividerComponent(props) {
  const { parentClass, parentStyle, dividerProps = {} } = props;
  const { width, dividerClass, align, style, layout, type, ...restProps } = dividerProps;

  return (
    <main className={`${parentClass}`} style={parentStyle}>
      <Divider className={`${width} ${dividerClass} `}
        align={align}
        style={style}
        layout={`${layout || "horizontal"}`}
        type={`${type || "solid"} `}
        {...restProps}
      />
    </main>
  );
}