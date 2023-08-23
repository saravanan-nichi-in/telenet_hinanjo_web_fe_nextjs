import { Divider } from 'primereact/divider';

export default function DividerComponent(props) {
  const { parentClass, dividerProps = {} } = props && props
  const { width, dividerClass, align, layout, type } = dividerProps && dividerProps

  return (
    <main className={`${parentClass}`}>
      <Divider className={`${width} ${dividerClass} `}
        align={align}
        layout={`${layout || "horizontal"}`}
        type={`${type || "solid"} `}
      />
    </main>
  );
}
